// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { getUsers } from '../services/supabaseService';
import { User } from '../types';

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