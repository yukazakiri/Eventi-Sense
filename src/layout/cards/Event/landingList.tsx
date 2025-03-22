import React, { useEffect, useState } from 'react';
import Card from './cardDesign';
import supabase from '../../../api/supabaseClient';

type CardListProps = {
  limit?: number;
};

const CardList: React.FC<CardListProps> = ({ limit }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('*');

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
  }

  return (
    <div className={`grid ${gridColumns} gap-6 p-6`}>
      {displayedCardData.map((event, index) => (
        <div key={event.id} className={index >= 3 ? 'hidden sm:block' : ''}>
          <Card
            id={event.id}
            title={event.name}
            description={event.description}
            image={event.image_url}
            tags={event.tags || []}
          />
        </div>
      ))}
    </div>
  );
};

export default CardList;