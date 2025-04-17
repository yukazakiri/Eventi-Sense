
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import SurveyForm from "./SurveyForm";
import supabase from '../api/supabaseClient';
import { FiX, FiMessageSquare, FiSmile } from 'react-icons/fi';
import { PiShootingStar } from 'react-icons/pi';

// Animation variants for different components
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

function SurveyDisplay() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  // Update initial position to top right
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: - 825 });
  const dragControls = useDragControls();
  
  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({ ...prev, x: window.innerWidth - 300 }));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      setLoading(false);
    };
    fetchUser();
  }, []);
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }));
  };


  if (loading) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Draggable Card Container */}
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, y: position.y }}
        animate={{ x: position.x, y: position.y }}
        className="fixed z-50 cursor-move"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
        className="bg-white rounded-lg shadow-2xl p-4 w-64  "
        style={{
          animation: 'bounce 1.7s infinite'
        }}


          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-gray-800/90 font-medium">
            Help us make event planning better for everyone!
            </h2>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
            >
              <PiShootingStar className="text-yellow-500" size={20} />
            </motion.div>
          </div>
          
          <motion.button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-white
              px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300
              flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <FiMessageSquare className="animate-pulse" size={20} />
            <span className="font-medium">Share Feedback</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal with enhanced animations */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                duration: 0.5
              }}
              className="flex min-h-full items-center justify-center p-4"
            >
              <motion.div 
                className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-purple-100 dark:border-purple-900"
                style={{
                  background: `
                    linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                  `,
                  border: '1px solid transparent',
                  borderRadius: '0.75rem'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden"
                  style={{
                    background: `
                      linear-gradient(#152131, #152131) padding-box,
                      linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                    `,
                    border: '1px solid transparent',
                    borderRadius: '0.75rem'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="relative z-10 flex justify-between items-center">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <h2 className="text-3xl font-bold bg-clip-text font-bonanova gradient-text">Help Shape Eventi-Sense</h2>
                      <div className="flex items-center mt-2 space-x-2">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                        >
                          <FiSmile size={20} />
                        </motion.div>
                        <p className="opacity-90 font-sofia">Your voice matters to us!</p>
                      </div>
                    </motion.div>
                    <motion.button 
                      whileHover={{ scale: 1.05, rotate: 45 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-gray-200 transition-all duration-300 p-2 rounded-full hover:bg-white/10"
                    >
                      <FiX size={24} />
                    </motion.button>
                  </div>
                  <motion.div 
                    className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.7, 0.5]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut"
                    }}
                  ></motion.div>
                </motion.div>

                <motion.div 
                  className="p-8 max-h-[80vh] overflow-y-auto bg-gradient-to-b from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 mt-[1px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {userId ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <SurveyForm userId={userId} onClose={() => setIsOpen(false)} />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center py-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                        Join us to share your thoughts!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Sign in to help us create an even better experience for everyone.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SurveyDisplay;