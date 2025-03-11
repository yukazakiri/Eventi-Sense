

// types/supplier.ts
export interface Supplier {
  id?: string;
  name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  location: string;
  phone_number: string;
  email: string;
  website: string;
  description: string;
  cover_image_url: string;
  price_range: string;
  company_id?: string;  // Make sure this is still here!
  created_at?: Date;
  rating?: number;
  suppliers_services?: string;
}
export interface CompanyProfile{
  id?: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  company_website?: string | null;
  company_logo_url?: string | null;
}
export interface SupplierImage{
  id: string;
  image_url: string;
 
}

export interface SupplierFormData extends Omit<Supplier, 'id' | 'company_id' | 'created_at'> {
  name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  location: string;
  phone_number: string;
  email: string;
  website: string;
  description: string;
  cover_image_url: string;
  price_range: string;
}
export interface SupplierServices{
  id?: string;
  service_name: string;
  description: string;
  price: string;

}

export interface SupplierSocials{
  id?: string;
  link: string;
}
export interface Booking {
  id?: string;
  supplier_id: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
  service_id?: string;
  suppliers_services?: SupplierServices;

}
