import { FormData, FormErrors } from './types';

export const validateStep = (step: number, formData: FormData): FormErrors => {
  const newErrors: FormErrors = {};
  
  if (step === 1) {
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required';
  } 
  else if (step === 2) {
    if (!formData.ownerName) newErrors.ownerName = 'Owner/Manager name is required';
    if (!formData.emailAddress) newErrors.emailAddress = 'Email address is required';
    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
  }
  else if (step === 4) {
    if (!formData.businessRegistration) newErrors.businessRegistration = 'Business registration is required';
    if (!formData.businessPermit) newErrors.businessPermit = 'Business permit is required';
    if (!formData.governmentId) newErrors.governmentId = 'Government ID is required';
    if (formData.businessType === 'Venue Manager' && !formData.fireSafetyCert) {
      newErrors.fireSafetyCert = 'Fire safety certificate is required for venues';
    }
  }
  else if (step === 5) {
    if (!formData.certifyInformation) newErrors.certifyInformation = 'You must certify that the information is true';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
  }
  
  return newErrors;
};