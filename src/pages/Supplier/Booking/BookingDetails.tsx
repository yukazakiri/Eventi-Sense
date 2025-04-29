import React, { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient'; // Adjust the path as needed
import { Booking } from '../../../types/supplier';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface UserBookingsProps {
    supplierId: string; // Add the supplierId as a prop
}

interface BookingWithServiceName extends Booking {
    service_name: string;
    avatar_url?: string; // Add avatar_url
}

// Modal Component
const BookingModal: React.FC<{
    booking: BookingWithServiceName | null;
    onClose: () => void;
    onConfirm: () => void;
    onDecline: () => void;
}> = ({ booking, onClose, onConfirm, onDecline }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center p-4 z-50 font-sofia">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg dark:bg-gray-900 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 tracking-wider text-gray-800 dark:text-white">Booking Details</h2>
                <div className="space-y-4 text-gray-700 dark:text-white">
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Name:</label>
                        <p>{booking.name}</p>
                    </div>
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Email:</label>
                        <p>{booking.email}</p>
                    </div>
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Phone:</label>
                        <p>{booking.phone}</p>
                    </div>
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Service:</label>
                        <p>{booking.suppliers_services?.service_name || 'Service Name Not Found'}</p>
                    </div>
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Message:</label>
                        <p>{booking.message || 'No message'}</p>
                    </div>
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Start Date:</label>
                        <p>{format(new Date(booking.start_date), 'yyyy-MM-dd hh:mm a')}</p>
                    </div>
                    <div>
                        <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">End Date:</label>
                        <p>{format(new Date(booking.end_date), 'yyyy-MM-dd hh:mm a')}</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onDecline}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const UserBookings: React.FC<UserBookingsProps> = ({ supplierId }) => {
    const [bookings, setBookings] = useState<BookingWithServiceName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<BookingWithServiceName | null>(null); // For modal

    const phTimeZone = 'Asia/Manila'; // Philippine Time Zone

    const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg'; // Path to your fallback image

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            setError(null);

            try {
                // First fetch the bookings with service name
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('supplier_bookings')
                    .select(`
                        *,
                        suppliers_services:service_id (service_name)
                    `)
                    .eq('supplier_id', supplierId);

                if (bookingsError) {
                    throw bookingsError;
                }

                if (bookingsData) {
                    // Then fetch user avatars separately for each booking
                    const bookingsWithDetails = await Promise.all(
                        bookingsData.map(async (booking: any) => {
                            // Fetch avatar from profiles using user_id
                            const { data: userData, error: userError } = await supabase
                                .from('profiles')
                                .select('avatar_url')
                                .eq('id', booking.user_id)
                                .single();

                            if (userError && userError.code !== 'PGRST116') {
                                console.error('Error fetching user data:', userError);
                            }

                            return {
                                ...booking,
                                avatar_url: userData?.avatar_url || fallbackAvatarUrl
                            };
                        })
                    );

                    setBookings(bookingsWithDetails);
                }
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [supplierId]);

    const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
        try {
            const { error } = await supabase
                .from('supplier_bookings')
                .update({ status })
                .eq('id', bookingId);

            if (error) {
                throw error;
            }

            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking.id === bookingId ? { ...booking, status } : booking
                )
            );
            setSelectedBooking(null); // Close modal after updating status
        } catch (err: any) {
            setError(err.message);
            console.error('Error updating booking status:', err);
        }
    };

    if (loading) {
        return <p className='text-gray-600 dark:text-white p-4'>Loading bookings...</p>;
    }

    if (error) {
        return <p className='text-gray-600 dark:text-white'>Error: {error}</p>;
    }

    return (
        <div className="p-6 font-sofia">
            {bookings.length > 0 ? (
                <div className="overflow-x-auto shadow border-[1px] border-gray-300 rounded-2xl dark:bg-gray-900 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 p-4 dark:text-white">
                        <thead className="border-b-[1px] border-gray-200 dark:border-gray-700">
                            <tr>  
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-200">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-200">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-200">
                                    Start Date
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-200">
                                    End Date
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-200">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:border-gray-700">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
                                        <img
                                            src={booking.avatar_url}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full mr-2"
                                        />
                                        <div className=''>
                                            {booking.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {booking.suppliers_services?.service_name || 'Service Name Not Found'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {format(
                                            toZonedTime(new Date(booking.start_date), phTimeZone),
                                            'yyyy-MM-dd hh:mm a'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {format(
                                            toZonedTime(new Date(booking.end_date), phTimeZone),
                                            'yyyy-MM-dd hh:mm a'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <span
                                            className={`px-4 py-2 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="px-4 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="p-4 text-gray-600 dark:text-white">No bookings found for this supplier.</p>
            )}

            {/* Modal */}
            {selectedBooking && (
                <BookingModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onConfirm={() => updateBookingStatus(selectedBooking.id ?? '', 'confirmed')}
                    onDecline={() => updateBookingStatus(selectedBooking.id ?? '', 'cancelled')}
                />
            )}
        </div>
    );
};

export default UserBookings;