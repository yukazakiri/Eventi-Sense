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
  export const deleteProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId)
        .select("*")
        .single();
    
      if (error) {
        console.error("Error deleting profile:", error.message);
        throw error;
      }
    
      return data;
    } catch (error) {
      console.error("Error in deleteProfile:", error);
      throw error;
    }
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
export const fetchAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error("Error fetching all profiles:", error.message);
    throw error;
  }

  return data;
};


export const fetchCompany = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching company profile:', profileError);
      throw new Error('An error occurred while fetching the company profile.');
    } else {
      return profileData;
    }
  }
  return null;
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

// Add this new function
export const fetchAuthUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching auth users:", error.message);
    throw error;
  }
  return data.users;
};

export const fetchAllCompanyProfiles = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from("company_profiles")
    .select("*");

  if (error) {
    console.error("Error fetching all company profiles:", error.message);
    throw error;
  }

  return data || [];
};
  
