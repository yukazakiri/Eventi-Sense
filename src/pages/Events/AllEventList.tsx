import { useState } from 'react';
import { Link } from 'react-router-dom';
import CardList from '../../layout/cards/Event/cardList';
import { HoverButton, HoverButton2, HoverButton3, HoverButton4, HoverButton5 } from '../../components/Button/button-hover';
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

    // Use the useEvents hook
    const { events, loading, error } = useEvents(filters);

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

    return (
        <>
            <MainNavbar />
            <div className="min-h-screen bg-[#2F4157]">
                {/* Hero Section with Background Image */}
                <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${myImage})` }}
                    />
                    <div className="absolute inset-0 bg-gray-900/60"></div>
                    {/* Decorative Border */}
                    <div className="absolute inset-2 sm:inset-4 md:inset-6 border border-gray-400/20 pointer-events-none"></div>

                    <div className="relative h-full flex items-center">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 sm:mb-6 font-bonanova uppercase">
                                    Events Directory
                                </h1>
                                <p className="text-md text-white/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl font-sofia tracking-widest">
                                    Discover exciting events near you. Browse our curated selection of events and find the perfect one to attend.
                                </p>
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                        <button     onClick={scrollToTarget} className="w-auto  h-14 px-4 py-2 rounded-full  hover:rounded-full transform transition-all duration-500 ease-in-out
                                                               hover:bg-[#2F4157] bg-[#2F4157] hover:w-36 hover:h-36 hover:text-yellow-400/50 text-white relative group">
                                                  <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out">More Details</span>
                                                  <    GoArrowDown 
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                                                    size={24}
                                                  />
                                                </button>   
                              
                                   
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar Overlay at Bottom of Hero */}
                    <div className="absolute -bottom-16 sm:-bottom-20 md:-bottom-12 left-0 right-0 backdrop-blur-sm py-4 sm:py-6 max-w-7xl mx-auto font-sofia tracking-widest text-xs sm:text-sm shadow-lg shadow-black/30 bg-navy-blue-5/95">
                        {/* Decorative Border */}
                        <div className="absolute inset-2 sm:inset-3 border border-white/20 pointer-events-none"></div>
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
                                {/* Search Input */}
                                <div className="w-full md:flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 cursor-text placeholder:text-gray-400"
                                        value={filters.searchQuery}
                                        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                    />
                                    <BiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl" />
                                </div>

                                {/* Location Dropdown */}
                                <div className="w-full md:w-48 relative font-sofia tracking-widest">
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
                                </div>

                                {/* Category Dropdown */}
                                <div className="w-full md:w-48 relative font-sofia tracking-widest">
                                <select onChange={(e) => handleCategoryChange(e.target.value)}    className="w-full  py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                                       >
                                    <option value="" className='text-gray-800/85'>All Categories</option>
                                    {eventCategories.map((category) => (
                                    <option key={category.id} value={category.name}  className='text-gray-800/85'>
                                        {category.name}
                                    </option>
                                    ))}
                                </select>
                                    <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
                                </div>

                                <HoverButton3
                                    className="w-full md:w-auto text-sm sm:text-base px-6 py-2 sm:py-3"
                                    onClick={() => {}} // Apply filters
                                >
                                    SEARCH
                                </HoverButton3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Events Section */}
                <section className='w-full h-full'>
                    <div id="targetSection" className='max-w-6xl mx-auto flex flex-col justify-center items-center py-6 pt-20 h-[12rem]'>
                        <h2 className="md:text-5xl text-xl font-bold font-bonanova gradient-text uppercase">Featured Events</h2>
                    
                    </div>
                </section>

                {/* Wave Section */}
                <section className='relative'>
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

                {/* Events List Section */}
                <section className='bg-white'>
                    <div className="mx-4 sm:mx-6 xl:mx-20 py-10 lg:border-r lg:border-b border-gray-600/20">
                        <div className="mx-auto max-w-7xl">
                            <div>
                                <CardList
                                    events={events}
                                    limit={showAllEvents ? undefined : 3}
                                />

                                {/* Conditional Rendering for View All/View Less Buttons */}
                                {!showAllEvents ? (
                                    <div className="flex justify-center mt-16">
                                        <HoverButton4 onClick={handleViewAllClick}>VIEW ALL EVENTS</HoverButton4>
                                    </div>
                                ) : (
                                    <div className="flex justify-center mt-16">
                                        <HoverButton4 onClick={handleViewLessClick}>VIEW LESS</HoverButton4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="py-12 md:py-20 mt-2 mx-4 sm:mx-6 lg:mx-10">
                        <div className="px-4 sm:px-6">
                            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
                                {/* Image Column */}
                                <div className="flex justify-center items-center w-full lg:w-auto">
                                    <div className="relative w-full max-w-[400px] lg:w-[400px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px]">
                                        <div className="absolute inset-2 md:inset-4 border border-white/90 pointer-events-none" />
                                        <img
                                            src={myImage2}
                                            alt="Event"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gray-900/60" />
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="w-full border-t lg:border-l border-gray-600/20 lg:border-t hover:border-gray-600/40 transition-all duration-300
                                        hover:translate-x-[4px] hover:translate-y-[4px]
                                        hover:shadow-[-4px_-4px_8px_#b1b4b2]
                                        active:translate-x-[0px] active:translate-y-[0px]
                                        active:shadow-none origin-top-left">
                                    <div className="max-w-4xl py-6 md:py-8 lg:pl-8 xl:pl-12">
                                        <div className="flex flex-col justify-start items-start gap-6 md:gap-8">
                                            {/* About Section */}
                                            <div className="text-left">
                                                <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                                                    Our Events
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                                                    Explore a variety of events tailored to your interests. From music festivals to art exhibitions, we have something for everyone.
                                                </p>
                                            </div>

                                            {/* Contact Section */}
                                            <div className="text-left w-full">
                                                <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                                                    Contact
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed mb-6 md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                                                    Do you have any questions about our events? We are happy to help:
                                                </p>
                                                <Link to="/contact">
                                                    <HoverButton5 className="w-full md:w-auto">
                                                        CONTACT US
                                                    </HoverButton5>
                                                </Link>

                                                <h2 className="text-2xl md:text-3xl font-light text-gray-800 mt-6 md:mt-8">
                                                    Address
                                                </h2>
                                                <address className="text-gray-700 not-italic leading-relaxed font-sofia tracking-wide text-sm sm:text-base mt-2 md:mt-4">
                                                    Session Road<br />
                                                    Baguio City<br />
                                                    Philippines
                                                </address>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <MainFooter />
            </div>
        </>
    );
};

export default AllEventList;