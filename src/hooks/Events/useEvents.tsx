// src/api/hooks/useEvents.ts
import { useEffect, useState, useRef } from 'react';
import supabase from '../../api/supabaseClient';
import { EventFilters, filterEvents } from './eventFilter';

export type EventWithDetails = {
  event: any;
  tags: string;
};

const useEvents = (filters: EventFilters) => {
  const [allEvents, setAllEvents] = useState<EventWithDetails[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevFilters = useRef(filters);
  const prevAllEvents = useRef(allEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*');

        if (error) throw error;

        const formattedData = data?.map((event) => ({
          event,
          tags: event.tags || 'No tags listed',
        })) || [];

        setAllEvents(formattedData);
        setFilteredEvents(filterEvents(formattedData, filters));
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(prevFilters.current) !== JSON.stringify(filters) ||
      JSON.stringify(prevAllEvents.current) !== JSON.stringify(allEvents)
    ) {
      setFilteredEvents(filterEvents(allEvents, filters));
      prevFilters.current = filters;
      prevAllEvents.current = allEvents;
    }
  }, [filters, allEvents]);

  return { events: filteredEvents, loading, error };
};

export default useEvents;