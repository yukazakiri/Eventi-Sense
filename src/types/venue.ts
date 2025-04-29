export interface CompanyProfile{
  id: string; // UUID
    company_name: string;
    company_address: string;
    company_email: string;
    company_phone: string;
    company_website?: string | null;
    company_logo_url?: string | null;
}
export interface VenueFormData {
    name: string;
    price: string;
    accessibility:  string[];
    pricing_model:  string[];
  
    address_street: string;
  
    address_city: string;
  
    address_state: string;
  
    address_zip: string;
  
    location: string;
  
    phone_number: string;
  
    email: string;
  
    website: string;
  
    capacity: string;
  
    description: string;
  
    venue_type: string[];
  
    amenities: { id: string; quantity: number | null; description: string | null }[];
  
  
    company_id: string;
  
  }
  // Add this to your types/venue.ts file
  export interface VenueService {
    id?: string;
    venue_id?: string;
    name: string;
    description: string;
    price: number;
    is_required: boolean;
  }
  export interface Venue {
    id: string; // UUID
    name: string;
    price: string;
    accessibility: string[];
    pricing_model: string[];
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    location: string;
    phone_number: string;
    email: string;
    website: string;
    capacity: string;
    description: string;
    venue_type: string[];
    company_id: string;
    created_at: string;
    updated_at: string;
    cover_image_url: string;
    venue_types: VenueTypeOption[];
    venue_accessibilities: AccessibilityOption[];
    venue_pricing_models: PricingModelOption[];
    cover_photo: string | null;

 // Legacy pricing fields (for backward compatibility)
 base_price: number;          // Base price per hour/day
 price_unit: 'hour' | 'day';  // Price per hour or per day
 
 // New pricing fields
 hourly_price?: number;       // Price per hour
 daily_price?: number;        // Price per day
 
 minimum_hours?: number;      // Minimum booking duration (in hours)
 downpayment_percentage: number; // Percentage required as downpayment (e.g., 30 for 30%)
 
 // Additional pricing options
 weekend_surcharge_percentage?: number; // Additional percentage for weekend bookings
 holiday_surcharge_percentage?: number; // Additional percentage for holiday bookings
 additional_services?: VenueService[]; // Additional services with pricing
}



export interface Amenity {
    id: string; // UUID
    name: string;
}

export interface VenueAmenity {

    venue_id: string; // UUID
    amenity_id: string; // UUID
    quantity: number | null;
    description: string | null;
}

export interface AmenityForm {
    id: string;
    quantity: number | null;
    description: string | null;
  }
export interface VenueImage {
    id: string;
  image_url: string;
 
}
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'confirmed-for-downpayment' | 'confirmed-paid';

export interface Booking {
  id?: string; // UUID, auto-generated
  venue_id: string; // Foreign key to venues table
  user_id: string; // Foreign key to auth.users
  start_date: string; // ISO date string (e.g., '2024-02-12T10:00:00Z')
  end_date: string; // ISO date string
  status?: BookingStatus; // Defaults to 'pending'
  created_at?: string; // Auto-generated timestamp
  updated_at?: string; // Auto-updated timestamp
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  avatar_url?:string;
}


export interface VenueTypeOption {
  id: string;
  name: string;
}

export interface AccessibilityOption {
  id: string;
  name: string;
}

export interface PricingModelOption {
  id: string;
  name: string;
}