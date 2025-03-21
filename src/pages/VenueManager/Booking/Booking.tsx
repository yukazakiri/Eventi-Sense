import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { Venue } from '../../../types/venue';

interface Company {
  id: string;
  // ... other company properties
}

interface CompanyProfile {
  company_logo_url: string | null;
  
  // ... other profile properties
}



interface Booking {
  id: string;
  venue_id: string;
  start_date: string; // Example: Add other booking properties
  end_date: string;   // Example
  


}

interface CompanyProfileProps {
  company: Company | null;
}

function Booking({ company }: CompanyProfileProps) {
  const [_companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [venues, setVenues] = useState<Venue[] | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [_bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!company?.id) return;

      setIsLoading(true);
      setVenuesLoading(true);
      setBookingsLoading(true);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', company.id)
          .single();

        if (profileError) {
          console.error('Error fetching company profile:', profileError);
        } else {
          setCompanyProfile(profileData as CompanyProfile);
        }

        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('*')
          .eq('company_id', company.id);

        if (venuesError) {
          console.error('Error fetching venues:', venuesError);
        } else {
          setVenues(venuesData as Venue[]);

          const allVenueIds = venuesData?.map(venue => venue.id) || [];

          if (allVenueIds.length > 0) {
            const { data: bookingsData, error: bookingsError } = await supabase
              .from('bookings')
              .select('*')
              .in('venue_id', allVenueIds);

            if (bookingsError) {
              console.error('Error fetching bookings:', bookingsError);
            } else {
              setBookings(bookingsData as Booking[]);
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
        setVenuesLoading(false);
        setBookingsLoading(false);
      }
    };

    fetchCompanyData();
  }, [company]);

  if (isLoading) {
    return <p>Loading company data...</p>;
  }

  if (!company) {
    return <p>No company data available.</p>;
  }

  return (
    <div>
   
    {venuesLoading ? (
      <p>Loading venues...</p>
    ) : venues ? (
      <div className="grid  md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Use grid for layout */}
        {venues.map((venue) => {
          const venueBookings = bookings?.filter(booking => booking.venue_id === venue.id);
          const bookingCount = venueBookings ? venueBookings.length : 0;

          return (
            
            <div key={venue.id}  className="overflow-hidden h-auto group cursor-pointer w-full hover:bg-navy-blue-5 dark:hover:bg-navy-sky-5 border-[1px] border-gray-300 dark:border-gray-700 rounded-xl transition-all duration-300 shadow-2xl">
            <NavLink to={`/Venue-Manager-Dashboard/BookingDetail/${venue.id}`} className="block h-full transition duration-500 ease-in-out hover:scale-105">
              <div className="relative">
                {venue.cover_image_url && (
                  <img className="w-full h-[150px] object-cover" src={venue.cover_image_url} alt={venue.name} />
                )}
          
                {/* "View More" overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out">
                  <span className="text-white text-lg ">View More</span>
                </div>
           
                <div className="text-base font-sofia shadow-lg absolute top-0 right-0 rounded-md bg-sky-600 px-4 py-2 text-white mt-3 mr-3 group-hover:bg-white group-hover:text-sky-800 transition duration-500 ease-in-out">
                {bookingCount}  Bookings
                </div>
              </div>
              <div className="px-6 py-4 mb-auto">
                <div className="font-medium text-lg gradient-text transition duration-500 ease-in-out inline-block mb-2">
                  {venue.name}
                </div>
                <p className="text-gray-500 dark:text-gray-200 text-sm">
                  {venue.description || "No description available"}
                </p>
              </div>
         
            </NavLink>
          </div>
          );
        })}
      </div>
    ) : (
      <p>No venues found.</p>
    )}
  </div>
  );
}

export default Booking;