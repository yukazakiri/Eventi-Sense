import { useState } from 'react';
import { HoverButton, HoverButton2, HoverButton3, HoverButton4, HoverButton5 } from '../../components/Button/button-hover';
import myImage from '../../assets/images/iStock-13447299461.jpg';
import myImage2 from '../../assets/images/venue-chair.jpg';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import MainFooter from '../../layout/MainFooter';
import { SupplierFilters } from '../../hooks/Supplier/supplierFilter'; // Import SupplierFilters
import useSuppliers from '../../hooks/Supplier/useSupplier'; // Import useSuppliers
import CardSuppliers from '../../layout/cards/Supplier/cardList';
import { supplierServiceTypes } from '../../types/supplierServicesTypes';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-pastelGray text-gray-800">
      {/* Hero Section with Background Image */}
      <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${myImage})` }}
        />
        <div className="absolute inset-0 bg-gray-900/60"></div>
        {/* Decorative Border */}
        <div className="absolute inset-2 sm:inset-4 md:inset-6 border border-white/20 pointer-events-none"></div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 sm:mb-6 font-bonanova uppercase">
                City of Pines Suppliers
              </h1>
              <p className="text-md text-white/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl font-sofia tracking-widest">
                Discover a curated selection of suppliers nestled amidst the cool, misty heights of Baguio.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <HoverButton className="text-sm sm:text-base">EXPLORE SUPPLIERS</HoverButton>
                <HoverButton2 className="text-sm sm:text-base">CONTACT NOW</HoverButton2>
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
<div className=" mx-4 sm:mx-6 xl:mx-24 py-20 mt-20 lg:border-r lg:border-b border-gray-600/20">
        <div className="mx-auto max-w-7xl px-6 ">
          <h2 className="text-4xl font-semibold tracking-wide uppercase text-gray-600 mb-2 text-center font-bonanova">Featured Suppliers</h2>
          <p className="text-gray-600 text-center mb-14 max-w-2xl mx-auto font-sofia tracking-wide">
            Discover our handpicked selection of suppliers that offer a unique atmosphere and stunning views.
          </p>

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

      {/* About Section */}
      <div className="py-12 md:py-20 mt-2 mx-4 sm:mx-6 lg:mx-10">
        {/* About section content (unchanged) */}
        <div className="px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
            {/* Image Column */}
            <div className="flex justify-center items-center w-full lg:w-auto">
              <div className="relative w-full max-w-[400px] lg:w-[400px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px]">
                <div className="absolute inset-2 md:inset-4 border border-white/90 pointer-events-none" />
                <img
                  src={myImage2}
                  alt="Supplier"
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
                  {/* Suppliers Section */}
                  <div className="text-left">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                      Our Suppliers
                    </h2>
                    <p className="text-gray-700 leading-relaxed md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                      We partner with a wide range of suppliers to ensure your event is a success. From caterers to photographers, we have you covered.
                    </p>
                  </div>

                  {/* Contact Section */}
                  <div className="text-left w-full">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                      Contact
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-6 md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                      Do you have any questions about our suppliers? We are happy to help:
                    </p>
                    <Link to="/contact">
                    <HoverButton5 className="w-full md:w-auto">
                      SUPPLIER INQUIRIES
                    </HoverButton5>
                    </Link>

                    <h2 className="text-2xl md:text-3xl font-light text-gray-800 mt-6 md:mt-8">
                      Address
                    </h2>
                    <address className="text-gray-700 not-italic leading-relaxed font-sofia tracking-wide text-sm sm:text-base mt-2 md:mt-4">
                      Seestraße 19<br />
                      18119 Rostock-Warnemünde<br />
                      Deutschland
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  );
};

export default SeasideSupplierListing;