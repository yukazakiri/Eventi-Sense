import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient'; // Your Supabase client
import CompanyProfile from './Booking/Booking'; // Your CompanyProfile component
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Bookings', href: '' },
];


interface Company {
  id: string;
  name: string;
  // ... other company properties
}

const Home: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      // Get the current user directly from Supabase Auth
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }
      console.log('user',user);

      try {
        // Fetch company data based on the user ID
        const { data, error } = await supabase
          .from('company_profiles') // Your companies table
          .select('*')
          .eq('id', user.id) // Filter by the currently logged-in user
          .single(); // Assuming one company per user

        if (error) {
          console.error('Error fetching company:', error);
        } else {
          setCompany(data as Company);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (isLoading) {
    return (
      <main className="flex-1 p-8 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:border dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">Loading company data...</p>
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="flex-1 p-8 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow dark:border dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No company found. Please create a company profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto md:mx-[2rem] md:my-6 my-4 ">
         <div className='flex justify-end mr-4'>
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>
         <div className='dark:bg-gray-900 bg-white rounded-3xl p-8'>
      <div className="font-sofia mb-6 dark:bg-gray-800   p-4 rounded-xl">
        <h1 className="text-3xl font-bonanova font-semibold text-gray-600 dark:text-gray-200">
          List Of Bookings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here is a list of all bookings associated with your company.
        </p>
      </div>
   
      <CompanyProfile company={company} />
      </div>
    </main>
  );
};

export default Home;