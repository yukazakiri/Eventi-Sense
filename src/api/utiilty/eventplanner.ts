import supabase from "../supabaseClient";
export interface EventPlannerFormData {
    company_name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    experience_years: number | string;
    specialization: string;
    website: string;
    bio: string;
  }
  export const initialFormData: EventPlannerFormData = {
    company_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    experience_years: '',
    specialization: '',
    website: '',
    bio: '',
  };
  
  
export const fetchEventPlanner = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from("eventplanners")
            .select("*")
            .eq("profile_id", userId)
            .single();

        if (error) {
            console.error("Error fetching event planner:", error.message);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error in fetchEventPlanner:", error);
        return null;
    }
};
