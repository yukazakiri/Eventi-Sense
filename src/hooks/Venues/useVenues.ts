// src/hooks/useVenues.ts
import { useEffect, useState } from 'react';
import supabase from '../../api/supabaseClient';
import { VenueFilters, filterVenues } from './venueFilter';

const useVenues = (filters: VenueFilters) => {
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
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
    setFilteredVenues(filterVenues(allVenues, filters));
  }, [filters, allVenues]);

  return { venues: filteredVenues, loading, error };
};

export default useVenues;