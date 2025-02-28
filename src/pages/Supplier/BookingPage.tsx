import  { useState, useEffect } from 'react';
import UserBookings from '../Supplier/Booking/BookingDetails'; // Adjust the path as needed
import supabase from '../../api/supabaseClient'; // Adjust the path to your Supabase client
import AddVenueAvailabilityForm from '../Supplier/SupplierDetails/AvailabilityGallery/AddSupplierAvailabilityForm';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';



const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Bookings', href: '' }
];
function BookingPage() {
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplierId = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('User not authenticated.');
          return;
        }

        // Fetch supplierId from the 'supplier' table using the user's ID.
        const { data, error } = await supabase
          .from('supplier')
          .select('id')
          .eq('company_id', user.id) // Assuming 'user_id' in 'supplier' table links to auth.user.id
          .single(); // Expecting only one supplier per user.

        if (error) {
          throw error;
        }

        if (data) {
          setSupplierId(data.id);
        } else {
          setError('Supplier not found for this user.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching supplier ID:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierId();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!supplierId) {
    return <div>Supplier ID not available.</div>;
  }

  return (
    <>
      <div className='flex justify-between mx-8'>
        <h1 className="text-3xl font-bold flex items-center font-bonanova text-gray-700 dark:text-white">Bookings</h1>
        <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
    <div className='md:mx-10'>

      <div className='bg-white rounded-2xl border-[1px] border-gray-300 mb-6 dark:bg-gray-900 dark:border-gray-700'>
      <div className='border-b-[1px] border-gray-300 dark:border-gray-700 '>
                 <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia  dark:text-white">User Booking Requests</h2>
            </div>
         <UserBookings supplierId={supplierId} />
      </div>
      <div className='bg-white rounded-2xl border-[1px] border-gray-300 mb-6 dark:bg-gray-900 dark:border-gray-700'>
      <div className='border-b-[1px] border-gray-300 dark:border-gray-700 '>
                 <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia  dark:text-white">Existing Availabilities</h2>
            </div>
          <div className='p-6'>
            <AddVenueAvailabilityForm  supplierId={supplierId} />
          </div>
      </div>
    
    
    </div>
  </>
  );
}

export default BookingPage;