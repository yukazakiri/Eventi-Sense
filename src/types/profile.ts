  
  export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    role: string;

  }
  export interface Company{
    id?: string;
    company_name: string;
    company_address: string;
    company_email: string;
    company_phone: string;
    company_website?: string | null;
    company_logo_url?: string | null;
  }