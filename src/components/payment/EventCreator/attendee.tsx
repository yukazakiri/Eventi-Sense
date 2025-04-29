import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { Event, Ticket, Order } from '../payment';
import { LuX, LuClock, LuUserCheck, LuUsers, LuArrowLeft, LuFilter, LuCalendarClock, LuTicket, LuMapPin, LuCalendar } from 'react-icons/lu';

interface Attendee {
  id: string;
  email: string;
  full_name: string;
}

interface TicketWithAttendee extends Ticket {
  attendee: Attendee;
  order?: Order; // Optional since free tickets won't have an order
  check_in_time?: string;
  check_in_status?: string; // New field for check-in status
}

// Enhanced Event interface with status
interface EnhancedEvent extends Omit<Event, 'location' | 'status' | 'date'> {
  status?: 'Upcoming' | 'completed' | 'cancelled';
  location?: string;
  date?: string;
}

const AttendeeManagementPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketWithAttendee[]>([]);
  const [event, setEvent] = useState<EnhancedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithAttendee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all'); // New filter for payment status
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Fetch event and attendees
  useEffect(() => {
    const fetchEventAndAttendees = async () => {
      try {
        setLoading(true);

        // Get the current authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('You must be logged in to view this page');
        }

        // Fetch event details with additional fields
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*, location, date, status')
          .eq('id', eventId)
          .single();

        if (eventError) throw eventError;

        // Check if the current user is the event creator
        if (eventData.organizer_id !== user.id) {
          throw new Error('You are not authorized to view this page');
        }

        setEvent(eventData);

        // Fetch tickets for the event with status = 'confirmed'
        const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          orders!left(
            payment_status,
            payment_date,
            amount
          ),
          profiles!tickets_user_id_fkey(*)
        `)
        .eq('event_id', eventId)
        .eq('status', 'purchased');
          console.log(ticketsData);
        if (ticketsError) throw ticketsError;

        // Transform data to include attendee information and ensure all required fields exist
        const formattedTickets = ticketsData.map(ticket => ({
          ...ticket,
          attendee: {
            id: ticket.profiles?.id || '',
            email: ticket.profiles?.email || '',
            full_name: ticket.profiles?.full_name || 'Unknown'
          },
          // Change this line - get the first order from the array if it exists
          order: ticket.orders && ticket.orders.length > 0 ? ticket.orders[0] : undefined,
          check_in_status: ticket.check_in_status || 'not_checked_in',
        }));

        setTickets(formattedTickets);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventAndAttendees();
    }
  }, [eventId]);

  // Handle check-in
  const handleCheckIn = async (ticketId: string, checkInStatus: 'checked_in' | 'checked_in_late') => {
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('tickets')
        .update({ 
          check_in_status: checkInStatus,
          check_in_time: now,
        })
        .eq('id', ticketId)
        .select();
  
      if (error) {
        console.error('Supabase update error:', error);
        setError(`Failed to update ticket: ${error.message}`);
        return;
      }
  
      // Update local state
      setTickets(prevTickets => {
        return prevTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, check_in_status: checkInStatus, check_in_time: now }
            : ticket
        );
      });
  
      setSelectedTicket(null); // Close the modal
    } catch (error: any) {
      console.error('Error during check-in:', error);
      setError(error.message);
    }
  };

  // Handle uncheck-in
  const handleUncheckIn = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          check_in_status: 'not_checked_in',
          check_in_time: null,
        })
        .eq('id', ticketId)
        .select();
  
      if (error) {
        console.error('Supabase update error:', error);
        setError(`Failed to uncheck-in ticket: ${error.message}`);
        return;
      }
  
      // Update local state
      setTickets(prevTickets => {
        return prevTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, check_in_status: 'not_checked_in', check_in_time: undefined }
            : ticket
        );
      });
    } catch (error: any) {
      console.error('Error during uncheck-in:', error);
      setError(error.message);
    }
  };

  // Format check-in time
  const formatCheckInTime = (timeString?: string) => {
    if (!timeString) return 'Not checked in';
    
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short'
    });
  };

  // Get initials safely from name
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // Handle event status change
  const handleStatusChange = async (newStatus: 'completed' | 'cancelled') => {
    try {
      // 1. Update event status
      const { error: statusError } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId);
  
      if (statusError) throw statusError;
  
      // 2. Get tickets with status = 'purchased' for this event
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('profiles(id)')
        .eq('event_id', eventId)
        .eq('status', 'purchased');
  
      if (ticketsError) throw ticketsError;
  
      // 3. Extract unique user IDs from tickets
      const userIds = Array.from(new Set(
        ticketsData
          .filter(ticket => ticket.profiles)
          .map(ticket => ticket.profiles && 'id' in ticket.profiles ? ticket.profiles.id : null)
          .filter((id): id is string => id !== null)
      ));
  
      if (userIds.length === 0) return;
  
      // 4. Get current user (organizer)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
  
    
    // 5. Create notifications
    const notifications = userIds.map(userId => ({
      user_id: userId,
      sender_id: user.id,
      type: 'event_status_change',
      message: `🎉 The event "${event?.name}" has officially wrapped up! We'd love to hear what you think — mind leaving a quick review? 😊`,
      link: `/events/${eventId}/reviews`,
      is_read: false,
      created_at: new Date().toISOString()
    }));

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);
  
      if (notificationError) throw notificationError;
  
      // Update UI
      setEvent(prev => prev ? { ...prev, status: newStatus } : null);
      setIsStatusModalOpen(false);
  
    } catch (error: any) {
      console.error('Status change failed:', error);
      setError(error.message);
    }
  };
  // Apply filters and search
  const filteredTickets = tickets
    .filter(ticket => {
      // Apply status filter
      if (filterStatus === 'all') return true;
      if (filterStatus === 'checked_in') return ticket.check_in_status === 'checked_in';
      if (filterStatus === 'checked_in_late') return ticket.check_in_status === 'checked_in_late';
      if (filterStatus === 'not_checked_in') return ticket.check_in_status === 'not_checked_in';
      return true;
    })
    .filter(ticket => {
      // Apply payment filter
      if (filterPayment === 'all') return true;
      if (filterPayment === 'paid') return ticket.order?.payment_status === 'completed';
      if (filterPayment === 'unpaid') return !ticket.order || ticket.order.payment_status !== 'completed';
      return true;
    })
    .filter(ticket => {
      // Apply search query
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        (ticket.attendee?.full_name || '').toLowerCase().includes(query) ||
        (ticket.attendee?.email || '').toLowerCase().includes(query)
      );
    });

  // Compute stats
  const stats = {
    total: tickets.length,
    checkedIn: tickets.filter(t => t.check_in_status === 'checked_in').length,
    checkedInLate: tickets.filter(t => t.check_in_status === 'checked_in_late').length,
    notCheckedIn: tickets.filter(t => t.check_in_status === 'not_checked_in' || !t.check_in_status).length,
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 flex justify-center items-center z-50">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-sky-600 animate-spin mx-auto"></div>
          <div className="text-sky-600 dark:text-sky-400 font-medium text-lg">Loading attendees...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-red-100 dark:border-red-900">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20">
            <LuX className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">Error Loading Attendees</h2>
          <p className="text-red-600 dark:text-red-400 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-6 pb-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-500 font-medium mb-6 group"
        >
          <LuArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </button>
        
        {/* Header with Event Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm px-6 py-5 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                {event?.name || 'Event'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Attendee Management</p>
              
            {/* Event Status Badge */}
<div className="mt-3 flex items-center">
  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
    event?.status === 'completed' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
      : event?.status === 'cancelled'
        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        : event?.status === 'Upcoming'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }`}>
    {event?.status === 'completed' ? 'Completed' : 
     event?.status === 'cancelled' ? 'Cancelled' :
     event?.status === 'Upcoming' ? 'Upcoming' : 'Unknown'}
  </span>
  
  <button 
    onClick={() => setIsStatusModalOpen(true)}
    className="ml-3 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300"
  >
    Change Status
  </button>
</div>

            </div>
            
            <div className="mt-4 md:mt-0 space-y-2">
              {/* Event Date */}
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LuCalendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>
                  {event?.date ? new Date(event.date).toLocaleDateString() : 'Date not set'}
    
                </span>
              </div>
              
              {/* Event Location */}
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <LuMapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{event?.location || 'Location not set'}</span>
              </div>
              
              {/* Check-in Progress */}
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                  Check-in Progress:
                </span>
                <div className="w-48 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-600 dark:bg-sky-500 rounded-full" 
                    style={{ width: `${tickets.length > 0 ? Math.round(((stats.checkedIn + stats.checkedInLate) / stats.total) * 100) : 0}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tickets.length > 0 ? Math.round(((stats.checkedIn + stats.checkedInLate) / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-sky-100 dark:bg-sky-900/20 rounded-lg flex items-center justify-center">
                <LuUsers className="h-6 w-6 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checked In</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.checkedIn}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <LuUserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checked In Late</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.checkedInLate}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <LuClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Checked In</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-300 mt-1">{stats.notCheckedIn}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <LuTicket className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Attendees</label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="block w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Status</label>
              <div className="relative">
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">All Attendees</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_in_late">Checked In Late</option>
                  <option value="not_checked_in">Not Checked In</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <LuFilter className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Payment</label>
              <div className="relative">
                <select
                  id="payment-filter"
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="block appearance-none w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid/Free</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
    {/* Attendee List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {filteredTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Attendee
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                       Ticket Order
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ticket Info
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Check-in Time
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Check in Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        ticket.check_in_status === 'checked_in' 
                          ? 'bg-green-50 dark:bg-green-900/10' 
                          : ticket.check_in_status === 'checked_in_late' 
                            ? 'bg-yellow-50 dark:bg-yellow-900/10' 
                            : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            ticket.check_in_status === 'checked_in'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : ticket.check_in_status === 'checked_in_late'
                                ? 'bg-yellow-100 dark:bg-yellow-900/20'
                                : 'bg-sky-100 dark:bg-gray-700'
                          }`}>
                            <span className={`text-lg font-medium ${
                              ticket.check_in_status === 'checked_in'
                                ? 'text-green-600 dark:text-green-400'
                                : ticket.check_in_status === 'checked_in_late'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-sky-600 dark:text-sky-400'
                            }`}>
                              {getInitials(ticket.attendee?.full_name)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.attendee?.full_name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.attendee?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                          {ticket.quantity || 1} {(ticket.quantity || 1) > 1 ? 'tickets' : 'ticket'}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <LuCalendarClock className="h-3 w-3 mr-1" />
                            {ticket.order?.payment_date
                              ? new Date(ticket.order.payment_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Free Ticket'}
                          </div>
                     
                          </div>
                        </td>
                      <td className="px-6 py-4">
                    
                        <div className="flex items-center justify-between mt-1">
                          
                          {ticket.order ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium">
                                ${ticket.order?.amount}
                              </span>
                              {ticket.order?.payment_status === 'completed' ? (
                                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                  Paid
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                                  Not Paid
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Free
                            </span>
                          )}
                          </div>
                        </td>
               
                      <td className="px-6 py-4">
                        {ticket.check_in_time ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatCheckInTime(ticket.check_in_time)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {new Date(ticket.check_in_time).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic">Not checked in yet</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                            ticket.check_in_status === 'checked_in'
                              ? 'bg-green-500'
                              : ticket.check_in_status === 'checked_in_late'
                                ? 'bg-yellow-500'
                                : 'bg-gray-400'
                          }`}></div>
                          <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            ticket.check_in_status === 'checked_in'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : ticket.check_in_status === 'checked_in_late'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {ticket.check_in_status === 'checked_in' ? 'Checked In' : 
                             ticket.check_in_status === 'checked_in_late' ? 'Checked In Late' : 
                             'Not Checked In'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {ticket.check_in_status !== 'checked_in' && ticket.check_in_status !== 'checked_in_late' ? (
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 shadow-sm"
                          >
                            <LuUserCheck className="mr-1.5 h-4 w-4" />
                            Check In
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUncheckIn(ticket.id)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 shadow-sm"
                          >
                            <LuX className="mr-1.5 h-4 w-4" />
                            Uncheck In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <LuTicket className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No attendees found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No attendees match your search or filter criteria. Try adjusting your filters.' 
                  : 'No attendees have been registered for this event yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination and Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing {filteredTickets.length} of {tickets.length} attendees
          </p>
          
          {filteredTickets.length > 0 && (
            <div className="flex space-x-2">
              <button 
                onClick={() => window.print()} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print List
              </button>
              
              <button 
                onClick={() => {
                  // This is a placeholder for export functionality
                  alert('Export functionality would be implemented here');
                }} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Confirmation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full overflow-hidden border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Check-In Attendee</h2>
              <button 
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-3">
                <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/20 flex items-center justify-center mr-4">
                  <span className="text-xl font-medium text-sky-600 dark:text-sky-400">
                    {getInitials(selectedTicket.attendee?.full_name)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedTicket.attendee?.full_name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedTicket.attendee?.email || 'No email'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Ticket Type</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedTicket.quantity || 1} {(selectedTicket.quantity || 1) > 1 ? 'tickets' : 'ticket'}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Payment Status</p>
                  {selectedTicket.order ? (
                    <div className="flex items-center">
                      {selectedTicket.order?.payment_status === 'completed' ? (
                        <span className="font-medium text-green-600 dark:text-green-400">Paid</span>
                      ) : (
                        <span className="font-medium text-red-600 dark:text-red-400">Not Paid</span>
                      )}
                    </div>
                  ) : (
                    <span className="font-medium text-gray-600 dark:text-gray-300">Free</span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select the appropriate check-in status for this attendee:
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleCheckIn(selectedTicket.id, 'checked_in')}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                <LuUserCheck className="mr-2 h-5 w-5" />
                Check In On Time
              </button>
              
              <button
                onClick={() => handleCheckIn(selectedTicket.id, 'checked_in_late')}
                className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
              >
                <LuClock className="mr-2 h-5 w-5" />
                Check In as Late
              </button>
              
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State - No Attendees */}
      {tickets.length === 0 && !loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-100 dark:bg-sky-900/20 mb-6">
            <LuTicket className="h-10 w-10 text-sky-600 dark:text-sky-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Attendees Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
            There are no attendees registered for this event yet. Once people purchase tickets, they'll appear here.
          </p>
          <button
            onClick={() => navigate(`/event/${eventId}`)}
            className="inline-flex items-center px-5 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            View Event Page
          </button>
        </div>
      )}
      {/* Status Change Modal */}
{isStatusModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Change Event Status</h2>
        <button 
          onClick={() => setIsStatusModalOpen(false)} 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <LuX className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => handleStatusChange('completed')}
          className="w-full px-4 py-3 text-left rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
        >
          <div className="font-medium">Mark as Completed</div>
          <p className="text-sm mt-1">Event has successfully concluded</p>
        </button>
        
        <button
          onClick={() => handleStatusChange('cancelled')}
          className="w-full px-4 py-3 text-left rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400"
        >
          <div className="font-medium">Cancel Event</div>
          <p className="text-sm mt-1">Event will not take place</p>
        </button>
        
        <button
          onClick={() => setIsStatusModalOpen(false)}
          className="w-full px-4 py-2 mt-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
 
    </div>
  );
};

export default AttendeeManagementPage;