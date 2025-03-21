export interface RegisterData {
    email: string;
    password: string;
    name: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
    role?: string; // Optional role for registration
  }
  
  export interface AssignRoleData {
    userId: string;
    role: string;
  }
  
  export interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    role: string;

  }

  export interface UserAuth {
    id: string;
    email: string | null;
    created_at: string;
    confirmed_at: string | null;
    profile: {
      user_id: string;
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
      website: string | null;
      updated_at: string | null;
      email: string | null;
      role: string;

    }
}
export interface UserAuthProfile {
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  email?: string | null;

}


  
  export interface ApiResponse {
    message?: string;
    user?: User;
    users?: User[];
    error?: string;
    email?: string; // Added for login response
    role?: string; // Added for login response
    token?: string; // Added for login response
  }
  
  export interface Profile {
    id: number;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    avatar_url: string | null;
    email: string | null;
    
    // Add other profile properties as needed
  }
  