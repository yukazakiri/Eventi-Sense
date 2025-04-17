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
import { MoonLoader } from "react-spinners";
import { motion } from "framer-motion";

import PublicSocialLinks from './VenueManager/Social/PublicSocialLinks';
import { FiPhoneOutgoing } from "react-icons/fi";
import { MdOutlineDesignServices, MdOutlineMiscellaneousServices } from 'react-icons/md';
import { MdKeyboardArrowDown} from 'react-icons/md';
import {  HoverButton2  } from '../components/Button/button-hover';
import '../components/borderwave/Wave.css';
import { GoArrowDown,GoArrowUpRight } from "react-icons/go";
import { CgWebsite } from "react-icons/cg";
import { TbAddressBook } from "react-icons/tb";
import { RiMoneyDollarCircleLine,RiBuilding2Line  } from "react-icons/ri";
import { IoLogoBuffer } from "react-icons/io";
import { LuAccessibility, LuDiamondPlus } from 'react-icons/lu';

import { useScroll, useTransform, useInView } from 'framer-motion';



interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

// Create a reusable ScrollReveal component
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
const ParallaxSection = ({ children, baseVelocity = 0.05 }: { children: React.ReactNode, baseVelocity?: number }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${baseVelocity * 100}%`]);
  
  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

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

    const targetSectionRef = useRef(null);
    const headerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
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
  if (loading) return (
    <div className="h-screen w-full flex justify-center items-center bg-[#2F4157]">
      <MoonLoader color="#ffffff" size={60} />
    </div>
  );

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
        <motion.div 
          style={{ opacity, scale }}
          className="relative w-full h-screen"
        >
          {/* Background Image with Blur Effect - same as before */}
          <div className="absolute inset-0 w-full h-screen">
            {venue?.cover_image_url ? (
              <>
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2 }}
                  src={venue.cover_image_url}
                  alt={venue?.name || "Spa facilities"}
                  className="w-full h-screen object-cover"
                />
                <motion.div 
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 1.5 }}
                ></motion.div>
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
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </>
            )}
          </div>
          
          {/* Centered Content Container */}
          <div className="absolute inset-0 flex justify-center items-center">
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
                <span>{venue?.name}</span>
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
                  <HoverButton2 onClick={() => navigate(`/venues/${venue.id}/book`)} className="relative z-10">
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
        <div id="targetSection" ref={targetSectionRef}  className='max-w-6xl mx-auto flex flex-col justify-center items-center py-10'>  
          <ScrollReveal delay={0.2}>
            <h2 className="md:text-6xl text-4xl font-bold font-bonanova gradient-text uppercase">{venue?.name}</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className='md:text-xl text-lg font-sofia text-[#D9DACD] text-center py-8'>
            <p>{venue?.description}</p>
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

        {/* Main content area with scroll animations */}
   
        <div className="relative w-full min-h-screen bg-white">
          <section className='pt-8'>
            <div className='grid grid-cols-1 md:grid-cols-2'> 
              <section className='text-gray-800 font-sofia flex flex-col items-center'>
                <div className='sticky top-0 h-screen w-full overflow-y-auto px-10'>
                  <ScrollReveal delay={0.3}>
                    <div>
                      {venueId ? (
                        <PublicSocialLinks venueId={venueId} />
                      ) : (
                        <div>Venue ID not found.</div>
                      )}
                    </div>
                  </ScrollReveal>
                  
                  <div className="p-10">
                    <ScrollReveal delay={0.4}>
                      <h2 className="text-2xl font-medium mb-6 font-serif">Accessibility</h2>
                      <StaggeredReveal staggerDelay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {venue.venue_accessibilities?.map((va, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center gap-3"
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { 
                                  opacity: 1, 
                                  x: 0,
                                  transition: { duration: 0.5 }
                                }
                              }}
                            >
                              <span className="inline-flex justify-center items-center w-6 h-6">
                                <LuAccessibility/>
                              </span>
                              <span>{va.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </StaggeredReveal>
                    </ScrollReveal>

                    <ScrollReveal delay={0.5}>
                      <h2 className="text-2xl font-medium mt-8 mb-6 font-serif">Venue Types</h2>
                      <StaggeredReveal staggerDelay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {venue.venue_types?.map((vt, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center gap-3"
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { 
                                  opacity: 1, 
                                  x: 0,
                                  transition: { duration: 0.5 }
                                }
                              }}
                            >
                              <span className="inline-flex justify-center items-center w-6 h-6">
                                <RiBuilding2Line />
                              </span>
                              <span>{vt.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </StaggeredReveal>
                    </ScrollReveal>

                    <ScrollReveal delay={0.6}>
                      <h2 className="text-2xl font-medium mt-8 mb-6 font-serif">Pricing Models</h2>
                      <StaggeredReveal staggerDelay={0.1}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {venue.venue_pricing_models?.map((vpm, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center gap-3"
                              variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { 
                                  opacity: 1, 
                                  x: 0,
                                  transition: { duration: 0.5 }
                                }
                              }}
                            >
                              <span className="inline-flex justify-center items-center w-6 h-6">
                                <LuDiamondPlus />
                              </span>
                              <span>{vpm.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </StaggeredReveal>
                    </ScrollReveal>
                  </div>
                </div>
              </section>

              {/* Right side info panel with enhanced animations */}
                     <ParallaxSection baseVelocity={0.05}>
              <div className='border-[1px] border-navy-blue-3/40 mw-full'>
         
                  <div className='bg-[#2F4157]/80 m-4 flex flex-col justify-center items-center border-[1px] border-navy-blue-3/40'>
                    <div className="w-full max-w-4xl text-white font-sofia flex flex-col gap-10 my-14">
                      
                      {/* About section */}
                      <ScrollReveal>
                        <div className="border-b-[1px] border-gray-400">
                          <div className="flex items-center py-4 px-6">
                            <motion.div 
                              initial={{ rotate: 0 }}
                              whileInView={{ rotate: 360 }}
                              transition={{ duration: 1.5 }}
                              className="mr-4 text-xl"
                            >
                              <IoLogoBuffer className='text-yellow-500/70'/>
                            </motion.div>
                            <div className="font-serif text-xl gradient-text">About</div>
                          </div>
                        </div>
                      </ScrollReveal>

                      {/* Price section */}
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
                              PHP {venue?.price}
                            </motion.div>
                          </div>
                        </motion.div>
                      </ScrollReveal>

                      {/* Website section */}
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
                              {venue?.website}
                            </motion.div>
                          </div>
                        </motion.div>
                      </ScrollReveal>

                      {/* Phone section */}
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
                              {venue?.phone_number}
                            </motion.div>
                          </div>
                        </motion.div>
                      </ScrollReveal>

                      {/* Address section */}
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
                              {venue?.address_street}, {venue?.address_city}, {venue?.address_state} {venue?.address_zip}
                            </motion.div>
                          </div>
                        </motion.div>
                      </ScrollReveal>
                      
                      {/* Amenities section with enhanced animations */}
                      <ScrollReveal delay={0.5}>
                        <section className='mb-4'>
                          <div className="flex flex-col font-sofia gap-4 text-white">
                            <div className="border-b-[1px] border-gray-400">
                              <div className="flex items-center py-4 px-6">
                                <motion.div 
                                  initial={{ rotate: 0 }}
                                  whileInView={{ rotate: 360 }}
                                  transition={{ duration: 1.5 }}
                                  className="mr-4 text-xl"
                                >
                                  <IoLogoBuffer className='text-yellow-500/70'/>
                                </motion.div>
                                <div className="font-serif text-xl gradient-text">Amenities</div>
                              </div>
                            </div>
                            
                            {venueAmenities.map((venueAmenity, index) => (
                              <motion.div 
                                key={venueAmenity.amenity_id} 
                                className="border-b border-gray-400 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                              >
                                {/* Amenity header with name and dropdown arrow */}
                                <div 
                                  className="flex items-center justify-between p-4 cursor-pointer"
                                  onClick={() => toggleAmenity(index)}
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
                                      {amenities.find((a) => a.id === venueAmenity.amenity_id)?.name}
                                    </div>
                                  </div>
                                  <motion.div 
                                    animate={{ rotate: expandedAmenity === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-white"
                                  >
                                    <MdKeyboardArrowDown className="text-xl" />
                                  </motion.div>
                                </div>

                                {/* Expandable content with better transition */}
                                <motion.div 
                                  animate={{ 
                                    height: expandedAmenity === index ? "auto" : 0,
                                    opacity: expandedAmenity === index ? 1 : 0
                                  }}
                                  transition={{ 
                                    duration: 0.5, 
                                    ease: [0.04, 0.62, 0.23, 0.98] 
                                  }}
                                  className="px-4 overflow-hidden"
                                >
                                  <div className="mb-2">
                                    <div className="text-sm text-white mb-1">Quantity</div>
                                    <div className="text-white">{venueAmenity.quantity}</div>
                                  </div>
                                  <div className="pb-3">
                                    <div className="text-sm text-white mb-1">Description</div>
                                    <div className="text-white text-sm">{venueAmenity.description}</div>
                                  </div>
                                </motion.div>
                              </motion.div>
                            ))}
                          </div>
                        </section>
                      </ScrollReveal>
                      
                      {/* Enhanced Book Now button */}
                      <ScrollReveal delay={0.6}>
                      <section>
                          <div className="p-10">
                            <motion.button 
                              onClick={() => navigate(`/venues/${venueId}/book`)}
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
                    </div>
                  </div>
             
              </div>  
               </ParallaxSection>
            </div>
          </section>

          {/* Enhanced Venue Gallery */}
          <section>
            <ScrollReveal>
              <div className="px-8 sm:px-12 lg:mx-16 my-24">
                <StaggeredReveal staggerDelay={0.2}>
                  <div className="masonry columns-2 md:columns-3">
                    {venueImages.length > 0 ? (
                      venueImages.map((venueImage, index) => (
                        <motion.div 
                          key={venueImage.id} 
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
                            src={venueImage.image_url} 
                            className="w-full h-auto rounded-lg"
                            layoutId={`image-${venueImage.id}`}
                          />
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end justify-center p-4"
                          >
                            <p className="text-white text-sm font-sofia">Gallery Image {index + 1}</p>
                          </motion.div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-gray-200 rounded-md p-4 flex items-center justify-center">
                        <p className="text-gray-600">No images found</p>
                      </div>
                    )}
                  </div>
                </StaggeredReveal>
              </div>
            </ScrollReveal>
            
            <ScrollReveal>
              <div>
                {venueId ? (
                  <PublicSocialLinks venueId={venueId} />
                ) : (
                  <div>Venue ID not found.</div>
                )}
              </div>
            </ScrollReveal>
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


