import { useParams } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { useEffect, useState } from 'react';
import { Venue, VenueImage } from '../../../types/venue';
import { VenueAmenity, Amenity, CompanyProfile } from '../../../types/venue';
import MainNavbar from '../../../layout/MainNavbar';
import { BsArrowDownLeft } from "react-icons/bs";
import Button from '../../../components/Button/button';
import { IoIosSend } from "react-icons/io";
import { MdPhone, MdEmail, MdLink, MdBusiness, MdPeople } from 'react-icons/md'; // Import icons
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}
const PublicVenueDetails: React.FC = () => {
    const { venueId } = useParams<{ venueId: string }>();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [venueAmenities, setVenueAmenities] = useState<VenueAmenity[]>([]);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [venueImages, setVenueImages] = useState<VenueImage[]>([]);
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
      const [calendarEvents, setCalendarEvents] = useState<AvailabilityEvent[]>([]);

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
    useEffect(() => {
      if (venueId) {
        fetchAvailabilities();
      }
    }, [venueId]);
  
    const fetchAvailabilities = async () => {
      try {
        const { data, error } = await supabase
          .from("venue_availability")
          .select("*")
          .eq("venue_id", venueId);
  
        if (error) {
          throw new Error(`Error fetching availabilities: ${error.message}`);
        }
  
        const events = data?.map((availability: any): AvailabilityEvent => ({
          id: availability.id,
          title: 'Not_Available',
          start: availability.available_start,
          end: availability.available_end,
        })) || [];
  
        setCalendarEvents(events);
      } catch (error) {
        console.error(error);
      }
    };
  

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
        className="h-[600px] w-full object-cover rounded-3xl"
      />
      <section className='absolute top-5 w-full z-30 '>
        <div className='flex justify-between'>
      <div className='cursor-pointer flex items-center bg-white text-white bg-opacity-50 rounded-xl m-4 py-2 px-4 font-bonanova shadow-lg hover:bg-opacity-70 hover:text-gray-100 hover:border-gray-300 transition duration-300 ease-in-out transform hover:scale-110'>
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
       className=' group  cursor-pointer flex items-center bg-white text-white bg-opacity-50 rounded-xl m-4 py-2 px-4 font-bonanova shadow-lg hover:bg-opacity-70 hover:text-gray-100 hover:border-gray-300 transition duration-300 ease-in-out transform hover:scale-110'>
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
     </div>
   </section>
      <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 text-white z-10">
        <div className="text-center">
          <h2 className="font-bonanova gradient-text text-3xl lg:text-4xl xl:text-5xl leading-tight">
            {venue?.name}
          </h2>
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl mt-2 md:mt-4 font-sofia max-w-[40rem]">
            {venue?.description}
          </p>
          <div className='flex justify-center mt-4'>  
          <Button
           label="Book Now"
            gradientText={true} // Gradient text
            variant="primary"
            onClick={() => {
              // Implement booking logic here
              console.log('Booking clicked');
            }}
            />
          </div>
        </div>
      </div>
    </div>
  )}
</div>
<section className= "mx-4 md:mx-8 lg:mx-16 xl:mx-24 ">

  <div className='md:mt-20 md:mb-14 my-4  flex justify-between'>
    <div className='font-bonanova text-3xl lg:text-4xl xl:text-[4rem] text-gray-700 font-medium  '><div>Giving the </div><div className='mt-4'> best just for you</div>  </div>
<button className="flex flex-col  items-center justify-center group rounded-full p-2 font-sofia bg-gray-700 text-gray-100 border border-yellow-500 shadow-md transition duration-300 ease-in-out hover:scale-110">
<IoIosSend className='text-[1.5rem] group-hover:text-yellow-500'/>
  <span className="text-center text-[12px] mx-2">Message Us</span>
