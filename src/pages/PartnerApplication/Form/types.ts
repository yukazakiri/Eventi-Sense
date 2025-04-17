export interface FormData {
    businessName: string;
    businessType: string;
    serviceType: string;
    businessDescription: string;
    ownerName: string;
    emailAddress: string;
    phoneNumber: string;
    businessAddress: string;
    website: string;
    socialMedia: string;
    portfolioLink: string;
    sampleWork: File | null;
    businessRegistration: File | null;
    businessPermit: File | null;
    governmentId: File | null;
    proofOfAddress: File | null;
    tin: string;
    fireSafetyCert: File | null;
    otherCertificates: File[] | null;
    certifyInformation: boolean;
    agreeToTerms: boolean;
  }
  
  export interface FormErrors {
    [key: string]: string | undefined;
  }
  
  export type StepComponentProps = {
    formData: FormData;
    errors: FormErrors;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMultipleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };