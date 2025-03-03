import supabase from '../supabaseClient';
import { Profile,Company } from '../../types/profile';

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      throw error;
    }

    return data;
  };

export const updateProfile = async (userId: string, updatedProfile: Partial<Profile>): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", userId)
      .select("*")
      .single();
      if (error) {
        console.error("Error fetching profile:", error.message);
        throw error;
      }
  
      return data;
  };
export const createProfile = async (profileData: Profile) => {
    try {
        const {data, error} = await supabase.from('profiles').insert([profileData]);
        if(error) {
            console.error('error creating profile', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('unexpected error creating profile', error);
        return null;
    }
}
export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileName = `avatars/${userId}_${Date.now()}_${file.name}`; // Unique file name
    const { data, error } = await supabase.storage
      .from('profile')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Unexpected error uploading avatar:', error);
    return null;
  }
};
export const fetchProfileRole = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile role:", error.message);
    throw error;
  }
  return data?.role;
};

export const fetchCompany = async (userId: string): Promise<Company | null> => {
  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .eq("id", userId)
    .single();
      if (error) {
        console.error("Error fetching profile:", error.message);
        throw error;
      }
  
      return data;
    };

    
export const createCompany = async (companyData: Company) => {
  const { data, error } = await supabase
    .from("company_profiles")
    .insert([companyData])
    .select();

  return { data, error };
};

export const updateCompany = async (userId: string, updatedCompany: Partial<Company>) => {
  const { data, error } = await supabase
    .from("company_profiles")
    .update(updatedCompany)
    .eq("id", userId)
    .select("*")
    .single();

  return { data, error };
};
  
