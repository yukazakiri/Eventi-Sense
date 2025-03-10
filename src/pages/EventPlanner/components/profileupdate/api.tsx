// File: src/utils/profileHelpers.ts
import supabase from '../../../../api/supabaseClient';
// File: src/types/profile.ts
export interface EventPlannerProfile {
    planner_id: number;
    company_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    experience_years: number;
    specialization: string;
    website: string;
    bio: string;
    avatar_url: string;
    profile_id: string;
    is_public: boolean;
  }
  
  export interface ModalData {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error';
  }
  
// In profileupdate/api.ts
export const toggleVisibility = async (profileId: string, newStatus: boolean): Promise<EventPlannerProfile> => {
  console.log('Updating with profileId:', profileId); // This should be a UUID string
  
  const { data, error } = await supabase
      .from('eventplanners')
      .update({ is_public: newStatus })
      .eq('profile_id', profileId) // Make sure profileId is the UUID string
      .select() // This is important to return the updated data
      .single();

  if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
  }

  if (!data) {
      console.error('Supabase returned null data.');
      throw new Error('No matching record found to update.');
  }

  console.log('Supabase data returned:', data);
  return data;
};

export const fetchUserProfile = async (): Promise<EventPlannerProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('eventplanners')
    .select('*')
    .eq('profile_id', user.id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Profile not found');

  return data;
};

export const updateUserProfile = async (
  profile: EventPlannerProfile, 
  formData: Partial<EventPlannerProfile>
): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Ensure numeric fields are properly converted
  const dataToSubmit = {
    ...formData,
    experience_years: formData.experience_years ? Number(formData.experience_years) : undefined
  };

  const { error } = await supabase
    .from('eventplanners')
    .update(dataToSubmit)
    .eq('planner_id', profile.planner_id);

  if (error) throw error;
};

export const uploadProfileImage = async (file: File): Promise<string> => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, JPG, or PNG).');
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image size exceeds the limit (5MB).');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Upload file to storage
  const fileName = `avatars/${user.id}-${Date.now()}`;
  const { error: uploadError } = await supabase.storage
    .from('profile')
    .upload(fileName, file);
  
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile')
    .getPublicUrl(fileName);
  
  return publicUrl;
};