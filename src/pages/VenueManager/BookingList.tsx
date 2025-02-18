import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient'; // Your Supabase client
import CompanyProfile from './Booking/Booking'; // Your CompanyProfile component

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
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Loading company data...</p> {/* Loading message */}
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p>No company found. Please create a company profile.</p> {/* No company message */}
        </div>
      </main>
    );
  }

  return (
    <main className='mx-auto md:mx-[6rem]' >
      <div className=" font-sofia my-8">
        <h1 className="text-3xl font-bonanova font-semibold  text-gray-600">List Of Bookings</h1>
        <p className="mt-2 text-gray-600">Here is a list of all bookings associated with your company.</p>
        
      </div>
      
    <CompanyProfile company={company} />
    </main>
  );
};

export default Home;