// types/profile.ts
export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'venue_manager' | 'supplier' | 'event_planner' | 'user';
    avatar_url: string | null;
    email: string | null;
  }
  
  // types/follow.ts
  export interface Follow {
    follower_id: string;
    following_id: string;
    created_at: string;
  }
  
  // types/profileWithFollow.ts
  export interface ProfileWithFollow extends Profile {
    is_following: boolean;
    followers_count: number;
    following_count: number;
  }