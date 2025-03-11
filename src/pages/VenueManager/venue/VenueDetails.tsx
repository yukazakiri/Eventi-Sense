// VenueDetailPage.js
import React, { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { useParams } from 'react-router-dom';
import VenueInfoForm from './VenueDetails/VenueInfor';
import AddressForm from './VenueDetails/VenueAddress';
import ImageUploadForm from './VenueDetails/VenueCoverPage';
import AmenitiesForm from './VenueDetails/Amenities';
import { Venue } from '../../../types/venue';

import SocialMediaLinks from '../../VenueManager/Social/SocialLinks';
import Gallery from './VenueDetails/AvailabiltyGallery/Gallery';
import AvailabilityForm from './VenueDetails/AvailabiltyGallery/AddVenueAvailabilityForm';

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
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

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

    const tabs = [
        { id: 'info', name: 'Venue Info' },
        { id: 'address & amenities', name: 'Address & Amenities' },
        { id: 'social', name: 'Social Media' },
        { id: 'cover photo', name: 'Cover Photo' },
        { id: 'gallery', name: 'Gallery' },
        { id: 'availability', name: 'Availability' },
    ];

    return (
        <div className="flex flex-col gap-8 lg:mx-16 md:mx-10 sm:mx-6   bg-white  dark:bg-gray-900 pb-8">
                    <div className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 transition-all duration-300">
                        {/* Always render the gradient div, but hide it initially if there's a cover photo */}
                        <div 
                            className="w-full h-72 bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 rounded-t-2xl relative fallback-gradient"
                            style={{display: venue.cover_image_url ? 'none' : 'block'}}
                        />
                        
                        {/* Only render the image if there's a cover photo */}
                        {venue.cover_image_url && (
                            <img 
                            src={venue.cover_image_url} 
                            alt="Venue Cover" 
                            className="w-full max-h-96 object-cover rounded-t-2xl" 
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                // Find the gradient div by class name
                                const gradientDiv = (e.target as HTMLElement).parentNode?.querySelector('.fallback-gradient');
                                if (gradientDiv) {
                                (gradientDiv as HTMLElement).style.display = 'block';
                                }
                            }}
                            />
                        )}
                        </div>
            <div>
            

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                    ${
                                        activeTab === tab.id
                                            ? 'border-sky-500 text-sky-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700'
                                    }
                                `}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content based on active tab */}
                <div className="lg:my-10 lg:mx-10 ">
                    {activeTab === 'info' && (
                        <VenueInfoForm
                            venue={venue}
                            isEditing={isEditingInfo}
                            setIsEditing={setIsEditingInfo}
                        />
                    )}
                    {activeTab === 'address & amenities' && (
                        <div className='grid md:grid-cols-2 gap-4  mt-4' >  
                        <div className='w-full col-start-1'>
                            <AddressForm
                                venue={venue}
                                onSave={handleSaveVenue}
                                isEditing={isEditingAddress}
                                setIsEditing={setIsEditingAddress}
                            />
                        </div>
                        <div className='w-full'>
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
                    )}
              
                    {activeTab === 'social' && (
                        <SocialMediaLinks venues_id={venue.id.toString()} isEditing={isEditing} setIsEditing={setIsEditing}/>
                    )}
                    {activeTab === 'cover photo' && (
                        <ImageUploadForm venueId={venue.id.toString()} isEditing={isEditingImage} setIsEditingImage={setIsEditingImage}  />
                    )}
                    {activeTab === 'gallery' && (
                        <Gallery />
                    )}
                    {activeTab === 'availability' && (
                        <AvailabilityForm    />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VenueDetailPage;