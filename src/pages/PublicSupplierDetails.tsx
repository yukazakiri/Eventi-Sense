import {  useNavigate, useParams } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import { useEffect, useRef, useState } from 'react';
import { CompanyProfile, Supplier, SupplierImage, SupplierServices } from '../types/supplier';
import MainNavbar from '../layout/components/MainNavbar'
import { MdOutlineDesignServices, MdOutlineMiscellaneousServices } from 'react-icons/md';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CustomModal from '../assets/modal/publicalendarmodal';
import { FiPhoneOutgoing } from "react-icons/fi";
import PublicSocialLinks from '../pages/Supplier/Social Media/PublicSocialLinks';
import {  HoverButton2  } from '../components/Button/button-hover';
import '../components/borderwave/Wave.css';
import { GoArrowDown,GoArrowUpRight } from "react-icons/go";
import { CgWebsite } from "react-icons/cg";
import { TbAddressBook } from "react-icons/tb";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLogoBuffer } from "react-icons/io";




interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

const PublicSupplierDetails: React.FC = () => {
  const [expandedService, setExpandedService] =  useState<any | null>(null);
  const { supplierId } = useParams<{ supplierId: string }>();  // supplierId is now guaranteed to be a string
  const navigate = useNavigate();
  const [supplier, setsupplier] = useState<Supplier | null>(null);
  const [supplierImages, setsupplierImages] = useState<SupplierImage[]>([]);
  const [_companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [services, setservices] = useState<SupplierServices[]>([]);
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
      if (!supplierId) return;

      try {
        setLoading(true);

        // Try fetching supplier by 'id'
        let { data: supplierData, error: supplierError } = await supabase
          .from('supplier') // Assuming table is plural 'suppliers'
          .select('*')
          .eq('id', supplierId) // First attempt: fetch by supplierId (supplier's ID)
          .single();

        // If the first fetch didn't return data (PGRST116: No rows found), try fetching by 'company_id'
        if (supplierError?.code === 'PGRST116' || !supplierData) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('supplier')
            .select('*')
            .eq('company_id', supplierId) // Second attempt: fetch by supplierId as company_id
            .single();

          // If we have a valid supplier by company_id
          if (fallbackError && fallbackError.code !== 'PGRST116') {
            throw fallbackError; // Only throw if the error isn't "no rows found"
          }

          supplierData = fallbackData;
        }

        // If neither fetch succeeded, handle the missing supplier case
        if (!supplierData) {
          throw new Error('Supplier not found by ID or company_id.');
        }

        // Continue with existing code using supplierData
        const { data: companyProfileData, error: companyError } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', supplierData.company_id)
          .single();

        if (companyError) throw companyError;

        // Rest of your existing fetches using supplierData.id
        const { data: imagesData, error: imagesError } = await supabase
          .from('supplier_images')
          .select('*')
          .eq('supplier_id', supplierData.id);

        if (imagesError) throw imagesError;

        const { data: servicesData, error: servicesError } = await supabase
          .from('suppliers_services')
          .select('*')    
          .eq('supplier_id', supplierData.id);

        if (servicesError) throw servicesError;

        // Set states
        setsupplier(supplierData);
        setCompanyProfile(companyProfileData);
        setsupplierImages(imagesData);
        setservices(servicesData);

      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supplierId]);

  useEffect(() => {
    if (supplierId) {
      fetchAvailabilities();
    }
  }, [supplierId]);
  
  const fetchAvailabilities = async () => {
    try {
      const { data, error } = await supabase
        .from("supplier_availability")
        .select("*")
        .eq("supplier_id", supplierId);

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

  if (!supplier) return <div>supplier not found.</div>;
  const toggleService = (index:any) => {
    if (expandedService === index) {
      setExpandedService(null);
    } else {
      setExpandedService(index);
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
      <div className= "">
        <div className="bg-[#2F4157]">
     {/* Venue Cover Image Section */}
<div className="relative w-full h-screen  ">
{/* Background Image with Blur Effect */}
<div className="absolute inset-0 w-full h-screen ">
  {supplier?.cover_image_url ? (
    <>
      {/* Blurred main background image */}
      <img
        src={supplier.cover_image_url}
        alt={supplier?.name || "Spa facilities"}
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
        <span className="font-bonanova capitalize text-orange-50 font-semibold">{supplier?.name}</span>
      </h1>
      
      <div className='flex'>
      <div className="w-auto md:py-10 py-6 ">
        <HoverButton2 onClick={() => navigate(`/suppliers/${supplier.id}/book`)}>
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
          src={supplier.cover_image_url}
          alt={supplier?.name || "Spa facilities"}
          className="w-auto md:h-[300px] h-[300px] object-cover rounded-md shadow-lg"
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
<section className='w-full  h-full'>
            <div id="targetSection" className='max-w-6xl mx-auto flex flex-col justify-center items-center py-10 h-[20rem] '>  
            <div>
<h2 className="md:text-6xl text-4xl  font-bold font-bonanova gradient-text uppercase"> {supplier?.name}</h2>
</div>
    <p className='md:text-xl text-md font-sofia text-[#D9DACD] text-center py-8'>{supplier?.description}</p>
            </div>
</section>

<section className='relative '>
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
  <div className='border-[1px] border-navy-blue-3/40 max-w-7xl mx-auto ' >
    <div className=' bg-[#2F4157]/80   m-4 flex flex-col justify-center items-center border-[1px] border-navy-blue-3/40   '>
    <div className=" w-full max-w-4xl text-white font-sofia flex flex-col gap-10  my-14">
    <div className="border-b-[1px] border-gray-400 ">
      <div className="flex items-center py-4 px-6">
        <div className=" mr-4 text-xl">
        <IoLogoBuffer className='text-yellow-500/70' />
        </div>
        <div className="font-serif text-xl gradient-text">About</div>
      </div>
    </div>

    <div className="border-b border-gray-400">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <div className=" mr-4 text-xl">
          <RiMoneyDollarCircleLine />
          </div>
          <div className="font-medium ">Starting Price</div>
        </div>
        <div className="">PHP {supplier?.price_range}</div>
      </div>
    </div>

    <div className="border-b border-gray-400">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <div className=" mr-4 text-xl">
          <CgWebsite />
          </div>
          <div className="font-medium ">Website</div>
        </div>
        <div className="">{supplier?.website}</div>
      </div>
    </div>

    <div className="border-b border-gray-400">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <div className=" mr-4 text-xl">
          <FiPhoneOutgoing />
          </div>
          <div className="font-medium ">Phone</div>
        </div>
        <div className="">{supplier?.phone_number}</div>
      </div>
    </div>
    <div className="border-b border-gray-400">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <div className=" mr-4 text-2xl">
          <TbAddressBook />
          </div>
          <div className="font-medium ">Address</div>
        </div>
        <div className="">{supplier?.address_street}, {supplier?.address_city}, {supplier?.address_state} {supplier?.address_zip}</div>
      </div>
    </div>
  
      <section className='mb-4'>
  <div className="flex flex-col font-sofia gap-4 text-white">
  <div className="border-b-[1px] border-gray-400 ">
      <div className="flex items-center py-4 px-6">
        <div className=" mr-4 text-xl">
        <IoLogoBuffer className='text-yellow-500/70' />
        </div>
        <div className="font-serif text-xl gradient-text">Services Offered</div>
      </div>
    </div>
    {services.map((service, index) => (
      <div key={index} className="border-b border-gray-400 overflow-hidden">
        {/* Service header with name and dropdown arrow */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => toggleService(index)}
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
              {service.service_name}
            </div>
          </div>
          <div className="text-white">
            {expandedService === index ? (
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
          ${expandedService === index ? 'max-h-[500px] pb-3' : 'max-h-0'}
        `}>
          <div className="mb-2">
            <div className="text-sm text-white mb-1">Price</div>
            <div className="text-white">{service.price}</div>
          </div>
          <div>
            <div className="text-sm text-white mb-1">Description</div>
            <div className="text-white text-sm">{service.description}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
  
  <section>
  <div className="p-10">
  <button onClick={() => navigate(`/suppliers/${supplier.id}/book`)}
   className="w-auto  h-14 px-4 py-2 rounded-full  hover:rounded-full transform transition-all duration-500 ease-in-out
                     hover:bg-[#2F4157] bg-[#2F4157] hover:w-36 hover:h-36 text-white relative group">
        <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out">Book Now</span>
        <    GoArrowUpRight
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          size={24}
        />
      </button>



</div>

  </section>
  </div>
  
    </div>
</div>
</section>

<section  >
     {/* supplier Gallery */}
     <div className="px-8 sm:px-12 lg:mx-16 my-10">
     
     <div className="masonry columns-2 md:columns-3">
       {supplierImages.length > 0 ? (

         supplierImages.map((supplierImage) => (
           <div key={supplierImage.id} className="relative group break-inside-avoid mb-8">
             <img src={supplierImage.image_url} className="w-full h-auto " />
           </div>
         ))
       ) : (
         <div className="bg-gray-200 rounded-md p-4 flex items-center justify-center ">
           <p className="text-gray-600">No images found</p>
         </div>
       )}
     </div>
   </div>
   <div >
            {supplierId ? (
                <PublicSocialLinks supplierId={supplierId} />
            ) : (
                <div>Supplier ID not found.</div> // Or any other fallback UI
            )}
            </div>
</section>

            {/* Availability Calendar Section */}
            <section id="availability-section" className="my-[4rem] mx-[2rem] font-sofia bg-white p-6 rounded-2xl">
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
         
    
          {/* Custom Modal */}
          <CustomModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title="supplier Availability"
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

export default PublicSupplierDetails;


