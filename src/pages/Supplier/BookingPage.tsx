import { useState, useEffect } from 'react';
import UserBookings from '../Supplier/Booking/BookingDetails'; // Adjust the path as needed
import supabase from '../../api/supabaseClient'; // Adjust the path to your Supabase client
import AddVenueAvailabilityForm from '../Supplier/SupplierDetails/AvailabilityGallery/AddSupplierAvailabilityForm';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom'; // Import Link for navigation

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
          .eq('company_id', user.id);

        if (error) {
          throw error;
        }

        // Check if we got any data back
        if (data && data.length > 0) {
          setSupplierId(data[0].id);
        } else {
          // No supplier found - set supplierId to null but don't treat as error
          setSupplierId(null);
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-4">Error: {error}</p>
          <Link
            to="/Supplier-Dashboard/Home"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!supplierId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-700 text-lg font-semibold mb-4 dark:text-white">
            No supplier information found. Please create or input your supplier details to proceed.
          </p>
          <Link
            to="/Supplier-Dashboard/Create-Supplier" // Adjust the route to your supplier creation page
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Create Supplier Information
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between mx-8">
        <h1 className="text-3xl font-bold flex items-center font-bonanova text-gray-700 dark:text-white">Bookings</h1>
        <div className="flex items-end">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <div className="md:mx-10">
        <div className="bg-white rounded-2xl border-[1px] border-gray-300 mb-6 dark:bg-gray-900 dark:border-gray-700">
          <div className="border-b-[1px] border-gray-300 dark:border-gray-700">
            <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-white">
              User Booking Requests
            </h2>
          </div>
          <UserBookings supplierId={supplierId} />
        </div>
        <div className="bg-white rounded-2xl border-[1px] border-gray-300 mb-6 dark:bg-gray-900 dark:border-gray-700">
          <div className="border-b-[1px] border-gray-300 dark:border-gray-700">
            <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-white">
              Existing Availabilities
            </h2>
          </div>
          <div className="p-6">
            <AddVenueAvailabilityForm supplierId={supplierId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingPage;