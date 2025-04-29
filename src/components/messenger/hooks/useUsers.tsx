// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { getUsers } from '../services/supabaseService';
import { User } from '../types';
import supabase from '../../../api/supabaseClient';

export const useUsers = (currentUserId: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers(currentUserId);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUsers();
    }
  }, [currentUserId]);

  return { users, loading, refetch: fetchUsers };
};
// services/supabaseService.ts
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