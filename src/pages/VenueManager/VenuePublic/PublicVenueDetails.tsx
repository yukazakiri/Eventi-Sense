import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { useEffect, useRef, useState } from 'react';
import { Venue, VenueImage } from '../../../types/venue';
import { VenueAmenity, Amenity, CompanyProfile } from '../../../types/venue';
import MainNavbar from '../../../layout/MainNavbar';
import { BsArrowDownLeft } from "react-icons/bs";
import Button from '../../../components/Button/button';
import { IoIosSend } from "react-icons/io";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CustomModal from '../../../assets/modal/publicalendarmodal';
import { TiLocation } from "react-icons/ti";
import { LuAccessibility } from "react-icons/lu";
import { IoPricetagsOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";



interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

const PublicVenueDetails: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();  // venueId is now guaranteed to be a string
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueAmenities, setVenueAmenities] = useState<VenueAmenity[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [venueImages, setVenueImages] = useState<VenueImage[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [_selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);
  const [currentView] = useState('dayGridMonth');
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!venueId) return;

      try {
        setLoading(true);

        const [
          { data: venueData, error: venueError },
          { data: venueAmenitiesData, error: venueAmenitiesError },
          { data: amenitiesData, error: amenitiesError },
          { data: venueImagesData, error: venueImagesError },
        ] = await Promise.all([
          supabase.from('venues').select(`
            *,
            venue_types (name),
            venue_accessibilities (name),
            venue_pricing_models (name)
          `).eq('id', venueId).single(),

          supabase.from('venue_amenities').select('*').eq('venue_id', venueId),
          supabase.from('amenities').select('id, name'),
          supabase.from('venue_images').select('*').eq('venue_id', venueId),
        ]);

        if (venueError) throw venueError;
        if (venueAmenitiesError) throw venueAmenitiesError;
        if (amenitiesError) throw amenitiesError;
        if (venueImagesError) throw venueImagesError;

        setVenue(venueData);
        setVenueAmenities(venueAmenitiesData || []);
        setAmenities(amenitiesData || []);
        setVenueImages(venueImagesData || []);

        if (venueData?.company_id) {
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

      } catch (err: any) {
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
        console.error("Error fetching events:", error.message);
        return;
      }

      if (data) {
        const eventsForCalendar = data.map((event: any): AvailabilityEvent => ({
          id: event.id,
          title: event.title || 'Not_Available',
          start: event.available_start,
          end: event.available_end,
        }));
        setEvents(eventsForCalendar);
      } else {
        setEvents([]);
      }

    } catch (error) {
      console.error("Error in fetchEvents:", error);
    }
  };

  const handleEventClick = (info: any) => {
    const clickedEventId = info.event.id;
    const originalEvent = events.find(event => event.id === clickedEventId);

    if (originalEvent) {
      setSelectedEvent(info.event);
      setSelectedDate(new Date(info.event.start));

      const startTime = new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const title = originalEvent.title;

      const content = `<b>${title}</b>: ${startTime} - ${endTime}`;
      setModalContent(content);
      setIsModalOpen(true);
    } else {
      console.error("Event not found!");
    }
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);

    const clickedEvents = events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const clickedStart = info.date;
      const clickedEnd = new Date(info.date);
      clickedEnd.setDate(info.date.getDate() + 1);

      return eventStart < clickedEnd && eventEnd > clickedStart &&
        eventStart.getDate() === clickedStart.getDate();
    });

    if (clickedEvents.length > 0) {
      const eventTimes = clickedEvents.map(event => {
        const startTime = new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${startTime} - ${endTime}`;
      }).join("<br/>");
      setModalContent(`Unavailable Times:<br/>${eventTimes}`);
    } else {
      setModalContent("No unavailability set for this day.");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    setError('');
    setSuccessMessage('');
  };

  if (error) return <div>{error}</div>;
  if (loading) return <div>Loading...</div>;

  if (!venue) return <div>Venue not found.</div>;

    return (
      <>
      <MainNavbar />
      <div className="overflow-hidden bg-slate-50">
        <div className="bg-orange-50 max-w-[90rem] mx-auto my-[2rem] md:my-[10rem] pb-[2rem] md:pb-[10rem] rounded-2xl shadow-lg">
          {/* Venue Cover Image Section */}
          <div className="relative overflow-hidden">
            {venue?.cover_image_url && (
              <div className="relative">
                <img
                  src={venue.cover_image_url}
                  alt={venue.name}
                  className="h-[600px] w-full object-cover rounded-t-3xl"
                />
                {/* Top Section with Company Logo and Check Availability Button */}
                <section className="absolute top-5 w-full z-30">
                  <div className="flex justify-between">
                    <div className="cursor-pointer flex items-center bg-white text-white bg-opacity-50 rounded-xl m-4 py-2 px-4 font-bonanova shadow-lg hover:bg-opacity-70 hover:text-gray-100 hover:border-gray-300 transition duration-300 ease-in-out transform hover:scale-110">
                      {companyProfile?.company_logo_url && (
                        <img
                          src={companyProfile.company_logo_url}
                          alt={companyProfile.company_name}
                          className="h-10 w-10 rounded-full mr-2"
                        />
                      )}
                      <button>{companyProfile?.company_name}</button>
                    </div>
                    <div
                      onClick={() => {
                        const availabilitySection = document.getElementById('availability-section');
                        if (availabilitySection) {
                          availabilitySection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="group cursor-pointer flex items-center bg-white text-white bg-opacity-50 rounded-xl m-4 py-2 px-4 font-bonanova shadow-lg hover:bg-opacity-70 hover:text-gray-100 hover:border-gray-300 transition duration-300 ease-in-out transform hover:scale-110"
                    >
                      <div className="p-2 group-hover:bg-gray-400 rounded-full mr-2">
                        <BsArrowDownLeft size={20} />
                      </div>
                      <button>Check Availability</button>
                    </div>
                  </div>
                </section>
                {/* Overlay and Venue Details */}
                <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 text-white z-10">
                  <div className="text-center">
                    <h2 className="font-bonanova gradient-text text-3xl lg:text-4xl xl:text-5xl leading-tight">
                      {venue?.name}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl xl:text-2xl mt-2 md:mt-4 font-sofia max-w-[40rem]">
                      {venue?.description}
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button
                        label="Book Now"
                        gradientText={true}
                        variant="primary"
                        onClick={() => navigate(`/venues/${venueId}/book`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
    
          {/* Venue Details Section */}
          <section className="font-sofia ">
            {/* Venue Types and Pricing */}
            <section className='mx-4 md:mx-8 lg:mx-12 xl:mx-24 mt-8'>
              <div className=' border-b-2 border-gray-600 py-8'>
              <ul className="flex  bg-sky-100  rounded-full py-1 w-fit mb-2">
                {venue.venue_types?.map((vt, index) => (
                  <li key={vt.id || index} className=" px-2 text-sky-700">
                    {vt.name}{', '}
                  </li>
                ))}
              </ul>
              <p className="bg-green-100 text-green-700  w-fit rounded-full px-2 mb-1 py-1 ">
                PHP {venue?.price}
              </p>
              <p className='text-gray-700 flex items-center text-[4rem] font-bonanova ml-2' >
                {venue?.name}
              </p>
              <p className='text-gray-500 flex items-center'>
                <TiLocation className="mr-1 mb-1" />{venue?.address_street}, {venue?.address_city}, {venue?.address_state} {venue?.address_zip}
              </p>
            </div>
              <div className="md:mt-20 md:mb-10 my-4 flex justify-center items-center  ">
              <div className="font-bonanova text-2xl lg:text-3xl xl:text-[3rem] text-gray-700 font-medium">
                Giving the best just for you
              </div>
        
            </div>   
                  {/* Venue Amenities */}
              <div className="flex items-center justify-center mx-auto mb-8">
              <div className="flex justify-center gap-4 text-gray-600">
                {venueAmenities.map((venueAmenity) => (
                  <div
                    key={venueAmenity.amenity_id}
                    className="rounded-full px-8 py-2 border border-gray-600 border-t-2  group relative font-sofia text-center cursor-pointer transition duration-300 ease-in-out hover:scale-110"
                  >
                    <h4 className="uppercase text-[13px]">
                      {amenities.find((a) => a.id === venueAmenity.amenity_id)?.name}
                    </h4>
                    <div className="absolute -top-5 right-0 translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-md z-10">
                      <div>
                        <p className="text-gray-600">Description: {venueAmenity.description}</p>
                        <p className="text-gray-600">Quantity: {venueAmenity.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          
            <section className='mb-4'>
              <div className="grid grid-cols-3 font-sofia gap-2">
              <div className="p-2 py-12 group hover:shadow-xl transition duration-300 ease-in-out group-hover:scale-110">
                  <div className="flex items-center justify-center">
                    <BsPeople className="text-[4rem] p-2 border border-orange-200 text-orange-300 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
                  </div>
                  <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
                    <div>
                    <h3 className="flex justify-center items-center text-gray-700 text-xl font-bonanova mb-1"> Capacity:</h3>
                    <p className="pl-1 text-justify text-gray-600">{' '}
                   {venue?.capacity}
                    </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2 py-12 group  hover:shadow-xl transition duration-300 ease-in-out group-hover:scale-110 ">
                  <div className="flex items-center justify-center">
                    <LuAccessibility className="text-[4rem] p-2 border border-orange-200 text-orange-300 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
                  </div>
                  <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
                    <div>
                    <h3 className="flex justify-center items-center text-gray-700 text-xl font-bonanova mb-1"> Accessibility:</h3>
                    <p className=" text-center text-gray-600">{' '}
                    {venue.venue_accessibilities?.map((va, index) => (
                    <span key={va.id || index}>{va.name}{', '}</span>
                  ))}
                    </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 py-12 group  hover:shadow-xl transition duration-300 ease-in-out group-hover:scale-110 ">
                  <div className="flex items-center justify-center">
                    <IoPricetagsOutline className="text-[4rem] p-4 border border-orange-200 text-orange-300 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
                  </div>
                  <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
                    <div>
                    <h3 className="flex justify-center items-center text-gray-700 text-xl font-bonanova mb-1">Pricing Models</h3>
                    <p className="  text-center text-gray-600">{' '}
                      {venue.venue_pricing_models?.map((vpm, index) => (
                        <span key={vpm.id || index}>{vpm.name}{', '}</span>
                      ))}
                    </p>
                    </div>
                  </div>
                </div>
               
              </div>
            </section>
       
           </section>
            {/* Venue Description and Message Button */}
           
    
      
    
            {/* Venue Gallery */}
            <div className="mx-2 mb-12 ">
     
              <div className="masonry columns-2 md:columns-3">
                {venueImages.length > 0 ? (
                  venueImages.map((venueImage) => (
                    <div key={venueImage.id} className="relative group break-inside-avoid mb-8">
                      <img src={venueImage.image_url} className="w-full h-auto " />
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-200 rounded-md p-4 flex items-center justify-center">
                    <p className="text-gray-600">No images found</p>
                  </div>
                )}
              </div>
            </div>
    
            {/* Venue Information Grid */}
            <section className='bg-slate-50'>
            
              <div className='mx-4 md:mx-8 lg:mx-12 xl:mx-24 mt-8 py-8 grid md:grid-cols-2'>
              <section>
                <h1 className='text-gray-700 flex items-center text-[3rem] font-bonanova ml-2'>Celebrate with us....</h1>
                <p className='text-gray-500 ml-5 md:my-4'>
                Unlock an exclusive experience at <span className='font-bonanova text-lg text-orange-400'>{venue?.name}.</span>  Discover our latest events, special offers, behind-the-scenes glimpses, and stories from those who've made memories here.</p>
                <div className='ml-4 my-2'>
                <div className='mb-1 flex'>
                  
                  <p className='pl-1 text-gray-500'>
                   <span className='font-bonanova text-gray-600 text-lg'> Phone: </span>{venue?.phone_number}
                  </p>
                </div>
                <div className='mb-1 flex'>
                  
                  <a href={`mailto:${venue?.email}`} className=' text-gray-500'>
                  <p className='pl-1 text-gray-500'>
                   <span className='font-bonanova text-gray-600 text-lg'> Email: </span>{venue?.email}
                  </p>
                  </a>
                </div>
                <div className='mb-1 flex'>
                  
                  <a href={venue?.website} target="_blank" rel="noopener noreferrer" className=' text-gray-500'>
                  <p className='pl-1 text-gray-500'>
                    <span className='font-bonanova text-gray-600 text-lg'> Website: </span>{venue?.website}
                  </p>
                  </a>
                </div>
                </div>
              </section>
              <section className='flex flex-col justify-center items-center '>
                <div className=''>
                  <button className="flex group p-2 px-6 font-sofia bg-gray-700 text-gray-100 border hover:border-slate-100 rounded-sm shadow-md transition duration-300 ease-in-out hover:scale-110">
                    <IoIosSend className="text-[1.5rem] group-hover:text-yellow-500" />
                    <span className="text-center text-[15px] mx-2 uppercase">Message Us for info </span>
                  </button>
                </div>
                <div className='my-2'>
                  or
                </div>
                <div>
                  <button
                     onClick={() => navigate(`/venues/${venueId}/book`)}
                   className="flex group p-2 px-6 font-sofia bg-gray-700 text-gray-100 border hover:border-slate-100 rounded-sm shadow-md transition duration-300 ease-in-out hover:scale-110">
                  <BsFillCalendar2CheckFill className="text-[1.5rem] group-hover:text-yellow-500" />
                    <span className="text-center text-[15px] mx-2 uppercase">Request a Booking</span>
                  </button>
                </div>
              </section>
              </div>
              
           
            </section>
    
            {/* Availability Calendar Section */}
            <section id="availability-section" className="my-[4rem] mx-[4rem] font-sofia">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={events}
                eventColor="#043677"
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height={600}
              />
            </section>
          </section>
    
          {/* Custom Modal */}
          <CustomModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="Venue Availability"
            modalContent={modalContent}
            selectedEvent={selectedEvent}
            error={error}
            setError={setError}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
        </div>
    
       
      </div>
    
    </>
    );
};

export default PublicVenueDetails;


