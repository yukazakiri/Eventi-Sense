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
  
    amenities: string[];
  
    company_id: string;
  
  }
interface Venue {
    id: number;
    name: string;
    address_street?: string;
    address_city?: string;
    address_state?: string;
    address_zip?: string;
    location: string;
    phone_number?: string;
    email?: string;
    website?: string;
    capacity?: number;
    description?: string;
    venue_type: string;
    company_id: string;
    amenities: number[];
  }


interface Amenity {
    id: string;
    name: string;
}

export type { Venue, Amenity}; // Export the interfaces