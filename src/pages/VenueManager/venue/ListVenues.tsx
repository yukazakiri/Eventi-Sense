import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import {  fetchVenueTypes, fetchVenuesWithTypes } from '../../../api/Venue/venueapi';
import { fetchCompany } from '../../../api/utiilty/profiles';
import { Venue } from '../../../types/venue';

const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Venues', href: '' },
];



interface VenueWithTypeName extends Venue {
  venue_type_name: string;
}

const CompanyVenuesPage: React.FC = () => {
  const [venuesWithTypes, setVenuesWithTypes] = useState<VenueWithTypeName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [venueTypes, setVenueTypes] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await fetchCompany();
        setCompanyProfile(profile);

        const types = await fetchVenueTypes();
        setVenueTypes(types);

      } catch (err:any) {
        setError(err.message);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadVenues = async () => {
      if (companyProfile?.id && Object.keys(venueTypes).length > 0) {
        try {
          const venues = await fetchVenuesWithTypes(companyProfile.id, venueTypes);
          setVenuesWithTypes(venues);
        } catch (err:any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };
    loadVenues();
  }, [companyProfile, venueTypes]);

  const handleVenueClick = (venueId: string) => {
    navigate(`/Venue-Manager-Dashboard/VenueDetails/${venueId}`);
  };

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div>Error: {error}</div>;

    return (
        <div className=" font-sofia text-[1.4rem]  md:mx-6 mx-4 md:my-10 my-4  ">
            <div className='flex justify-end mr-4'>
                <Breadcrumbs items={breadcrumbItems} />
            </div>
          <div className='bg-white dark:bg-gray-900 rounded-3xl p-8'>
            <div className="mb-4 flex justify-between">
                <h2 className="text-3xl font-bold">
                    Venues
                </h2>
                <div className='flex justify-end items-end'>
                    <NavLink to="/Venue-Manager-Dashboard/CreateVenue">
                        <button
                            className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800 mr-2"
                        >
                            Create Venue
                        </button>
                    </NavLink>
                </div>
            </div>

            {venuesWithTypes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {venuesWithTypes.map((venue) => (
                        <NavLink key={venue.id} to={`/Venue-Manager-Dashboard/VenueDetails/${venue.id}`}>
                            <div className="overflow-hidden h-auto group cursor-pointer w-full hover:bg-navy-blue-5 dark:hover:bg-navy-sky-5 border-[1px] border-gray-300 dark:border-gray-700 rounded-xl transition-all duration-300 shadow-2xl">
                                <div className="venue-container">
                                    <div className="overflow-hidden rounded-t-xl" onClick={() => handleVenueClick(venue.id)}>
                                        <img
                                            className="w-full h-48 sm:h-56 md:h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                                            src={venue.cover_image_url || "https://via.placeholder.com/500"}
                                            alt={venue.name}
                                        />
                                    </div>
                                    <div className="px-4 py-4">
                                        <h3 className="font-bold text-xl mb-2 gradient-text">
                                            {venue.name}
                                        </h3>
                                        <p className="text-gray-500 text-base">{venue.description}</p>
                                    </div>
                                    <div className="px-4 pt-2 pb-4">
                                        {venue.venue_type_name.split(",").map((type, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-sky-200/10 rounded-full px-3 py-2 text-sm font-semibold text-sky-400 mr-2 mb-2"
                                            >
                                               # {type.trim()}
                                            </span>
                                        ))}
                                        {venue.venue_type_name.split(",").length > 0 && <br />}
                                    </div>
                                    <div className="px-6 py-4 flex flex-row items-center">
                                        <span className="py-1 text-sm font-regular text-sky-400 mr-1 flex flex-row items-center">
                                            <span>{/* Time Ago */}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            ) : (
                <p>No venues found for your company.</p>
            )}
          </div>
        </div>
    );
};

export default CompanyVenuesPage;