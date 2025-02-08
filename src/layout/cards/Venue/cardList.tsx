import React, { useState, useEffect } from 'react';
import Card from './cardDesign'; // Import the Card component
import supabase from '../../../api/supabaseClient';
import { useNavigate } from 'react-router-dom';

type CardVenuesProps = {
  limit?: number; // Optional prop to limit the number of cards
};

const CardVenues: React.FC<CardVenuesProps> = ({ limit }) => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data, error } = await supabase
          .from('venues') // Replace 'venues' with your actual table name
          .select('*') // Select all columns
          .order('id', { ascending: false }); // Sort by ID in descending order

        if (error) {
          throw error; // Re-throw the error to be caught below
        }

        if (data) {
          setVenues(data);
        } else {
          setVenues([]); // Handle the case where no data is returned
        }
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []); // Empty dependency array ensures this runs only once on mount
 
  const handleCardClick = (venueId: number) => {  // venueId should match your venue's ID type
    console.log("Clicked venue ID:", venueId); 
    navigate(`/venue/${venueId}`); // Navigate to the venue details page
  };

  if (loading) {
    return <div>Loading venues...</div>; // Or a more sophisticated loading indicator
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display the error message
  }

  const displayedVenues = limit ? venues.slice(0, limit) : venues;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayedVenues.map((venue) => (
        <div key={venue.id} onClick={() => handleCardClick(venue.id)}> {/* Important: Use a unique key from your data (e.g., venue.id) */}
          <Card
            VenueName={venue.name} // Access properties from your 'venues' data
            Guests={venue.Guests}
            PlaceName={venue.location}
            image={venue.cover_image_url} // Assuming your image URL is in 'image_url'
            rating={venue.rating} // Access the rating
          />
        </div>
      ))}
    </div>
  );
};

export default CardVenues;
