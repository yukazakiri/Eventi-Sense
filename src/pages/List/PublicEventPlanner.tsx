import { useState } from 'react';
import { Link } from 'react-router-dom';
import CardList from '../../layout/cards/EventPlanner/cardList';
import { HoverButton, HoverButton2, HoverButton3, HoverButton4, HoverButton5 } from '../../components/Button/button-hover';
import myImage from '../../assets/images/planner.jpg';
import myImage2 from '../../assets/images/plannerverti.jpg';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import MainFooter from '../../layout/MainFooter';
import MainNavbar from '../../layout/components/MainNavbar';
import useEventPlanners from '../../hooks/EventPlanner/useEventPlanners'; // Import the hook

const PublicEventPlanner = () => {
    const [filters, setFilters] = useState({
        searchQuery: '',
        location: '',
        minExperience: 0, // Added minExperience filter
        availability: false
    });

    const [showAllPlanners, setShowAllPlanners] = useState(false);

    // Use the useEventPlanners hook
    const { eventPlanners} = useEventPlanners(filters);

    // Unified filter handlers
    const handleFilterChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleViewAllClick = () => {
        setShowAllPlanners(true);
    };

    const handleViewLessClick = () => {
        setShowAllPlanners(false);
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
            <div className="min-h-screen bg-[#2F4157]">
                {/* Hero Section with Background Image */}
                <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${myImage})` }}
                    />
                    <div className="absolute inset-0 bg-gray-900/60"></div>
                    {/* Decorative Border */}
                    <div className="absolute inset-2 sm:inset-4 md:inset-6 border border-gray/20 pointer-events-none"></div>

                    <div className="relative h-full flex items-center">
                        <div className="container mx-auto px-4 sm:px-6">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 sm:mb-6 font-bonanova uppercase">
                                    Event Planners Directory
                                </h1>
                                <p className="text-md text-white/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl font-sofia tracking-widest">
                                    Find the perfect event planner for your special occasion. Browse our curated selection of experienced professionals ready to bring your vision to life.
                                </p>
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                    <HoverButton className="text-sm sm:text-base" onClick={scrollToTarget}>EXPLORE PLANNERS</HoverButton>
                                    <Link to="/contact">
                                    <HoverButton2 className="text-sm sm:text-base" >CONTACT NOW</HoverButton2>
                                    </Link>
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
                                        placeholder="Search event planners..."
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

                                {/* Experience Dropdown */}
                                <div className="w-full md:w-48 relative font-sofia tracking-widest">
                                    <select
                                        className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                                        value={filters.minExperience}
                                        onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value))}
                                    >
                                        <option value={0} className='text-gray-800/85'>Experience</option>
                                        <option value={1} className='text-gray-800/85'>1+ years</option>
                                        <option value={3} className='text-gray-800/85'>3+ years</option>
                                        <option value={5} className='text-gray-800/85'>5+ years</option>
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

                {/* Featured Event Planners Section */}
                <section  className='w-full h-full'>
                    <div id="targetSection" className='max-w-6xl mx-auto flex flex-col justify-center items-center py-10 pt-28 h-[20rem]'>
                        <h2 className="md:text-5xl text-xl font-bold font-bonanova gradient-text uppercase">Featured Event Planners</h2>
                        <p className="text-[#D9DACD] text-center mb-14 max-w-2xl mx-auto font-sofia tracking-wide pt-4">
                            Discover our handpicked selection of professional event planners who can make your special occasion unforgettable.
                        </p>
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

                {/* Event Planners List Section */}
                <section className='bg-white'>
                    <div className="mx-4 sm:mx-6 xl:mx-16 py-10 lg:border-r lg:border-b border-gray-600/20">
                        <div className="mx-auto max-w-7xl">
                            <div>
                                <CardList
                                    eventPlanners={eventPlanners} // Pass filtered event planners
                                    limit={showAllPlanners ? undefined : 4}
                                />

                                {/* Conditional Rendering for View All/View Less Buttons */}
                                {!showAllPlanners ? (
                                    <div className="flex justify-center mt-16">
                                        <HoverButton4 onClick={handleViewAllClick}>VIEW ALL PLANNERS</HoverButton4>
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
                                            alt="Event Planner"
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
                                                    Our Event Planners
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                                                    Each of our carefully selected event planners offers a unique set of skills and specialties. From intimate gatherings to grand celebrations, we have the perfect professional to bring your vision to life.
                                                </p>
                                            </div>

                                            {/* Contact Section */}
                                            <div className="text-left w-full">
                                                <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                                                    Contact
                                                </h2>
                                                <p className="text-gray-700 leading-relaxed mb-6 md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                                                    Do you have any questions about our event planners? We are happy to help:
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

export default PublicEventPlanner;