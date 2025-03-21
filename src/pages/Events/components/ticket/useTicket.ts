import { useEffect, useState } from 'react';
import supabase from '../../../../api/supabaseClient';
import { Event, Ticket } from '../../../../types/event';
import { Profile } from '../../../../types/types';

export const useTickets = (viewMode: 'organizer' | 'attendee') => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<{ [eventId: string]: Event }>({});
  const [profiles, setProfiles] = useState<{ [userId: string]: Profile }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        if (viewMode === 'organizer') {
          const { data: userEvents, error: eventsError } = await supabase
            .from('events')
            .select('id')
            .eq('organizer_id', user.id);

          if (eventsError) throw eventsError;
          if (!userEvents?.length) return handleEmptyState();

          const { data: ticketsData, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .in('event_id', userEvents.map(event => event.id))
            .order('created_at', { ascending: false });

          if (ticketsError) throw ticketsError;
          await fetchRelatedData(ticketsData);
        } else {
          const { data: ticketsData, error: ticketsError } = await supabase
            .from('tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (ticketsError) throw ticketsError;
          await fetchRelatedData(ticketsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedData = async (ticketsData: Ticket[]) => {
      const eventIds = ticketsData.map(ticket => ticket.event_id);
      const userIds = ticketsData.map(ticket => ticket.user_id);

      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds);

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('id', viewMode === 'organizer' ? userIds : [userIds[0]]);

      const combinedData = ticketsData.map(ticket => ({
        ...ticket,
        events: eventsData?.find(event => event.id === ticket.event_id),
        profiles: profilesData?.find(profile => profile.id === ticket.user_id),
      }));

      processCombinedData(combinedData);
    };

    const processCombinedData = (combinedData: any[]) => {
      setTickets(combinedData);
      setEvents(createLookupMap(combinedData, 'events'));
      setProfiles(createLookupMap(combinedData, 'profiles'));
    };

    const createLookupMap = (data: any[], key: string) => 
      data.reduce((acc, item) => ({
        ...acc,
        ...(item[key] && { [item[key].id]: item[key] })
      }), {});

    const handleEmptyState = () => {
      setTickets([]);
      setEvents({});
      setProfiles({});
      setLoading(false);
    };

    fetchData();
  }, [viewMode]);

  return { tickets, events, profiles, loading, error };
};