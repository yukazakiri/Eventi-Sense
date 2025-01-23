import React from 'react';
import Card from './cardDesign';
import image1 from '../../../assets/images/La Trinidad Benguet City Lights.jpg'

// Define the props for CardList
type CardListProps = {
  limit?: number; // sOptional prop to limit the number of cards
};

const CardList: React.FC<CardListProps> = ({ limit }) => {
  const cardData = [
    {
      title: 'The Coldest Sunset',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque.',
      image: image1,
      tags: ['photography', 'travel', 'winter'],
    },
    {
      title: 'Beautiful Sunrise',
      description:
        'An amazing sunrise captured from the top of the mountain with perfect lighting and serenity.',
      image: image1,
      tags: ['nature', 'sunrise', 'peaceful'],
    },
    {
      title: 'City Lights at Night',
      description:
        'A stunning view of the city skyline at night, illuminated by countless lights reflecting off the buildings.',
      image: image1,
      tags: ['city', 'nightlife', 'urban'],
    },
    {
      title: 'Mountain Adventure',
      description:
        'Explore the breathtaking beauty of mountains and enjoy the thrill of adventure.',
      image: image1,
      tags: ['adventure', 'mountains', 'hiking'],
    },
    {
      title: 'Beach Paradise',
      description:
        'Relax on the sandy beaches and enjoy the crystal-clear waters of the ocean.',
      image: image1,
      tags: ['beach', 'relaxation', 'vacation'],
    },
  ];

  // If a limit is provided, slice the cardData array; otherwise, show all cards
  const displayedCardData = limit ? cardData.slice(0, limit) : cardData;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {displayedCardData.map((data, index) => (
        <div key={index}
        className={index >= 3 ? "hidden sm:block" : ""} 
        >
        <Card {...data} />
      </div>
      ))}
    </div>
  );
};

export default CardList;