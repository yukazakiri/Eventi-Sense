import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverButton, HoverButton3, HoverButton4, HoverButton5 } from '../../components/Button/button-hover';
import myImage from '../../assets/images/iStock-13447299461.jpg';
import myImage2 from '../../assets/images/venue-chair.jpg';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import MainFooter from '../../layout/MainFooter';
import { SupplierFilters } from '../../hooks/Supplier/supplierFilter';
import useSuppliers from '../../hooks/Supplier/useSupplier';
import CardSuppliers from '../../layout/cards/Supplier/cardList';
import { supplierServiceTypes } from '../../types/supplierServicesTypes';
import { Link } from 'react-router-dom';
import MainNavbar from '../../layout/components/MainNavbar';

const SeasideSupplierListing = () => {
  const [filters, setFilters] = useState<SupplierFilters>({
    searchQuery: '',
    serviceType: '',
    location: '',
    minRating: undefined,
  });

  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const { suppliers, loading, error } = useSuppliers(filters);
  const [_isInView, setIsInView] = useState(false);

  const handleFilterChange = (field: keyof SupplierFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewAllClick = () => setShowAllSuppliers(true);
  const handleViewLessClick = () => setShowAllSuppliers(false);

  const scrollToTarget = () => {
    const targetElement = document.getElementById('targetSection');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    if (targetSection) observer.observe(targetSection);
    
    return () => {
      if (targetSection) observer.unobserve(targetSection);
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  return (
    <>  
      <MainNavbar/>
      <div className="min-h-screen bg-[#2F4157]">
        {/* Hero Section */}
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
          <motion.div
            initial={{ scale: 1.05, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${myImage})` }}
          />
          <div className="absolute inset-0 bg-gray-900/60"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-2 sm:inset-4 md:inset-6 border border-white/20 pointer-events-none"
          />

          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div 
                className="max-w-3xl"
                variants={heroContentVariants}
                initial="hidden"
                animate="visible"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 sm:mb-6 font-serif uppercase">
                  City of Pines Suppliers
                </h1>
                <p className="text-md text-white/90 leading-relaxed mb-6 sm:mb-10 max-w-2xl font-sofia tracking-widest">
                  Discover a curated selection of suppliers nestled amidst the cool, misty heights of Baguio.
                </p>
                <motion.div 
                  className="flex flex-wrap gap-3 sm:gap-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HoverButton className="text-sm sm:text-base" onClick={scrollToTarget}>
                    EXPLORE SUPPLIERS
                  </HoverButton>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div 
            variants={searchBarVariants}
            initial="hidden"
            animate="visible"
            className="absolute -bottom-16 sm:-bottom-20 md:-bottom-12 left-0 right-0 backdrop-blur-sm py-4 sm:py-6 max-w-7xl mx-auto font-sofia tracking-widest text-xs sm:text-sm shadow-lg shadow-black/30 bg-navy-blue-5/95"
          >
            <div className="absolute inset-2 sm:inset-3 border border-white/20 pointer-events-none"></div>
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
                <div className="w-full md:flex-1 relative">
                  <motion.input 
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.2)" }}
                    type="text" 
                    placeholder="Search suppliers..." 
                    className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 cursor-text placeholder:text-gray-400"
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  />
                  <BiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl" />
                </div>

                <motion.div 
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="w-full md:w-48 relative font-sofia tracking-widest"
                >
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
                  </select>
                  <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
                </motion.div>

                <motion.div 
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="w-full md:w-48 relative font-sofia tracking-widest"
                >
                  <select
                    className="w-full py-2 sm:py-3 px-4 bg-transparent focus:outline-none text-gray-300 appearance-none border-l border-gray-500/50 cursor-pointer"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  >
                    <option value="" className='text-gray-800/85'>Location</option>
                    <option value="Baguio City" className='text-gray-800/85'>Baguio City</option>
                    <option value="La Trinidad" className='text-gray-800/85'>La Trinidad</option>
                  </select>
                  <MdOutlineKeyboardArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg sm:text-xl pointer-events-none" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <HoverButton3 
                    className="w-full md:w-auto text-sm sm:text-base px-6 py-2 sm:py-3"
                    onClick={() => handleFilterChange('searchQuery', filters.searchQuery)}
                  >
                    SEARCH
                  </HoverButton3>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

     
        {/* Suppliers Section */}
        <section className='bg-white py-10'>
          <motion.div 
            className="mx-4 sm:mx-6 xl:mx-24 py-10 lg:border-r lg:border-b border-gray-600/20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="mx-auto max-w-7xl px-6">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-red-500"
                  >
                    Error loading suppliers: {error?.toString()}
                  </motion.div>
                ) : suppliers.length === 0 && !loading ? (
                  <motion.div 
                    key="no-suppliers"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    No suppliers match your search criteria.
                  </motion.div>
                ) : (
                  <motion.div
                    key="suppliers"
                    variants={fadeInUp}
                  >
                    <CardSuppliers 
                  
                      loading={loading}
                      limit={showAllSuppliers ? undefined : 3}
                      showAll={showAllSuppliers}
                      handleViewLess={handleViewLessClick}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!loading && !showAllSuppliers && suppliers.length > 3 && (
                <motion.div 
                  className="flex justify-center mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <HoverButton4 onClick={handleViewAllClick}>
                      VIEW ALL SUPPLIERS
                    </HoverButton4>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div 
            className="py-12 md:py-20 mt-2 mx-4 sm:mx-6 lg:mx-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="px-4 sm:px-6">
              <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
                <motion.div 
                  className="flex justify-center items-center w-full lg:w-auto"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <div className="relative w-full max-w-[400px] lg:w-[400px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px]">
                    <motion.div 
                      className="absolute inset-2 md:inset-4 border border-white/90 pointer-events-none" 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    />
                    <motion.div
                      initial={{ scale: 1.05, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="w-full h-full"
                    >
                      <img 
                        src={myImage2} 
                        alt="Supplier" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gray-900/60" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div 
                  className="w-full border-t lg:border-l border-gray-600/20 lg:border-t hover:border-gray-600/40 transition-all duration-300 
                            hover:translate-x-[4px] hover:translate-y-[4px] 
                            hover:shadow-[-4px_-4px_8px_#b1b4b2]
                            active:translate-x-[0px] active:translate-y-[0px] 
                            active:shadow-none origin-top-left"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="max-w-4xl py-6 md:py-8 lg:pl-8 xl:pl-12">
                    <motion.div 
                      className="flex flex-col justify-start items-start gap-6 md:gap-8"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                    >
                      <motion.div 
                        className="text-left"
                        variants={fadeInUp}
                      >
                        <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                          Our Suppliers
                        </h2>
                        <p className="text-gray-700 leading-relaxed md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                          We partner with a wide range of suppliers to ensure your event is a success. From caterers to photographers, we have you covered.
                        </p>
                      </motion.div>

                      <motion.div 
                        className="text-left w-full"
                        variants={fadeInUp}
                      >
                        <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4 md:mb-6">
                          Contact
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-6 md:mb-8 font-sofia tracking-wide text-sm sm:text-base">
                          Do you have any questions about our suppliers? We are happy to help:
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Link to="/contact">
                            <HoverButton5 className="w-full md:w-auto">
                              SUPPLIER INQUIRIES
                            </HoverButton5>
                          </Link>
                        </motion.div>
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
                          Seestraße 19<br />
                          18119 Rostock-Warnemünde<br />
                          Deutschland
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

export default SeasideSupplierListing;