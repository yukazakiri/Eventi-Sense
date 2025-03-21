// src/api/hooks/useEventPlanners.ts
import { useEffect, useState, useRef } from 'react';
import supabase from '../../api/supabaseClient';
import { EventPlannerFilters, filterEventPlanners } from './eventPlannerFilter';

export type EventPlannerWithDetails = {
  planner: any;
  services: string;
};

const useEventPlanners = (filters: EventPlannerFilters) => {
  const [allEventPlanners, setAllEventPlanners] = useState<EventPlannerWithDetails[]>([]);
  const [filteredEventPlanners, setFilteredEventPlanners] = useState<EventPlannerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevFilters = useRef(filters);
  const prevAllEventPlanners = useRef(allEventPlanners);

  useEffect(() => {
    const fetchEventPlanners = async () => {
      try {
        const { data, error } = await supabase
          .from('eventplanners')
          .select('*');

        if (error) throw error;

        const formattedData = data?.map((planner) => ({
          planner,
          services: planner.specialization || 'No specialization listed',
        })) || [];

        setAllEventPlanners(formattedData);
        setFilteredEventPlanners(filterEventPlanners(formattedData, filters));
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchEventPlanners();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(prevFilters.current) !== JSON.stringify(filters) ||
      JSON.stringify(prevAllEventPlanners.current) !== JSON.stringify(allEventPlanners)
    ) {
      setFilteredEventPlanners(filterEventPlanners(allEventPlanners, filters));
      prevFilters.current = filters;
      prevAllEventPlanners.current = allEventPlanners;
    }
  }, [filters, allEventPlanners]);

  return { eventPlanners: filteredEventPlanners, loading, error };
};

export default useEventPlanners;