export interface VenueFormData {

    name: string;
  
    address_street: string;
  
    address_city: string;
  
    address_state: string;
  
    address_zip: string;
  
    location: string;
  
    phone_number: string;
  
    email: string;
  
    website: string;
  
    capacity: number;
  
    description: string;
  
    venue_type: string;
  
    amenities: { id: string; quantity: number | null; description: string | null }[];
  
    company_id: string;
  
  }
  export interface Venue {
    id: string; // UUID
    name: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    location: string;
    phone_number: string;
    email: string;
    website: string;
    capacity: number;
    description: string;
    venue_type: string;
    company_id: string;
    created_at: string;
    cover_image_url: string;
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



