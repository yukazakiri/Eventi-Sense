import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import CardList from '../../layout/cards/Event/cardList';
import { HoverButton3, HoverButton4, HoverButton5 } from '../../components/Button/button-hover';
import myImage from '../../assets/images/events.jpg';
import myImage2 from '../../assets/images/plannerverti.jpg';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import MainFooter from '../../layout/MainFooter';
import MainNavbar from '../../layout/components/MainNavbar';
import useEvents from '../../hooks/Events/useEvents'; // Updated hook for events
import { GoArrowDown } from "react-icons/go";
import { eventCategories } from "./constants/category";

const AllEventList = () => {
    const [filters, setFilters] = useState({
        searchQuery: '',
        location: '',
        category: '',
        minTicketPrice: 0,
        maxTicketPrice: 1000,
    });

    const [showAllEvents, setShowAllEvents] = useState(false);
    const [isInView, setIsInView] = useState(false);
    
    // Scroll progress for parallax effects
    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 300], [0, -50]);


    // Use the useEvents hook
    const { events } = useEvents(filters);

    // Unified filter handlers
    const handleFilterChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };
    
    const handleCategoryChange = (category: string) => {
        setFilters((prev) => ({ ...prev, category }));
    };
    
    const handleViewAllClick = () => {
        setShowAllEvents(true);
    };

    const handleViewLessClick = () => {
        setShowAllEvents(false);
    };

    const scrollToTarget = () => {
        const targetElement = document.getElementById('targetSection');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Set up intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        const targetSection = document.getElementById('targetSection');
        if (targetSection) {
            observer.observe(targetSection);
        }
        
        return () => {
            if (targetSection) {
                observer.unobserve(targetSection);
            }
        };
    }, []);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                ease: "easeOut" 
            }
        }
    };

    const heroContentVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    const searchBarVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.8
            }
        }
    };
    
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };
    

    
    const cardContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };
    
    const aboutSectionVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };
    
    const imageFrameVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.02,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <>
            <MainNavbar />
            <div className="min-h-screen bg-[#2F4157]">
                {/* Hero Section with Background Image and Parallax Effect */}
                <motion.div 
                    className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                            backgroundImage: `url(${myImage})`,
                            y: headerY 
                        }}
                    />
                    <div className="absolute inset-0 bg-gray-900/60"></div>
                    {/* Decorative Border with Animation */}
                    <motion.div 
                        className="absolute inset-2 sm:inset-4 md:inset-6 border border-gray-400/20 pointer-events-none"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />

                    <div className="relative h-full flex items-center">
                        <div className="container mx-auto px-4 sm:px-6">
                            <motion.div 
                                className="max-w-3xl"
                                variants={heroContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.h1 
                                    className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 sm:mb-6 font-bonanova uppercase"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    Events Directory
                                </motion.h1>
                                <motion.p 
                                    className="text-md text-white/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl font-sofia tracking-widest"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5 }}
                                >
                                    Discover exciting events near you. Browse our curated selection of events and find the perfect one to attend.
                                </motion.p>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-block"
                >
                  <motion.div 
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.9 }}
                    className="absolute inset-0 bg-gray-200 rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100"
                  ></motion.div>
                  <button 
                    onClick={scrollToTarget} 
                    className="px-6 h-14 rounded-full hover:rounded-full transform transition-all duration-500 ease-in-out
                    bg-transparent hover:w-36 hover:h-36 text-white relative group z-10"
                  >
                    <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out text-sm whitespace-nowrap">
                      More Details
                    </span>
                    <motion.div
                      initial={{ rotate: 180 }}
                      animate={{ rotate: scrollY.get() > 50 ? 0 : 180 }}
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
                        </div>
                    </div>

                    {/* Search Bar Overlay at Bottom of Hero */}
                    <motion.div 
                        className="absolute -bottom-16 sm:-bottom-20 md:-bottom-12 left-0 right-0 backdrop-blur-sm py-4 sm:py-6 max-w-7xl mx-auto font-sofia tracking-widest text-xs sm:text-sm shadow-lg shadow-black/30 bg-navy-blue-5/95"
                        variants={searchBarVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Decorative Border */}
                        <div className="absolute inset-2 sm:inset-3 border border-white/20 pointer-events-none"></div>
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
                                {/* Search Input */}
                                <motion.div 
                                    className="w-full md:flex-1 relative"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 cursor-text placeholder:text-gray-400"
                                        value={filters.searchQuery}
                                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    />
                                    <BiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl" />
                                </motion.div>

                                {/* Location Dropdown */}
                                <motion.div 
                                    className="w-full md:w-48 relative font-sofia tracking-widest"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <select
                                        className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                    >
                                        <option value="" className='text-gray-800/85'>Location</option>
                                        <option value="Baguio City" className='text-gray-800/85'>Baguio City</option>
                                        <option value="La Trinidad" className='text-gray-800/85'>La Trinidad</option>
                                        <option value="Benguet" className='text-gray-800/85'>Benguet</option>
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
                                </motion.div>

                                {/* Category Dropdown */}
                                <motion.div 
                                    className="w-full md:w-48 relative font-sofia tracking-widest"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <select 
                                        onChange={(e) => handleCategoryChange(e.target.value)}    
                                        className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                                    >
                                        <option value="" className='text-gray-800/85'>All Categories</option>
                                        {eventCategories.map((category) => (
                                            <option key={category.id} value={category.name} className='text-gray-800/85'>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <HoverButton3
                                        className="w-full md:w-auto text-sm sm:text-base px-6 py-2 sm:py-3"
                                        onClick={() => {}} // Apply filters
                                    >
                                        SEARCH
                                    </HoverButton3>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Featured Events Section */}
           
       
                <section className='w-full h-full'>
                    <motion.div 
                        id="targetSection" 
                        className='max-w-6xl mx-auto flex flex-col justify-center items-center py-6 pt-20 h-[8rem]'
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h2 
                            className="md:text-3xl text-xl font-bold font-bonanova gradient-text uppercase"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Featured Events Section
                        </motion.h2>
                    </motion.div>
                </section>

                {/* Wave Section with Animation */}
                <section className='relative'>
                    <motion.div 
                        className="ocean"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    >
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
                    </motion.div>
                </section>

                {/* Events List Section with Stagger Animation */}
                <section className='bg-white'>
                    <motion.div 
                        className="mx-4 sm:mx-6 xl:mx-20 py-10 lg:border-r lg:border-b border-gray-600/20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={cardContainerVariants}
                    >
                        <div className="mx-auto max-w-7xl">
                            <div>
                                <AnimatePresence mode="wait">
                                    <CardList
                                        events={events}
                                        limit={showAllEvents ? undefined : 3}
                                    />
                                </AnimatePresence>

                                {/* Conditional Rendering for View All/View Less Buttons */}
                                <motion.div 
                                    className="flex justify-center mt-16"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    {!showAllEvents ? (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <HoverButton4 onClick={handleViewAllClick}>VIEW ALL EVENTS</HoverButton4>
                                        </motion.div>
                                    ) : (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <HoverButton4 onClick={handleViewLessClick}>VIEW LESS</HoverButton4>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* About Section with Animation */}
                    <motion.div 
                        className="py-12 md:py-20 mt-2 mx-4 sm:mx-6 lg:mx-10"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={aboutSectionVariants}
                    >
                        <div className="px-4 sm:px-6">
                            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
                                {/* Image Column with Animation */}
                                <motion.div 
                                    className="flex justify-center items-center w-full lg:w-auto"
                                    variants={imageFrameVariants}
                                    whileHover="hover"
                                >
                                    <div className="relative w-full max-w-[400px] lg:w-[400px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px]">
                                        <motion.div 
                                            className="absolute inset-2 md:inset-4 border border-white/90 pointer-events-none"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.5 }}
                                        />
                                        <motion.img
                                            src={myImage2}
                                            alt="Event"
                                            className="w-full h-full object-cover"
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                        <div className="absolute inset-0 bg-gray-900/60" />
                                    </div>
                                </motion.div>

                                {/* Content Column with Animation */}
                                <motion.div 
                                    className="w-full border-t lg:border-l border-gray-600/20 lg:border-t hover:border-gray-600/40 transition-all duration-300
                                            hover:translate-x-[4px] hover:translate-y-[4px]
                                            hover:shadow-[-4px_-4px_8px_#b1b4b2]
                                            active:translate-x-[0px] active:translate-y-[0px]
                                            active:shadow-none origin-top-left"
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="max-w-4xl py-6 md:py-8 lg:pl-8 xl:pl-12">
                                        <motion.div 
                                            className="flex flex-col justify-start items-start gap-6 md:gap-8"
                                            variants={staggerContainer}
                                        >
                                            {/* About Section */}
                                            <motion.div 
                                                className="text-left"
                                                variants={fadeInUp}
                                            >
                                                <motion.h2 
                                                    className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6"
                                                    variants={fadeInUp}
                                                >
                                                    Our Events
                                                </motion.h2>
                                                <motion.p 
                                                    className="text-gray-700 leading-relaxed md:mb-8 font-sofia tracking-wide text-sm sm:text-base"
                                                    variants={fadeInUp}
                                                >
                                                    Explore a variety of events tailored to your interests. From music festivals to art exhibitions, we have something for everyone.
                                                </motion.p>
                                            </motion.div>

                                            {/* Contact Section */}
                                            <motion.div 
                                                className="text-left w-full"
                                                variants={fadeInUp}
                                            >
                                                <motion.h2 
                                                    className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6"
                                                    variants={fadeInUp}
                                                >
                                                    Contact
                                                </motion.h2>
                                                <motion.p 
                                                    className="text-gray-700 leading-relaxed mb-6 md:mb-8 font-sofia tracking-wide text-sm sm:text-base"
                                                    variants={fadeInUp}
                                                >
                                                    Do you have any questions about our events? We are happy to help:
                                                </motion.p>
                                                <Link to="/contact">
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <HoverButton5 className="w-full md:w-auto">
                                                            CONTACT US
                                                        </HoverButton5>
                                                    </motion.div>
                                                </Link>

                                                <motion.h2 
                                                    className="text-2xl md:text-3xl font-light text-gray-800 mt-6 md:mt-8"
                                                    variants={fadeInUp}
                                                >
                                                    Address
                                                </motion.h2>
                                                <motion.address 
                                                    className="text-gray-700 not-italic leading-relaxed font-sofia tracking-wide text-sm sm:text-base mt-2 md:mt-4"
                                                    variants={fadeInUp}
                                                >
                                                    Session Road<br />
                                                    Baguio City<br />
                                                    Philippines
                                                </motion.address>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>
                <MainFooter />
            </div>
        </>
    );
};

export default AllEventList;