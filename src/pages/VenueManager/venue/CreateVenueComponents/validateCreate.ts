import { VenueFormData } from "../../../../types/venue";

interface FormErrors {
  [key: string]: string;
}

// Validate the entire form (used for final submission)
export const validateVenueForm = (formData: VenueFormData): FormErrors => {
  const errors: FormErrors = {};
  
  // Combine all step validations
  return {
    ...validateStep1(formData),
    ...validateStep2(formData),
    ...validateStep3(formData),
    ...validateStep4(formData)
  };
};

// Step 1: Venue Information validation
export const validateStep1 = (formData: VenueFormData): FormErrors => {
  const errors: FormErrors = {};

  // Basic required field validation
  if (!formData.name?.trim()) {
    errors.name = "Venue name is required";
  } else if (formData.name.length < 3) {
    errors.name = "Venue name must be at least 3 characters";
  } else if (formData.name.length > 100) {
    errors.name = "Venue name cannot exceed 100 characters";
  }
  // Contact information validation
  if (formData.phone_number && !/^09\d{9}$/.test(formData.phone_number)){
    errors.phone_number = "Please enter a valid phone number";
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (formData.website && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(formData.website)) {
    errors.website = "Please enter a valid website URL";
  }

  // Capacity validation
  if (formData.capacity && isNaN(Number(formData.capacity))) {
    errors.capacity = "Capacity must be a number";
  } else if (formData.capacity && Number(formData.capacity) <= 0) {
    errors.capacity = "Capacity must be greater than 0";
  }

  // Price validation
  if (formData.price && isNaN(Number(formData.price))) {
    errors.price = "Price must be a number";
  } else if (formData.price && Number(formData.price) < 0) {
    errors.price = "Price cannot be negative";
  }

  // Selection validation
  if (!formData.venue_type || formData.venue_type.length === 0) {
    errors.venue_type = "Please select at least one venue type";
  }

  if (!formData.pricing_model || formData.pricing_model.length === 0) {
    errors.pricing_model = "Please select at least one pricing model";
  }

  // Description validation (optional field but with min length if provided)
  if (formData.description && formData.description.trim().length < 20) {
    errors.description = "Description should be at least 20 characters if provided";
  }

  return errors;
};

// Step 2: Cover Photo validation (optional in this implementation)
export const validateStep2 = (formData: VenueFormData, selectedFile?: File | null): FormErrors => {
  const errors: FormErrors = {};
  
  // Cover photo is optional, but if validating file size/type is required:
  // if (selectedFile) {
  //   if (selectedFile.size > 5 * 1024 * 1024) {
  //     errors.coverPhoto = "Image size should not exceed 5MB";
  //   }
  //   
  //   const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  //   if (!validTypes.includes(selectedFile.type)) {
  //     errors.coverPhoto = "Please upload an image in JPEG, PNG, or WebP format";
  //   }
  // }

  return errors;
};

// Step 3: Address Details validation
export const validateStep3 = (formData: VenueFormData): FormErrors => {
  const errors: FormErrors = {};

  // Address validation
  if (!formData.address_street?.trim()) {
    errors.address_street = "Street address is required";
  }

  if (!formData.address_city?.trim()) {
    errors.address_city = "City is required";
  }

  if (!formData.address_state?.trim()) {
    errors.address_state = "State is required";
  }

  if (!formData.address_zip?.trim()) {
    errors.address_zip = "ZIP code is required";
} else if (!/^\d{4}$/.test(formData.address_zip)) {
    errors.address_zip = "Please enter a valid 4-digit ZIP code (e.g., 1234)";
}

  return errors;
};

// Step 4: Amenities validation (optional in this implementation)
export const validateStep4 = (formData: VenueFormData): FormErrors => {
  const errors: FormErrors = {};
  
  // Amenities are generally optional, but you could add specific validation if needed
  // For example, validation for quantity values:
  
  formData.amenities.forEach((amenity, index) => {
    if (amenity.quantity !== null && amenity.quantity < 0) {
      errors[`amenity_${amenity.id}_quantity`] = `Quantity for amenity cannot be negative`;
    }
  });

  return errors;
};

// Validate the current step before proceeding to the next
export const validateCurrentStep = (
  formData: VenueFormData, 
  currentStep: number, 
  selectedFile?: File | null
): FormErrors => {
  switch(currentStep) {
    case 1:
      return validateStep1(formData);
    case 2:
      return validateStep2(formData, selectedFile);
    case 3:
      return validateStep3(formData);
    case 4:
      return validateStep4(formData);
    default:
      return {};
  }
};

// Helper function to check if form has errors
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Function to display validation errors as an alert
export const displayValidationErrors = (errors: FormErrors): void => {
  const errorMessages = Object.values(errors).join('\n• ');
  alert(`Please fix the following errors:\n\n• ${errorMessages}`);
};