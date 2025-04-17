import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface HeroSectionProps {
  event: {
    image_url: string;
    name: string;
    description: string;
    date: string;
    location: string;
    capacity: string;
    ticket_price: number;
  };
  onOpenModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ event }) => {
  const [imageError, setImageError] = React.useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  React.useEffect(() => {
    const img = new Image();
    img.src = event.image_url;
    img.onerror = () => setImageError(true);
  }, [event.image_url]);

  React.useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 50,
          damping: 15,
          duration: 0.8,
          delayChildren: 0.3,
          staggerChildren: 0.1,
        },
      });
    }
  }, [controls, inView]);

  const backgroundVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      } 
    }
  };

  const textVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="relative h-[60vh] md:h-[65vh] lg:h-[65vh] overflow-hidden"
    >
      <motion.div
        variants={backgroundVariants}
        className="absolute inset-0 bg-cover bg-center bg-gray-800"
        style={{
          backgroundImage: !imageError ? `url(${event.image_url})` : 'none',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-4 sm:inset-6 md:inset-8 lg:inset-10 border border-white/30 pointer-events-none"
      />

      <div className="relative h-full flex items-center justify-center">
        <motion.div 
          variants={containerVariants}
          className="container mx-auto px-6 sm:px-8 lg:px-12 text-center"
        >
          <motion.h1
            variants={textVariants}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold gradient-text font-bonanova uppercase leading-tight mb-4"
          >
            {event.name}
          </motion.h1>
          <motion.p
            variants={textVariants}
            className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed mb-8 max-w-2xl mx-auto font-sofia tracking-wide"
          >
            {event.description}
          </motion.p>
          {/* Button component for booking tickets with hover and tap animations 
          <motion.button
            variants={textVariants}
            whileHover={{ scale: 1.05, backgroundColor: "#4F46E5" }}
            whileTap={{ scale: 0.98 }}
            className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-200"
            onClick={onOpenModal}
          >
            Book Tickets
          </motion.button>*/}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;