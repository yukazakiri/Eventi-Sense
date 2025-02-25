import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabaseClient';
import { Event, Ticket } from '../../types/event';
import { Profile } from '../../types/types';

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

  useEffect(() => {
    const fetchTicketsAndEventsAndProfiles = async () => {
      try {
        setLoading(true);
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (ticketError) throw ticketError;
        setTickets(ticketData || []);

        if (ticketData && ticketData.length > 0) {
          const uniqueEventIds = [...new Set(ticketData.map((ticket) => ticket.event_id))];
          const fetchedEvents: { [eventId: string]: Event } = {};
          const uniqueUserIds = [...new Set(ticketData.map((ticket) => ticket.user_id))];
          const fetchedProfiles: { [userId: string]: Profile } = {};

          for (const eventId of uniqueEventIds) {
            const { data: eventData, error: eventError } = await supabase
              .from('events')
              .select('*')
              .eq('id', eventId)
              .single();

            if (eventError) {
              console.error(`Error fetching event ${eventId}:`, eventError);
              continue;
            }
            if (eventData) {
              fetchedEvents[eventId] = eventData as Event;
            }
          }
          setEvents(fetchedEvents);

          for (const userId of uniqueUserIds) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            if (profileError) {
              console.error(`Error fetching profile ${userId}:`, profileError);
              continue;
            }
            if (profileData) {
              fetchedProfiles[userId] = profileData as Profile;
            }
          }
          setProfiles(fetchedProfiles);
        }
      } catch (err) {
        console.error('Error fetching tickets, events, and profiles:', err);
        setError('Failed to load tickets, events, and profiles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsAndEventsAndProfiles();
  }, []);

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
    // Navigate to an edit page or open a modal with the ticket details
    console.log('Edit ticket:', ticketId);
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
      <h1 className="text-2xl font-bold mb-6">Tickets List</h1>
      <div className="bg-white p-6 overflow-hidden rounded-2xl border-[1px] border-gray-300">
        {/* Filter Controls */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Statuses</option>
            <option value="reserved">Reserved</option>
            <option value="purchased">Purchased</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
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
            className="p-2 border border-gray-300 rounded"
          />

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded flex-grow"
          />
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto shadow border-[1px] border-gray-300 rounded-2xl p-6">
          <table className="min-w-full divide-y divide-gray-200 p-4">
            <thead className="border-b-[1px] border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">Event Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors border-b-[1px] border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <img
                      src={profiles[ticket.user_id]?.avatar_url}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>{profiles[ticket.user_id]?.first_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {events[ticket.event_id]?.name || 'Event not found'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        ticket.status === 'reserved'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ticket.status === 'purchased'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.purchase_date ? new Date(ticket.purchase_date).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
                    <button
                      onClick={() => handleEditTicket(ticket.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TicketsList;