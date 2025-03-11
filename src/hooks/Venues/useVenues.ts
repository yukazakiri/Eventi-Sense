import { useEffect, useState, useRef } from 'react';
import supabase from '../../api/supabaseClient';
import { VenueFilters, filterVenues } from './venueFilter';

const useVenues = (filters: VenueFilters) => {
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const prevFilters = useRef<VenueFilters>(filters);
  const prevAllVenues = useRef<any[]>(allVenues);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select(`
            *,
            venues_venue_types (
              venue_type_id,
              venue_types (
                name
              )
            )
          `);

        if (error) throw error;
        console.log("Fetched Venues Data:", data);
        setAllVenues(data || []);
        setFilteredVenues(filterVenues(data || [], filters));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(prevFilters.current) !== JSON.stringify(filters) ||
      JSON.stringify(prevAllVenues.current) !== JSON.stringify(allVenues)
    ) {
      setFilteredVenues(filterVenues(allVenues, filters));
      prevFilters.current = filters;
      prevAllVenues.current = allVenues;
    }
  }, [filters, allVenues]);

  return { venues: filteredVenues, loading, error };
};

export default useVenues;