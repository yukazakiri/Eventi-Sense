import React, { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { useParams } from 'react-router-dom';
import VenueInfoForm from './VenueDetails/VenueInfor';
import AddressForm from './VenueDetails/VenueAddress';
import ImageUploadForm from './VenueDetails/VenueCoverPage';

import { Venue } from '../../../types/venue';

const VenueDetailPage: React.FC = () => {
    const { venueId: venueIdFromParams = '' } = useParams<{ venueId: string }>();
    const [venueId, setVenueId] = useState<number | string | null>(null);
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    useEffect(() => {
        const venueIdAsNumber = Number(venueIdFromParams);
        setVenueId(isNaN(venueIdAsNumber) ? venueIdFromParams : venueIdAsNumber);
    }, [venueIdFromParams]);

    useEffect(() => {
        const fetchVenue = async () => {
            if (!venueId) return;

            try {
                const { data: venueData, error: venueError } = await supabase
                    .from('venues')
                    .select('*')
                    .eq('id', venueId)
                    .single();

                if (venueError) {
                    throw venueError;
                }

                setVenue(venueData);
            } catch (err) {
                console.error('Error fetching venue details:', err);
                setError('An error occurred while fetching the venue details.');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [venueId]);

    const handleSaveVenue = async (updatedVenue: Venue) => {
        try {
            const { error } = await supabase
                .from('venues')
                .update(updatedVenue)
                .eq('id', venue!.id);

            if (error) {
                throw error;
            }

            setVenue(updatedVenue);
            setIsEditingInfo(false);
            setIsEditingAddress(false);
            alert("Venue updated successfully!");
        } catch (err: any) {
            console.error("Error updating venue:", err);
            setError(err?.message || "An error occurred while updating.");
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
        <div className="p-8">
            <div className='mx-auto font-sofia'>
                <section className='my-4'>
                    {!isEditingInfo && !isEditingAddress && (
                        <>
                            <button onClick={() => setIsEditingInfo(true)} 
                                className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2"
                            >
                                Edit Venue Information
                            </button>
                            <button onClick={() => setIsEditingAddress(true)} 
                                className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Edit Venue Address
                            </button>
                        </>
                    )}
                    {(isEditingInfo || isEditingAddress) && (
                        <button 
                            onClick={() => {
                                setIsEditingInfo(false);
                                setIsEditingAddress(false);
                            }}
                            className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                        >
                            Cancel
                        </button>
                    )}
                </section>
                <div className='grid lg:grid-cols-2 gap-8'>
                    <div>
                        <VenueInfoForm
                            venue={venue}
                            onSave={handleSaveVenue}
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
                    <div className='col-span-1'>
                        <ImageUploadForm venueId={venue.id.toString()} />
                    </div>
                    <div className='col-span-1  bg-white p-[10rem]'>
                        asdsad
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailPage;
