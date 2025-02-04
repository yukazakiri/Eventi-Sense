import React, { useEffect, useState } from 'react';
import  supabase  from '../../../api/supabaseClient'; // Adjust based on your supabase setup
import { useNavigate } from 'react-router-dom'; // Navigate to specific venue page

interface Venue {
  id: string;
  name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  location: string;
  phone_number: string;
  email: string;
  website: string;
  capacity: number;
  description: string;
  venue_type: string;
  created_at: string;
  company_id: string;
}

const CompanyVenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyProfile, setCompanyProfile] = useState<any>(null); // Replace with your actual company profile object
  const navigate = useNavigate();

  // Assuming you're fetching the company profile from context or Supabase authentication
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // Get the logged-in user
      if (user) {
        // Fetch company profile based on the logged-in user (replace this with your actual logic)
        const { data: profileData, error: profileError } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', user.id) // Assuming you have a user_id column
          .single();

        if (profileError) {
          console.error('Error fetching company profile:', profileError);
          setError('An error occurred while fetching the company profile.');
        } else {
          setCompanyProfile(profileData);
        }
      }
    };

    fetchCompanyProfile();
  }, []);

  useEffect(() => {
    if (companyProfile?.id) {
      const fetchVenues = async () => {
        try {
          const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('company_id', companyProfile.id); // Use the companyProfile.id

          if (error) {
            throw error;
          }

          setVenues(data);
        } catch (err) {
          console.error('Error fetching venues:', err);
          setError('An error occurred while fetching venues.');
        } finally {
          setLoading(false);
        }
      };

      fetchVenues();
    }
  }, [companyProfile]); // Run again when companyProfile changes

  const handleVenueClick = (venueId: string) => {
    navigate(`/Venue-Manager-Dashboard/Venue/${venueId}`); // Navigate to the venue detail page
  };

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Venues for Your Company</h1>
      {venues.length > 0 ? (
        <ul>
          {venues.map((venue) => (
            <li key={venue.id} onClick={() => handleVenueClick(venue.id)}>
              <h2>{venue.name}</h2>
              <p>{venue.location}</p>
              <p>{venue.address_street}, {venue.address_city}, {venue.address_state}, {venue.address_zip}</p>
              <p>Capacity: {venue.capacity}</p>
              <p>Type: {venue.venue_type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No venues found for your company.</p>
      )}
    </div>
  );
};

export default CompanyVenuesPage;
