// EventAttendees.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { getCurrentUser } from '../../api/utiilty/profiles';

interface Attendee {
  id: string;
  email?: string;
  quantity: number;
  amount?: number;
  payment_date: string;
}



const EventAttendees = () => {
    
  const { eventId } = useParams();
 
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');

  console.log('Event IDs:', eventId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Event ID:', eventId);
        if (!eventId) throw new Error('Invalid Event ID');
  
        const user = await getCurrentUser();
        if (!user) throw new Error('User not authenticated');
  
        // Verify event exists and user is organizer
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('name, organizer_id')
          .eq('id', eventId)
          .single();
  
        if (eventError) throw eventError;
        if (eventData.organizer_id !== user.id) throw new Error('Unauthorized access');
  
        setEventName(eventData.name);
  
        // Fetch attendees
        const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          quantity,
          user_id,
          orders (
            amount,
            payment_date,
            payment_status
          ),
          profiles (
            email
          )
        `)
        .eq('event_id', eventId)
        .eq('orders.payment_status', 'completed');
      
  
        if (error) throw error;
  
        const processedData = data.map(ticket => ({
            id: ticket.id,
            email: ticket.profiles?.[0]?.email || "No email", // Ensure it correctly references the email field
            quantity: ticket.quantity,
            amount: ticket.orders?.[0]?.amount,
            payment_date: ticket.orders?.[0]?.payment_date
          }));
  
        if (!processedData) throw new Error('No attendees found');
        setAttendees(processedData);
          
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [eventId]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
        Error loading attendees: {error}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">{eventName} Attendees</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all attendees for this event
          </p>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tickets
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount Paid
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Purchase Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {attendees.map((attendee) => (
                    <tr key={attendee.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {attendee.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {attendee.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${attendee.amount?.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(attendee.payment_date || 'TBA').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {attendees.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No attendees found for this event
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAttendees;