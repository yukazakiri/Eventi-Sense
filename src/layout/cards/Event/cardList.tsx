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
      const { data, error } = await supabase  
        .from('events')
        .select('*');

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {displayedCardData.map((event, index) => (
        <div key={event.id} className={index >= 3 ? "hidden sm:block" : ""}>
          <Card
            id={event.id}
            title={event.name} // Use event.name instead of event.title
            description={event.description}
            image={event.image_url}
            tags={event.tags || []} // Pass tags to the Card component
          />
        </div>
      ))}
    </div>
  );
};

export default CardList;