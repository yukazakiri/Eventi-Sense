import React, { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';

const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home' , icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Venues', href: '' },
 // Current page (empty href)
];

interface Venue {
  id: string;
  name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  location: string;
  phone_number: string;
  email: string;
  website: string;
  capacity: number;
  description: string;
  venue_type: string;
  created_at: string;
  company_id: string;
  cover_image_url: string; // Add this for image URL from Supabase
}

const CompanyVenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching company profile:', profileError);
          setError('An error occurred while fetching the company profile.');
        } else {
          setCompanyProfile(profileData);
        }
      }
    };

    fetchCompanyProfile();
  }, []);

  useEffect(() => {
    if (companyProfile?.id) {
      const fetchVenues = async () => {
        try {
          const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('company_id', companyProfile.id);

          if (error) {
            throw error;
          }

          setVenues(data);
        } catch (err) {
          console.error('Error fetching venues:', err);
          setError('An error occurred while fetching venues.');
        } finally {
          setLoading(false);
        }
      };

      fetchVenues();
    }
  }, [companyProfile]);

  const handleVenueClick = (venueId: string) => {
    navigate(`/Venue-Manager-Dashboard/Venue/${venueId}`);
  };

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 font-sofia">
    <div className='flex '>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      <div className=" mb-4 flex justify-start items-start"> 
      <h2 className="text-3xl font-bold  ">
      Venues 
    </h2>
    <div className='flex justify-end items-end'>
      <NavLink to="/Venue-Manager-Dashboard/CreateVenue">
      <button   
       className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full  text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
         >
        Create Venue
      </button>
      </NavLink>
    </div>
    </div>
      
      {venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10 group cursor-pointer">
          {venues.map((venue) => (
            <div key={venue.id} className="rounded overflow-hidden shadow-lg hover:bg-white">
              <div className="relative">
                <a  onClick={() => handleVenueClick(venue.id)}> {/* Link to venue details */}
                  <img
                    className="w-full"
                    src={venue.cover_image_url || "https://via.placeholder.com/500"} // Placeholder if no image
                    alt={venue.name}
                  />
                  <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
                </a>
                <div className="absolute bottom-0 left-0 bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                  {venue.venue_type} {/* Display venue type */}
                </div>
                {/* Date/Number Overlay -  You'll likely need to format the created_at date */}
                {/* <div className="text-sm absolute top-0 right-0 bg-indigo-600 px-4 text-white rounded-full h-16 w-16 flex flex-col items-center justify-center mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                  <span className="font-bold">27</span>
                  <small>March</small>
                </div> */}
              </div>
              <div className="px-6 py-4">
                <a href="#" onClick={() => handleVenueClick(venue.id)} className="font-semibold text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out">
                  {venue.name}
                </a>
                <p className="text-gray-500 text-sm">{venue.address_city}, {venue.address_state}</p> {/* Simplified location */}
              </div>
              <div className="px-6 py-4 flex flex-row items-center">
                <span className="py-1 text-sm font-regular text-gray-900 mr-1 flex flex-row items-center">
                  {/* You'll need to handle the time ago logic */}
                  <span>{/* Time Ago */}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No venues found for your company.</p>
      )}
    </div>
  );
};

export default CompanyVenuesPage;