import { useState } from 'react';
import {  HoverButton3, HoverButton4} from '../../components/Button/button-hover';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';

import { SupplierFilters } from '../../hooks/Supplier/supplierFilter'; // Import SupplierFilters
import useSuppliers from '../../hooks/Supplier/useSupplier'; // Import useSuppliers
import CardSuppliers from '../../layout/cards/Supplier/cardList';
import { supplierServiceTypes } from '../../types/supplierServicesTypes';

const SeasideSupplierListing = () => {
  const [filters, setFilters] = useState<SupplierFilters>({
    searchQuery: '',
    serviceType: '', // Add serviceType filter
    location: '',   // Add location filter
    minRating: undefined, // Add minRating filter
  });

  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const { suppliers, loading, error } = useSuppliers(filters);

  const handleFilterChange = (field: keyof SupplierFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewAllClick = () => {
    setShowAllSuppliers(true);
  };

  const handleViewLessClick = () => {
    setShowAllSuppliers(false);
  };

  return (
    <> 
        <div className="min-h-screen ">
      {/* Hero Section with Background Image */}
      <div className="relative h-[20vh] ">
       
      <section className='w-full  h-full'>
            <div id="targetSection" className='max-w-6xl mx-auto flex flex-col justify-center items-center my-10   '>  
            <h2 className="md:text-5xl text-xl  font-bold font-bonanova gradient-text uppercase"> Featured Supplier</h2>
                  
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
                  placeholder="Search suppliers..."
                  className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 cursor-text placeholder:text-gray-400"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                />
                <BiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl" />
              </div>

              <div className="w-full md:w-48 relative font-sofia tracking-widest">
                <select
                  className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500 cursor-pointer"
                  value={filters.serviceType}
                  onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                >
                     <option value="" className='text-gray-800/85'>Service Type</option>
                    {supplierServiceTypes.map((type) => (
                        <option key={type} value={type} className='text-gray-800/85'>
                            {type}
                        </option>
                    ))}
                  {/* Add more service types as needed */}
                </select>
                <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
              </div>

              <div className="w-full md:w-48 relative font-sofia tracking-widest">
                <select
                  className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="" className='text-gray-800/85'>Location</option>
                  <option value="Baguio City" className='text-gray-800/85'>Baguio City</option>
                  <option value="La Trinidad" className='text-gray-800/85'>La Trinidad</option>
                  {/* Add more locations as needed */}
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
   

{/* Featured Suppliers Section */}
<section className='mt-10'>
<div className=" mx-4 sm:mx-6 xl:mx-24 py-10 lg:border-r lg:border-b border-gray-600/20">
        <div className="mx-auto max-w-7xl px-6 ">
         

          <div>
            {loading ? (
              <div className="text-center py-8">Loading suppliers...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading suppliers: </div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-8">No suppliers match your search criteria.</div>
            ) : (
              <CardSuppliers
                limit={showAllSuppliers ? undefined : 3}
                showAll={showAllSuppliers}
                handleViewLess={handleViewLessClick}
              />
            )}

            {!showAllSuppliers && suppliers.length > 3 && (
              <div className="flex justify-center mt-16">
                <HoverButton4 onClick={handleViewAllClick}>VIEW ALL SUPPLIERS</HoverButton4>
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

export default SeasideSupplierListing;