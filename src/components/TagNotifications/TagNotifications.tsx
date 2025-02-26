import { useState, useEffect, useRef } from 'react';
import supabase from '../../api/supabaseClient';
import { confirmTag, untagEntity } from '../../types/tagging';
import { useClickOutside } from '../../hooks/useClickOutside';

interface TagNotification {
  id: string;
  event_id: string;
  tagged_entity_id: string;
  tagged_entity_type: 'venue' | 'supplier';
  is_confirmed: boolean;
  created_at: string;
  event: {
    name: string;
    date: string;
  };
}

const TagNotifications = () => {
  const [notifications, setNotifications] = useState<TagNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          setLoading(false);
          return;
        }

        // Get user's profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoading(false);
          return;
        }

        console.log('Current user:', user.id);
        console.log('User profile:', profile);
        
        // For venue managers, we need to find venues associated with their company
        if (profile?.role === 'venue_manager') {
          // First, find all venues managed by this user's company
          const { data: managedVenues, error: venuesError } = await supabase
            .from('venues')
            .select('id')
            .eq('company_id', profile.id);  
            
          if (venuesError) {
            console.error('Error fetching venues:', venuesError);
            setLoading(false);
            return;
          }
          
          console.log('Managed venues:', managedVenues);
          
          if (managedVenues && managedVenues.length > 0) {
            // Extract venue IDs
            const venueIds = managedVenues.map(venue => venue.id);
            console.log('Venue IDs:', venueIds);
            
            // Now fetch tag notifications for these venues
            const { data: venueTags, error: tagsError } = await supabase
              .from('event_tags')
              .select(`
                *,
                event:events (
                  name,
                  date
                )
              `)
              .eq('tagged_entity_type', 'venue')
              .in('tagged_entity_id', venueIds)
              .order('created_at', { ascending: false });
              
            if (tagsError) {
              console.error('Error fetching venue tags:', tagsError);
            } else {
              console.log('Tags for managed venues:', venueTags);
              setNotifications(venueTags || []);
            }
          } else {
            console.log('No venues found for this company');
          }
        } else if (profile?.role === 'supplier') {
          // First, find the supplier record for this user
          const { data: supplierData, error: supplierError } = await supabase
            .from('supplier')
            .select('id')
            .eq('company_id', user.id)
            .single();
            
          if (supplierError) {
            console.error('Error fetching supplier:', supplierError);
            setLoading(false);
            return;
          }
          
          console.log('Supplier data:', supplierData);
          
          if (supplierData) {
            // Fetch tag notifications for this supplier
            const { data: supplierTags, error: tagsError } = await supabase
              .from('event_tags')
              .select(`
                *,
                event:events (
                  name,
                  date
                )
              `)
              .eq('tagged_entity_type', 'supplier')
              .eq('tagged_entity_id', supplierData.id)
              .eq('is_confirmed', false)
              .order('created_at', { ascending: false });
              
            if (tagsError) {
              console.error('Error fetching supplier tags:', tagsError);
            } else {
              console.log('Tags for supplier:', supplierTags);
              setNotifications(supplierTags || []);
            }
          } else {
            console.log('No supplier record found for this user');
          }
        }
        
        setLoading(false);
        
        // Set up real-time subscription for updates
        // This should be set up based on the venues or other entities found
        const channel = supabase.channel('event_tags_changes');
        
        // Subscribe to all event_tags changes (could be optimized for specific entities)
        channel
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'event_tags'
            }, 
            (payload) => {
              console.log('Received real-time update:', payload);
              fetchNotifications();
            }
          )
          .subscribe();
          
        return () => {
          channel.unsubscribe();
        };
        
      } catch (error) {
        console.error('Unexpected error in fetchNotifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (tagId: string) => {
    try {
      await confirmTag(tagId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === tagId ? { ...notif, is_confirmed: true } : notif
        )
      );
    } catch (error) {
      console.error('Error accepting tag:', error);
    }
  };

  const handleReject = async (tagId: string) => {
    try {
      await untagEntity(tagId);
      setNotifications(prev => prev.filter(notif => notif.id !== tagId));
    } catch (error) {
      console.error('Error rejecting tag:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon with Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {/* Notification Badge */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          </div>

          <div className="p-2">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No pending notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {notification.event.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Event Date: {new Date(notification.event.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleAccept(notification.id)}
                        className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleReject(notification.id)}
                        className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagNotifications;