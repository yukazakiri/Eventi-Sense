// companyProfile.ts (in your api folder)
import  supabase  from './supabaseClient'; // Import your Supabase client

// Define the type for your company profile data
interface CompanyProfile {
  id: string; // Or number, depending on your database
  user_id: string;
  company_name: string;
  company_logo_url: string | null; // Make it nullable if it can be null in the DB
  // ... other properties
}

export async function fetchCompanyProfile(userId: string): Promise<CompanyProfile | null> {
  try {
    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching company profile:", error);
      return null;
    }

    return data as CompanyProfile; // Type assertion since Supabase types might not be perfect
  } catch (err) {
    console.error("Error in fetchCompanyProfile:", err);
    return null;
  }
}


