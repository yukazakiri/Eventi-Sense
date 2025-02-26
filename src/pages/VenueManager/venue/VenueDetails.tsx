// VenueDetailPage.js
import React, { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { Link, useParams } from 'react-router-dom';
import VenueInfoForm from './VenueDetails/VenueInfor';
import AddressForm from './VenueDetails/VenueAddress';
import ImageUploadForm from './VenueDetails/VenueCoverPage';
import AmenitiesForm from './VenueDetails/Amenities';
import { Venue } from '../../../types/venue';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/24/solid';
import { FaCalendarDay, FaImage } from 'react-icons/fa';
import SocialMediaLinks from '../../VenueManager/Social/SocialLinks';

const breadcrumbItems = [
    { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Venues', href: '/Venue-Manager-Dashboard/Venue-List' },
    { label: 'Venue Details', href: '' } 
];

interface Amenity {
    id: string;
    name: string;
}

interface VenueAmenity {
    venue_id: string;
    amenity_id: string;
    quantity: number | null;
    description: string | null;
}


const VenueDetailPage: React.FC = () => {
    const { venueId: venueIdFromParams = '' } = useParams<{ venueId: string }>();
    const [venueId, setVenueId] = useState<number | string | null>(null);
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [_venueAmenities, setVenueAmenities] = useState<VenueAmenity[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<VenueAmenity[]>([]);
    const [isEditingAmenities, setIsEditingAmenities] = useState(false);
     const [isEditingImage, setIsEditingImage]= useState(false);
     const [isEditing, setIsEditing]= useState(false)


    useEffect(() => {
        const venueIdAsNumber = Number(venueIdFromParams);
        setVenueId(isNaN(venueIdAsNumber) ? venueIdFromParams : venueIdAsNumber);
    }, [venueIdFromParams]);

    useEffect(() => {
        const fetchData = async () => {
            if (!venueId) return;

            try {
                setLoading(true);

                const [venuePromise, venueAmenitiesPromise, amenitiesPromise] = [
                    supabase.from('venues').select('*').eq('id', venueId).single(),
                    supabase.from('venue_amenities').select('*').eq('venue_id', venueId),
                    supabase.from('amenities').select('*'),
                ];

                const results = await Promise.all([venuePromise, venueAmenitiesPromise, amenitiesPromise]);

                const [
                    { data: venueData, error: venueError },
                    { data: venueAmenitiesData, error: venueAmenitiesError },
                    { data: amenitiesData, error: amenitiesError },
                ] = results;

                if (venueError) {
                    console.error("Error fetching venue:", venueError);
                    setError("Venue not found.");
                } else {
                    setVenue(venueData);
                }

                if (venueAmenitiesError) {
                    console.error("Error fetching venue amenities:", venueAmenitiesError);
                } else {
                    setVenueAmenities(venueAmenitiesData || []);
                    setSelectedAmenities(venueAmenitiesData || []);
                }

                if (amenitiesError) {
                    console.error("Error fetching amenities:", amenitiesError);
                } else {
                    setAmenities(amenitiesData || []);
                }

            } catch (err) {
                console.error('Error in fetchData:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [venueId]);

    const handleSaveVenue = async (updatedVenue: Venue) => {
        try {
            const { error } = await supabase
                .from('venues')
                .update(updatedVenue)
                .eq('id', venue!.id);

            if (error) throw error;

            setVenue(updatedVenue);
            setIsEditingInfo(false);
            setIsEditingAddress(false);
            alert('Venue updated successfully!');
        } catch (err: any) {
            console.error('Error updating venue:', err);
            setError(err?.message || 'An error occurred while updating.');
        }
    };

    const handleSaveVenueAmenities = async (venue: Venue, updatedVenueAmenities: VenueAmenity[]) => {
        try {
            if (!venue || !venue.id) {
                console.error('Venue object or ID is missing.');
                setError('Venue information is missing. Cannot update amenities.');
                return;
            }

            const { data: existingVenueAmenities, error: fetchError } = await supabase
                .from('venue_amenities')
                .select('*')
                .eq('venue_id', venue.id);

            if (fetchError) throw fetchError;

            const amenitiesToDelete = existingVenueAmenities.filter(
                (existing) => !updatedVenueAmenities.some((updated) => updated.amenity_id === existing.amenity_id)
            );

            for (const amenity of amenitiesToDelete) {
                const { error: deleteError } = await supabase
                    .from('venue_amenities')
                    .delete()
                    .eq('venue_id', venue.id)
                    .eq('amenity_id', amenity.amenity_id);

                if (deleteError) throw deleteError;
            }

            for (const updatedAmenity of updatedVenueAmenities) {
                const { error: upsertError } = await supabase
                    .from('venue_amenities')
                    .upsert([updatedAmenity], { onConflict: 'venue_id,amenity_id' });

                if (upsertError) throw upsertError;
            }

            setVenueAmenities(updatedVenueAmenities);
            setSelectedAmenities(updatedVenueAmenities);
            alert('Venue amenities updated successfully!');
        } catch (err: any) {
            console.error('Error updating venue amenities:', err);
            setError(err?.message || 'An error occurred while updating venue amenities.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!venue) {
        return <div>Venue not found.</div>;
    }
    return (
        <div className="px-8 mb-6">
            <div className="mx-auto font-sofia">
           
                <section className="my-4 flex justify-between items-center h-full">
                  
                    <div className="flex items-end">
                        <div className='flex' >
                            <div className='px-6 py-4 bg-indigo-600 hover:bg-indigo-800 max-w-auto text-white rounded-3xl mr-4 flex items-center'>
                                <Link to={`/Venue-Manager-Dashboard/Venue-Details/${venue.id}/add-availability`} className="flex items-center">
                                    <FaCalendarDay className="mr-2 h-[2rem] w-[3rem] text-slate-100" />
                                    <span>Add Availability</span>
                                </Link>
                            </div>
                            <div className='px-6 py-4 bg-white hover:bg-indigo-800 group  border-2 border-indigo-600 hover:text-white hover:border-indigo-200 max-w-auto text-indigo-600 rounded-3xl flex items-center'>
                                <Link to={`/Venue-Manager-Dashboard/Venue-Details/${venue.id}/add-photos`} className="flex items-center">
                                    <FaImage className="mr-2 h-[3rem] w-[3rem]  text-indigo-600 group-hover:text-slate-100 " />
                                    <span>Add Photos for Venue</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
                </section>
    
                <div className="grid lg:grid-cols-2 grid-flow-row gap-8">
                <div className='col-span-2'>
                        <SocialMediaLinks venues_id={venue.id.toString()} isEditing={isEditing} setIsEditing={setIsEditing}/>
                    </div>
                <div className='col-span-2'>
                            <ImageUploadForm venueId={venue.id.toString()} isEditing={isEditingImage} setIsEditingImage={setIsEditingImage}  />
                        </div>
                    <div className=' col-span-2'>
                        <VenueInfoForm
                            venue={venue}
                         
                            isEditing={isEditingInfo}
                            setIsEditing={setIsEditingInfo}
                        />
                        
                    </div>
                    <div>
                        <AddressForm
                            venue={venue}
                            onSave={handleSaveVenue}
                            isEditing={isEditingAddress}
                            setIsEditing={setIsEditingAddress}
                        />
                      
                    </div> 
                     <div className="">
                            <AmenitiesForm
                                venue={venue}
                                amenities={amenities}
                                selectedAmenities={selectedAmenities}
                                onSave={handleSaveVenueAmenities}
                                isEditing={isEditingAmenities}
                                setIsEditing={setIsEditingAmenities}
                            />
                      
                        </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailPage;