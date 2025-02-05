import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { VenueFormData, Amenity } from '../../../types/venue';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Venues', href: '/venues' },
  { label: 'Edit Venue', href: '' } // Current page (empty href)
];

// Updated interface for amenity form data
interface AmenityForm {
  id: string;
  quantity: number | null;
  description: string | null;
}
const VenueForm = () => {
  const navigate = useNavigate();

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
    capacity: 0,
    description: '',
    venue_type: '',
    amenities: [],
    company_id: '',
  });

  const [amenities, setAmenities] = useState<Amenity[]>([]); // Correct initialization
  const [amenitiesLoading, setAmenitiesLoading] = useState<boolean>(true);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState<any | null>(null);
  const [companyProfile, setCompanyProfile] = useState<any | null>(null);
  const [companyProfileLoading, setCompanyProfileLoading] = useState(true);
  const [companyProfileError, setCompanyProfileError] = useState<string | null>(null);

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
        .select("id, company_name")
        .eq("id", userId) // Correctly use user_id
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { amenities, ...venueData } = formData;

      // Insert venue
      const { data: newVenueData, error: venueError } = await supabase
        .from("venues")
        .insert([venueData])
        .select("id")
        .single();

      if (venueError) throw venueError;
      const venueId = newVenueData?.id;
      if (!venueId) throw new Error("Venue ID not found");

      // Insert amenities if any
      if (amenities.length > 0) {
        const amenityInserts = amenities.map(({ id, quantity, description }) => ({
          venue_id: venueId,
          amenity_id: id,
          quantity,
          description
        }));

        const { error: amenitiesError } = await supabase
          .from("venue_amenities")
          .insert(amenityInserts);

        if (amenitiesError) throw amenitiesError;
      }

      navigate('/Venue-Manager-Dashboard/Venue-List');
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className=" max-w-7xl mx-auto my-[6rem] font-sofia">
   
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
              type="submit" 
              disabled={isSubmitting}
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Venue'}
            </button>
          )}
        </div>
      </section>
    <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 gap-8'>
    <section className={`shadow-lg bg-white p-[2rem] col-span-2 ${isEditing ? 'border-indigo-400 border-2 rounded-lg' : ''}`}>
      <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company:</label>
      {companyProfileLoading ? (
        <div>Loading company...</div>
      ) : companyProfileError ? (
        <div>Error: {companyProfileError}</div>
      ) : companyProfile ? (
        <input 
        type="text" 
        id="company_id" 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        value={companyProfile.company_name} 
        readOnly 
        />
      ) : (
        <div>No company found.</div>
      )}
      </section>

      <section className={`shadow-lg bg-white p-[2rem] ${isEditing ? 'border-indigo-400 border-2 rounded-lg' : ''}`}>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Name:</label>
        <input 
        type="text" 
        name="name" 
        value={formData.name} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: The Grand Ballroom"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Phone Number:</label>
        <input 
        type="text" 
        name="phone_number" 
        value={formData.phone_number} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 555-555-1234"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Email:</label>
        <input 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: info@thegrandballroom.com"
        />
      </div> 
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Website:</label>
        <input 
        type="text" 
        name="website" 
        value={formData.website} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        readOnly={!isEditing}
        placeholder="Example: thegrandballroom.com"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Capacity:</label>
        <input 
        type="number" 
        name="capacity" 
        value={formData.capacity} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Description:</label>
        <textarea 
        name="description" 
        value={formData.description} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: This is a beautiful ballroom with a large dance floor and a capacity of 500 guests."
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Venue Type:</label>
        <input 
        type="text" 
        name="venue_type" 
        value={formData.venue_type} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: Ballroom"
        />
      </div>
      </section>

      <section className={`shadow-lg bg-white p-[2rem] ${isEditing ? 'border-indigo-400 border-2 rounded-lg ' : ''}`}>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Street Address:</label>
        <input 
        type="text" 
        name="address_street" 
        value={formData.address_street} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 123 Main Street"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">City:</label>
        <input 
        type="text" 
        name="address_city" 
        value={formData.address_city} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: New York"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">State:</label>
        <input 
        type="text" 
        name="address_state" 
        value={formData.address_state} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: NY"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Zip Code:</label>
        <input 
        type="text" 
        name="address_zip" 
        value={formData.address_zip} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 10001"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Location:</label>
        <input 
        type="text" 
        name="location" 
        value={formData.location} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: New York, NY"
        />
      </div>
      </section>

      <section className={`shadow-lg bg-white p-[2rem] col-span-2 ${isEditing ? 'border-indigo-400 border-2 rounded-lg ' : ''}`}>
      <label className="block mb-2 text-md font-medium text-gray-800">Amenities:</label>
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
      </section>
     
     
    </form>
  

    
    </div>
  );
};

export default VenueForm;