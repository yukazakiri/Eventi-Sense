import { useParams } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { useEffect, useState } from 'react';
import { Venue, VenueImage } from '../../../types/venue';
import { VenueAmenity, Amenity, CompanyProfile } from '../../../types/venue';
import MainNavbar from '../../../layout/MainNavbar';
import { BsArrowDownLeft } from "react-icons/bs";

const PublicVenueDetails: React.FC = () => {
    const { venueId } = useParams<{ venueId: string }>();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [venueAmenities, setVenueAmenities] = useState<VenueAmenity[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [venueImages, setVenueImages] = useState<VenueImage[]>([]);
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!venueId) return;

            try {
                setLoading(true);

                const [{ data: venueData, error: venueError }, { data: venueAmenitiesData, error: venueAmenitiesError }, { data: amenitiesData, error: amenitiesError }, { data: venueImagesData, error: venueImagesError }] = await Promise.all([
                    supabase.from('venues').select('*').eq('id', venueId).single(),
                    supabase.from('venue_amenities').select('*').eq('venue_id', venueId),
                    supabase.from('amenities').select('id, name'),
                    supabase.from('venue_images').select('*').eq('venue_id', venueId)
                ]);

                if (venueError) throw venueError;
                if (venueAmenitiesError) throw venueAmenitiesError;
                if (amenitiesError) throw amenitiesError;
                if (venueImagesError) throw venueImagesError;

                setVenue(venueData);
                setVenueAmenities(venueAmenitiesData || []);
                setAmenities(amenitiesData || []);
                setVenueImages(venueImagesData || []);

                if (venueData && venueData.company_id) {
                    const { data: companyProfileData, error: companyProfileError } = await supabase
                        .from('company_profiles')
                        .select('*')
                        .eq('id', venueData.company_id)
                        .single();

                    if (companyProfileError) {
                        console.error("Error fetching company profile:", companyProfileError);
                        setError("Error fetching company profile.");
                    } else {
                        setCompanyProfile(companyProfileData);
                    }
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [venueId]);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Loading...</div>;

    return (
      <>
      <MainNavbar/>
     <div className="  overflow-hidden bg-slate-50"> {/* Added overflow-hidden */}
      <div className='bg-white max-w-[90rem] mx-auto my-[2rem] md:my-[10rem] rounded-2xl shadow-lg'>

        {/* Make the image and text responsive */}
<div className="relative rounded-2xl overflow-hidden  md:mx-8 pt-[4rem]">
  {venue?.cover_image_url && (
    <div className="relative">
      <img
        src={venue.cover_image_url}
        alt={venue.name}
        className="h-full w-full object-cover rounded-3xl"
      />
      <div className='absolute top-5 left-5 z-30 cursor-pointer flex items-center bg-white text-white bg-opacity-50 rounded-xl m-4 py-2 px-4 font-bonanova shadow-lg hover:bg-opacity-70 hover:text-gray-100 hover:border-gray-300 transition duration-300 ease-in-out transform hover:scale-110'>
        {companyProfile?.company_logo_url && (
          <img
            src={companyProfile.company_logo_url}
            alt={companyProfile.company_name}
            className="h-10 w-10 rounded-full mr-2"
          />
        )}
        <button className="">
          {companyProfile?.company_name}
        </button>
      </div>
      <div
       onClick={() => {
        const availabilitySection = document.getElementById('availability-section');
        if (availabilitySection) {
          availabilitySection.scrollIntoView({ behavior: 'smooth' });
        }
      }}
       className='absolute group top-5 right-5 z-30 cursor-pointer flex items-center bg-white text-white bg-opacity-50 rounded-xl m-4 py-2 px-4 font-bonanova shadow-lg hover:bg-opacity-70 hover:text-gray-100 hover:border-gray-300 transition duration-300 ease-in-out transform hover:scale-110'>
        <div className='p-2 group-hover:bg-gray-400 rounded-full mr-2'> 
          <BsArrowDownLeft className="" size={20} />
        </div> 
      <div className='flex'>
        <button 
         
        >
          Check Availability
          
        </button>
      
       </div>

      </div>
      <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 text-white z-10">
        <div className="text-center">
          <h2 className="font-bonanova text-2xl  md:text-3xl lg:text-4xl xl:text-5xl leading-tight">
            {venue?.name}
          </h2>
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl mt-2 md:mt-4">
            {venue?.description}
          </p>
          <button className="mt-4 px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition duration-300">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )}
</div>
            {/* ... Venue Details ... */}
            <div id='availability-section' className="flex flex-row justify-center">
               
                <div className="flex flex-col w-1/2">
                    <h3 className="text-2xl font-bold">Amenities:</h3>
                    <ul className="list-disc pl-4">
                        {venueAmenities.map(venueAmenity => (
                            <li key={venueAmenity.amenity_id}>
                                {amenities.find(a => a.id === venueAmenity.amenity_id)?.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                {venueImages.map(venueImage => (
                    <img key={venueImage.id} src={venueImage.image_url} className="w-full h-auto" />
                ))}
            </div>

            {/* Company Profile Display */}
            {companyProfile && (
                <div className="mt-4">
                    <h3 className="text-2xl font-bold">Company Profile:</h3>
                    <p>{companyProfile.company_name}</p>
                    {/* ... other company profile details ... */}
                </div>
            )}
        </div>
      </div>
        </>
    );
};

export default PublicVenueDetails;
