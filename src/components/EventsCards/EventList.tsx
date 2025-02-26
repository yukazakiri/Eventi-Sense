import React, { useEffect, useState } from 'react';
import Card from './EventDesign';
import { getCurrentUser, fetchProfile } from '../../api/utiilty/profiles';
import supabase from '../../api/supabaseClient';

type CardListProps = {
  limit?: number;
};

const CardList: React.FC<CardListProps> = ({ limit }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'supplier' | 'venue_manager' | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get the current user's ID
        const user = await getCurrentUser();

        if (!user) {
          console.error('No user logged in');
          setLoading(false);
          return;
        }

        // First get the user's role
        const profile = await fetchProfile(user.id);

        if (!profile) throw new Error('Profile not found');
        
        setUserRole(profile.role as 'supplier' | 'venue_manager');

        // Fetch events based on role
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('organizer_id', user.id)
          .eq('organizer_type', profile.role);

        if (error) throw error;
        setEvents(data || []);

      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const displayedCardData = limit ? events.slice(0, limit) : events;

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <svg 
          className="w-16 h-16 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
        <p className="text-xl font-semibold mb-2">No events found</p>
        <p className="text-sm text-gray-400">
          {userRole === 'supplier' 
            ? "Create your first event to get started"
            : "No events assigned to your venue yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {displayedCardData.map((event, index) => (
        <div key={event.id} className={index >= 3 ? "hidden sm:block" : ""}>
          <Card
            id={event.id}
            title={event.name}
            description={event.description}
            image={event.image_url}
            tags={event.tags || []}
            role={userRole}
          />
        </div>
      ))}
    </div>
  );
};

export default CardList;