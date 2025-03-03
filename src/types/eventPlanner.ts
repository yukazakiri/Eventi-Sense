export interface EventPlanner {
    id: string; // UUID
    profile_id: string; // UUID, foreign key to profiles table
    company_profile_id: string; // UUID, foreign key to company_profiles table
    bio: string | null; // TEXT, can be null
    specialization: string | null; // TEXT, can be null
    rating: number; // NUMERIC(3, 2), defaults to 0.00
    created_at: string; // TIMESTAMPTZ, ISO 8601 string
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

