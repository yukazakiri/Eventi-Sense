// CardVenues.tsx
import React, { useState } from 'react';
import Card from './cardDesign';
import { useNavigate } from 'react-router-dom';
import imagefallback from '../../../assets/images/fallback.png';
import { HoverButton4 } from '../../../components/Button/button-hover';
import { motion } from 'framer-motion';

type CardVenuesProps = {
    venues?: any[];
    limit?: number;
    showAll?: boolean;
    handleViewLess?: () => void;
    loading?: boolean; // Add loading prop
};

const VenueSkeleton = () => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
    className="overflow-hidden h-full rounded-xl shadow-2xl flex flex-col bg-gray-100"
  >
    {/* Image Skeleton */}
    <div className="w-full h-48 bg-gray-200 animate-pulse" />
    
    {/* Content Skeleton */}
    <div className="p-4 space-y-4">
      {/* Venue Name */}
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      
      {/* Location and Capacity */}
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
      
      {/* Price */}
      <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
      
      {/* Venue Types */}
      <div className="flex gap-2">
        {[1, 2].map((tag) => (
          <div key={tag} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
  </motion.div>
);

const CardVenues: React.FC<CardVenuesProps> = ({ 
  venues = [], 
  limit, 
  showAll = false, 
  handleViewLess,
  loading = false // Default to false
}) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const venuesPerPage = 9;

    // If loading, show skeletons
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: limit || 6 }).map((_, index) => (
            <VenueSkeleton key={index} />
          ))}
        </div>
      );
    }

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