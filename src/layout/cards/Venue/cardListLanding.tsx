// CardVenues.tsx
import React, { useState, useEffect } from 'react';
import Card from './cardListDesignLanding';
import { useNavigate } from 'react-router-dom';
import imagefallback from '../../../assets/images/fallback.png';
import supabase from '../../../api/supabaseClient';


interface Venue {
    id: number;
    name: string;
    capacity: string;
    location: string;
    price: number;
    cover_image_url: string;
    rating: number;
    venues_venue_types?: { venue_types: { name: string } }[];
}

type CardVenuesProps = {
    limit?: number;
};

const CardVenues: React.FC<CardVenuesProps> = ({ limit }) => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<Venue[]>([]);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const { data, error } = await supabase
                    .from('venues') // Replace 'venues' with your actual table name
                    .select(`
                        id,
                        name,
                        capacity,
                        location,
                        price,
                        cover_image_url,
           
                        venues_venue_types (
                            venue_types (
                                name
                            )
                        )
                    `);

                if (error) {
                    console.error('Error fetching venues:', error);
                    return;
                }

                if (data) {
                    let processedData = data as unknown as Venue[];
                    if(limit){
                        processedData = processedData.slice(0,limit);
                    }
                    setVenues(processedData);
                }
            } catch (error) {
                console.error('Error fetching venues:', error);
            }
        };

        fetchVenues();
    }, [limit]); // Add limit as a dependency to useEffect

    const handleCardClick = (venueId: number) => {
        navigate(`/venue/${venueId}`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {venues.map((venue) => {
                    const venueTypeNames = venue.venues_venue_types?.map(
                        (vvt) => vvt.venue_types?.name
                    ).filter(Boolean) || [];

                    return (
                        <div key={venue.id} onClick={() => handleCardClick(venue.id)}>
                            <Card
                                VenueName={venue.name}
                                capacity={venue.capacity}
                                PlaceName={venue.location}
                                Price={venue.price}
                                image={venue.cover_image_url || imagefallback}
                                rating={venue.rating}
                                venueType={venueTypeNames}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardVenues;