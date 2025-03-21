export type EventPlanner = {
  planner: {
    planner_id: string;
    profile_id: string;
    company_name: string;
    specialization: string;
    avatar_url: string;
    is_public: boolean;

    // Add other fields as needed
  };
  services: string;
};
export interface EventPlanners {
  planner_id: number;
  profile_id: string; // UUID
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  experience_years: number | null;
  specialization: string | null;
  website: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
  avatar_url: string;
  is_public:boolean;
  phone: string | null;
}
  export interface CardProps {
    planner_id: number;
    profile_id: string; // UUID
    company_name: string | null;
    avatar_url: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
    experience_years: number | null;
    specialization: string | null;
    website: string | null;
    bio: string | null;
    phone: string | null;
    created_at: String;
    updated_at: Date;
  }
  
  export interface EventPlannerDetails {
    id: string; // UUID
    bio: string | null; // TEXT, can be null
    specialization: string | null; // TEXT, can be null
    avg_rating: number; // NUMERIC(3, 2), defaults to 0.00
    profile_id: string; // UUID, foreign key to profiles table
    company_profile_id: string; // UUID, foreign key to company_profiles table
    created_at: string; // TIMESTAMPTZ, ISO 8601 string
  }

