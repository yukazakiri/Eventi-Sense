import { useState } from 'react';
import { Calendar, BarChart2, MessageCircle, Shield, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentPage from './payment';

export default function ProPlanOverview({ onClose }: { onClose?: () => void }) {
  const [showPayment, setShowPayment] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  
  // Pricing calculations
  const monthlyPrice = 299;
  const annualPrice = 3588;
  const monthlyEquivalent = Math.round(annualPrice / 12);
  
  // Features list with icons
  const features = [
    {
      icon: <BarChart2 size={18} />,
      title: "Full Access to Directories",
      description: "Connect with trusted venues and suppliers"
    },
    {
      icon: <Calendar size={18} />,
      title: "Manage Up to 10 Events",
      description: "Run multiple projects efficiently"
    },
    {
      icon: <MessageCircle size={18} />,
      title: "AI Chatbot Support",
      description: "24/7 assistance for faster decisions"
    },
    {
      icon: <Calendar size={18} />,
      title: "Calendar & Registration Tools",
      description: "Schedule events and manage attendees"
    },
    {
      icon: <BarChart2 size={18} />,
      title: "Interactive Dashboard",
      description: "Track progress with real-time updates"
    }
  ];
  
  const planDetails = {
    name: 'Pro Plan',
    monthlyPrice: monthlyPrice,
    annualPrice: annualPrice,
    billingPeriod: isAnnual ? 'annual' : 'monthly' as 'annual' | 'monthly'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  // Close button animations
  const closeButtonVariants = {
    hover: { scale: 1.1, rotate: 90 },
    tap: { scale: 0.9 },
    initial: { opacity: 0, rotate: -90 },
    animate: { opacity: 1, rotate: 0, transition: { delay: 0.5, duration: 0.3 } }
  };

  if (showPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PaymentPage 
          selectedPlan={planDetails}
          onBack={() => setShowPayment(false)}
          onSuccess={() => {
            // Handle successful payment
            // e.g., redirect to dashboard
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg md:max-w-xl lg:max-w-2xl relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: `
            linear-gradient(#152131, #152131) padding-box,
            linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
          `,
          border: '1px solid transparent',
          borderRadius: '0.75rem'
        }}
      >
        {/* Close Button */}
        {onClose && (
          <motion.button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-300 hover:text-white rounded-full shadow-lg border border-gray-700"
            variants={closeButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            aria-label="Close modal"
          >
            <X size={18} />
          </motion.button>
        )}
        
        {/* Header */}
        <motion.div 
          className="p-6 md:p-8 border-b border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        > 
          <h2 className="text-xl md:text-2xl font-bold text-white">Pro Plan</h2>
          <p className="text-gray-400 mt-1 text-xs md:text-sm">
            Advanced tools for professional event planners
          </p>
        </motion.div>
        
        {/* Pricing Toggle and Display */}
        <motion.div 
          className="p-6 md:p-8 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <span className={`mr-3 text-xs md:text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button 
              className="relative w-10 md:w-12 h-5 md:h-6 rounded-full bg-gray-700 cursor-pointer"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle billing cycle"
            >
              <div 
                className={`absolute w-3 md:w-4 h-3 md:h-4 top-1 bg-white rounded-full transition-all duration-300 ease-in-out ${
                  isAnnual ? 'left-6 md:left-7' : 'left-1'
                }`} 
              />
            </button>
            <span className={`ml-3 text-xs md:text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>Annual</span>
            {isAnnual && <span className="ml-2 bg-green-900 text-green-200 text-xs px-2 py-0.5 rounded">Save 15%</span>}
          </div>
          
          {/* Price Display */}
          <div className="text-center mb-6">
            <p className="text-3xl md:text-4xl font-bold text-white">₱{isAnnual ? monthlyEquivalent : monthlyPrice}</p>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {isAnnual ? 'per month, billed annually' : 'per month, cancel anytime'}
            </p>
            {isAnnual && <p className="text-amber-300 text-xs md:text-sm mt-1">₱{annualPrice} total per year</p>}
          </div>
          
          {/* Update CTA Button */}
          <motion.button
            onClick={() => setShowPayment(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Upgrade to Pro</span>
            <motion.div
              animate={{ x: isHovering ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.button>
        </motion.div>
        
        {/* Features */}
        <motion.div 
          className="px-6 md:px-8 pb-6 md:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-white text-xs md:text-sm uppercase tracking-wider mb-4 font-medium">
            Included Features
          </h3>
          <ul className="space-y-3 md:space-y-4">
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex gap-2 md:gap-3"
                variants={featureVariants}
                custom={index}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="flex-shrink-0 text-amber-400 mt-1"
                  whileHover={{ scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <p className="text-white text-xs md:text-sm font-medium">{feature.title}</p>
                  <p className="text-gray-400 text-xs">
                    {feature.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
          
          {/* Guarantee */}
          <motion.div 
            className="mt-6 border border-gray-700 rounded p-2 md:p-3 flex items-center gap-2 md:gap-3 bg-gray-800 bg-opacity-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <Shield size={16} className="text-amber-400" />
            <p className="text-gray-300 text-xs">
              No-risk trial. Cancel or downgrade any time.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
      </div>
    );
}