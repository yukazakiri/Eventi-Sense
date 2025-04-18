// src/hooks/unreadMessage.ts
import { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';

export const useUnreadMessages = (currentUserId: string | null) => {
  const [unreadFromUsers, setUnreadFromUsers] = useState<string[]>([]);
  
  useEffect(() => {
    if (!currentUserId) return;

    const fetchUnreadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', currentUserId)
        .eq('read', false);

      if (error) {
        console.error('Error fetching unread messages:', error);
        return;
      }

      const senderIds = [...new Set(data.map((msg) => msg.sender_id))];
      setUnreadFromUsers(senderIds);
    };

    // Initial fetch
    fetchUnreadMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`unread_messages_${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          // Check if the message was marked as read
          if (payload.new.read === true) {
            fetchUnreadMessages(); // Re-fetch unread messages
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        () => {
          fetchUnreadMessages(); // Re-fetch for new unread messages
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [currentUserId]);

  return unreadFromUsers;
};