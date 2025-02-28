import React, { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { NavLink, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';

const breadcrumbItems = [
    { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Venues', href: '' },
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
    created_at: string;
    company_id: string;
    cover_image_url: string;
}

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
        const fetchVenueTypes = async () => {
            try {
                const { data, error } = await supabase.from('venue_types').select('id, name');
                if (error) {
                    console.error("Error fetching venue types:", error);
                    setError("Error fetching venue types.");
                } else {
                    const venueTypesMap: Record<string, string> = {};
                    data?.forEach(type => {
                        venueTypesMap[type.id] = type.name;
                    });
                    setVenueTypes(venueTypesMap);
                    console.log("venueTypes fetched:", venueTypesMap);
                }
            } catch (err) {
                console.error("Error fetching venue types:", err);
                setError("An error occurred while fetching venue types.");
            }
        };

        fetchVenueTypes();
    }, []);

    useEffect(() => {
        if (companyProfile?.id && Object.keys(venueTypes).length > 0) {
            const fetchVenues = async () => {
                try {
                    const { data, error } = await supabase
                        .from('venues')
                        .select('*, venues_venue_types(venue_type_id)')
                        .eq('company_id', companyProfile.id);

                    if (error) {
                        throw error;
                    }

                    const venuesWithTypesData = data?.map(venue => {
                        const venueTypeIds = venue.venues_venue_types?.map((item:any) => item.venue_type_id) || [];
                        const venueTypeNames = venueTypeIds.map((id: string) => venueTypes[id]).filter((name: string | undefined) => name !== undefined).join(", ");

                        return {
                            ...venue,
                            venue_type_name: venueTypeNames,
                        };
                    });

                    setVenuesWithTypes(venuesWithTypesData || []);
                    console.log("venuesWithTypes:", venuesWithTypesData);

                } catch (err) {
                    console.error('Error fetching venues:', err);
                    setError('An error occurred while fetching venues.');
                } finally {
                    setLoading(false);
                }
            };

            fetchVenues();
        }
    }, [companyProfile, venueTypes]);

    const handleVenueClick = (venueId: string) => {
        navigate(`/Venue-Manager-Dashboard/VenueDetails/${venueId}`);
    };

    if (loading) return <div>Loading venues...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="max-w-screen-2xl mx-auto p-8 font-sofia text-[1.4rem]">
            <div className='flex'>
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="mb-4 flex justify-between">
                <h2 className="text-3xl font-bold">
                    Venues
                </h2>
                <div className='flex justify-end items-end'>
                    <NavLink to="/Venue-Manager-Dashboard/CreateVenue">
                        <button
                            className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
                        >
                            Create Venue
                        </button>
                    </NavLink>
                </div>
            </div>

            {venuesWithTypes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {venuesWithTypes.map((venue) => (
                        <NavLink key={venue.id} to={`/Venue-Manager-Dashboard/VenueDetails/${venue.id}`}>
                            <div className="overflow-hidden h-auto group cursor-pointer w-full hover:bg-navy-blue-5 dark:hover:bg-navy-blue-5 border-[1px] border-gray-300 dark:border-gray-700 rounded-xl transition-all duration-300 shadow-2xl">
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
                                                className="inline-block bg-gray-200 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 mr-2 mb-2"
                                            >
                                               # {type.trim()}
                                            </span>
                                        ))}
                                        {venue.venue_type_name.split(",").length > 0 && <br />}
                                    </div>
                                    <div className="px-6 py-4 flex flex-row items-center">
                                        <span className="py-1 text-sm font-regular text-gray-900 mr-1 flex flex-row items-center">
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
    );
};

export default CompanyVenuesPage;