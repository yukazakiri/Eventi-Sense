import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../../api/supabaseClient';
import { VenueFormData, Amenity } from '../../../../types/venue';
import {  ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import CreateInfoVenueForm from './CreateInfo';
import CreateAddressVenueForm from './CreateAddress';
import { validateVenueForm } from './FormValidation';
import CreatePhotoCover from './CreateCoverPhoto';
import { displayValidationErrors, hasErrors, validateCurrentStep } from './validateCreate';


const VenueForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 4;
  
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    location: '',
    phone_number: '',
    email: '',
    website: '',
    capacity: '',
    accessibility: [],
    price: '',
    pricing_model: [],
    description: '',
    venue_type: [],
    amenities: [],
    company_id: '',
  });

  const [_amenities, setAmenities] = useState<Amenity[]>([]);
  const [_amenitiesLoading, setAmenitiesLoading] = useState<boolean>(true);
  const [_amenitiesError, setAmenitiesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const [_user, setUser] = useState<any | null>(null);
  const [_companyProfile, setCompanyProfile] = useState<any | null>(null);
  const [_companyProfileLoading, setCompanyProfileLoading] = useState(true);
  const [_companyProfileError, setCompanyProfileError] = useState<string | null>(null);
  const [_formErrors, setFormErrors] = useState({});
  const [_venueId, setVenueId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [venueTypes, setVenueTypes] = useState<any[]>([]);
  const [venueTypesLoading, setVenueTypesLoading] = useState(true);
  const [venueTypesError, setVenueTypesError] = useState<string | null>(null);

  const [accessibilities, setAccessibilities] = useState<any[]>([]);
  const [accessibilitiesLoading, setAccessibilitiesLoading] = useState(true);
  const [accessibilitiesError, setAccessibilitiesError] = useState<string | null>(null);

  const [pricingModels, setPricingModels] = useState<any[]>([]);
  const [pricingModelsLoading, setPricingModelsLoading] = useState(true);
  const [pricingModelsError, setPricingModelsError] = useState<string | null>(null);

  // Step titles for the progress indicator
  const steps = [
    { number: 1, title: "Venue Information" },
    { number: 2, title: "Cover Photo" },
    { number: 3, title: "Address Details" },
    { number: 4, title: "Review & Submit" }
  ];

  useEffect(() => {
    const fetchUserAndCompanyProfile = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Error fetching user:", error);
            return;
        }

        if (user) {
            setUser(user);
            fetchCompanyProfile(user.id);
        }
    };

    const fetchAllRelatedData = async () => {
        try {
            const [
                { data: venueTypesData, error: venueTypesError },
                { data: accessibilitiesData, error: accessibilitiesError },
                { data: pricingModelsData, error: pricingModelsError },
                { data: amenitiesData, error: amenitiesError },
            ] = await Promise.all([
                supabase.from('venue_types').select('id, name'),
                supabase.from('venue_accessibilities').select('id, name'),
                supabase.from('venue_pricing_models').select('id, name'),
                supabase.from('amenities').select('id, name'),
            ]);

            if (venueTypesError) throw venueTypesError;
            setVenueTypes(venueTypesData);

            if (accessibilitiesError) throw accessibilitiesError;
            setAccessibilities(accessibilitiesData);

            if (pricingModelsError) throw pricingModelsError;
            setPricingModels(pricingModelsData);

            if (amenitiesError) throw amenitiesError;
            setAmenities(amenitiesData);

        } catch (error: any) {
            console.error("Error fetching related data:", error);
            setVenueTypesError(error.message);
            setAccessibilitiesError(error.message);
            setPricingModelsError(error.message);
            setAmenitiesError(error.message);
        } finally {
            setVenueTypesLoading(false);
            setAccessibilitiesLoading(false);
            setPricingModelsLoading(false);
            setAmenitiesLoading(false);
        }
    };

    fetchUserAndCompanyProfile();
    fetchAllRelatedData();
  }, []);

  const fetchCompanyProfile = async (userId: string) => {
    setCompanyProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setCompanyProfile(data);
        setFormData((prevData) => ({
          ...prevData,
          company_id: data.id,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching company profile:", error.message);
      setCompanyProfileError(error.message);
    } finally {
      setCompanyProfileLoading(false);
    }
  };

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const { data, error } = await supabase.from('amenities').select('id, name');
        if (error) {
          console.error("Error fetching amenities:", error);
          setAmenitiesError(error.message);
        } else {
          setAmenities(data);
        }
      } finally {
        setAmenitiesLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiCheckboxChange = (name: keyof VenueFormData, value: string) => {
    setFormData(prev => ({
        ...prev,
        [name]: (prev[name] as string[] || []).includes(value)
            ? (prev[name] as string[]).filter(item => item !== value)
            : [...(prev[name] as string[] || []), value]
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result as string);
        }
        reader.readAsDataURL(file);
    } else {
        setImageUrl(null);
    }
  };

  const handleUpload = async (venueId: string) => {
    if (!selectedFile) {
      return;
    }
  
    setUploading(true);
    setUploadError(null);
  
    try {
      // Generate a unique filename using a timestamp or UUID
      const timestamp = Date.now();
      const fileExtension = selectedFile.name.split('.').pop();
      const uniqueFileName = `${timestamp}.${fileExtension}`;
      const filePath = `VenuesPhoto/CoverPhoto/${venueId}/${uniqueFileName}`;
  
      const { error } = await supabase.storage
        .from('venue_images')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false,
        });
  
      if (error) {
        throw error;
      }
  
      // Construct the public URL correctly
      const { data: { publicUrl } } = supabase.storage.from('venue_images').getPublicUrl(filePath);
      setImageUrl(publicUrl);
  
      const { error: updateError } = await supabase
        .from('venues')
        .update({ cover_image_url: publicUrl })
        .eq('id', venueId);
  
      if (updateError) throw updateError;
  
      alert('Image uploaded successfully!');
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };
  
  const nextStep = () => {
    if (activeStep < totalSteps) {
      const errors = validateCurrentStep(formData, activeStep, selectedFile);
      setFormErrors(errors);
  
      if (hasErrors(errors)) {
        displayValidationErrors(errors);
        return;
      }
  
      setActiveStep(activeStep + 1);
    }
  };const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow submission if the user is on the final step
    if (activeStep !== totalSteps) {
        alert("Please complete all steps before submitting.");
        return;
    }

    // Set the submitting state to true only when the user explicitly clicks "Create Venue"
    setIsSubmitting(true);

    // Validate the entire form
    const errors = validateVenueForm(formData);
    setFormErrors(errors);

    if (hasErrors(errors)) {
        displayValidationErrors(errors);
        setIsSubmitting(false); // Reset submit state if validation fails
        return;
    }

    // Proceed with submission
    setUploading(true);

    try {
        let newVenueId: string | null = null;
        const { amenities, venue_type, accessibility, pricing_model, ...venueData } = formData;

        const { data: newVenueData, error: venueError } = await supabase
            .from("venues")
            .insert([venueData])
            .select("id")
            .single();

        if (venueError) throw venueError;
        newVenueId = newVenueData?.id;
        if (!newVenueId) throw new Error("Venue ID not found");

        setVenueId(newVenueId);

        if (selectedFile && newVenueId) {
            await handleUpload(newVenueId);
        }

        await Promise.all([
            ...venue_type.map(type => insertRelatedDataWithNames(newVenueId, type, 'venue_types', 'venues_venue_types', 'venue_type_id')),
            ...accessibility.map(acc => insertRelatedDataWithNames(newVenueId, acc, 'venue_accessibilities', 'venues_venue_accessibilities', 'venue_accessibility_id')),
            ...pricing_model.map(price => insertRelatedDataWithNames(newVenueId, price, 'venue_pricing_models', 'venues_venue_pricing_models', 'venue_pricing_model_id')),
        ]);

        alert("You have successfully created a venue!");

        // Retrieve user and company profile to get user id and company id.
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("User not found");
        const userId = user.id;

        const { data: companyProfile, error: companyError } = await supabase
            .from("company_profiles")
            .select("id")
            .eq("user_id", userId)
            .single();

        if (companyError || !companyProfile) throw new Error("Company profile not found");
        const companyId = companyProfile.id;

        // Create notification
        const notificationMessage = "A new venue has been created.";
        const { error: notificationError } = await supabase
            .from('notifications')
            .insert([
                {
                    user_id: companyId, // Notify the company owner
                    sender_id: userId, // ID of the sender
                    type: "venue_creation",
                    message: notificationMessage,
                    link: `/Venue-Manager-Dashboard/Venue-List`,
                    is_read: false
                }
            ]);

        if (notificationError) {
            console.error("Error creating notification:", notificationError);
        }

        navigate('/Venue-Manager-Dashboard/Venue-List');

    } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred. Please try again.");
    } finally {
        setIsSubmitting(false);
        setUploading(false);
    }
};

  const insertRelatedDataWithNames = async (
    venueId: string,
    name: string,
    tableName: string,
    joinTableName: string,
    foreignKey: string
  ) => {
    if (!name) return;

    try {
        const id = await fetchId(name, tableName);
        if (id) {
            await insertRelatedData(venueId, id, joinTableName, foreignKey);
        } else {
            console.warn(`No ID found for name "${name}" in table "${tableName}". Skipping insertion.`);
        }
    } catch (error) {
        console.error(`Error inserting related data for ${tableName}:`, error);
    }
  };

  const fetchId = async (name: string, tableName: string): Promise<string | null> => {
    if (!name) return null;

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('id')
            .eq('name', name)
            .single();

        if (error) {
            throw error;
        }

        return data?.id || null;
    } catch (error) {
        console.error(`Error fetching ID from ${tableName}:`, error);
        return null;
    }
  };

  const insertRelatedData = async (
    venueId: string,
    selectedId: string,
    joinTableName: string,
    foreignKey: string
  ) => {
    const insert = {
        venue_id: venueId,
        [foreignKey]: selectedId,
    };
    const { error } = await supabase.from(joinTableName).insert([insert]);
    if (error) {
        throw error;
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Loading states check
  if (venueTypesLoading || accessibilitiesLoading || pricingModelsLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500 "></div>
      <span className="ml-3 text-xl font-medium text-gray-700">Loading venue data...</span>
    </div>;
  }

  // Error states check
  if (venueTypesError || accessibilitiesError || pricingModelsError) {
    return <div className="text-red-500 p-4">
      An error occurred while loading data. Please refresh the page and try again.
    </div>;
  }

  // Helper function to get step guidance message
  const getStepMessage = () => {
    switch(activeStep) {
      case 1:
        return "Please enter your venue's basic information including name, type, pricing, and accessibility options.";
      case 2:
        return "Upload a cover photo for your venue. This will be the main image visitors see.";
      case 3:
        return "Enter your venue's address details including street, city, state, and zip code.";
      case 4:
        return "You're almost done! Review your information and submit to create your venue.";
      default:
        return "";
    }
  };

  return (
    <div className="md:m-10 m-4 font-sofia">
      <div className='col-span-2'>
    
      </div>
      <section className='bg-white  md:p-10 rounded-3xl dark:bg-gray-900'>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300 font-bonanova">Create Your Venue</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">Complete the following steps to create your venue</p>
        </div>
        
        {/* Step Counter */}
        <div className="text-center mb-2">
          <span className="font-semibold text-sky-600">Step {activeStep} of {totalSteps}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-full bg-sky-600 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(activeStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        {/* Step Navigation */}
        <div className="flex mb-8 overflow-x-auto">
          {steps.map((step) => (
            <div 
              key={step.number} 
              className={`flex-1 text-center ${
                activeStep === step.number 
                  ? 'font-bold text-sky-600 border-b-2 border-sky-600' 
                  : activeStep > step.number 
                  ? 'text-green-600' 
                  : 'text-gray-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 mb-2 rounded-full ${
                  activeStep === step.number 
                    ? 'bg-sky-100 text-sky-600 border border-sky-600' 
                    : activeStep > step.number 
                    ? 'bg-green-100 text-green-600 border border-green-600' 
                    : 'bg-gray-100 text-gray-400 border border-gray-400'
                }`}>
                  {activeStep > step.number ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <span>{step.title}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Step Guidance Message */}
        <div className="bg-sky-400/10 border-l-4 border-sky-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-sky-700 dark:text-sky-400">{getStepMessage()}</p>
              <p className="text-xs mt-1 text-sky-500 dark:text-sky-700">Don't worry! You can edit all information after creating your venue.</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        {/* Step 1: Venue Information */}
        {activeStep === 1 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <CreateInfoVenueForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleMultiCheckboxChange={handleMultiCheckboxChange}
              isEditing={true}
              accessibilities={accessibilities}
              pricingModels={pricingModels}
              venueTypes={venueTypes}
            />
          </div>
        )}

        {/* Step 2: Cover Photo */}
        {activeStep === 2 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <CreatePhotoCover
              isEditing={true}
              imageUrl={imageUrl}
              handleFileChange={handleFileChange}
              uploading={uploading}
              uploadError={uploadError}
              selectedFile={selectedFile}
            />
          </div>
        )}

        {/* Step 3: Address Details */}
        {activeStep === 3 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <CreateAddressVenueForm
              formData={formData}
              handleInputChange={handleInputChange}
              isEditing={true}
            />
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {activeStep === 4 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <div className="shadow-lg bg-white p-6 border border-gray-300 rounded-3xl mb-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Ready to Submit Your Venue</h2>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      You're all set! Your venue is ready to be published.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  <span className="font-medium">What happens next?</span> After submission:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your venue will be created and added to your venue list</li>
                  <li>You can add and manage amenities after submission</li>
                  <li>You can update any venue details at any time</li>
                  <li>Your venue will be available for booking based on your settings</li>
                </ul>
                
                <p className="pt-4 text-sm italic">
                  Note: Amenities can be added and customized after your venue is created. You'll be able to specify quantities and add descriptions for each amenity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={activeStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg ${
              activeStep === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-sky-600 border border-sky-600 hover:bg-sky-50'
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>

          {activeStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Next
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-3 rounded-lg ${
                isSubmitting 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Venue...
                </>
              ) : (
                <>
                  Create Venue
                  <CheckCircleIcon className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
      </section>
    </div>
  );
};

export default VenueForm;