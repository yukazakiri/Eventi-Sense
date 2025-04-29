import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion'; // Import more framer-motion features
import { useInView } from 'react-intersection-observer';
import MainFooter from '../layout/MainFooter';
import MainNavbar from '../layout/components/MainNavbar';
import ProPlanOverview from './ProPlan/Proplan';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const navigate = useNavigate();
  
  // Animation controls
  const headerControls = useAnimation();
  const cardsControls = useAnimation();
  const whyChooseControls = useAnimation();
  const faqControls = useAnimation();
  
  // Intersection observers
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [whyChooseRef, whyChooseInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [faqRef, faqInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Start animations when sections come into view
  useEffect(() => {
    if (headerInView) headerControls.start('visible');
    if (cardsInView) cardsControls.start('visible');
    if (whyChooseInView) whyChooseControls.start('visible');
    if (faqInView) faqControls.start('visible');
  }, [headerInView, cardsInView, whyChooseInView, faqInView, headerControls, cardsControls, whyChooseControls, faqControls]);

  // Update the pricingPlans array to include textColor property
  const pricingPlans = [
      {
        // Free Plan
        name: 'Free Plan',
        price: 'Free',
        description: 'Perfect for getting started with basic event planning',
        features: [
          'Access to basic venue and supplier directories',
          'Limited to 2 active event project',
          'Basic event creation',
          'View-only access to calendar and event schedules',
        ],
        cta: 'Get Started',
        url: '/register',
        popular: false,
        bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
        textColor: 'text-gray-800', // Dark text for light background
        descriptionColor: 'text-gray-600',
        iconColor: 'text-green-500',
        borderColor: 'border-green-200',
        buttonStyle: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      },
      {
        // Pro Plan
        name: 'Pro Plan',
        price: isAnnual ? '₱3,588/year' : '₱299/month',
        description: 'Advanced features for professional event planners',
        features: [
          'Access to full venue and supplier directories',
          'Manage up to 10 active event projects',
          'AI-powered chatbot assistance',
          'Calendar scheduling and attendee registration tools',
          'Event dashboard for tracking and quick updates',
        ],
        cta: 'Upgrade Now',
        url: '/upgrade-pro',
        popular: true,
        bgColor: 'bg-gradient-to-br from-navy-blue-3 to-navy-blue-4',
        textColor: 'text-white', // Light text for dark background
        descriptionColor: 'text-gray-300',
        iconColor: 'text-cyan-300',
        borderColor: 'border-yellow-300',
        buttonStyle: 'bg-gradient-to-r from-navy-blue-1 to-cyan-600 hover:from-navy-blue-2 hover:to-cyan-700',
      },
      {
        // Business Plan
        name: 'Business Plan',
        price: isAnnual ? '₱5,988/year' : '₱499/month',
        description: 'Full-featured solution for growing businesses',
        features: [
          'Unlimited active event projects',
          'Customizable event templates',
          'Advanced event management tools',
          'Integrated ticketing system and attendee management',
          'Event performance evaluation and reporting tools',
          'Budget planner and financial tracking features',
        ],
        cta: 'Upgrade Now',
        url: '/upgrade-business',
        popular: false,
        bgColor: 'bg-gradient-to-br from-indigo-700 to-navy-blue-4',
        textColor: 'text-white', // Light text for dark background
        descriptionColor: 'text-gray-300',
        iconColor: 'text-indigo-300',
        borderColor: 'border-indigo-600',
        buttonStyle: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      },
      {
        name: 'Partner Plan',
        price: 'Apply Now',
        description: 'Become a listed Supplier or Venue Manager on EventiSense',
        features: [
          'Create and manage your own business profile',
          'Showcase services or venues to thousands of users',
          'Receive direct booking inquiries from planners',
          'Access analytics and engagement reports',
          'Personalized support and onboarding',
        ],
        cta: 'Become a Partner',
        url: '/partner-application', // You can create this route for the application form
        popular: false,
        bgColor: 'bg-gradient-to-br from-cyan-100 to-cyan-200',
        textColor: 'text-gray-800',
        descriptionColor: 'text-gray-600',
        iconColor: 'text-cyan-700',
        borderColor: 'border-cyan-300',
        buttonStyle: 'bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-800 hover:to-cyan-900',
      }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: i * 0.15,
        type: "spring",
        stiffness: 100 
      }
    }),
    hover: {
      y: -12,
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const featureItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  const toggleVariants = {
    monthly: { x: 0 },
    annual: { x: 32 }
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20 
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };


  return (
    <div>
      <MainNavbar />
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-[#2F4157] to-[#1e2a38] py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-24 font-sofia">
          {/* Pricing Header */}
          <motion.div 
            ref={headerRef}
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate={headerControls}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.7,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.h1 
                className="text-5xl font-semibold gradient-text mb-6 font-bonanova mx-auto max-w-4xl"
                animate={floatingAnimation}
              >
                Flexible Pricing, Tailored to Your Needs
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Choose a plan that fits your business and scale effortlessly as you grow.
            </motion.p>
            
            {/* Toggle for Monthly/Annual Billing */}
            <motion.div 
              className="mt-8 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className={`text-gray-300 font-medium ${!isAnnual ? 'text-white' : ''}`}>Monthly</span>
              <motion.button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`mx-4 w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  isAnnual ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="bg-white w-6 h-6 rounded-full shadow-md"
                  variants={toggleVariants}
                  animate={isAnnual ? "annual" : "monthly"}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                ></motion.div>
              </motion.button>
              <span className={`text-gray-300 font-medium ${isAnnual ? 'text-white' : ''}`}>Annual</span>
              {isAnnual && (
                <motion.span 
                  className="ml-2 bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  Save 15%
                </motion.span>
              )}
            </motion.div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div 
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            variants={staggerContainerVariants}
            initial="hidden"
            animate={cardsControls}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className={`rounded-3xl shadow-xl overflow-hidden transition-transform duration-300 group ${
                  plan.popular ? `border-2 ${plan.borderColor} ring-2 ring-yellow-300/50 shadow-yellow-300/20` : `border ${plan.borderColor}`
                } ${plan.bgColor}`}
              >
                {/* Card Header */}
                <div className="p-6 relative">
                  {/* Popular Badge */}
           
{plan.popular && (
  <motion.div 
    className="absolute top-6 right-6 bg-yellow-400 text-navy-blue-4 text-xs font-bold px-3 py-1 rounded-full"
    initial={{ 
      opacity: 0, 
      scale: 0,
      backgroundPosition: "200% 0" 
    }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      backgroundPosition: "-200% 0"
    }}
    transition={{ 
      opacity: { delay: 0.5 + index * 0.1, duration: 0.5 },
      scale: { delay: 0.5 + index * 0.1, type: "spring", stiffness: 500 },
      backgroundPosition: {
        repeat: Infinity,
        duration: 3,
        ease: "linear"
      }
    }}
    style={{
      background: "linear-gradient(90deg, #FFD700, #FFC107, #FFD700)",
      backgroundSize: "200% 100%"
    }}
  >
    POPULAR
  </motion.div>
)}

                  {/* Plan Name */}
                  <h2 className={`text-2xl font-bold mb-2 ${plan.textColor}`}>{plan.name}</h2>
                  <p className={`text-sm mb-4 ${plan.descriptionColor}`}>{plan.description}</p>
                  
                  {/* Plan Price */}
                  <motion.div 
                    className="my-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.p 
                      className={`text-4xl font-bold ${plan.textColor}`}
                      key={plan.price} // This ensures the animation triggers when price changes
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {plan.price}
                    </motion.p>
                    {plan.price !== 'Free' && plan.price !== 'Contact Us for a Quote' && (
                      <p className={`text-sm mt-1 ${plan.descriptionColor}`}>
                        {isAnnual ? 'Billed annually' : 'Billed monthly'}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Plan Features */}
                <div className="px-6 pb-4">
                  <div className="h-px bg-gray-600/30 mb-6"></div>
                  <motion.ul 
                    className="mb-8 space-y-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {plan.features.map((feature, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-start"
                        custom={idx}
                        variants={featureItemVariants}
                      >
                        <motion.svg
                          className={`w-5 h-5 ${plan.iconColor} mr-3 mt-0.5 flex-shrink-0`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            delay: 0.3 + idx * 0.1,
                            type: "spring",
                            stiffness: 300
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                        <span className={`text-sm ${plan.textColor}`}>{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* Call-to-Action Button */}
                <div className="px-6 pb-6">
                  <motion.button
                    onClick={() => {
                      if (plan.name === 'Pro Plan') {
                        setShowProModal(true);
                      } else {
                        navigate(plan.url);
                      }
                    }}
                    className={`w-full py-3 px-4 font-semibold rounded-xl transition-all duration-300 text-white ${plan.buttonStyle} shadow-lg`}
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Why Choose EventiSense Section */}
          <motion.div 
            ref={whyChooseRef}
            className="mt-24 text-center bg-navy-blue-4/30 rounded-3xl p-12 max-w-5xl mx-auto backdrop-blur-sm border border-navy-blue-3 flex flex-col"
            variants={fadeIn}
            initial="hidden"
            animate={whyChooseControls}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div 
                className="inline-block mb-2 px-4 py-1 bg-navy-blue-3/50 text-cyan-300 rounded-full font-medium text-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(56, 189, 248, 0.5)"
                }}
              >
                Why EventiSense?
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-3xl font-bold gradient-text font-bonanova mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Unlock Your Event Planning Potential
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Simplify event planning with cutting-edge tools. Access comprehensive resources to streamline your workflow. Enjoy flexible pricing designed to fit your needs.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button 
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Start for Free
              </motion.button>
              
              <motion.button 
                className="bg-transparent border border-cyan-500 text-cyan-400 font-semibold py-3 px-8 rounded-xl hover:bg-cyan-500/10 transition-all duration-300"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                Schedule a Demo
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div 
            ref={faqRef}
            className="mt-24 max-w-4xl mx-auto"
            variants={fadeIn}
            initial="hidden"
            animate={faqControls}
          >
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-block mb-2 px-4 py-1 bg-navy-blue-3/50 text-cyan-300 rounded-full font-medium text-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(56, 189, 248, 0.5)"
                }}
              >
                Frequently Asked Questions
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Got Questions?
              </motion.h2>
              
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Find answers to common questions about our pricing plans
              </motion.p>
            </motion.div>
            
            {/* Add FAQ content here */}
          </motion.div>
        </div>
 
     {/* Pro Plan Modal */}
<AnimatePresence>
  {showProModal && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 p-4 pt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="relative"
        variants={popIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ProPlanOverview onClose={() => setShowProModal(false)} />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        
        <MainFooter />
      </motion.div>
    </div>
  );
};

export default PricingPage;