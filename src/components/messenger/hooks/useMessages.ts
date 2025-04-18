import { useState, useEffect, useCallback } from 'react';
import { 
  getMessages, 
  sendMessage as sendMessageService, 
  subscribeToMessages,
  deleteMessage as deleteMessageService,
  markMessageAsRead,
} from '../services/supabaseService';
import { Message, MessageToSend } from '../types';

export const useMessages = (userId: string, otherUserId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMessages = useCallback(async () => {
    if (!userId || !otherUserId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const data = await getMessages(userId, otherUserId);

    setMessages(data);
    setLoading(false);

    // Find all unread messages sent to the current user
    const unreadMessages = data.filter(
      (msg) => msg.receiver_id === userId && !msg.read
    );

    // Mark them as read
    if (unreadMessages.length > 0) {
      const unreadIds = unreadMessages.map(msg => msg.id.toString());
      await markMessageAsRead(unreadIds);
    }
  }, [userId, otherUserId]);

  const sendMessage = async (message: MessageToSend) => {
    try {
      const newMessage = await sendMessageService(message);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };
  
  const deleteMessage = async (messageId: string) => {
    try {
      await deleteMessageService(messageId);
      setMessages(prevMessages => 
        prevMessages.filter(message => message.id.toString() !== messageId)
      );
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  useEffect(() => {
    if (!userId) return;
    
    const subscription = subscribeToMessages(userId, () => {
      fetchMessages();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchMessages]);
  
  return { 
    messages, 
    sendMessage, 
    deleteMessage, 
    loading, 
    refetch: fetchMessages 
  };
};
