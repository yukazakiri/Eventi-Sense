import MainNavbar from '../layout/components/MainNavbar'
import Button from "../components/Button/button";
import CardList from "../layout/cards/Event/landingList";
import Cardvenues from "../layout/cards/Venue/cardListLanding";
import CardSuppliers from "../layout/cards/Supplier/cardListLanding";
import MainFooter from "../layout/MainFooter";

import { Link, NavLink } from "react-router-dom";
import { HoverButton } from "../components/Button/button-hover";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import myImage from '../assets/images/format/bg-landing.webp';
import logo from '../assets/images/logoES.png';
import {  GoArrowRight } from 'react-icons/go';

const content: { title: string; text: string }[] = [
  { title: "Event Planning Tools", text: "Effortlessly create and manage event schedules with tools designed for efficiency. From budget planning to task management, EventiSense ensures every detail is organized and on track." },
  { title: "Event Collaboration Tools", text: "Seamlessly share event details with your team or clients for smooth collaboration. Assign tasks, track progress, and keep everyone aligned with real-time updates." },
  { title: "AI-Powered Chatbot Assistance", text: "Effortlessly create and manage event schedules with tools designed for efficiency. From budget planning to task management, EventiSense ensures every detail is organized and on track." },
];

const content1: { title: string; text: string }[] = [
  { 
    title: "Event Analytics", 
    text: "Track event performance with detailed analytics and insights. Measure attendance, engagement, and ROI to improve future events." 
  },
  { 
    title: "Customizable Event Templates", 
    text: "Save time with pre-designed, customizable event templates. Tailor them to your needs and ensure consistency across all your events." 
  },
  { 
    title: "Attendee Engagement Tools", 
    text: "Boost attendee interaction with polls, surveys, and live Q&A sessions. Keep your audience engaged and gather valuable feedback in real-time." 
  }
];

