import MainFooter from "../layout/MainFooter";
import MainNavbar from '../layout/components/MainNavbar';
import Image2 from "../assets/images/Session_Road___Baguio_City__Philippines-removebg-preview.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logoES.png";

function AboutUs() {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  // Full paragraph content
  const fullText = `
    EventiSense was born from a shared vision between Jake Christon Agustin and Jeymark Bacurin, students at Data Center College of the Philippines, Baguio City. The journey began on August 12, 2024, when the duo recognized the complexity of event planning and the challenges faced by planners, suppliers, and venue managers in Baguio City. Inspired by the city's bustling event culture and its potential for growth, they aimed to create a solution that would revolutionize event management through technology.
    Traditional event planning often involves juggling multiple tasks, coordinating with numerous stakeholders, and dealing with unforeseen complications. These challenges motivated the development of EventiSense—an integrated event management system designed to simplify processes, enhance coordination, and provide real-time support.
    With the integration of advanced technologies like AI-powered chatbots, comprehensive directories for venues and suppliers, and a user-friendly interface, EventiSense aims to be the ultimate tool for event organizers. 
    It doesn't just cater to the needs of the event planners but also ensures a seamless experience for venue managers, suppliers, and event participants.
    EventiSense is more than just a tool; it is a vision to make event planning seamless, innovative, and accessible. By leveraging modern technologies, it seeks to address the unique challenges of event management in Baguio City while promoting local tourism and economic growth.
    As the development continues, the EventiSense team remains committed to innovation, collaboration, and the pursuit of excellence. The story of EventiSense is a testament to how a simple idea, driven by passion and determination, can evolve into a transformative solution for an entire industry.
  `;

  // Split the text into sentences
  const sentences = fullText.split('.');
  const truncatedText = sentences.slice(0, 4).join('. ') + '.';
  return (
    <div>
      <MainNavbar />
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex items-center justify-center text-white noise-bg py-[4rem] xl:py-[7rem]"
      >
        <div className="p-6 md:p-10 mx-auto text-center">
          <motion.h1 
            variants={fadeIn}
            className="uppercase text-4xl lg:text-5xl font-bold font-bonanova gradient-text leading-snug md:leading-normal lg:leading-relaxed text-shadow"
          >
            About Us
          </motion.h1>
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 xl:grid-cols-3 mt-[4rem] xl:mt-[10rem]"
          >
            <motion.section variants={fadeIn} className="font-montserrat text-lg lg:text-center text-left">
              <h1 className="font-bonanova gradient-text text-2xl uppercase">Who we are?</h1>
              <p className="mt-2 font-sofia">
                EventiSense is a cutting-edge event management platform designed
                exclusively for events in Baguio City. Our system combines
                AI-powered features, comprehensive directories, and
                user-friendly tools to create an effortless planning experience.
              </p>
            </motion.section>
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
            <motion.section variants={fadeIn}>
              <div className="pt-[2rem]">
                <Link to={"/contact"}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="md:block font-sofia flex md:mx-auto px-6 py-8 text-gray-200 text-[1.5rem] bg-gradient-to-r from-gray-400 via-gray-600 to-transparent rounded-lg shadow-md transition-transform duration-300"
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="bg-gray-50 py-[5rem]"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeIn}
            className="text-4xl font-bold text-center mb-8 text-gray-800/50 font-bonanova uppercase"
          >
            Why Choose EventiSense?
          </motion.h2>
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Card 1 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-pastelBlue p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                <span className="text-4xl text-blue-600">🌟</span>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">Easy to Use</h3>
              <p className="mt-2 text-gray-600">
                EventiSense simplifies event planning with an intuitive interface and powerful tools.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-pastelGreen p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                <span className="text-4xl text-green-600">🚀</span>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">Fast and Efficient</h3>
              <p className="mt-2 text-gray-600">
                Save time with our streamlined processes and quick access to trusted vendors.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-pastelYellow p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                <span className="text-4xl text-yellow-600">💡</span>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">Innovative Solutions</h3>
              <p className="mt-2 text-gray-600">
                Stay ahead with cutting-edge features designed to make your events unforgettable.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-pastelPink p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                <span className="text-4xl text-pink-600">📅</span>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">Seamless Scheduling</h3>
              <p className="mt-2 text-gray-600">
                Effortlessly manage your event timeline with our smart scheduling tools.
              </p>
            </motion.div>

            {/* Card 5 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-pastelPurple p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                <span className="text-4xl text-purple-600">🤝</span>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">Collaborative Platform</h3>
              <p className="mt-2 text-gray-600">
                Work seamlessly with your team and vendors in one unified platform.
              </p>
            </motion.div>

            {/* Card 6 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-pastelOrange p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center">
                <span className="text-4xl text-orange-600">📊</span>
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">Data-Driven Insights</h3>
              <p className="mt-2 text-gray-600">
                Make informed decisions with real-time analytics and reporting.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="bg-gray-50 py-12"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeIn}
            className="noise-bg rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row"
          >
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 relative"
            >
              <img
                src={Image2}
                alt="Session Road, Baguio City"
                className="w-auto h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 p-6 flex flex-col justify-center"
            >
              <h2 className="text-4xl font-bold gradient-text uppercase font-bonanova mb-4">
                Our Story
              </h2>
              <motion.div
                className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
                  isExpanded ? 'max-h-[1000px]' : 'max-h-[100px]'
                }`}
              >
                <p className="text-gray-400 font-sofia">
                  {isExpanded ? fullText : truncatedText}
                </p>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-300 hover:text-yellow-400/60 focus:outline-none mt-2 flex items-center"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-1 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="bg-gray-50 pb-12"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sofia"
          >
            {/* Mission Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="relative rounded-lg shadow-lg overflow-hidden h-[300px] noise-bg"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-4xl font-bold gradient-text mb-2 font-bonanova">Mission</h3>
                <p className="text-white py-6">
                  To revolutionize event planning by providing innovative, user-friendly tools that simplify the process and empower our users.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="relative rounded-lg shadow-lg overflow-hidden h-[300px] noise-bg"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-4xl font-bold gradient-text mb-2 font-bonanova">Vision</h3>
                <p className="text-white py-6">
                  To become the leading event management platform globally, known for our commitment to innovation and customer satisfaction.
                </p>
              </div>
            </motion.div>

            {/* Values Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="relative rounded-lg shadow-lg overflow-hidden h-[300px] noise-bg"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-4xl font-bold gradient-text mb-2 font-bonanova">Values</h3>
                <p className="text-white py-6">
                  We are committed to integrity, innovation, collaboration, and delivering exceptional value to our users.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="bg-gray-50 pb-[5rem]"
      >
        <div className="container mx-auto px-4 noise-bg py-12 rounded-lg font-sofia text-gray-400">
          <div className="text-center">
            <motion.h2 
              variants={fadeIn}
              className="text-4xl font-bold gradient-text font-bonanova mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-200 mb-8 mt-4"
            >
              Join thousands of others who are already benefiting from our services. Contact us today or subscribe to stay updated!
            </motion.p>
            <motion.div 
              variants={staggerContainer}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.a
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="bg-white font-sofia font-semibold py-3 px-8 rounded-lg shadow-lg text-gray-600 hover:bg-gray-100 transition duration-300"
              >
                Contact Us
              </motion.a>
              <motion.a
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/Create-Event"
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-yellow-600/80 transition duration-300"
              >
                Create Now 
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <MainFooter />
    </div>
  );
}

export default AboutUs;
