import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { VenueFormData, Amenity } from '../../../types/venue';

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

  const [companies, setCompanies] = useState<any[] | null>(null);
  const [amenities, setAmenities] = useState<Amenity[] | null>(null);
  const [companiesLoading, setCompaniesLoading] = useState<boolean>(true);
  const [amenitiesLoading, setAmenitiesLoading] = useState<boolean>(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [amenitiesError, setAmenitiesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState<any | null>(null);
  const [companyProfile, setCompanyProfile] = useState<any | null>(null);
  const [companyProfileLoading, setCompanyProfileLoading] = useState(true);
  const [companyProfileError, setCompanyProfileError] = useState<string | null>(null);


useEffect(() => {
    const fetchUserAndCompanyProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("User:", user);
  
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
  
      if (user) {
        setUser(user);
        fetchCompanyProfile(user.id); // Fetch company profile using user.id
      }
    };
  
    fetchUserAndCompanyProfile();
  }, []);
  
  const fetchCompanyProfile = async (userId: string) => {
    setCompanyProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("id, company_name") // Fetch specific fields
        .eq("id", userId) // Using user.id as primary key
        .single();
  
      if (error) throw error;
  
      if (data) {
        console.log("Company Profile ID:", data.id); // This is the company_profiles.id
        setCompanyProfile(data);
  
        // If you need to store it in form data
        setFormData((prevData) => ({
          ...prevData,
          company_id: data.id, // Store company profile ID
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
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase.from('company_profiles').select('id, company_name');
        if (error) {
          console.error("Error fetching companies:", error);
          setCompaniesError(error.message);
        } else {
          setCompanies(data);
        }
      } finally {
        setCompaniesLoading(false);
      }
    };

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

    fetchCompanies();
    fetchAmenities();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      amenities: checked
        ? [...prevData.amenities, value]
        : prevData.amenities.filter((amenity) => amenity !== value),
    }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      company_id: companyId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Exclude 'amenities' from venueData before inserting into 'venues'
      const { amenities, ...venueData } = formData;
  
      console.log("Submitting venue data:", venueData);
  
      // Insert venue (without amenities)
      const { data: newVenueData, error: venueError } = await supabase
        .from("venues")
        .insert([venueData])
        .select("id")
        .single(); // Get single record
  
      if (venueError) {
        console.error("Error inserting venue:", venueError);
        alert("Failed to create venue. Please try again.");
        return;
      }
  
      const venueId = newVenueData?.id;
  
      if (!venueId) {
        alert("Venue ID not found after insert.");
        return;
      }
  
      // Insert amenities (if any)
      if (amenities?.length > 0) {
        const amenityInserts = amenities.map((amenityId) => ({
          venue_id: venueId,
          amenity_id: amenityId,
        }));
  
        const { error: amenitiesError } = await supabase
          .from("venue_amenities")
          .insert(amenityInserts);
  
        if (amenitiesError) {
          console.error("Error inserting amenities:", amenitiesError);
          alert("Failed to add amenities, but the venue was created.");
        }
      }
  
      navigate('/Venue-Manager-Dashboard/Venue-List'); // Redirect to venue list`);
    } catch (error) {
      console.error("Error during venue submission:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
 
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="address_street">Street Address:</label>
      <input
        type="text"
        name="address_street"
        value={formData.address_street}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="address_city">City:</label>
      <input
        type="text"
        name="address_city"
        value={formData.address_city}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="address_state">State:</label>
      <input
        type="text"
        name="address_state"
        value={formData.address_state}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="address_zip">Zip Code:</label>
      <input
        type="text"
        name="address_zip"
        value={formData.address_zip}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="location">Location:</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="phone_number">Phone Number:</label>
      <input
        type="text"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="website">Website:</label>
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleInputChange}
      />

      <label htmlFor="capacity">Capacity:</label>
      <input
        type="number"
        name="capacity"
        value={formData.capacity}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="description">Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="venue_type">Venue Type:</label>
      <input
        type="text"
        name="venue_type"
        value={formData.venue_type}
        onChange={handleInputChange}
        required
      />


      {/* Company Profile Display (Conditional) */}
      {companyProfileLoading ? (
        <div>Loading company profile...</div>
      ) : companyProfileError ? (
        <div>Error: {companyProfileError}</div>
      ) : companyProfileError ? (
        <div>Error: {companyProfileError}</div>
      ) : companyProfile ? null : (
        <div>No company profile found for this user.</div>
      )}

     {/* Company Name Display */}
<label htmlFor="company_id">Company:</label>
{companyProfileLoading ? (
  <div>Loading company...</div>
) : companyProfileError ? (
  <div>Error: {companyProfileError}</div>
) : companyProfile ? (
  <input
    type="text"
    id="company_id"
    value={companyProfile.company_name} // Show the company name
    readOnly // Make it non-editable
  />
) : (
  <div>No company found.</div>
)}

      <label>Amenities:</label>
      {amenitiesLoading ? (
        <div>Loading amenities...</div>
      ) : amenitiesError ? (
        <div>Error: {amenitiesError}</div>
      ) : (
        amenities?.map((amenity) => (
          <label key={amenity.id}>
            <input
              type="checkbox"
              value={amenity.id}
              checked={formData.amenities.includes(amenity.id)}
              onChange={handleCheckboxChange}
            />
            {amenity.name}
          </label>
        ))
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Venue'}
      </button>
    </form>
  );
};

export default VenueForm;