function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="static bg-white"
      ref={containerRef}
    > 
      <MainNavbar />
      <div className="bg-navy-blue-5/95">
      <div className="relative h-screen min-h-[400px]">
      <motion.div
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${myImage})` }}
      />
      <div className="absolute inset-0 bg-gray-950/70"></div>
      
      {/* Centered Text Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 space-y-4 md:space-y-6"
      > 
        <div className="flex flex-col items-center space-y-4 sm:space-y-5 md:space-y-6">
          <div className="h-16 w-16 sm:h-20 sm:w-20 mb-2">
            <img src={logo} alt="Logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-bonanova text-white">
            EventiSense
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-sofia max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            Discover the perfect venues, suppliers, and tools for extraordinary experiences
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-block mt-2 sm:mt-4"
          >
            <motion.div 
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 0.9 }}
              className="absolute inset-0 bg-gray-200 rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100"
            ></motion.div>
            <Link to="/Pricing">
              <button 
                className="px-5 sm:px-6 h-12 sm:h-14 rounded-full hover:rounded-full transform transition-all duration-500 ease-in-out
                bg-transparent hover:w-32 sm:hover:w-36 hover:h-32 sm:hover:h-36 text-white relative group z-10"
              >
                <span className="group-hover:opacity-0 transition-opacity duration-300 font-sofia tracking-widest ease-in-out text-sm whitespace-nowrap">
                  Get Started 
                </span>
                <motion.div
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GoArrowRight
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    size={24}
                  />
                </motion.div>
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Border with animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-2 sm:inset-4 md:inset-6 border border-white/20 pointer-events-none"
      />
    </div>


        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto px-4 md:px-8 xl:px-[2rem] 3xl:px-[16rem] py-[4rem] bg-white"
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <h1 className="text-4xl font-bold font-bonanova text-gray-800/40 uppercase">Upcoming Events</h1>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end font-sofia cursor-pointer mr-6"
          >
            <motion.div 
              whileHover={{ scale: 1.05, borderColor: "#4a5568" }}
              className='text-gray-700 font-sofia border-[1px] px-3 py-2 border-gray-700/70'
            >
              <NavLink to="/event-list"> View All </NavLink>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-[1rem]"
          > 
            <CardList limit={4}/>
          </motion.div>  
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative bg-navy-blue-5/95 py-[2rem]"
        >
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mx-4 2xl:mx-[12rem] xl:mx-[8rem] my-[4rem]"
          >
            <div className="flex justify-between py-[10px]">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold font-bonanova gradient-text uppercase"
              >
                Venues
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-white flex justify-end font-sofia cursor-pointer hover:text-yellow-300"
              >
                <HoverButton> 
                  <NavLink to="/venue-list"> View All </NavLink>
                </HoverButton> 
              </motion.div> 
            </div>
            <Cardvenues limit={3} />
          </motion.section>
          
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-4 2xl:mx-[16rem] xl:mx-[8rem] my-[4rem]"
          >
            <div className="flex justify-between py-[10px]">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-4xl font-bold font-bonanova gradient-text uppercase"
              >
                Suppliers
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-white flex justify-end font-sofia cursor-pointer hover:text-yellow-300"
              >
                <HoverButton>
                  <NavLink to="/supplier-list"> View All </NavLink>
                </HoverButton> 
              </motion.div>
            </div>
            <CardSuppliers limit={3} />
          </motion.section>
        </motion.section>
      </div>
         
      <motion.section 
        style={{ opacity, scale }}
        className="flex justify-center items-center my-[4rem]"
      >
        <div className="text-center py-[4rem]">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-bonanova text-gray-800/50 uppercase"
          >
            EVERYTHING YOU NEED TO KNOW
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-800/90 font-regular text-[1.2rem] w-auto md:w-[35rem] py-[2rem] mx-auto font-sofia"
          >
            EventiSense is a cutting-edge event management platform designed to simplify and streamline event planning for organizers, venue managers, suppliers, and users. Our comprehensive features empower users to create, manage, and execute events effortlessly, leveraging AI-driven tools, advanced directories, and seamless collaboration features. Accessible across multiple devices, EventiSense ensures convenience, efficiency, and enhanced decision-making at every stage of the event planning process.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  label="Contact Us"
                  gradientText={true}
                  variant="secondary"
                />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.1 }}
        className="2xl:mx-[10rem] xl:mx-[5rem] py-[5rem] noise-bg rounded-[5rem]"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center my-[2rem]"
        >
          <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold font-bonanova gradient-text uppercase">Our Key features</h1>
        </motion.div> 
        <div className="grid lg:grid-cols-3">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="flex justify-center items-center font-sofia"
          >
            <div className="lg:space-y-6 p-6">
              {content.map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={featureCardVariants}
                  whileHover={{ x: -5 }}
                  className="lg:space-y-2 text-white lg:text-end text-center"
                >
                  <h2 className="text-lg font-meduim">{item.title}</h2>
                  <p className="text-sm font-thin pb-10 lg:pb-[4rem] text-gray-300">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="justify-center items-center relative lg:flex hidden">
            <div className="gradient-backgroundsimple rounded-full flex items-center justify-center md:w-[6.9rem] md:h-[7rem] lg:w-[16rem] lg:h-[16rem] relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/6 -left-1/6 w-[25rem] h-[25rem] rounded-full border-[1px] border-yellow-500/70" 
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex-shrink-0">
                  <NavLink to="/">
                    <div className="h-24 w-24">
                      <img src={logo} alt="Background" className="h-full w-full object-contain" />
                    </div>
                  </NavLink>
                </div>
              </motion.button>
            </div>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
            className="flex justify-center items-center font-sofia"
          >
            <div className="lg:space-y-6 p-6">
              {content1.map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={featureCardVariants}
                  whileHover={{ x: 5 }}
                  className="lg:space-y-2 text-white lg:text-start text-center"
                >
                  <h2 className="text-lg font-meduim">{item.title}</h2>
                  <p className="text-sm font-thin pb-10 lg:pb-[4rem] text-gray-300">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section> 
      <motion.section 
        style={{ opacity, scale }}
        className="flex justify-center items-center my-[4rem]"
      >
        <div className="text-center py-[4rem]">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-bonanova text-gray-800/50 uppercase"
          >
             Our goal is simple
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-800/90 font-regular text-[1.2rem] w-auto md:w-[35rem] py-[2rem] mx-auto font-sofia"
          >
         To help you master the art of celebration, coordination, and unforgettable moments.
         This is more than a directory—it’s your key to effortless event excellence. </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
          
          </motion.div>
        </div>
      </motion.section>
   


      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className=""
      >
        <MainFooter />
      </motion.div>
    </motion.section>
  );
}

export default HomePage;
