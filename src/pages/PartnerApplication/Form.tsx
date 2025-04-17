import { useState, ChangeEvent, FormEvent } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import  supabase  from '../../api/supabaseClient';

import { FormData, FormErrors } from './Form/types';
import { validateStep } from './Form/validation';
import { AgreementsStep } from './Form/step/AgreementStep';
import { BusinessInfoStep } from './Form/step/BusinesInfo';
import { BusinessVerificationStep } from './Form/step/BusinessVerification';
import { ContactDetailsStep } from './Form/step/ContactDetailsStep';
import { SocialPortfolioStep } from './Form/step/SocialPortFolio';

const PartnerForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    serviceType: '',
    businessDescription: '',
    ownerName: '',
    emailAddress: '',
    phoneNumber: '',
    businessAddress: '',
    website: '',
    socialMedia: '',
    portfolioLink: '',
    sampleWork: null,
    businessRegistration: null,
    businessPermit: null,
    governmentId: null,
    proofOfAddress: null,
    tin: '',
    fireSafetyCert: null,
    otherCertificates: null,
    certifyInformation: false,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleMultipleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: Array.from(files)
      }));
      
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const nextStep = () => {
    const validationErrors = validateStep(currentStep, formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('partner-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Error uploading file');
    }

    return filePath;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateStep(currentStep, formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Upload documents first
        const documentUploads = await Promise.all([
          formData.sampleWork && uploadFile(formData.sampleWork as File, 'sample-works'),
          formData.businessRegistration && uploadFile(formData.businessRegistration as File, 'business-registrations'),
          formData.businessPermit && uploadFile(formData.businessPermit as File, 'business-permits'),
          formData.governmentId && uploadFile(formData.governmentId as File, 'government-ids'),
          formData.proofOfAddress && uploadFile(formData.proofOfAddress as File, 'proof-of-address'),
          formData.fireSafetyCert && uploadFile(formData.fireSafetyCert as File, 'fire-safety-certs'),
        ].filter(Boolean));

        // Insert partner data
        const { data: partnerData, error: partnerError } = await supabase
          .from('partners')
          .insert({
            business_name: formData.businessName,
            business_type: formData.businessType,
            service_type: formData.serviceType,
            business_description: formData.businessDescription,
            owner_name: formData.ownerName,
            email_address: formData.emailAddress,
            phone_number: formData.phoneNumber,
            business_address: formData.businessAddress,
            website: formData.website,
            social_media: formData.socialMedia,
            portfolio_link: formData.portfolioLink,
            tin: formData.tin
          })
          .select()
          .single();

        if (partnerError) throw partnerError;

        // Insert documents
        const documentTypes = [
          'sample_work',
          'business_registration',
          'business_permit',
          'government_id',
          'proof_of_address',
          'fire_safety_cert'
        ];

        const documentInserts = documentUploads.map((filePath, index) => ({
          partner_id: partnerData.id,
          document_type: documentTypes[index],
          file_path: filePath,
          file_name: filePath?.split('/')?.pop() ?? ''
        }));

        if (documentInserts.length > 0) {
          const { error: documentsError } = await supabase
            .from('partner_documents')
            .insert(documentInserts);

          if (documentsError) throw documentsError;
        }

        // Insert agreements
        const { error: agreementsError } = await supabase
          .from('partner_agreements')
          .insert({
            partner_id: partnerData.id,
            certify_information: formData.certifyInformation,
            agree_to_terms: formData.agreeToTerms
          });

        if (agreementsError) throw agreementsError;

        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            businessName: '',
            businessType: '',
            serviceType: '',
            businessDescription: '',
            ownerName: '',
            emailAddress: '',
            phoneNumber: '',
            businessAddress: '',
            website: '',
            socialMedia: '',
            portfolioLink: '',
            sampleWork: null,
            businessRegistration: null,
            businessPermit: null,
            governmentId: null,
            proofOfAddress: null,
            tin: '',
            fireSafetyCert: null,
            otherCertificates: null,
            certifyInformation: false,
            agreeToTerms: false,
          });
          setCurrentStep(1);
          setSubmitSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to submit form. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 my-24 z-50"     style={{
        background: `
          linear-gradient(#152131, #152131) padding-box,
          linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
        `,
        border: '1px solid transparent',
        borderRadius: '0.75rem'
      }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2 font-bonanova">Partner Registration</h1>
          <p className="text-gray-300">Complete all steps to join our network of trusted partners</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && <BusinessInfoStep {...{ formData, errors, handleInputChange, handleFileChange, handleMultipleFileChange }} />}
            {currentStep === 2 && <ContactDetailsStep {...{ formData, errors, handleInputChange, handleFileChange, handleMultipleFileChange }} />}
            {currentStep === 3 && <SocialPortfolioStep {...{ formData, errors, handleInputChange, handleFileChange, handleMultipleFileChange }} />}
            {currentStep === 4 && <BusinessVerificationStep {...{ formData, errors, handleInputChange, handleFileChange, handleMultipleFileChange }} />}
            {currentStep === 5 && (
              <AgreementsStep
                {...{ formData, errors, handleInputChange, handleFileChange, handleMultipleFileChange }}
                {...{ formData, errors, handleInputChange }}
                isSubmitting={isSubmitting}
                submitSuccess={submitSuccess}
              />
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center text-white bg-navy-blue-3 hover:bg-navy-blue-4 px-4 py-2 rounded-lg transition-colors"
                >
                  <ChevronLeft className="mr-2" /> Previous
                </button>
              )}
              
              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center ml-auto bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Next <ChevronRight className="ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>Having trouble? Contact our support team at partners@eventisense.com</p>
        </div>
      </div>
    </div>
  );
};

export default PartnerForm;