import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabaseClient';
import { Event, Ticket } from '../../types/event';
import { Profile } from '../../types/types';

// Add these interfaces at the top of the file
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSave: (ticketId: string, newStatus: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, ticket, onSave }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 dark:bg-gray-950">
        <h2 className="text-xl font-bold mb-4">Update Ticket Status</h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSave(ticket.id, 'approved')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Approve Ticket
            </button>
            <button
              onClick={() => onSave(ticket.id, 'cancelled')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Cancel Ticket
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketsList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<{ [eventId: string]: Event }>({});
  const [profiles, setProfiles] = useState<{ [userId: string]: Profile }>({});

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search term state
  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg'; // Path to your fallback image

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewMode, setViewMode] = useState<'organizer' | 'attendee'>('organizer');
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');
  
        let ticketData;
  
        if (viewMode === 'organizer') {
          // Get events created by the user
          const { data: userEvents, error: eventsError } = await supabase
            .from('events')
            .select('id')
            .eq('organizer_id', user.id);
  
          if (eventsError) throw eventsError;
  
          if (!userEvents?.length) {
            setTickets([]);
            setEvents({});
            setProfiles({});
            setLoading(false);
            return;
          }
  
          // Get tickets for those events
          const { data: ticketsData, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .in('event_id', userEvents.map(event => event.id))
            .order('created_at', { ascending: false });
  
          if (ticketsError) throw ticketsError;
  
          // Fetch related events and profiles manually
          const eventIds = ticketsData.map(ticket => ticket.event_id);
          const userIds = ticketsData.map(ticket => ticket.user_id);
  
          const { data: eventsData, error: eventsFetchError } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds);
  
          if (eventsFetchError) throw eventsFetchError;
  
          const { data: profilesData, error: profilesFetchError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', userIds);
  
          if (profilesFetchError) throw profilesFetchError;
  
          // Combine the data
          ticketData = ticketsData.map(ticket => ({
            ...ticket,
            events: eventsData.find(event => event.id === ticket.event_id),
            profiles: profilesData.find(profile => profile.id === ticket.user_id),
          }));
        } else {
          // Get user's tickets with related data
          const { data: ticketsData, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
  
          if (ticketsError) throw ticketsError;
  
          // Fetch related events and profiles manually
          const eventIds = ticketsData.map(ticket => ticket.event_id);
  
          const { data: eventsData, error: eventsFetchError } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds);
  
          if (eventsFetchError) throw eventsFetchError;
  
          const { data: profilesData, error: profilesFetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id);
  
          if (profilesFetchError) throw profilesFetchError;
  
          // Combine the data
          ticketData = ticketsData.map(ticket => ({
            ...ticket,
            events: eventsData.find(event => event.id === ticket.event_id),
            profiles: profilesData.find(profile => profile.id === ticket.user_id),
          }));
        }
  
        // Process the joined data
        if (ticketData) {
          setTickets(ticketData);
  
          // Create events lookup object
          const eventsMap: { [key: string]: Event } = {};
          ticketData.forEach(ticket => {
            if (ticket.events) {
              eventsMap[ticket.events.id] = ticket.events;
            }
          });
          setEvents(eventsMap);
  
          // Create profiles lookup object
          const profilesMap: { [key: string]: Profile } = {};
          ticketData.forEach(ticket => {
            if (ticket.profiles) {
              profilesMap[ticket.profiles.id] = ticket.profiles;
            }
          });
          setProfiles(profilesMap);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [viewMode]);

  // Filter tickets based on selected criteria and search term
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesEvent = eventFilter ? events[ticket.event_id]?.name === eventFilter : true;
    const matchesUser = userFilter
      ? profiles[ticket.user_id]?.first_name?.toLowerCase().includes(userFilter.toLowerCase())
      : true;
    const matchesSearch = searchTerm
      ? ticket.id.toString().includes(searchTerm) ||
        profiles[ticket.user_id]?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        events[ticket.event_id]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesStatus && matchesEvent && matchesUser && matchesSearch;
  });

  // Handle ticket deletion
  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase.from('tickets').delete().eq('id', ticketId);
      if (error) throw error;
      setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== ticketId));
    } catch (err) {
      console.error('Error deleting ticket:', err);
      setError('Failed to delete ticket. Please try again later.');
    }
  };

  // Handle ticket editing (you can implement this as a modal or separate page)
  const handleEditTicket = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsEditModalOpen(true);
    }
  };

  // Add this new function
  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      
      setIsEditModalOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError('Failed to update ticket status. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Ticket Management</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {viewMode === 'organizer' 
            ? "Manage ticket reservations for your events. You can approve, cancel, or delete ticket requests."
            : "View and track your ticket reservations across all events."}
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('organizer')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              viewMode === 'organizer'
                ? 'bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-500 dark:hover:bg-sky-600'  
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            }`}
            title="View and manage tickets for events you organize"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Manage Event Tickets
          </button>
          <button
            onClick={() => setViewMode('attendee')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${ 
              viewMode === 'attendee'
                ? 'bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-500 dark:hover:bg-sky-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            }`}
            title="View your personal ticket reservations"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            My Tickets
          </button>
        </div>
      </div>

      <div className="bg-white p-6 overflow-hidden rounded-2xl border-[1px] border-gray-300 dark:bg-gray-900 dark:border-gray-700">
        {/* Filter Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter & Search Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">Ticket Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
                title="Filter tickets by their current status"
              >
                <option value="">All Statuses</option>
                <option value="reserved">Reserved</option>
                <option value="purchased">Purchased</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">Event</label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
                title="Filter tickets by specific event"
              >
                <option value="">All Events</option>
                {Object.values(events).map((event) => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">User Name</label>
              <input
                type="text"
                placeholder="Search by user name..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
                title="Filter tickets by user name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">Quick Search</label>
              <input
                type="text"
                placeholder="Search tickets, events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
                title="Search across all ticket information"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">
            {viewMode === 'organizer' ? 'Ticket Requests' : 'Your Tickets'}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'} found)
            </span>
          </h2>
        </div>

        {/* Tickets Table - Keep existing table code but add tooltips */}
        <div className="overflow-x-auto shadow border-[1px] border-gray-300 rounded-2xl p-6 dark:bg-gray-950 dark:border-gray-700">
          {filteredTickets.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {viewMode === 'organizer' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48" title="Ticket requester's information">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" title="Unique ticket identifier">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" title="Name of the event">Event Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24" title="Number of tickets requested">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32" title="Current status of the ticket">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider" title="When the ticket was purchased">Purchase Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40" title="Available actions for this ticket">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    {viewMode === 'organizer' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={profiles[ticket.user_id]?.avatar_url || fallbackAvatarUrl}
                              alt="User Avatar"
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-200">
                              {profiles[ticket.user_id]?.first_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{ticket.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {events[ticket.event_id]?.name || 'Event not found'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-center">
                          {ticket.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-medium
                            ${ticket.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : 
                              ticket.status === 'purchased' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTicket(ticket.id)}
                              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {events[ticket.event_id]?.name || 'Event not found'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{ticket.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 text-center">
                          {ticket.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${ticket.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : 
                              ticket.status === 'purchased' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                          {ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleString() : 'N/A'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-white">
              <svg 
                className="w-16 h-16 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 14h.01M15 14h.01M9 14h.01M12 16h.01M9 16h.01M15 16h.01M9 12h.01M15 12h.01M12 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" 
                />
              </svg>
              <p className="text-xl font-semibold mb-2">No tickets found</p>
              <p className="text-sm text-gray-400 dark:text-white">
                {viewMode === 'organizer' 
                  ? "There are no ticket requests for your events matching the current filters."
                  : "You don't have any tickets matching the current filters."}
              </p>
              {(statusFilter || eventFilter || userFilter || searchTerm) && (
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setEventFilter('');
                    setUserFilter('');
                    setSearchTerm('');
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onSave={handleUpdateTicketStatus}
      />
    </div>
  );
};

export default TicketsList;