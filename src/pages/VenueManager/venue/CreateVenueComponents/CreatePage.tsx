import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../../api/supabaseClient';
import { VenueFormData, Amenity} from '../../../../types/venue';
import Breadcrumbs from '../../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/24/solid';
import CreateInfoVenueForm from './CreateInfo';
import CreateAddressVenueForm from './CreateAddress';
import { validateVenueForm, } from './FormValidation'; // Import validations
import CreatePhotoCover from './CreateCoverPhoto'



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
  const [formData, setFormData] = useState<VenueFormData>({ // Type the state
    name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    location: '', // Initialize all properties
    phone_number: '',
    email: '',
    website: '',
    capacity: '',
    accessibility: [],
    price: '',
    pricing_model: [],
    description: '',
    venue_type: [],
    amenities: [], // Initialize as an empty array
    company_id: '',
  });

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState<boolean>(true);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 

  const [_user, setUser] = useState<any | null>(null);
  const [_companyProfile, setCompanyProfile] = useState<any | null>(null);
  const [_companyProfileLoading, setCompanyProfileLoading] = useState(true);
  const [ _companyProfileError, setCompanyProfileError] = useState<string | null>(null);
  const [_formErrors, setFormErrors] = useState({});
  const [venueId, setVenueId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialImageUrl, _setInitialImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Move selectedFile state here
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
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


  useEffect(() => {
    const fetchUserAndCompanyProfile = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Error fetching user:", error);
            return;
        }

        if (user) {
            setUser(user);
            fetchCompanyProfile(user.id); // Keep this to set the company ID
        }
    };

    const fetchAllRelatedData = async () => {  // Moved outside
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

    // Call both functions concurrently
    fetchUserAndCompanyProfile();
    fetchAllRelatedData(); // Now called independently
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
      const filePath = `VenuesPhoto/CoverPhoto/${venueId}/${selectedFile.name}`; // Correct file path
      const {  error } = await supabase.storage
        .from('company_logos') // Your bucket name
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false // or true, depending on your needs
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



const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateVenueForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
        return;
    }

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

  return (
    <div className="max-w-screen-xl mx-auto my-[6rem] font-sofia">
  
      <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 gap-8'>
        <div className='col-span-2 '>
          <section className='flex justify-between items-center my-4'>
            <div className='flex items-center'>
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className='flex items-center'>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`text-white mx-4 ${isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
              >
                {isEditing ? 'Cancel ' : 'Create Venue'}
              </button>
              {isEditing && (
          <button
          type="submit" // Add this line
          disabled={isSubmitting} // Disable while submitting
          className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Venue'}
        </button>
              )}
            </div>
          </section>
        </div>
          <section>
          <div className='mb-8'>
          <CreateInfoVenueForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleMultiCheckboxChange={handleMultiCheckboxChange}
            isEditing={isEditing}
            accessibilities={accessibilities}
            pricingModels={pricingModels}
            venueTypes={venueTypes}
          />
          </div>
          <div>
          <CreatePhotoCover
            isEditing={isEditing}
            imageUrl={imageUrl}
            handleFileChange={handleFileChange}
            uploading={uploading}
            uploadError={uploadError}
            selectedFile={selectedFile}
          />
          </div>
          </section>
          <section >
            <div className='mb-8'>
                <CreateAddressVenueForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  isEditing={isEditing}
                />
            </div>
                 <div className={`shadow-lg bg-white p-[2rem]  ${isEditing ? 'border-indigo-400 border-2 rounded-lg ' : ''}`}>
      <label className="block mb-2 text-md font-medium text-gray-800">Amenities:</label>

      {/*formErrors.amenities && <p className="text-red-500">{formErrors.amenities}</p>*/}

      {amenitiesLoading ? (
        <div>Loading amenities...</div>
      ) : amenitiesError ? (
        <div>Error: {amenitiesError}</div>
      ) : amenities.length > 0 ? (
        amenities.map((amenity) => {
        const venueAmenity = formData.amenities.find(a => a.id === amenity.id);
        return (
          <div key={amenity.id} className="mb-3 p-2 border rounded">
          <label className="flex items-center gap-2">
            <input
            type="checkbox"
            checked={!!venueAmenity}
            onChange={() => handleCheckboxChange(amenity)}
            disabled={!isEditing}
            />
            <span className="font-medium">{amenity.name}</span>
          </label>

          {venueAmenity && (
            <div className="ml-6 mt-2 space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Quantity:</label>
              <input
              type="number"
              min="0"
              value={venueAmenity.quantity ?? ''}
              onChange={(e) => 
                handleAmenityChange(
                amenity.id, 
                'quantity', 
                e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="border rounded p-1"
              readOnly={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Description:</label>
              <textarea
              value={venueAmenity.description ?? ''}
              onChange={(e) => 
                handleAmenityChange(amenity.id, 'description', e.target.value)
              }
              className="border rounded p-1 w-full"
              rows={3}
              readOnly={!isEditing}
              />
            </div>
            </div>
          )}
          </div>
        );
        })
      ) : (
        <div>No amenities found.</div>
      )}
                </div>
          </section>
      
  
      </form>
    </div>
    
  );
};

export default VenueForm;
