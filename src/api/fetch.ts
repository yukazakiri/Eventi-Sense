import  supabase  from "./supabaseClient";


interface Company {
    id?: string;
    company_name: string;
    company_address: string;
    company_email: string;
    company_phone: string;
    company_logo_url?: string | null;
  }
  interface Profile {
    id: string;
    role: string;
  }
  
export const fetchCompany = async (userId: string): Promise<Company | null> => {
    const { data, error } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("id", userId)
      .single();
  
    if (error) {
      console.error("Error fetching company profile:", error.message);
      throw error;
    }
  
    return data;
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

// const company = await fetchCompany(user.id);
// if (company) {
//   setCompany(company);
// }