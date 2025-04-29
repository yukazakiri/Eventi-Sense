// src/services/supabaseService.ts
import supabase from '../../../api/supabaseClient'
import { Message, User, MessageToSend } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

// Modify getUsers to support pagination
export const getUsers = async (currentUserId: string, limit?: number) => {
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('id', currentUserId);
  
  // If limit is provided, apply it to the query
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data as User[];
};

// The rest of your supabaseService.ts code remains unchanged
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

export const getConversationPartners = async (userId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('sender_id, receiver_id')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
    
  const partnerIds = new Set<string>();
  data?.forEach((message) => {
    const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
    partnerIds.add(partnerId);
  });

  return Array.from(partnerIds);
};

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

export const createNewConversation = async (senderId: string, receiverId: string): Promise<string> => {
  try {
    // First check if there are any existing messages between these users
    const { data: existingMessages, error: fetchError } = await supabase
      .from('messages')
      .select('id')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .limit(1);

    if (fetchError) {
      throw fetchError;
    }

    // If there are no existing messages, create the first message
    if (!existingMessages || existingMessages.length === 0) {
      const { data: newMessage, error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: senderId,
            receiver_id: receiverId,
            content: '👋 Hello!' // Initial greeting message
          }
        ])
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      return newMessage.id.toString();
    }

    // If messages exist, return the first message id as the conversation identifier
    return existingMessages[0].id.toString();

  } catch (error) {
    console.error('Error in createNewConversation:', error);
    throw error;
  }
};

export { supabase };