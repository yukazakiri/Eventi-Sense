// venueBookingTypes.ts
export interface VenueBooking {
    id: number;
    venue_id: number;
    user_id: string; // Assuming user_id is a string (UUID)
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    status: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
  }
  
  // supplierBookingTypes.ts
  export interface SupplierBooking {
    id: number;
    supplier_id: number;
    user_id: string; // Assuming user_id is a string (UUID)
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    status: string;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    service_id?: number; // Optional service_id
  }