</button>
  </div>
            {/* ... Venue Details ... */}
            <div  className="flex items-center justify-center mx-auto  ">
               
 <div className="grid grid-cols-2 lg:grid-cols-4 justify-center gap-4 ">
  {venueAmenities.map(venueAmenity => (
    <div
      key={venueAmenity.amenity_id}
      className="rounded-full px-8 py-2 border border-gray-600 border-t-2 hover:border-yellow-500 hover:bg-gray-700 hover:text-white group relative font-sofia text-center cursor-pointer transition duration-300 ease-in-out hover:scale-110"
    >
      <h4 className="uppercase text-[13px]">{amenities.find(a => a.id === venueAmenity.amenity_id)?.name}</h4>
      <div className="absolute -top-5 right-0 translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-md z-10 ">
      <div className=' '>
        <p className="text-gray-600">Description: {venueAmenity.description}</p>
        <p className="text-gray-600">Quantity: {venueAmenity.quantity}</p>
        </div>
      </div>
    </div>
  ))}
</div>
            </div>
<div className='mx-2 my-10 '>
  <h1 className='text-[1.5rem] font-bonanova text-gray-700 my-4  '>From Our Gallery</h1>
            <div className="masonry columns-2 md:columns-3">
                {venueImages.length > 0 ? (
                    venueImages.map(venueImage => (
                      <div key={venueImage.id} className="relative group break-inside-avoid mb-8">
                        <img src={venueImage.image_url} 
                         className="w-full h-auto rounded-lg"
                          />
                      </div>
                    ))
                ) : (
                    <div className="bg-gray-200 rounded-md p-4 flex items-center justify-center">
                        <p className="text-gray-600">No images found</p>
                    </div>
                )}
            </div>
            </div>

     
<section className=" ">
  <div className="grid grid-cols-3 font-sofia">
    <div className="p-2 py-12 bg-gray-50  hover:border-yellow-600 flex justify-center items-center  group">
      <h1 className='font-bonanova text-[2rem] text-justify transition duration-300 ease-in-out group-hover:scale-110'>Celebrate with us</h1>
    </div>

   
      <div className="p-2 py-12 bg-gray-700  hover:border-yellow-600 group ">
      <div className="flex items-center justify-center text-yellow-500">
          <MdPeople className="text-[4rem] p-4 flex justify-center  border-[1px]   border-yellow-400  rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
          </div>
          <div className="flex justify-center items-center my-2 text-white transition duration-300 ease-in-out group-hover:scale-110">
          <p>Capacity:{venue?.capacity}</p>
        </div>
      </div>

      <div className="p-2 py-12  bg-gray-50   hover:border-yellow-600 group ">
        <div className="flex items-center justify-center">
          <MdPhone className="text-[4rem] p-4 border border-gray-600 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
        </div>  
        <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
        <p className="pl-4">Phone Number:{venue?.phone_number}</p>
      </div>
      </div>
 

      <div className="p-2 py-12 bg-gray-700  hover:border-yellow-600 group">
      <div className="flex items-center justify-center text-yellow-500">  
          <MdEmail className="text-[4rem] p-4  flex justify-center  border-[1px]   border-yellow-400 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
          </div>
          <div className="flex justify-center items-center my-2 text-white transition duration-300 ease-in-out group-hover:scale-110">
          <p>Email:{venue?.email}</p>
        </div>
      </div>
      <div className="p-2 py-12  bg-gray-50   hover:border-yellow-600 group">
      <div className="flex items-center justify-center">
          <MdLink className="text-[4rem] p-4  border flex justify-center  border-gray-600 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
          </div>
          <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
          <p>Website: {venue?.website}</p>
        </div>
      </div>
      <div className="p-2 py-12 bg-gray-700  hover:border-yellow-600 group">  
        <div className="flex items-center justify-center text-yellow-500">
          <MdBusiness className="text-[4rem] p-4   flex justify-center border-[1px]   border-yellow-400 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
          </div>
          <div className="flex justify-center items-center my-2 text-white transition duration-300 ease-in-out group-hover:scale-110">
          <p>Type: {venue?.venue_type}</p>
        </div>
      </div>
 


  </div>
</section>

<section id='availability-section' className='my-[4rem] mx-[4rem]'>
<FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventColor="#043677"
 
          height={600}
        />
</section>
</section>



        </div>
        
      </div>
        </>
    );
};

export default PublicVenueDetails;
