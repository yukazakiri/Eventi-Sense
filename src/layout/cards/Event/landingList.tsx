import React, { useEffect, useState } from 'react';
import Card from './cardDesign';
import supabase from '../../../api/supabaseClient';
import { motion } from 'framer-motion';

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
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6`}>
        {[1, 2, 3, 4].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
            className="overflow-hidden h-full rounded-xl shadow-2xl flex flex-col bg-gray-100"
          >
            {/* Skeleton Image */}
            <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 animate-pulse" />
            
            {/* Skeleton Content */}
            <div className="p-4 flex flex-col flex-grow space-y-4">
              {/* Title Skeleton */}
              <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse" />
              
              {/* Description Skeleton */}
              <div className="space-y-2 flex-grow">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>
              
              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((tag) => (
                  <div 
                    key={tag} 
                    className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  const displayedCardData = limit ? events.slice(0, limit) : events;

  // Determine grid columns dynamically
  let gridColumns = 'grid-cols-1'; // Default to 1 column

  if (limit) {
    if (limit <= 1) {
      gridColumns = 'grid-cols-1';
    } else if (limit === 2) {
      gridColumns = 'grid-cols-1 sm:grid-cols-2';
    } else if (limit === 3) {
      gridColumns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    } else if (limit === 4) {
      gridColumns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4';
    } else if (limit > 4) {
      gridColumns = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
    }
  } else {
    gridColumns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`grid ${gridColumns} gap-4 sm:gap-6 p-3 sm:p-4 md:p-6`}
    >
      {displayedCardData.map((event, index) => (
        <motion.div 
          key={event.id} 
          className={`${index >= 3 ? 'hidden sm:block' : ''} w-full`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: Math.min(index * 0.1, 0.8),
            type: "spring",
            damping: 15
          }}
          viewport={{ once: true }}
        >
          <Card
            id={event.id}
            title={event.name}
            description={event.description}
            image={event.image_url}
            tags={event.tags || []}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CardList;