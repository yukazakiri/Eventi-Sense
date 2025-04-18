// src/services/supabaseService.ts
import supabase from '../../../api/supabaseClient'
import { Message, User, MessageToSend } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';


// Messages services
export const deleteMessage = async (messageId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
};
export const getMessages = async (userId: string, otherUserId: string | undefined) => {
  if (!otherUserId) return [];

  const { data, error } = await supabase
    .from('messages_with_profiles')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data as Message[];
};

export const sendMessage = async (message: MessageToSend) => {
  // Insert the new message
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select() // Add .select() to return the inserted row
    .single(); // Get a single row

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  // Fetch the complete message with profiles info to match the messages_with_profiles view
  const messageId = data?.id;
  
  if (messageId) {
    const { data: fullMessage, error: fetchError } = await supabase
      .from('messages_with_profiles')
      .select('*')
      .eq('id', messageId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching sent message details:', fetchError);
    } else {
      return fullMessage as Message;
    }
  }

  // Fallback to a basic message object if we couldn't get the full one
  return {
    ...message,
    id: Date.now(), // Temporary ID until refresh
    created_at: new Date().toISOString()
  } as Message;
};

let activeSubscription: RealtimeChannel | null = null;

export const subscribeToMessages = (
  userId: string,
  callback: () => void
) => {
  // Unsubscribe from any existing subscription
  if (activeSubscription) {
    activeSubscription.unsubscribe();
  }

  // Create a new subscription
  activeSubscription = supabase
    .channel(`messages-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${userId} OR receiver_id=eq.${userId}`
      },
      callback
    )
    .subscribe();

  return activeSubscription;
};

// User services
export const getUsers = async (currentUserId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId);

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data as User[];
};

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('No active session found');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }

  return data as User;
};

export { supabase };


// Add this new function to mark messages as read
export const markMessageAsRead = async (messageIds: string[]) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
};