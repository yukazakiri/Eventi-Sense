import { useState } from 'react';
import CardVenues from '../../layout/cards/Venue/cardList';
import {  HoverButton3, HoverButton4} from '../../components/Button/button-hover';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

import { VenueFilters } from '../../hooks/Venues/venueFilter';
import useVenues from '../../hooks/Venues/useVenues';
  import {venueTypes } from '../../types/venueTypes';


const SeasideVenueListing = () => {
   
    const [filters, setFilters] = useState<VenueFilters>({
        searchQuery: '',
        price: '',
        capacity: '',
        venueType: ''
      });
    
      const [showAllVenues, setShowAllVenues] = useState(false);
      const { venues, loading, error } = useVenues(filters);
    
      // Unified filter handlers
      const handleFilterChange = (field: keyof VenueFilters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
      };
    

  const handleViewAllClick = () => {
    setShowAllVenues(true);
  };

  const handleViewLessClick = () => {
    setShowAllVenues(false);
  };
 
  return (
    <>

    <div className="min-h-screen ">
      {/* Hero Section with Background Image */}
      <div className="relative h-[20vh] ">
      
      <section className='w-full  h-full'>
            <div id="targetSection" className='max-w-6xl mx-auto flex flex-col justify-center items-center my-10   '>  
            <h2 className="md:text-5xl text-xl  font-bold font-bonanova gradient-text uppercase"> Featured Venues</h2>
                  
            </div>
</section>
        {/* Search Bar Overlay at Bottom of Hero */}
        <div className="absolute -bottom-16 sm:-bottom-20 md:-bottom-12 left-0 right-0 backdrop-blur-sm py-4 sm:py-6 max-w-7xl mx-auto font-sofia tracking-widest text-xs sm:text-sm shadow-lg shadow-black/30 bg-navy-blue-5/95">
          {/* Decorative Border */}
          <div className="absolute inset-2 sm:inset-3 border border-white/20 pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
         {/* Updated Search Inputs */}
      <div className="w-full md:flex-1 relative">
        <input 
          type="text" 
          placeholder="Search venues..." 
          className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 cursor-text placeholder:text-gray-400"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        />
        <BiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl" />
      </div>

              
              <div className="w-full md:w-48 relative font-sofia tracking-widest">
              <select 
                className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500 cursor-pointer"
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
                >
                  <option value="" className='text-gray-800/85'>Price Range</option>
                  <option value="0-1000" className='text-gray-800/85'>₱0 - ₱1,000</option>
                  <option value="1000-5000" className='text-gray-800/85'>₱1,000 - ₱5,000</option>
                  <option value="5000-10000" className='text-gray-800/85'>₱5,000 - ₱10,000</option>
                  <option value="10000+" className='text-gray-800/85'>₱10,000+</option>
                </select>
                <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
              </div>
              <div className="w-full md:w-48 relative font-sofia tracking-widest">
                <select
                    className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                    value={filters.venueType}
                    onChange={(e) => handleFilterChange('venueType', e.target.value)}
                >
                    <option value="" className='text-gray-800/85'>Venue Type</option>
                    {venueTypes.map((type) => (
                        <option key={type} value={type} className='text-gray-800/85'>
                            {type}
                        </option>
                    ))}
                </select>
                <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
            </div>
              
              <div className="w-full md:w-48 relative font-sofia tracking-widest">
                <select 
                  className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                >
                  <option value="" className='text-gray-800/85'>Capacity</option>
                  <option value="0-50" className='text-gray-800/85'>Up to 50 guests</option>
                  <option value="50-100" className='text-gray-800/85'>50 - 100 guests</option>
                  <option value="100-300" className='text-gray-800/85'>100 - 300 guests</option>
                  <option value="300+" className='text-gray-800/85'>300+ guests</option>
                </select>
                <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
              </div>
          
              <HoverButton3 
                className="w-full md:w-auto text-sm sm:text-base px-6 py-2 sm:py-3"
                onClick={() => handleFilterChange('searchQuery', filters.searchQuery)}
              >
                SEARCH
              </HoverButton3>
            </div>
          </div>
        </div>
      </div>
  

      {/* Featured Venues Section */}
      <section className=''>
      <div className=" mx-4 sm:mx-6 xl:mx-24 py-10 lg:border-r lg:border-b border-gray-600/20 mt-10">
        <div className="mx-auto max-w-7xl px-6 ">
         
          
          <div>
            {loading ? (
              <div className="text-center py-8">Loading venues...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading venues: </div>
            ) : venues.length === 0 ? (
              <div className="text-center py-8">No venues match your search criteria.</div>
            ) : (
              <CardVenues 
                venues={venues}
                limit={showAllVenues ? undefined : 3}
                showAll={showAllVenues}
                handleViewLess={handleViewLessClick}
              />
            )}
            
            {!showAllVenues && venues.length > 3 && (
              <div className="flex justify-center mt-16">
                <HoverButton4 onClick={handleViewAllClick}>VIEW ALL VENUES</HoverButton4>
              </div>
            )}
          </div>
        </div>
      </div>

   
      </section>

    </div>
    </>
  );
};

export default SeasideVenueListing;