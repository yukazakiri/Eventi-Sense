import {  useNavigate, useParams } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import { useEffect, useRef, useState } from 'react';
import { CompanyProfile, Supplier, SupplierImage, SupplierServices } from '../types/supplier';
import MainNavbar from '../layout/MainNavbar';
import { BsArrowDownLeft } from "react-icons/bs";
import Button from '../components/Button/button';
import { IoIosSend } from "react-icons/io";
import { BsFillCalendar2CheckFill } from "react-icons/bs";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CustomModal from '../assets/modal/publicalendarmodal';
import { TiLocation } from "react-icons/ti";
import { MdOutlineDesignServices } from "react-icons/md";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import PublicSocialLinks from '../pages/Supplier/Social Media/PublicSocialLinks';




interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

const PublicSupplierDetails: React.FC = () => {
    
  const { supplierId } = useParams<{ supplierId: string }>();  // supplierId is now guaranteed to be a string
  const navigate = useNavigate();
  const [supplier, setsupplier] = useState<Supplier | null>(null);
  const [supplierImages, setsupplierImages] = useState<SupplierImage[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
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

        // Fetch supplier data
        const { data: supplierData, error: supplierError } = await supabase
          .from('supplier')
          .select('*')
          .eq('id', supplierId)
          .single();

        if (supplierError) throw supplierError;

        // Fetch company profile
        const { data: companyProfileData, error: companyError } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('id', supplierData.company_id)
          .single();

        if (companyError) throw companyError;

        // Fetch supplier images
        const { data: imagesData, error: imagesError } = await supabase
          .from('supplier_images')
          .select('*')
          .eq('supplier_id', supplierId);

        if (imagesError) throw imagesError;

        const { data: servicesData, error: servicesError } = await supabase
        .from('suppliers_services')
        .select('*')    
        .eq('supplier_id', supplierId);

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

    return (
      <>
      <MainNavbar />
      <div className="overflow-hidden bg-slate-50">
        <div className="bg-orange-50 max-w-[90rem] mx-auto my-[2rem] md:my-[10rem] pb-[2rem] md:pb-[10rem] rounded-2xl shadow-lg">
          {/* Venue Cover Image Section */}
          <div className="relative overflow-hidden">
            {supplier?.cover_image_url && (
              <div className="relative">
                <img
                  src={supplier.cover_image_url}
                  alt={supplier.name}
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
                {/* Overlay and supplier Details */}
                <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 text-white z-10">
                  <div className="text-center">
                    <h2 className="font-bonanova gradient-text text-3xl lg:text-4xl xl:text-5xl leading-tight">
                      {supplier?.name}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl xl:text-2xl mt-2 md:mt-4 font-sofia max-w-[40rem]">
                      {supplier?.description}
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button
                        label="Book Now"
                        gradientText={true}
                        variant="primary"
                        onClick={() => navigate(`/suppliers/${supplierId}/book`)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
    
          {/* supplier Details Section */}
          <section className="font-sofia ">
            {/* supplier Types and Pricing */}
            <section className='mx-4 md:mx-8 lg:mx-12 xl:mx-24 mt-8'>
              <div className=' border-b-2 border-gray-600 py-4'>
        
              <p className="bg-green-100 text-green-700  w-fit rounded-full px-2 mb-1 py-1 ">
                PHP {supplier?.price_range}
              </p>
              <p className='text-gray-700 flex items-center text-[4rem] font-bonanova ml-2' >
                {supplier?.name}
              </p>
              <p className='text-gray-500 flex items-center mb-2'>
                <TiLocation className="mr-1 mb-1" />{supplier?.address_street}, {supplier?.address_city}, {supplier?.address_state} {supplier?.address_zip}
              </p>
              <div >
            {supplierId ? (
                <PublicSocialLinks supplierId={supplierId} />
            ) : (
                <div>Supplier ID not found.</div> // Or any other fallback UI
            )}
            </div>
            </div>
              <div className="md:mt-20 md:mb-10 my-4 flex justify-center items-center  ">
              <div className="font-bonanova text-2xl lg:text-3xl xl:text-[3rem] text-gray-700 font-medium">
                Giving the best just for you
              </div>
        
            </div>   
          
          
            <section className='mb-4'>
            <div className="grid grid-cols-1 md:grid-cols-3 font-sofia gap-2">
                {services.map((service, index) => (
                    <div key={index} className="p-2 py-12 group hover:shadow-xl transition duration-300 ease-in-out group-hover:scale-110">
                        <div className="flex items-center justify-center">
                            {index % 2 === 0 ? ( // Alternate icons
                                <MdOutlineDesignServices className="text-[3rem] p-2 border border-orange-200 text-orange-300 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
                            ) : (
                                <MdOutlineMiscellaneousServices className="text-[3rem] p-2 border border-orange-200 text-orange-300 rounded-full transition duration-300 ease-in-out group-hover:scale-110" />
                            )}
                        </div>
                        <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
                            <p className="text-gray-700 text-center">
                                {service.service_name}
                            </p>
                        </div>
                        <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
                            <p className="text-gray-500 text-center">
                                {service.price}
                            </p>
                        </div>
                        <div className="flex justify-center items-center my-2 transition duration-300 ease-in-out group-hover:scale-110">
                            <p className="text-gray-600 text-center text-sm">
                                {service.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
       
           </section>
            {/* supplier Description and Message Button */}
           
    
      
    
            {/* supplier Gallery */}
            <div className="mx-2 mb-12 ">
     
              <div className="masonry columns-2 md:columns-3">
                {supplierImages.length > 0 ? (
                  supplierImages.map((supplierImage) => (
                    <div key={supplierImage.id} className="relative group break-inside-avoid mb-8">
                      <img src={supplierImage.image_url} className="w-full h-auto " />
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-200 rounded-md p-4 flex items-center justify-center">
                    <p className="text-gray-600">No images found</p>
                  </div>
                )}
              </div>
            </div>
    
            {/* supplier Information Grid */}
            <section className='bg-slate-50'>
            
              <div className='mx-4 md:mx-8 lg:mx-12 xl:mx-24 mt-8 py-8 grid md:grid-cols-2'>
              <section>
                <h1 className='text-gray-700 flex items-center text-[3rem] font-bonanova ml-2'>Celebrate with us....</h1>
                <p className='text-gray-500 ml-5 md:my-4'>
                Unlock an exclusive experience at <span className='font-bonanova text-lg text-orange-400'>{supplier?.name}.</span>  Discover our latest events, special offers, behind-the-scenes glimpses, and stories from those who've made memories here.</p>
                <div className='ml-4 my-2'>
                <div className='mb-1 flex'>
                  
                  <p className='pl-1 text-gray-500'>
                   <span className='font-bonanova text-gray-600 text-lg'> Phone: </span>{supplier?.phone_number}
                  </p>
                </div>
                <div className='mb-1 flex'>
                  
                  <a href={`mailto:${supplier?.email}`} className=' text-gray-500'>
                  <p className='pl-1 text-gray-500'>
                   <span className='font-bonanova text-gray-600 text-lg'> Email: </span>{supplier?.email}
                  </p>
                  </a>
                </div>
                <div className='mb-1 flex'>
                  
                  <a href={supplier?.website} target="_blank" rel="noopener noreferrer" className=' text-gray-500'>
                  <p className='pl-1 text-gray-500'>
                    <span className='font-bonanova text-gray-600 text-lg'> Website: </span>{supplier?.website}
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
                     onClick={() => navigate(`/suppliers/${supplierId}/book`)}
                   className="flex group p-2 px-6 font-sofia bg-gray-700 text-gray-100 border hover:border-slate-100 rounded-sm shadow-md transition duration-300 ease-in-out hover:scale-110">
                  <BsFillCalendar2CheckFill className="text-[1.5rem] group-hover:text-yellow-500" />
                    <span className="text-center text-[15px] mx-2 uppercase">Request a Booking</span>
                  </button>
                </div>
              </section>
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
          </section>
    
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


