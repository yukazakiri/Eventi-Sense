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
    capacity: 0,
    description: '',
    venue_type: '',
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

    fetchUserAndCompanyProfile();
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
      let newVenueId = venueId; 

      // Always create the venue first
      const { amenities, ...venueData } = formData;
      const { data: newVenueData, error: venueError } = await supabase
        .from("venues")
        .insert([venueData])
        .select("id")
        .single();

      if (venueError) throw venueError;
      newVenueId = newVenueData?.id;
      if (!newVenueId) throw new Error("Venue ID not found");

      setVenueId(newVenueId);

      // Upload cover photo after venue creation
      if (selectedFile && newVenueId) {
        await handleUpload(newVenueId);
      }

      // Insert amenities
      if (newVenueId && formData.amenities.length > 0) {
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
  return (
    <div className="max-w-7xl mx-auto my-[6rem] font-sofia">
  
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
              isEditing={isEditing}
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
