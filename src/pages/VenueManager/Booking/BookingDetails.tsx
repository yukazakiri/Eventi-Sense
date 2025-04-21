import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { Venue, Booking, BookingStatus } from '../../../types/venue';
import { Profile } from '../../../types/types';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import AddVenueAvailabilityForm from '../venue/VenueDetails/AvailabiltyGallery/AddVenueAvailabilityForm';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { fetchVenue } from '../../../api/Venue/venueapi';
import { fetchProfile, getCurrentUser } from '../../../api/utiilty/profiles';
import BookingModal from './components/bookingModal';
import { MdKeyboardArrowDown } from "react-icons/md";
import { Modal } from '../../../assets/modal/modal';
import { successMessages, errorMessages, confirmationMessages, MessageObject } from '../../../assets/modal/message';



const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Bookings', href: '/Venue-Manager-Dashboard/Booking-List' },
  { label: 'Details', href: '' },
];

  const BookingDetails = () => {
    const { venueId } = useParams();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [_profiles, setProfiles] = useState<Profile[]>([]);
    const phTimeZone = 'Asia/Manila';
    const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
      // Modal states
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalTitle, setModalTitle] = useState('');
      const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning' | 'confirmation'>('info');
      const [modalAction, setModalAction] = useState<() => void>(() => {});
      const [modalMessageKey, setModalMessageKey] = useState<keyof MessageObject | undefined>(undefined);
    useEffect(() => {
      const fetchBookingDetails = async () => {
        
        try {
          if (!venueId) {
            throw new Error('Venue ID is required');
          }
          
          // Use the imported fetchVenue function instead of direct Supabase query
          const venueData = await fetchVenue(venueId);
          setVenue(venueData);

          if (!venueData) {
            throw new Error('Venue not found');
          }

          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('venue_id', venueId);

          if (bookingError) throw bookingError;
          setBookings(bookingData || []);

          // Get user profiles for each booking
          const userIds = bookingData?.map(booking => booking.user_id).filter(Boolean);
          
          if (userIds && userIds.length > 0) {
            // Use Promise.all to fetch all profiles in parallel
            const profilePromises = userIds.map(userId => fetchProfile(userId));
            const fetchedProfiles = await Promise.all(profilePromises);
            setProfiles(fetchedProfiles.map((profile): Profile => ({...profile!, id: Number(profile!.id)})).filter(Boolean));
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBookingDetails();
    }, [venueId]);
    const updateBookingStatus = async (bookingId: string | undefined, newStatus: BookingStatus) => {
      if (!bookingId) return; // Prevent undefined errors
    
      try {
        // Fetch the booking details to access user_id and venue_id
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('user_id')
          .eq('id', bookingId)
          .single();
    
        if (bookingError || !booking) {
          throw new Error("Failed to retrieve booking details.");
        }

        const { error: updateError } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId);
    
        if (updateError) throw updateError;
    
        // Update UI state
        setBookings(prev =>
          prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
    
        setSelectedBooking(null);
        showSuccessModal('itemSaved');
        const user = await getCurrentUser();
        const userId = user?.id;
        const senderName = user?.user_metadata?.name || 'Unknown User';
        // Define notification message
        let notificationMessage = `${senderName} has `;

        if (newStatus === 'cancelled') {
            notificationMessage += `cancelled your booking at ${venue?.name}.`;
        } else if (newStatus === 'confirmed') {
            notificationMessage += `approved your booking at ${venue?.name}.`;
        } else if (newStatus === 'pending') {
          notificationMessage += `set your booking to pending at ${venue?.name}.`
        } else {
            notificationMessage += `changed the status of your booking at ${venue?.name}.`;
        }
    
        // Create notification
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert([
            {
              user_id: booking.user_id, // Notify the user who made the booking
              sender_id: userId, // ID of the sender
              type: "booking_status_update",
              message: notificationMessage, // Use the sender's name
              link: `/venue/${venue?.id}`,
              is_read: false, // Explicitly set read status
            }
          ]);
    
        if (notificationError) {
          console.error("Error creating notification:", notificationError);
        }
      } catch (err: any) {
        console.error("Error updating booking:", err);
        setError(err.message);
        showErrorModal('networkError');
      }
    };
    
 
    const deleteBooking = async (bookingId: string | undefined) => {
      if (!bookingId) return; // Prevent undefined errors
    
      try {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .eq('id', bookingId)
          .eq('status', 'cancelled'); // Ensure only cancelled bookings are deleted
    
        if (error) throw error;
    
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      } catch (err: any) {
        setError(err.message);
        showErrorModal('networkError');
      }
    };  
      const showSuccessModal = (messageKey: keyof typeof successMessages) => {
        setIsModalOpen(true);
        setModalTitle('Success');
        setModalType('success');
        setModalMessageKey(messageKey);
        setModalAction(() => closeModal);
      };
    
      const showErrorModal = (messageKey: keyof typeof errorMessages) => {
        setIsModalOpen(true);
        setModalTitle('Error');
        setModalType('error');
        setModalMessageKey(messageKey);
        setModalAction(() => closeModal);
      };
       const closeModal = () => {
      setIsModalOpen(false);
    };
  
      const showConfirmationModal = (messageKey: keyof typeof confirmationMessages, onConfirm: () => void) => {
        setIsModalOpen(true);
        setModalTitle('Confirmation');
        setModalType('confirmation');
        setModalMessageKey(messageKey);
        setModalAction(() => onConfirm);
      };
      const openDeleteModal = () => {
        const bookingId = selectedBooking?.id; // Assuming selectedBooking is the booking you want to delete
        showConfirmationModal('deleteItem', () => deleteBooking(bookingId));
      };
  
    const filteredBookings = selectedFilter === 'all' 
      ? bookings 
      : bookings.filter(booking => booking.status === selectedFilter);

    if (loading) return <p className="p-4 text-gray-600 dark:text-white">Loading...</p>;
    if (error) return <p className="p-4 text-red-500 dark:text-red-400">Error: {error}</p>;

    return (
      <div className="md:mx-10 mx-4 mt-4">
        
        <div className="flex justify-end mr-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        
        <div className="bg-white p-8 mb-8 border border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700">

          {venue && (
            <div className='flex justify-between'>
            <h1 className="text-2xl font-bold mb-6 text-gray-700 dark:text-white">
              Bookings for <span className="gradient-text">{venue.name}</span>
            </h1>
              <div className="relative inline-block text-left">
                  <select
                    className="appearance-none w-full px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out cursor-pointer pr-10"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                  
                    <div className="pointer-events-none absolute inset-y-0 -top-2 right-0 flex items-center px-2 text-gray-700 dark:text-gray-400">
                        <MdKeyboardArrowDown className="h-5 w-5" aria-hidden="true" />
                    </div>
              </div>
            </div>
          )}

{filteredBookings.length > 0 ? (
            <div className="overflow-x-auto shadow border border-gray-300 rounded-2xl dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-300">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-300">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-300">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-300">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-400 tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">

                          {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={booking?.avatar_url || fallbackAvatarUrl}
                            className="w-10 h-10 rounded-full mr-2"
                            alt="User avatar"
                          />
                          <div className="text-sm text-gray-900 dark:text-white">
                            {booking.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {booking.service}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-2 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600"
                        >
                          View
                        </button>
                        {booking.status === 'cancelled' && (
                      <button          onClick={openDeleteModal}  className="ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl ">Delete</button>
                    )}
                      </td>
                   
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-4 text-gray-600 dark:text-gray-300">No bookings found</p>
          )}

{selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onConfirm={() => updateBookingStatus(selectedBooking.id!, 'confirmed')}
          onDecline={() => updateBookingStatus(selectedBooking.id!, 'cancelled')}
        />
      )}
        </div>
        
              {/* Modal Component */}
              <Modal
                isOpen={isModalOpen}
                title={modalTitle}
                onClose={closeModal}
                type={modalType}
                messageKey={modalMessageKey}
                onConfirm={modalAction}
              />
              

        <AddVenueAvailabilityForm />
      </div>
    );
  };

  export default BookingDetails;