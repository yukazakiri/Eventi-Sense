import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { Event, Ticket, Order } from '../payment';
import { LuX, LuClock, LuUserCheck, LuUsers, LuArrowLeft, LuFilter, LuCalendarClock, LuTicket } from 'react-icons/lu';

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

const AttendeeManagementPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketWithAttendee[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithAttendee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
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
            orders!left(*),
            profiles!inner(*)
          `)
          .eq('event_id', eventId)
          .eq('status', 'confirmed'); // Only fetch confirmed tickets

        if (ticketsError) throw ticketsError;

        // Transform data to include attendee information and ensure all required fields exist
        const formattedTickets = ticketsData.map(ticket => ({
          ...ticket,
          attendee: {
            id: ticket.profiles?.id || '',
            email: ticket.profiles?.email || '',
            full_name: ticket.profiles?.full_name || 'Unknown'
          },
          order: ticket.orders || undefined, // Set to undefined if no order exists
          check_in_status: ticket.check_in_status || 'not_checked_in', // Default to 'not_checked_in'
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
      
      const {  error } = await supabase
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 pb-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-500 font-medium mb-6 group"
        >
          <LuArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Events
        </button>
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm px-6 py-5 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            {event?.name || 'Event'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Attendee Management</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
        
        {/* Attendee List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Attendee
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ticket Info
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Check-in Time
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-sky-100 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-lg font-medium text-sky-600 dark:text-sky-400">
                              {getInitials(ticket.attendee?.full_name)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.attendee?.id || 'Unknown'}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{ticket.attendee?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {ticket.quantity || 1} {(ticket.quantity || 1) > 1 ? 'tickets' : 'ticket'}
                        </div>
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {ticket.check_in_time 
                            ? formatCheckInTime(ticket.check_in_time)
                            : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {ticket.check_in_status !== 'checked_in' && ticket.check_in_status !== 'checked_in_late' && (
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 bg-green-800 px-4 py-2 rounded-md text-xs font-medium mr-2"
                          >
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'No attendees match your search or filter criteria.' 
                        : 'No attendees found for this event.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredTickets.length} of {tickets.length} attendees
          </p>
        </div>
      </div>

      {/* Check-In Confirmation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full overflow-hidden border border-gray-200 dark:border-gray-700  max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Confirm Check-In</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Attendee: <span className="font-semibold">{selectedTicket.attendee?.id || 'Unknown'}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Email: {selectedTicket.attendee?.email || 'No email'}
              </p>
            </div>
            
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
    </div>
  );
};

export default AttendeeManagementPage;