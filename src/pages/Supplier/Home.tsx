import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';
import CreateCompany from '../Profile/Company';



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
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p>No company found. Please create a company profile.</p>
          <CreateCompany/>

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