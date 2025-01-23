import React from 'react';
import Card from './cardDesign'; // Import the Card component

type CardVenuesProps = {
  limit?: number; // Optional prop to limit the number of cards
};

const CardVenues: React.FC<CardVenuesProps> = ({ limit }) => {
  const cardData = [
    {
      VenueName: "The Coldest Sunset",
      PlaceName: "The Hotel 1",
      Guests: "Up to 500 Guest",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 4, // Rating out of 5
    },
    {
      VenueName: "Beautiful Sunrise",
      PlaceName: "The Hotel 2",
      Guests: "Up to 500 Guest",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
    {
      VenueName: "City Lights at Night",
      PlaceName: "The Hotel 3",
      Guests: "Up to 500 Guest",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 3,
    },
    {
      VenueName: "Mountain Adventure",
      PlaceName: "The Hotel 4",
      Guests: "Up to 500 Guest",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 4,
    },
    {
      VenueName: "Beach Paradise",
      PlaceName: "The Hotel 5",
      Guests: "Up to 500 Guest",
      image:
        "https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
    },
  ];

  // If a limit is provided, slice the cardData array; otherwise, show all cards
  const displayedCardData = limit ? cardData.slice(0, limit) : cardData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayedCardData.map((data, index) => (
        <div key={index}>
          <Card
            VenueName={data.VenueName}
            Guests={data.Guests}
            PlaceName={data.PlaceName}
            image={data.image}
            rating={data.rating} // Pass the rating
          />
        </div>
      ))}
    </div>
  );
};

export default CardVenues;