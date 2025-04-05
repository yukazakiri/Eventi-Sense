// types.ts
export interface EventTag {
    id: string;
    name: string;
    type: 'venue' | 'supplier';
  }
  export  interface Organizer {
    id: string;
    name: string;
    company_name?: string;
    company_logo_url?: string;
    avatar_url?: string;
    email: string;
    phone_number: string;
    profile_id?: string;
    role?: string;

  }
  
  export  interface CompanyProfile {
    id: string;
    company_name: string;
    company_logo_url?: string;
  }
  
  export  interface Event {
    name: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    status: string;
    organizer_type: 'event_planner' | 'venue_manager' | 'supplier';
  }
  