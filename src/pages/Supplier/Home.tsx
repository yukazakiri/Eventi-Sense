import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';




interface Company {
  id: string;
  name: string;
  // ... other company properties
}

const Home: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    async function fetchVenueIds(companyId: string): Promise<string[]> {
      try {
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .eq('company_id', companyId);

        if (venuesError) {
          console.error('Error fetching venues:', venuesError);
          return [];
        }
        return venues.map(venue => venue.id);
      } catch (error) {
        console.error('Error fetching venues:', error);
        return [];
      }
    }

    async function fetchTotalBookings(companyId: string) {
      try {
        const venueIds = await fetchVenueIds(companyId);
        if (venueIds.length === 0) {
          setTotalBookings(0);
          return;
        }

        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('count', { count: 'exact' })
          .in('venue_id', venueIds);

        if (error) {
          console.error("Error fetching total bookings:", error);
        } else {
          const count = bookings?.[0]?.count ? parseInt(bookings[0].count.toString(), 10) : 0;
          setTotalBookings(count);
        }
      } catch (error) {
        console.error("Error fetching total bookings:", error);
      }
    }

    async function fetchCompanyData() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return data as Company;
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setIsLoading(false);
      }
    }

    async function initializeData() {
      const companyData = await fetchCompanyData();
      if (!companyData) return;

      setCompany(companyData);
      await fetchTotalBookings(companyData.id);
    }

    initializeData();
  }, []); // Empty dependency array is OK here since we're using state setters properly

  if (isLoading) {
    return (
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow flex gap-2">
      
          <p>Loading company data...</p>
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="flex-1 p-8 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <svg 
                      className="h-6 w-6 text-blue-600 dark:text-blue-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Company Profile Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    To access your dashboard and manage your events effectively, please complete your company profile. This will help us provide you with a personalized experience tailored to your business needs.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="/Supplier-Dashboard/Profiles" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                      Complete Profile
                    </a>
                    <a 
                      href="#"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact our support team at support@example.com
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="flex-1 p-8">
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome to Your Venue Manager Home Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Total Bookings Across All Venues: {totalBookings}
        </p>

        {/* ... other content */}
      </div>
    </main>
  );
};

export default Home;