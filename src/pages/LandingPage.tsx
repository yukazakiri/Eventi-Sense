import MainNavbar from '../layout/components/MainNavbar'
import Button from "../components/Button/button";
import CardList from "../layout/cards/Event/landingList";
import Cardvenues from "../layout/cards/Venue/cardListLanding";
import CardSuppliers from "../layout/cards/Supplier/cardListLanding";
import MainFooter from "../layout/MainFooter";
import ReviewSection from "../layout/cards/Review/cardDesign";
import { Link, NavLink } from "react-router-dom";
import { HoverButton } from "../components/Button/button-hover";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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

  const fadeInUp = {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        type: "spring",
        damping: 15
      }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };


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
        <section className="noise-bg h-auto py-[6rem]">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 items-center justify-center text-white mx-4 2xl:mx-[16rem] xl:mx-[8rem]"
          >
            <div className="p-6 md:py-[5rem] text-left">
              <motion.p 
                variants={fadeInUp}
                className="text-5xl font-semibold font-bonanova leading-snug md:leading-normal lg:leading-relaxed"
              >
                Your dream event is just a click away with 
              </motion.p>
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-4xl lg:text-[3rem] font-bold font-bonanova gradient-text leading-snug md:leading-normal lg:leading-relaxed uppercase"
              >
                EventiSense
              </motion.h1>
            </div>
            <motion.div 
              variants={fadeInUp}
              className="p-6 lg:p-[5rem]"
            >
              <div className="font-sofia text-justify">
                <p>
                  EventiSense simplifies your event planning with powerful tools designed to help you coordinate smarter, manage faster, and connect deeper with trusted venues and suppliers.
                </p>
              </div>
              <div className="pt-6 flex  md:flex-row gap-4">
                <Link to="/Pricing">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    label="Get Started for Free"
                    gradientText={true}
                    variant="secondary"
                  />
                </motion.div>
                </Link>
                <Link to="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    label="Book a Demo"
                    gradientText={true}
                    variant="primary"
                  />
                </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>

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
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="text-sm font-thin pb-10 lg:pb-[4rem]">
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
                className="absolute -top-1/6 -left-1/6 w-[25rem] h-[25rem] rounded-full border-[1px] border-yellow-400" 
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="absolute top-0 left-0 w-full h-full"
              >
                <motion.h1 
                  animate={{ 
                    textShadow: ["0px 0px 5px rgba(255,255,255,0.5)", "0px 0px 15px rgba(255,255,255,0.8)", "0px 0px 5px rgba(255,255,255,0.5)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-bold font-bonanova gradient-text text-[1.3rem] md:text-[2.2rem]"
                >
                  EventiSense
                </motion.h1>
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
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="text-sm font-thin pb-10 lg:pb-[4rem]">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section> 

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.1 }}
        className="my-[4rem]"
      >
        <ReviewSection/>
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
