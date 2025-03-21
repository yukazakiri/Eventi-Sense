import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';


interface DashboardStats {
  totalVenues: number;
  totalBookings: number;
  pendingBookings: number;
  ticketReservations: number;
}

interface Company {
  id: string;
  name: string;
  // ... other company properties
}

interface DashboardErrors {
  venues?: string;
  bookings?: string;
  pending?: string;
  reservations?: string;
  company?: string;
}

const Home: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<DashboardErrors>({});
  const [stats, setStats] = useState<DashboardStats>({
    totalVenues: 0,
    totalBookings: 0,
    pendingBookings: 0,
    ticketReservations: 0,
  });

  useEffect(() => {
    async function fetchVenueIds(companyId: string): Promise<string[]> {
      try {
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('id')
          .eq('company_id', companyId);

        if (venuesError) throw venuesError;
        return venues.map(venue => venue.id);
      } catch (error) {
        setErrors(prev => ({ ...prev, venues: 'Failed to fetch venues' }));
        return [];
      }
    }

    async function fetchDashboardStats(companyId: string) {
      try {
        const venueIds = await fetchVenueIds(companyId);
        
        // Get total venues count
        const { data: venuesCount, error: venuesError } = await supabase
          .from('venues')
          .select('count', { count: 'exact' })
          .eq('company_id', companyId);

        if (venuesError) throw venuesError;

        // Get total bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('count', { count: 'exact' })
          .in('venue_id', venueIds);

        if (bookingsError) throw bookingsError;

        // Get pending bookings
        const { data: pendingBookings, error: pendingError } = await supabase
          .from('bookings')
          .select('count', { count: 'exact' })
          .in('venue_id', venueIds)
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Get ticket reservations
        const { data: ticketReservations, error: ticketsError } = await supabase
          .from('tickets')
          .select('count', { count: 'exact' })
          .in('event_id', venueIds)
          .eq('status', 'reserved');

        if (ticketsError) throw ticketsError;

        setStats({
          totalVenues: venuesCount?.[0]?.count || 0,
          totalBookings: bookings?.[0]?.count || 0,
          pendingBookings: pendingBookings?.[0]?.count || 0,
          ticketReservations: ticketReservations?.[0]?.count || 0,
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setErrors(prev => ({ 
          ...prev, 
          bookings: 'Failed to fetch statistics' 
        }));
      }
    }

    async function fetchCompanyData() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        const { data, error } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        return data as Company;
      } catch (error) {
        setErrors(prev => ({ 
          ...prev, 
          company: 'Failed to fetch company profile' 
        }));
        return null;
      } finally {
        setIsLoading(false);
      }
    }

    async function initializeData() {
      const companyData = await fetchCompanyData();
      if (companyData) {
        setCompany(companyData);
        await fetchDashboardStats(companyData.id);
      }
    }

    initializeData();
  }, []);
  interface Event {
    id: string;
    name: string;
    date: string;
    venue: string;
    status: string; // e.g., "upcoming", "ongoing", "completed"
  }
  
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  
  // Fetch upcoming events
  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(5);
  
        if (error) throw error;
        setUpcomingEvents(data || []);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    }
  
    fetchUpcomingEvents();
  }, []);

  const renderStatCard = (
    title: string,
    value: number,
    icon: JSX.Element,
    color: string,
    error?: string
  ) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      {error ? (
        <div className="text-red-500 dark:text-red-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg`}>
              <div className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}>
                {icon}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{title}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total {title.toLowerCase()}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <main className="flex-1 p-8 dark:bg-gray-950">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
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
                      href="/Venue-Manager-Dashboard/Profiles"  
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
    <main className="flex-1 p-8 dark:bg-gray-950">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your business metrics
        </p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard(
          "Venues",
          stats.totalVenues,
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>,
          "blue",
          errors.venues
        )}

        {renderStatCard(
          "Bookings",
          stats.totalBookings,
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>,
          "green",
          errors.bookings
        )}

        {renderStatCard(
          "Pending",
          stats.pendingBookings,
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>,
          "yellow",
          errors.pending
        )}

        {renderStatCard(
          "Reservations",
          stats.ticketReservations,
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
          </svg>,
          "purple",
          errors.reservations
        )}
      </div>
      <div className="mt-8">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Upcoming Events</h2>
  <div className="space-y-4">
    {upcomingEvents.map(event => (
      <div key={event.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{event.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{event.venue} • {new Date(event.date).toLocaleDateString()}</p>
          </div>
          <span className={`px-2 py-1 text-sm rounded-full ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {event.status}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
<div className="mt-8">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <a href="/Venue-Manager-Dashboard/Event/Create" className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="text-center">
        <div className="mx-auto w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Create Event</p>
      </div>
    </a>
    {/* Add more quick actions here */}
  </div>
</div>
    </main>
  );
};

export default Home;