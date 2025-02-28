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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets List</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('organizer')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'organizer'
                ? 'bg-blue-500 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            }`}
          >
            My Events' Tickets
          </button>
          <button
            onClick={() => setViewMode('attendee')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'attendee'
                ? 'bg-blue-500 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
            }`}
          >
            My Reserved Tickets
          </button>
        </div>
      </div>

      <div className="bg-white p-6 overflow-hidden rounded-2xl border-[1px] border-gray-300 dark:bg-gray-950 dark:border-gray-700">
        {/* Filter Controls */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="reserved">Reserved</option>
            <option value="purchased">Purchased</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
          >
            <option value="">All Events</option>
            {Object.values(events).map((event) => (
              <option key={event.id} value={event.name}>
                {event.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by user..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
          />

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded dark:bg-gray-950 dark:text-white dark:border-gray-700"
          />
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto shadow border-[1px] border-gray-300 rounded-2xl p-6 dark:bg-gray-950 dark:border-gray-700">
          {filteredTickets.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {viewMode === 'organizer' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchase Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">Actions</th>
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
                  ? "No tickets have been created for your events yet"
                  : "You haven't reserved any tickets yet"}
              </p>
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