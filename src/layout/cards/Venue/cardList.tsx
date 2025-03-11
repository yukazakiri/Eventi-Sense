// CardVenues.tsx
import React, { useState } from 'react';
import Card from './cardDesign';
import { useNavigate } from 'react-router-dom';
import imagefallback from '../../../assets/images/fallback.png';
import { HoverButton4 } from '../../../components/Button/button-hover';

type CardVenuesProps = {
    venues?: any[];
    limit?: number;
    showAll?: boolean;
    handleViewLess?: () => void;
};

const CardVenues: React.FC<CardVenuesProps> = ({ venues = [], limit, showAll = false, handleViewLess }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const venuesPerPage = 9;

    const handleCardClick = (venueId: number) => {
        navigate(`/venue/${venueId}`);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    let displayedVenues = venues;

    if (showAll) {
        const startIndex = (currentPage - 1) * venuesPerPage;
        const endIndex = startIndex + venuesPerPage;
        displayedVenues = venues.slice(startIndex, endIndex);
    } else if (limit) {
        displayedVenues = venues.slice(0, limit);
    }

    const totalPages = Math.ceil(venues.length / venuesPerPage);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedVenues.map((venue) => {
                    const venueTypeNames = venue.venues_venue_types?.map(
                        (vvt: any) => vvt.venue_types?.name
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

            {showAll && totalPages > 1 && (
                <div className="mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={currentPage === pageNumber}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === pageNumber ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}

            {showAll && handleViewLess && (
                <div className="flex justify-center mt-16">
                    <HoverButton4 onClick={handleViewLess}>View less</HoverButton4>
                </div>
            )}
        </div>
    );
};

export default CardVenues;