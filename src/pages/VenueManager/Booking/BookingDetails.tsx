    import  { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import supabase from '../../../api/supabaseClient';
    import { Venue, Booking, BookingStatus } from '../../../types/venue';
    import { format } from 'date-fns';
    import { toZonedTime } from 'date-fns-tz';
    import AddVenueAvailabilityForm from '../venue/VenueDetails/AvailabiltyGallery/AddVenueAvailabilityForm';

    const BookingDetails = () => {
    const { venueId } = useParams();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const phTimeZone = 'Asia/Manila'; // Philippine Timezone

    useEffect(() => {
        const fetchBookingDetails = async () => {
        try {
            // 1. Fetch Venue Details
            const { data: venueData, error: venueError } = await supabase
            .from('venues')
            .select('*')
            .eq('id', venueId)
            .single();

            if (venueError) {
            throw venueError;
            }
            if (venueData) {
            setVenue(venueData);
            } else {
            setError("Venue not found.");
            return;
            }

            // 2. Fetch Bookings for the Venue
            const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('venue_id', venueId);

            if (bookingError) {
            throw bookingError;
            }

            if (bookingData) {
            setBookings(bookingData);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchBookingDetails();
    }, [venueId]);

    // Function to update booking status
    const updateBookingStatus = async (bookingId: string, newStatus: string) => {
        try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId);

        if (error) {
            throw error;
        }

        // Update the UI
        setBookings((prevBookings) =>
            prevBookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: newStatus as BookingStatus } : booking
            )
        )
        } catch (err: any) {
        setError(err.message);
        }
    };

    if (loading) {
        return <p className="p-4 text-gray-600">Loading booking details...</p>;
    }

    if (error) {
        return <p className="p-4 text-red-500">Error: {error}</p>;
    }

    return (
        <div>
        <div className=" bg-white p-8  m-4 border-[1px] border-gray-300 rounded-3xl">
        {venue && (
            <h1 className="text-3xl font-bonanova font-bold mb-6 text-gray-700">
            Bookings for <span className="text-indigo-500">{venue.name}</span>
            </h1>
        )}

        {bookings.length > 0 ? (
       
            <div className="overflow-x-auto  shadow  border-[1px] border-gray-300 rounded-lg ">
            <table className="min-w-full divide-y divide-gray-200 p-4 ">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    End Date
                    </th>
                
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.message || "No message"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(
                        toZonedTime(new Date(booking.start_date), phTimeZone),
                        'yyyy-MM-dd hh:mm a'
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(
                        toZonedTime(new Date(booking.end_date), phTimeZone),
                        'yyyy-MM-dd hh:mm a'
                        )}
                    </td>
        
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                        className={`px-4 py-2 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                        >
                        {booking.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                        {booking.status !== 'confirmed' && (
                            <button
                                onClick={() => {
                                if (booking.id) {
                                    updateBookingStatus(booking.id, 'confirmed');
                                }
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg  hover:bg-green-600"
                            >
                                Confirm
                            </button>
                            )}
                        {booking.status !== 'cancelled' && (
                            <button
                            onClick={() => {
                                if (booking.id) {
                                    updateBookingStatus(booking.id, 'cancelled');
                                }
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                            Cancel
                            </button>
                        )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
      
        ) : (
            <p className="p-4 text-gray-600">No bookings found for this venue.</p>
        )}
    
        </div> 
       <AddVenueAvailabilityForm />
        </div>
    );
    };

    export default BookingDetails;