import { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { Booking, Venue } from '../../../types/venue';
import { Booking as SupplierBooking, Supplier } from '../../../types/supplier';
import { Calendar, Clock, Package } from 'react-feather';
import BookingDetailsModal from './UserbookingsModal';

export const useUserBookings = () => {
  const [bookings, setBookings] = useState<(Booking & { venue?: Venue })[]>([]);
  const [supplierBookings, setSupplierBookings] = useState<(SupplierBooking & { supplier?: Supplier })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('User not authenticated');
        return;
      }

      // Fetch venue bookings with venue data in a single query
      const { data: venueBookingsData, error: venueBookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          venue:venue_id (*)
        `)
        .eq('user_id', user.id);

      if (venueBookingsError) throw venueBookingsError;

      // Fetch supplier bookings with supplier data in a single query
      const { data: supplierBookingsData, error: supplierBookingsError } = await supabase
        .from('supplier_bookings')
        .select(`
          *,
          supplier:supplier_id (*)
        `)
        .eq('user_id', user.id);

      if (supplierBookingsError) throw supplierBookingsError;

      setBookings(venueBookingsData || []);
      setSupplierBookings(supplierBookingsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return {
    bookings,
    supplierBookings,
    loading,
    error,
    refresh: fetchUserBookings
  };
};

interface UserBookingsProps {
  userId: string;
}

export const UserBookings: React.FC<UserBookingsProps> = ({ userId }) => {
  const { bookings, supplierBookings, loading, error } = useUserBookings();
  const [selectedBooking, setSelectedBooking] = useState<(Booking & { venue?: Venue }) | (SupplierBooking & { supplier?: Supplier }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'venue' | 'supplier'>('venue');

  const handleBookingClick = (
    booking: (Booking & { venue?: Venue }) | (SupplierBooking & { supplier?: Supplier }), 
    type: 'venue' | 'supplier'
  ) => {
    // Ensure nested data exists
    const enhancedBooking = type === 'venue'
      ? { ...booking, venue: (booking as Booking & { venue?: Venue }).venue }
      : { ...booking, supplier: (booking as SupplierBooking & { supplier?: Supplier }).supplier };
  
    setSelectedBooking(enhancedBooking);
    setModalType(type);
    setIsModalOpen(true);
  };
  
  if (!userId) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">User ID is required.</span>
      </div>
    );
  }

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  const BookingCard = ({ 
    booking, 
    type 
  }: { 
    booking: (Booking & { venue?: Venue }) | (SupplierBooking & { supplier?: Supplier }); 
    type: 'venue' | 'supplier' 
  }) => {
    const colors = type === 'venue' ? {
      bg: 'bg-indigo-500/40',
      icon: 'text-indigo-400',
      text: 'text-blue-400 hover:text-blue-300',
      status: 'bg-sky-100 text-sky-800'
    } : {
      bg: 'bg-pink-500/40',
      icon: 'text-pink-400',
      text: 'text-pink-400 hover:text-pink-300',
      status: 'bg-pink-100 text-pink-800'
    };

    // Get the related entity name (venue or supplier)
    const entityName = type === 'venue' 
    ? (booking as Booking & { venue?: Venue }).venue?.name || 'Venue details unavailable'
    : (booking as SupplierBooking & { supplier?: Supplier }).supplier?.name || 'Supplier details unavailable';

    return (
      <div 
        key={booking.id}
        className="relative bg-[#152131] rounded-xl font-sofia p-4 sm:p-6 w-full border-3 border-transparent transition-shadow duration-500 ease-in-out cursor-pointer"
        style={{
          background: `
            linear-gradient(#152131, #152131) padding-box,
            linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
          `,
          border: '1px solid transparent',
          borderRadius: '0.75rem'
        }}
        onClick={() => handleBookingClick(booking, type)}
      >
        {type === 'supplier' && (
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-3"></div>
        )}
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-white">
              {type === 'venue' ? 'Venue Booking' : 'Supplier Booking'}
            </h3>
            <span className={`px-2 py-1 ${colors.status} text-xs font-medium rounded-full`}>
              #{booking.status}
            </span>
          </div>

  
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-200">
              <div className={`${colors.bg} rounded-full`}> 
                <Calendar className={`h-4 w-4 m-2 ${colors.icon}`} />
              </div>
              <span>
                {booking.created_at 
                  ? new Date(booking.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) 
                  : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-200">
              <div className={`${colors.bg} rounded-full`}> 
                <Clock className={`h-4 w-4 m-2 ${colors.icon}`} />
              </div>
              <span>
                {booking.created_at 
                  ? new Date(booking.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) 
                  : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-200">
              <div className={`${colors.bg} rounded-full`}> 
                <Package className={`h-4 w-4 m-2 ${colors.icon}`} />
              </div>
               <div>
               <p className="text-sm text-gray-400">{type === 'venue' ? 'Venue' : 'Supplier'}</p>
               <p className="font-medium">{entityName}</p>
               </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-gray-200/30">
            <button 
              className={`${colors.text} text-sm font-medium flex items-center`}
              onClick={(e) => {
                e.stopPropagation();
                handleBookingClick(booking, type);
              }}
            >
              View Details
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sofia max-w-7xl mx-auto">
      {/* Venue Bookings Section */}
      <div>
      <div className='mb-6'> <h2 className="text-xl font-semibold gradient-text  font-bonanova mb-6 tracking-wide">Venue Bookings</h2></div>
       
        
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} type="venue" />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-6 text-center">
            <p className="text-gray-300">No venue bookings found.</p>
            <a href="/venues" className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Explore Venues
            </a>
          </div>
        )}
      </div>

      {/* Supplier Bookings Section */}
      <div>
        <div className='mb-6'> <h2 className="text-xl font-semibold gradient-text  font-bonanova mb-6 tracking-wide">Supplier Bookings</h2></div>
    
        
        {supplierBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplierBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} type="supplier" />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-lg p-6 text-center">
            <p className="text-gray-300">No supplier bookings found.</p>
            <a href="/suppliers" className="mt-3 inline-block px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              Explore Suppliers
            </a>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          type={modalType}
          entityDetails={
            modalType === 'venue' 
              ? (selectedBooking as Booking & { venue?: Venue }).venue
              : (selectedBooking as SupplierBooking & { supplier?: Supplier }).supplier
          }
        />
      )}
    </div>
  );
};