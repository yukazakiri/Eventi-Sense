import {  useNavigate, useParams } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import { useEffect, useRef, useState } from 'react';
import { Venue, VenueImage } from '../types/venue';
import { VenueAmenity, Amenity, CompanyProfile } from '../types/venue';
import MainNavbar from '../layout/components/MainNavbar'

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CustomModal from '../assets/modal/publicalendarmodal';

import { LuAccessibility, LuDiamondPlus } from "react-icons/lu";

import PublicSocialLinks from './VenueManager/Social/PublicSocialLinks';
import { FiPhoneOutgoing } from "react-icons/fi";
import { MdOutlineDesignServices, MdOutlineMiscellaneousServices } from 'react-icons/md';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import {  HoverButton2  } from '../components/Button/button-hover';
import '../components/borderwave/Wave.css';
import { GoArrowDown,GoArrowUpRight } from "react-icons/go";
import { CgWebsite } from "react-icons/cg";
import { TbAddressBook } from "react-icons/tb";
import { RiMoneyDollarCircleLine,RiBuilding2Line  } from "react-icons/ri";
import { IoLogoBuffer } from "react-icons/io";


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
  const [_companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
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
    const [expandedAmenity, setExpandedAmenity] =  useState<any | null>(null);

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
  const toggleAmenity = (index:any) => {
    if (expandedAmenity === index) {
      setExpandedAmenity(null);
    } else {
      setExpandedAmenity(index);
    }
  };
  const scrollToTarget = () => {
    const targetElement = document.getElementById('targetSection');
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling
    }
};
    return (
      <>
      <MainNavbar />
      <div className='bg-[#2F4157]'>
      <div className="relative w-full h-screen  ">
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0 w-full h-screen ">
        {venue?.cover_image_url ? (
          <>
            {/* Blurred main background image */}
            <img
              src={venue.cover_image_url}
              alt={venue?.name || "Spa facilities"}
              className="w-full h-screen object-cover "
            />
            
         
          </>
        ) : (
          <>
            {/* Default blurred background image */}
            <img
              src="/path/to/default-spa-image.jpg"
              alt="Spa facilities"
              className="w-full h-screen object-cover filter blur-md"
            />
            
       
          </>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        {/* Content */}
        <div className=" z-10 w-full  h-screen flex flex-col justify-center items-start  to-transparent text-white    bg-gray-600  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-r-[1px] border-gray-100
      ">
        
        <div className="p-10">
          <div className="max-w-2xl text-left">
            <h1 className="font-serif text-4xl lg:text-6xl mb-4">
              <span className="font-bonanova capitalize text-orange-50 font-semibold">{venue?.name}</span>
            </h1>
            
            <div className='flex'>
            <div className="w-auto md:py-10 py-6 ">
              <HoverButton2 onClick={() => navigate(`/venues/${venue.id}/book`)}>
                Book now
              </HoverButton2>
            
            </div>
            <div className="p-10 md:hidden block ">
            <button    onClick={scrollToTarget} className="w-auto  h-14 px-4 py-2 rounded-full  hover:rounded-full transform transition-all duration-500 ease-in-out
                              hover:bg-[#2F4157] bg-[#2F4157] hover:w-36 hover:h-36 text-white relative group">
                  <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out">More Details</span>
                  <   GoArrowDown 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    size={24}
                  />
                </button>
          </div>
          </div>
            
          </div>
          <div>
                  {/* Non-blurred image positioned at bottom left (not at edge) */}
                  
              <img
                src={venue.cover_image_url}
                alt={venue?.name || "Spa facilities"}
                className="w-full md:h-[400px] h-[300px] object-cover rounded-md shadow-lg"
              />
            </div>
          </div>
        </div>
        <div className='text-white h-screen md:flex hidden flex-col justify-center items-center z-50'>
        <div className="p-10">
        <button     onClick={scrollToTarget} className="w-auto  h-14 px-4 py-2 rounded-full  hover:rounded-full transform transition-all duration-500 ease-in-out
                           hover:bg-[#2F4157] bg-[#2F4157] hover:w-36 hover:h-36 text-white relative group">
              <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out">More Details</span>
              <    GoArrowDown 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                size={24}
              />
            </button>   
      </div>
      
        </div>
        </div>

        {/* Border effect */}
        <div className="absolute inset-2 sm:inset-4 md:inset-6 border border-white/20 pointer-events-none z-20"></div>
      </div>
      
      <div  id="targetSection" className='max-w-6xl mx-auto flex flex-col justify-center items-center py-10 '>  
  <div>
<h2 className="md:text-6xl text-4xl  font-bold font-bonanova gradient-text uppercase"> {venue?.name}</h2>
</div>
    <p className='md:text-xl text-lg font-sofia text-[#D9DACD] text-center py-8'>{venue?.description}</p>
  
</div> 
        <section className='relative mt-12'>
<div className="ocean">

<div>
    <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
    <defs>
      <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
    </defs>
      <g className="parallax">
        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.5)" />
        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(146, 163, 177,0.5)" />
        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(59, 96, 124,0.5)" />
        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#FFFFFF" />
      </g>
    </svg>
    </div>
    </div>
</section>
      <div className="relative w-full min-h-screen bg-white">
  <section className='pt-10'>
    <div className='grid grid-cols-1 md:grid-cols-2'> 
    <section className='text-gray-800 font-sofia flex flex-col items-center'>
    <div className='sticky top-0 h-screen w-full overflow-y-auto px-10'>
      <div>
      {venueId ? (
        <PublicSocialLinks venueId={venueId} />
      ) : (
        <div>Venue ID not found.</div>
      )}
    </div>
    <div className="p-10">
  <h2 className="text-2xl font-medium mb-6 font-serif">Accessibility</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {venue.venue_accessibilities?.map((va, index) => (
      <div key={index} className="flex items-center gap-3">
        <span className="inline-flex justify-center items-center w-6 h-6">
          {/* Replace with appropriate accessibility icon */}
        <LuAccessibility/>
        </span>
        <span>{va.name}</span>
      </div>
    ))}
  </div>

  <h2 className="text-2xl font-medium mt-8 mb-6 font-serif">Venue Types</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {venue.venue_types?.map((vt, index) => (
      <div key={index} className="flex items-center gap-3">
        <span className="inline-flex justify-center items-center w-6 h-6">
          {/* Replace with appropriate venue type icon */}
          <RiBuilding2Line />
        </span>
        <span>{vt.name}</span>
      </div>
    ))}
  </div>

  <h2 className="text-2xl font-medium mt-8 mb-6 font-serif">Pricing Models</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {venue.venue_pricing_models?.map((vpm, index) => (
      <div key={index} className="flex items-center gap-3">
        <span className="inline-flex justify-center items-center w-6 h-6">
          {/* Replace with appropriate pricing icon */}
          <LuDiamondPlus />
        </span>
        <span>{vpm.name}</span>
      </div>
    ))}
  </div>
    </div>
    </div>
 
      </section>
      <div className='border-[1px] border-navy-blue-3/40 mw-full '>
        <div className='bg-[#2F4157]/80 m-4 flex flex-col justify-center items-center border-[1px] border-navy-blue-3/40'>
          <div className="w-full max-w-4xl text-white font-sofia flex flex-col gap-10 my-14">
            
            {/* About section */}
            <div className="border-b-[1px] border-gray-400">
              <div className="flex items-center py-4 px-6">
                <div className="mr-4 text-xl ">
                  <IoLogoBuffer className='text-yellow-500/70'/>
                </div>
                <div className=" font-serif text-xl gradient-text">About</div>
              </div>
            </div>

            {/* Price section */}
            <div className="border-b border-gray-400">
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="mr-4 text-xl">
                    <RiMoneyDollarCircleLine />
                  </div>
                  <div className="font-medium">Starting Price</div>
                </div>
                <div className="">PHP {venue?.price}</div>
              </div>
            </div>

            {/* Website section */}
            <div className="border-b border-gray-400">
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="mr-4 text-xl">
                    <CgWebsite />
                  </div>
                  <div className="font-medium">Website</div>
                </div>
                <div className="">{venue?.website}</div>
              </div>
            </div>

            {/* Phone section */}
            <div className="border-b border-gray-400">
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="mr-4 text-xl">
                    <FiPhoneOutgoing />
                  </div>
                  <div className="font-medium">Phone</div>
                </div>
                <div className="">{venue?.phone_number}</div>
              </div>
            </div>

            {/* Address section */}
            <div className="border-b border-gray-400">
              <div className="flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                  <div className="mr-4 text-2xl">
                    <TbAddressBook />
                  </div>
                  <div className="font-medium">Address</div>
                </div>
                <div className="">{venue?.address_street}, {venue?.address_city}, {venue?.address_state} {venue?.address_zip}</div>
              </div>
            </div>
            
            {/* Amenities section (converted from services) */}
            <section className='mb-4'>
              <div className="flex flex-col font-sofia gap-4 text-white">
                <div className="border-b-[1px] border-gray-400">
                  <div className="flex items-center py-4 px-6 ">
                    <div className="mr-4 text-xl">
                      <IoLogoBuffer className='text-yellow-500/70'/>
                    </div>
                    <div className="font-serif text-xl gradient-text">Amenities</div>
                  </div>
                </div>
                
                {venueAmenities.map((venueAmenity, index) => (
                  <div key={venueAmenity.amenity_id} className="border-b border-gray-400 overflow-hidden">
                    {/* Amenity header with name and dropdown arrow */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleAmenity(index)}
                    >
                      <div className="flex items-center text-white">
                        <div className="mr-4 ml-2">
                          {index % 2 === 0 ? (
                            <MdOutlineDesignServices className="text-xl text-white" />
                          ) : (
                            <MdOutlineMiscellaneousServices className="text-xl text-white" />
                          )}
                        </div>
                        <div className="font-medium text-white">
                          {amenities.find((a) => a.id === venueAmenity.amenity_id)?.name}
                        </div>
                      </div>
                      <div className="text-white">
                        {expandedAmenity === index ? (
                          <MdKeyboardArrowUp className="text-xl" />
                        ) : (
                          <MdKeyboardArrowDown className="text-xl" />
                        )}
                      </div>
                    </div>

                    {/* Expandable content with transition */}
                    <div className={`
                      px-4
                      transition-all
                      duration-300
                      ease-in-out
                      overflow-hidden
                      ${expandedAmenity === index ? 'max-h-[500px] pb-3' : 'max-h-0'}
                    `}>
                      <div className="mb-2">
                        <div className="text-sm text-white mb-1">Quantity</div>
                        <div className="text-white">{venueAmenity.quantity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white mb-1">Description</div>
                        <div className="text-white text-sm">{venueAmenity.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Book Now button */}
            <section>
              <div className="p-10">
                <button 
                  onClick={() => navigate(`/venues/${venueId}/book`)}
                  className="w-auto h-14 px-4 py-2 rounded-full hover:rounded-full transform transition-all duration-500 ease-in-out
                    hover:bg-[#2F4157] bg-[#2F4157] hover:w-36 hover:h-36 text-white relative group"
                >
                  <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out">Book Now</span>
                  <GoArrowUpRight
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    size={24}
                  />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Venue Gallery */}
  <section>
    <div className="px-8 sm:px-12 lg:mx-16 my-10">
      <div className="masonry columns-2 md:columns-3">
        {venueImages.length > 0 ? (
          venueImages.map((venueImage) => (
            <div key={venueImage.id} className="relative group break-inside-avoid mb-4">
              <img src={venueImage.image_url} className="w-full h-auto" />
            </div>
          ))
        ) : (
          <div className="bg-gray-200 rounded-md p-4 flex items-center justify-center">
            <p className="text-gray-600">No images found</p>
          </div>
        )}
      </div>
    </div>
    <div>
      {venueId ? (
        <PublicSocialLinks venueId={venueId} />
      ) : (
        <div>Venue ID not found.</div>
      )}
    </div>
  </section>

  {/* Availability Calendar Section */}
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
</div>
</div>


      
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
    </>
    );
};

export default PublicVenueDetails;


