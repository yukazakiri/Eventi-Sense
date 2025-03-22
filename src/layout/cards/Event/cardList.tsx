import React from 'react';
import Card from './cardDesign';

type CardListProps = {
  events: any[];
  limit?: number;
};

const CardList: React.FC<CardListProps> = ({ events, limit }) => {
  const displayedCardData = limit ? events.slice(0, limit) : events;

  // Determine grid columns dynamically
  let gridColumns = 'grid-cols-1'; // Default to 1 column

  if (limit) {
    if (limit <= 1) {
      gridColumns = 'grid-cols-1';
    } else if (limit === 2) {
      gridColumns = 'grid-cols-2';
    } else if (limit === 3) {
      gridColumns = 'grid-cols-3';
    } else if (limit === 4) {
      gridColumns = 'grid-cols-2 sm:grid-cols-4';
    } else if (limit > 4) {
      gridColumns = 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6';
    }
  } else {
    gridColumns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  }console.log("Event Data:", events);


  return (
    <div className={`grid ${gridColumns} gap-6 p-6`}>
     {displayedCardData.map(({ event, tags }, index) => (
  <div key={event.id || index}> {/* Use index as a fallback for missing IDs */}
    <Card
      id={event.id}
      title={event.name}
      description={event.description}
      image={event.image_url || "https://via.placeholder.com/150"}
      tags={tags || []}
    />
  </div>
))}

    </div>
  );
};

export default CardList;