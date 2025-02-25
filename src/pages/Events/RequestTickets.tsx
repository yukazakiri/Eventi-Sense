import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabaseClient';

interface Ticket {
    id: string;
    event_id: string;
    user_id: string;
    quantity: number;
    status: string;
    purchase_date: string | null;
    created_at: string;
    updated_at: string;
}

const TicketsList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setError('You must be logged in to view your tickets.');
                    setLoading(false);
                    return;
                }

                // 1. Fetch the user's events
                const { data: userEvents, error: eventsError } = await supabase
                    .from('events')
                    .select('id')
                    .eq('organizer_id', user.id);

                if (eventsError) throw eventsError;

                if (!userEvents || userEvents.length === 0) {
                    setTickets([]); // No events, no tickets
                    setLoading(false);
                    return;
                }

                const eventIds = userEvents.map((event) => event.id);

                // 2. Fetch the tickets for those events
                const { data, error: ticketsError } = await supabase
                    .from('tickets')
                    .select('*')
                    .in('event_id', eventIds) // Fetch tickets for the user's events
                    .order('created_at', { ascending: false });

                if (ticketsError) throw ticketsError;

                setTickets(data || []);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                setError('Failed to load tickets. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // ... (rest of your component: loading, error handling, rendering)
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
            <h1 className="text-2xl font-bold mb-6">Tickets for Your Events</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Ticket ID</th>
                            <th className="py-2 px-4 border-b">Event ID</th>
                            <th className="py-2 px-4 border-b">User ID</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Purchase Date</th>
                            <th className="py-2 px-4 border-b">Created At</th>
                            <th className="py-2 px-4 border-b">Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{ticket.id}</td>
                                <td className="py-2 px-4 border-b">{ticket.event_id}</td>
                                <td className="py-2 px-4 border-b">{ticket.user_id}</td>
                                <td className="py-2 px-4 border-b">{ticket.quantity}</td>
                                <td className="py-2 px-4 border-b">
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm ${ticket.status === 'reserved'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : ticket.status === 'purchased'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {ticket.purchase_date
                                        ? new Date(ticket.purchase_date).toLocaleString()
                                        : 'N/A'}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(ticket.created_at).toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(ticket.updated_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketsList;