import React, { useEffect, useState } from 'react';
import Card from './cardDesign';
import supabase from '../../../api/supabaseClient';

type EventsProps = {
  eventPlannerId: string;

};

const Events: React.FC<EventsProps> = ({ eventPlannerId }) => {
  console.log ('eventPlannerId:', eventPlannerId);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      // Only fetch events created by the specified event planner
      const { data, error } = await supabase  
        .from('events')
        .select('*')
        .eq('organizer_id', eventPlannerId);

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [eventPlannerId]); // Add eventPlannerId as a dependency

  if (loading) {
    return <div>Loading...</div>;
  }

  if (events.length === 0) {
    return <div className="p-6">No events found for this event planner.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 ">
      {events.map((event) => (
        <div key={event.id}>
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

export default Events;