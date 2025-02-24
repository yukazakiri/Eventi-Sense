// formValidations.js (or formValidations.ts)
import { SupplierFormData } from '../../../types/supplier';

export const validateSupplierForm = (formData: SupplierFormData) => {
    let errors: Record<string, string> = {};

  if (!formData.name) {
    errors.name = "Supplier name is required";
  }
  if (!formData.address_street) {
    errors.address_street = "Street address is required";
  }
  if (!formData.address_city) {
    errors.address_city = "City is required";
  }
  if (!formData.address_state) {
    errors.address_state = "State is required";
  }
  if (!formData.address_zip) {
    errors.address_zip = "Zip code is required";
  }
  if (!formData.phone_number) {
    errors.phone_number = "Phone number is required";
  }
  if (!formData.email) {
    errors.email = "Email is required";
  }

  return errors; // Return the errors object
};


// Example usage (you can add more helper validation functions if needed)
export const isValidEmail = (email: string) => {
  // Use a regular expression or a library for more robust email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidZip = (zip: string) => {
    return /^\d{5}(?:-\d{4})?$/.test(zip);
};