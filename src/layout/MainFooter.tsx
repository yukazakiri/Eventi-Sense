import { motion } from 'framer-motion';
import { GoArrowRight } from 'react-icons/go';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaTripadvisor } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logoES.png';

function MainFooter() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const linkHoverVariants = {
    hover: { x: 8, transition: { duration: 0.2 } }
  };

  return (
    <div>
      <footer className="relative bg-[#2A3B4E] pt-8 gradient-border overflow-hidden">
        <motion.div 
          className="w-full px-4 md:px-8 lg:px-12 font-montserrat pt-12 md:pt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Main footer grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left column - Quick Links and Resources */}
            <motion.div 
              className="font-sofia flex flex-col justify-center items-center md:items-start"
              variants={itemVariants}
            >
              <div className="flex flex-wrap w-full">
                {/* Quick Links Section */}
                <div className="w-full md:w-1/2 mb-8 font-bonanova text-center md:text-left px-4">
                  <motion.span 
                    className="block uppercase font-semibold mb-4 text-white text-xl md:text-2xl"
                    variants={itemVariants}
                  >
                    Quick Links
                  </motion.span>
                  <ul className="list-none text-gray-400 text-lg">
                    {[
                      { name: 'About Us', href: '/about' },
                      { name: 'Contact Us', href: '/contact' },
                      { name: 'Services', href: '/services' }
                    ].map((item, index) => (
                      <motion.li key={index} variants={itemVariants}>
                        <motion.div whileHover="hover" variants={linkHoverVariants}>
                          <NavLink 
                            to={item.href}
                            className="font-semibold pb-3 hover:text-white transition-colors flex items-center justify-center md:justify-start"
                          >
                            {item.name}
                          </NavLink>
                        </motion.div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Other Resources Section */}
                <div className="w-full md:w-1/2 font-bonanova mb-8 text-center md:text-left px-4">
                  <motion.span 
                    className="block uppercase font-semibold mb-4 text-white text-xl md:text-2xl"
                    variants={itemVariants}
                  >
                    Other Resources
                  </motion.span>
                  <ul className="list-none text-gray-400 text-lg">
                    {[
                      { name: 'Terms & Conditions', href: '/terms' },
                      { name: 'Privacy Policy', href: '/privacy' },
                    ].map((item, index) => (
                      <motion.li key={index} variants={itemVariants}>
                        <motion.div whileHover="hover" variants={linkHoverVariants}>
                          <NavLink 
                            to={item.href}
                            className="font-semibold pb-3 hover:text-white transition-colors flex items-center justify-center md:justify-start"
                          >
                            {item.name}
                          </NavLink>
                        </motion.div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Right column - Website Info */}
            <motion.div 
              className="flex flex-col border-t lg:border-t-0 lg:border-l border-gray-500/40 pt-8 lg:pt-0 px-4"
              variants={itemVariants}
            >
              <motion.div 
                className="mb-8 flex justify-center"
                whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
              >
                {/* Logo on left */}
                <div className="flex-shrink-0">
             <NavLink to="/" >
            <div className="h-14 w-14 mb-2">
          <img src={logo} alt="Background" className="h-full w-full object-contain" />
         </div>
         </NavLink>
       
            </div>
              </motion.div>
              
              <motion.div 
                className="text-center space-y-2 font-sofia text-base md:text-lg"
                variants={itemVariants}
              >
                <motion.h2 
                  className="text-xl md:text-4xl  gradient-text uppercase font-bonanova"
                  whileHover={{ scale: 1.05 }}
                >
                  EventiSense
                </motion.h2>
                <div className='pt-'>
                <p className="text-gray-300">2nd Floor, Building</p>
                <p className="text-gray-300">Upper Bonifacio Street</p>
                <p className="text-gray-300">Baguio City</p>
                <div className='py-6'>
                <p className="text-gray-300">+421 45 530 00 00</p>
                <p className="text-gray-300 mb-6">info@eventisense.com</p>
                </div>
                </div>
                <motion.div 
                  className="flex justify-center gap-6 mt-8"
                  variants={itemVariants}
                >
                  {[
                    { icon: <FaTripadvisor size={20} />, href: "#" },
                    { icon: <FaFacebook size={20} />, href: "#" },
                    { icon: <FaInstagram size={20} />, href: "#" },
                    { icon: <FaYoutube size={20} />, href: "#" }
                  ].map((item, index) => (
                    <motion.a 
                      key={index}
                      href={item.href} 
                      className="text-gray-300 hover:text-white"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.icon}
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Enhanced wave section */}
        <section className="relative mt-12">
          <div className="ocean">
            <div>
              <svg className="waves w-full" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                <defs>
                  <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className="parallax">
                  <motion.use 
                    xlinkHref="#gentle-wave" 
                    x="48" 
                    y="0" 
                    fill="rgba(23, 32, 43,0.4)" 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  />
                  <motion.use 
                    xlinkHref="#gentle-wave" 
                    x="48" 
                    y="3" 
                    fill="rgba(23, 32, 43,0.6)" 
                    animate={{ x: ["0%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  />
                  <motion.use 
                    xlinkHref="#gentle-wave" 
                    x="48" 
                    y="5" 
                    fill="rgba(23, 32, 43,0.8)" 
                    animate={{ x: ["-120%", "80%"] }}
                    transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                  />
                  <motion.use 
                    xlinkHref="#gentle-wave" 
                    x="48" 
                    y="7" 
                    fill="#445468" 
                    animate={{ x: ["-50%", "150%"] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  />
                </g>
              </svg>
            </div>
          </div>
        </section>

        <div className="bg-[#445468] h-full text-white font-sofia p-6">
          <div className="pt-24 pb-12 md:pt-32 md:pb-16">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center">
              <motion.h1 
                className="font-bonanova font-extralight text-2xl md:text-4xl text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Join the experience
              </motion.h1>
              
              <motion.p 
                className="mt-2 max-w-full md:max-w-[18rem] text-xs tracking-wide text-gray-200 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Exclusive offers, easy bookings, and personalized stays await when you sign up.
              </motion.p>
              
              {/* More Details Button with enhanced hover effects */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative mt-4 md:mt-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 0.9 }}
                  className="h-full w-full bg-gray-200 rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 absolute inset-0"
                />
                <NavLink to="/register">
                  <button className="w-auto h-12 md:h-14 px-6 py-2 rounded-full hover:rounded-full transform transition-all duration-500 ease-in-out
                    bg-transparent hover:w-28 md:hover:w-36 hover:h-28 md:hover:h-36 text-white relative group z-10 flex items-center justify-center">
                    <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out text-sm">Sign Up</span>
                    <GoArrowRight
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                      size={24}
                    />
                  </button>
                </NavLink>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="flex flex-wrap items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-full px-4 text-center">
              <div className="text-xs sm:text-sm text-gray-300 py-1">
                Copyright © <span id="get-current-year">2024</span> EventiSense. All rights reserved.
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default MainFooter;