import {  useNavigate, useParams } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import { useEffect, useRef, useState } from 'react';
import { CompanyProfile, Supplier, SupplierImage, SupplierServices } from '../types/supplier';
import MainNavbar from '../layout/components/MainNavbar'
import { MdOutlineDesignServices, MdOutlineMiscellaneousServices } from 'react-icons/md';
import { MdKeyboardArrowDown} from 'react-icons/md';
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
import { useScroll, useTransform, useInView,motion } from 'framer-motion';
import { MoonLoader } from "react-spinners";
// Add these imports at the top
import { getCurrentUser } from '../api/utiilty/profiles'; 
import { createNewConversation } from '../components/messenger/services/supabaseService'; 



interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}
const ScrollReveal = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Create a parallax component

// const ParallaxSection = ({ children, baseVelocity = 0.05 }: { children: React.ReactNode, baseVelocity?: number }) => {
//   const ref = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start end", "end start"]
//   });
  
//   const y = useTransform(scrollYProgress, [0, 1], ["0%", `${baseVelocity * 100}%`]);
  
//   return (
//     <motion.div
//       ref={ref}
//       style={{ y }}
//       className="relative"
//     >
//       {children}
//     </motion.div>
//   );
// };

// StaggeredReveal for grid items
const StaggeredReveal = ({ children, staggerDelay = 0.1 }: { children: React.ReactNode, staggerDelay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

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
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user as any);
    };
    fetchUser();
  }, []);
  const handleMessageSupplier = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/suppliers/${supplierId}` } });
      return;
    }
    
    setIsMessageLoading(true);
    try {
      if (!supplier || !supplier.company_id) {
        console.error('Supplier data or company_id not available');
        setIsMessageLoading(false);
        return;
      }
  
      console.log('Using company_id for messaging:', supplier.company_id);
      
      const { data: companyData, error: companyError } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('id', supplier.company_id)
        .single();
        
      if (companyError || !companyData) {
        console.error('Error fetching company user_id:', companyError);
        setIsMessageLoading(false);
        return;
      }
  
      if (!companyData.id) {
        console.error('Company profile has no associated id');
        setIsMessageLoading(false);
        return;
      }
  
      console.log('Company user found:', companyData.id);
      
      const conversationId = await createNewConversation(currentUser.id, companyData.id);
      console.log('Conversation created with ID:', conversationId);
      
      navigate('/Messenger', { 
        state: { 
          selectedUserId: companyData.id,
          supplierName: supplier.name
        } 
      });
      
    } catch (error) {
      console.error('Error starting conversation:', error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const targetSectionRef = useRef(null);
    const headerRef = useRef(null);
    const { scrollYProgress } = useScroll();
// Remove the opacity transformation
const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 1]); // Keep opacity at 1
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

  
  // With this:
  if (loading) return (
    <div className="h-screen w-full flex justify-center items-center bg-[#2F4157]">
      <MoonLoader color="#ffffff" size={60} />
    </div>
  );

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
  
        <div className="bg-[#2F4157]">
     {/* Venue Cover Image Section */}
     <motion.div 
          style={{ opacity, scale }}
          className="relative w-full h-screen"
        >

<div className="absolute inset-0 w-full h-screen">
    {supplier?.cover_image_url ? (
      <>
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          src={supplier.cover_image_url}
          alt={supplier?.name || "Spa facilities"}
          className="w-full h-screen object-cover"
        />
        <motion.div 
          className="absolute inset-0 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </>
  ) : (
    <>
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        src="/path/to/default-spa-image.jpg"
        alt="Spa facilities"
        className="w-full h-screen object-cover filter blur-md"
      />
      <div className="absolute inset-0 bg-black/70" /> {/* Consistent darkness */}
    </>
  )}
</div>
          
          {/* Centered Content Container */}
          <div className="absolute inset-0 flex justify-center items-center mt-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="z-10 text-white text-center px-4"
            >
              <motion.h1 
                ref={headerRef}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-4xl lg:text-[4rem] mb-8 gradient-text font-bonanova"
              >
                <span>{supplier?.name}</span>
              </motion.h1>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex justify-center items-center gap-6 mt-4"
              >
                {/* Enhanced Button with hover effects */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <motion.div 
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.9 }}
                    className="h-full w-full bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 absolute inset-0"
                  ></motion.div>
                  <HoverButton2  onClick={() => navigate(`/suppliers/${supplier.id}/book`)} className="relative z-10">
                    Book now
                  </HoverButton2>
                </motion.div>
                
                {/* More Details Button with enhanced hover effects */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <motion.div 
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.9 }}
                    className="h-full w-full bg-gray-200 rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 absolute inset-0"
                  ></motion.div>
                  <button onClick={scrollToTarget} className="w-auto h-14 px-4 py-2 rounded-full hover:rounded-full transform transition-all duration-500 ease-in-out
                    bg-transparent hover:w-36 hover:h-36 text-white relative group z-10">
                    <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out text-sm">More Details</span>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: scrollY > 50 ? 180 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <GoArrowDown 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                        size={24}
                      />
                    </motion.div>
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated border effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute inset-2 sm:inset-4 md:inset-6 border border-white/40 pointer-events-none z-20"
          ></motion.div>
        </motion.div>
   {/* Description section with scroll reveal */}
   <div id="targetSection" ref={targetSectionRef} className='max-w-6xl mx-auto flex flex-col justify-center items-center py-10'>  
     <ScrollReveal delay={0.2}>
       <h2 className="md:text-6xl text-4xl font-bold font-bonanova gradient-text uppercase">{supplier?.name}</h2>
     </ScrollReveal>
     
     <ScrollReveal delay={0.4} className='md:text-xl text-lg font-sofia text-[#D9DACD] text-center py-8'>
       <p>{supplier?.description}</p>
     </ScrollReveal>
   </div>
   
   {/* Enhanced wave section */}
   <section className='relative mt-12'>
     <div className="ocean">
       <div>
         <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
         viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
         <defs>
           <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
         </defs>
         <g className="parallax">
           <motion.use 
             xlinkHref="#gentle-wave" 
             x="48" 
             y="0" 
             fill="rgba(255,255,255,0.5)" 
             animate={{ x: ["-100%", "100%"] }}
             transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
           />
           <motion.use 
             xlinkHref="#gentle-wave" 
             x="48" 
             y="3" 
             fill="rgba(146, 163, 177,0.5)" 
             animate={{ x: ["0%", "200%"] }}
             transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
           />
           <motion.use 
             xlinkHref="#gentle-wave" 
             x="48" 
             y="5" 
             fill="rgba(59, 96, 124,0.5)" 
             animate={{ x: ["-120%", "80%"] }}
             transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
           />
           <motion.use 
             xlinkHref="#gentle-wave" 
             x="48" 
             y="7" 
             fill="#FFFFFF" 
             animate={{ x: ["-50%", "150%"] }}
             transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
           />
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
    <ScrollReveal>
    <div className="border-b-[1px] border-gray-400 ">
      <div className="flex items-center py-4 px-6">
        <div className=" mr-4 text-xl">
        <IoLogoBuffer className='text-yellow-500/70' />
        </div>
        <div className="font-serif text-xl gradient-text">About</div>
      </div>
    </div>
    </ScrollReveal>
<ScrollReveal delay={0.1}>
  <motion.div 
    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
    className="border-b border-gray-400"
  >
    <div className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.2 }}
          className="mr-4 text-xl"
        >
          <RiMoneyDollarCircleLine />
        </motion.div>
        <div className="font-medium">Starting Price</div>
      </div>
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        PHP {supplier?.price_range}
      </motion.div>
    </div>
  </motion.div>
</ScrollReveal>

<ScrollReveal delay={0.2}>
      <motion.div 
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        className="border-b border-gray-400"
      >
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.2 }}
              className="mr-4 text-xl"
            >
              <CgWebsite />
            </motion.div>
            <div className="font-medium">Website</div>
          </div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {supplier?.website}
          </motion.div>
        </div>
      </motion.div>
    </ScrollReveal>

    <ScrollReveal delay={0.3}>
      <motion.div 
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        className="border-b border-gray-400"
      >
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.2 }}
              className="mr-4 text-xl"
            >
              <FiPhoneOutgoing />
            </motion.div>
            <div className="font-medium">Phone</div>
          </div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {supplier?.phone_number}
          </motion.div>
        </div>
      </motion.div>
    </ScrollReveal>

    <ScrollReveal delay={0.4}>
      <motion.div 
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        className="border-b border-gray-400"
      >
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.2 }}
              className="mr-4 text-2xl"
            >
              <TbAddressBook />
            </motion.div>
            <div className="font-medium">Address</div>
          </div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {supplier?.address_street}, {supplier?.address_city}, {supplier?.address_state} {supplier?.address_zip}
          </motion.div>
        </div>
      </motion.div>
    </ScrollReveal>
  
      <section className='mb-4'>
  <div className="flex flex-col font-sofia gap-4 text-white">
  <ScrollReveal>
    <div className="border-b-[1px] border-gray-400">
      <div className="flex items-center py-4 px-6">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.2 }}
          className="mr-4 text-xl"
        >
          <IoLogoBuffer className='text-yellow-500/70' />
        </motion.div>
        <div className="font-serif text-xl gradient-text">Services Offered</div>
      </div>
    </div>
    </ScrollReveal>

    {services.map((service, index) => (
      <ScrollReveal delay={0.1 * (index + 1)} key={index}>
        <motion.div 
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          className="border-b border-gray-400 overflow-hidden"
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleService(index)}
          >
            <div className="flex items-center text-white">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.2 }}
                className="mr-4 ml-2"
              >
                {index % 2 === 0 ? (
                  <MdOutlineDesignServices className="text-xl text-white" />
                ) : (
                  <MdOutlineMiscellaneousServices className="text-xl text-white" />
                )}
              </motion.div>
              <div className="font-medium text-white">
                {service.service_name}
              </div>
            </div>
            <motion.div 
              animate={{ rotate: expandedService === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white"
            >
              <MdKeyboardArrowDown className="text-xl" />
            </motion.div>
          </div>

          <motion.div 
            animate={{ 
              height: expandedService === index ? "auto" : 0,
              opacity: expandedService === index ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="px-4 overflow-hidden"
          >
            <div className="mb-2">
              <div className="text-sm text-white mb-1">Price</div>
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: expandedService === index ? 0 : 20, opacity: expandedService === index ? 1 : 0 }}
                transition={{ delay: 0.1 }}
                className="text-white"
              >
                {service.price}
              </motion.div>
            </div>
            <div>
              <div className="text-sm text-white mb-1">Description</div>
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: expandedService === index ? 0 : 20, opacity: expandedService === index ? 1 : 0 }}
                transition={{ delay: 0.2 }}
                className="text-white text-sm"
              >
                {service.description}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </ScrollReveal>
    ))}
  </div>
</section>
<ScrollReveal delay={0.6}>
                      <section>
                          <div className="p-10">
                            <motion.button 
                             onClick={() => navigate(`/suppliers/${supplier.id}/book`)}
                              className="w-auto h-14 px-4 py-2 rounded-full hover:rounded-full transform transition-all duration-500 ease-in-out
                                hover:bg-[#2F4157] bg-[#2F4157] hover:w-36 hover:h-36 text-white relative group"
                              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(255,255,255,0.3)" }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out">Book Now</span>
                              <div
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-50"
                              >
                                <GoArrowUpRight size={24} />
                              </div>
                            </motion.button>
                          </div>
                        </section>
                      </ScrollReveal>
                      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="bg-[#2F4157]/20 backdrop-blur-sm rounded-lg p-6 border border-white/10 shadow-xl max-w-md mx-auto my-8"
>
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="text-center space-y-4"
  >
    <h3 className="text-white text-xl font-bonanova">Have Questions?</h3>
    <p className="text-gray-200 font-sofia text-sm">
      We're here to help you plan your perfect event. Reach out to us directly for personalized assistance and detailed information about our services.
    </p>
  </motion.div>

  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    className="relative mt-6"
  >
    <motion.div 
      initial={{ opacity: 0.6 }}
      whileHover={{ opacity: 0.9 }}
      className="h-full w-full bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 absolute inset-0"
    ></motion.div>
    <HoverButton2 
      onClick={handleMessageSupplier} 
      className="relative z-10 w-full"
    >
      {isMessageLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z"></path>
          </svg>
          Start a Conversation
        </span>
      )}
    </HoverButton2>
  </motion.div>
</motion.div>
 
  </div>
  
    </div>
</div>
</section>

<section>
  <ScrollReveal>
    <div className="px-8 sm:px-12 lg:mx-16 my-24">
      <StaggeredReveal staggerDelay={0.2}>
      <div className="w-full">
  {supplierImages.length > 0 ? (
    <div className="masonry columns-2 md:columns-3">
      {supplierImages.map((supplierImage, index) => (
        <motion.div 
          key={supplierImage.id} 
          className="relative group break-inside-avoid mb-4"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { 
              opacity: 1, 
              scale: 1,
              transition: { duration: 0.6 }
            }
          }}
          whileHover={{ 
            scale: 1.02, 
            transition: { duration: 0.2 } 
          }}
        >
          <motion.img 
            src={supplierImage.image_url} 
            className="w-full h-auto rounded-lg"
            layoutId={`image-${supplierImage.id}`}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end justify-center p-4"
          >
            <p className="text-white text-sm font-sofia">Gallery Image {index + 1}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  ) : (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[300px] bg-gradient-to-br from-[#2F4157]/5 to-[#2F4157]/20 rounded-xl p-8 flex flex-col items-center justify-center gap-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-20 h-20 rounded-full bg-[#2F4157]/10 flex items-center justify-center"
      >
        <svg 
          className="w-10 h-10 text-[#2F4157]/40" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </motion.div>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[#2F4157]/70 text-lg font-sofia text-center"
      >
       The supplier hasn't uploaded any gallery images yet. Check back later for visual updates of their services.
      </motion.p>
    </motion.div>
  )}
</div>
      </StaggeredReveal>
    </div>
  </ScrollReveal>
  
  <ScrollReveal>
    <div>
      {supplierId ? (
        <PublicSocialLinks supplierId={supplierId} />
      ) : (
        <div>Supplier ID not found.</div>
      )}
    </div>
  </ScrollReveal>
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

    </>
    );
};

export default PublicSupplierDetails;


