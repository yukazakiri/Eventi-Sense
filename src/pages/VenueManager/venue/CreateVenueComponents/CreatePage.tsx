import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../../api/supabaseClient';
import { VenueFormData, Amenity } from '../../../../types/venue';
import Breadcrumbs from '../../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon, ArrowRightIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import CreateInfoVenueForm from './CreateInfo';
import CreateAddressVenueForm from './CreateAddress';
import { validateVenueForm } from './FormValidation';
import CreatePhotoCover from './CreateCoverPhoto';
import { displayValidationErrors, hasErrors, validateCurrentStep } from './validateCreate';

interface AmenityForm {
  id: string;
  quantity: number | null;
  description: string | null;
}

const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Venues', href: '/Venue-Manager-Dashboard/Venue-List' },
  { label: 'Create Venue', href: '' }
];

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

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState<boolean>(true);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);
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
    { number: 4, title: "Amenities" }
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

  const handleCheckboxChange = (amenity: Amenity) => {
    setFormData(prevData => {
      const existingIndex = prevData.amenities.findIndex(a => a.id === amenity.id);
      if (existingIndex > -1) {
        // Remove if unchecked
        const updatedAmenities = [...prevData.amenities];
        updatedAmenities.splice(existingIndex, 1);
        return { ...prevData, amenities: updatedAmenities };
      }
      // Add new amenity with default values
      return {
        ...prevData,
        amenities: [
          ...prevData.amenities,
          {
            id: amenity.id,
            quantity: null,
            description: null
          }
        ]
      };
    });
  };

  const handleAmenityChange = (amenityId: string, field: keyof AmenityForm, value: string | number | null) => {
    setFormData(prevData => ({
      ...prevData,
      amenities: prevData.amenities.map(amenity => 
        amenity.id === amenityId ? { ...amenity, [field]: value } : amenity
      )
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
      const filePath = `VenuesPhoto/CoverPhoto/${venueId}/${selectedFile.name}`;
      const { error } = await supabase.storage
        .from('company_logos')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Construct the public URL correctly
      const { data: { publicUrl } } = supabase.storage.from('company_logos').getPublicUrl(filePath);
      setImageUrl(publicUrl);

      const { error: updateError } = await supabase
        .from('venues')
        .update({ cover_image_url: publicUrl })
        .eq('id', venueId);

      if (updateError) throw updateError;

      alert("Image uploaded successfully!");
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
      // Validate the current step
      const errors = validateCurrentStep(formData, activeStep, selectedFile);
      setFormErrors(errors);
      
      if (hasErrors(errors)) {
        // Display errors and prevent moving to next step
        displayValidationErrors(errors);
        return;
      }
      
      // If validation passes, proceed to next step
      setActiveStep(activeStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateVenueForm(formData);
    setFormErrors(errors);


  if (hasErrors(errors)) {
    displayValidationErrors(errors);
    return;
  }
    // For this non-validating version, we'll proceed regardless of errors
    setIsSubmitting(true);
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

        if (newVenueId && formData.amenities && formData.amenities.length > 0) {
            const amenityInserts = formData.amenities.map(({ id, quantity, description }) => ({
                venue_id: newVenueId,
                amenity_id: id,
                quantity,
                description,
            }));

            const { error: amenitiesError } = await supabase
                .from("venue_amenities")
                .insert(amenityInserts);

            if (amenitiesError) throw amenitiesError;
        }

        alert("Venue successfully created!");
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
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
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
        return "Select the amenities your venue offers. You can add quantities and descriptions for each.";
      default:
        return "";
    }
  };

  return (
    <div className="mx-10 font-sofia">
      <div className='col-span-2'>
        <section className='flex justify-between items-center my-4 sticky top-0'>
          <div className='flex items-center'>
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </section>
      </div>
      <section className='bg-white  md:p-10 rounded-3xl dark:bg-gray-900'>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create Your Venue</h1>
          <p className="text-gray-600 mt-2">Complete the following steps to create your venue</p>
        </div>
        
        {/* Step Counter */}
        <div className="text-center mb-2">
          <span className="font-semibold text-indigo-600">Step {activeStep} of {totalSteps}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-in-out"
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
                  ? 'font-bold text-indigo-600 border-b-2 border-indigo-600' 
                  : activeStep > step.number 
                  ? 'text-green-600' 
                  : 'text-gray-400'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 mb-2 rounded-full ${
                  activeStep === step.number 
                    ? 'bg-indigo-100 text-indigo-600 border border-indigo-600' 
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
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">{getStepMessage()}</p>
              <p className="text-xs mt-1 text-blue-500">Don't worry! You can edit all information after creating your venue.</p>
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

        {/* Step 4: Amenities */}
        {activeStep === 4 && (
          <div className="transition-opacity duration-500 ease-in-out">
            <div className="shadow-lg bg-white p-6 border border-gray-300 rounded-3xl mb-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Venue Amenities</h2>
              <p className="text-gray-600 mb-6">Select the amenities your venue offers to guests</p>
              
              {amenitiesLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : amenitiesError ? (
                <div className="text-red-500">Error: {amenitiesError}</div>
              ) : amenities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {amenities.map((amenity) => {
                    const venueAmenity = formData.amenities.find(a => a.id === amenity.id);
                    return (
                      <div key={amenity.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!venueAmenity}
                            onChange={() => handleCheckboxChange(amenity)}
                            className="w-5 h-5 text-indigo-600"
                          />
                          <span className="font-medium text-gray-800">{amenity.name}</span>
                        </label>

                        {venueAmenity && (
                          <div className="ml-7 mt-3 space-y-3">
                            <div>
                              <label className="block text-sm text-gray-600">Quantity:</label>
                              <input
                                type="number"
                                min="0"
                                placeholder="How many?"
                                value={venueAmenity.quantity ?? ''}
                                onChange={(e) => 
                                  handleAmenityChange(
                                    amenity.id, 
                                    'quantity', 
                                    e.target.value ? parseInt(e.target.value) : null
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600">Description:</label>
                              <textarea
                                placeholder="Add details about this amenity..."
                                value={venueAmenity.description ?? ''}
                                onChange={(e) => 
                                  handleAmenityChange(amenity.id, 'description', e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                rows={2}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">No amenities found.</div>
              )}
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
                : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Previous
          </button>

          {activeStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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