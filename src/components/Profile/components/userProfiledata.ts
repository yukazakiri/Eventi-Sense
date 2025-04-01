import { useState, useCallback } from 'react';
import supabase from '../../../api/supabaseClient';
import { ProfileData } from './type';

export function useProfileData() {
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    avatar_url: '',
    id: '',
    created_at: '',
    updated_at: '',
  });

  const fetchProfileAndEmail = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: user.email || '',
          avatar_url: profileData.avatar_url,
          id: profileData.id,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
        });
      }
      setEmail(user.email || '');
    }
  }, []);

  return {
    profile,
    email,
    formData,
    setFormData,
    fetchProfileAndEmail
  };
}