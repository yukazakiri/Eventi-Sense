
import Process from './Process';
import MainNavbar from '../../layout/components/MainNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import PartnerForm from './Form';
import { useState, useEffect } from 'react';
import  supabase  from '../../api/supabaseClient';
import { toast } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (!user) {
      toast.error('Please login first to continue with partner registration');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div>
      <MainNavbar/>
      <div className='bg-[#2F4157] min-h-screen'>
        <div className='container mx-auto py-28'>
          <div className='flex flex-col lg:flex-row gap-4 items-start'>
            {/* Aside content */}
            <aside className='lg:w-1/3 lg:sticky lg:top-16 space-y-2 px-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mb-6 mt-4'
              >
                <h1 className='text-2xl font-bonanova font-semibold text-white mb-2'>
                  Join Our Network of Event Suppliers and Venues
                </h1>
                <p className='text-md font-sofia text-gray-300 mt-4'>
                  Be a part of EventiSense and simplify your event management.
                </p>
              </motion.div>

              {/* Partner Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className='rounded-lg shadow-md p-6'
                style={{
                  background: `
                    linear-gradient(#152131, #152131) padding-box,
                    linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                  `,
                  border: '1px solid transparent',
                  borderRadius: '0.75rem'
                }}
              >
                <div className='space-y-4 font-sofia'>
                  <h3 className='text-xl font-semibold text-gray-200 tracking-wide'>
                    Become an EventiSense Partner
                  </h3>
                  <p className='text-gray-200 text-sm'>
                    Join our trusted network of event professionals and grow your business through our platform.
                  </p>
                  <ul className='space-y-2 text-sm text-gray-200 mb-4'>
                    <li className='flex items-center'>
                      <span className='text-green-600 mr-2'>✔</span>
                      Increase your visibility
                    </li>
                    <li className='flex items-center'>
                      <span className='text-green-600 mr-2'>✔</span>
                      Manage bookings efficiently
                    </li>
                    <li className='flex items-center'>
                      <span className='text-green-600 mr-2'>✔</span>
                      Secure payment processing
                    </li>
                  </ul>
          
                  {!user && (
                      <div className=" text-sm text-red-400 mt-4">
                        Please login first
                      </div>
                    )}
                  <motion.button
                    onClick={handleGetStarted}
                    whileHover={{ 
                      scale: user ? 1.02 : 1,
                      background: user 
                        ? 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)'
                        : 'linear-gradient(to right, #4b5563, #6b7280)'
                    }}
                    whileTap={{ scale: user ? 0.98 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-full py-3 px-6 rounded-md font-medium text-white shadow-lg relative ${
                      !user ? 'cursor-not-allowed opacity-75 ' : ''
                    }`}
                    style={{
                      background: user 
                        ? 'linear-gradient(to right, #2563eb, #1d4ed8)'
                        : 'linear-gradient(to right, #4b5563, #6b7280)'
                    }}
                  >
                 
                    Get Started
                  </motion.button>
     
                </div>
              </motion.div>
            </aside>

            {/* Main content */}
            <motion.main 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='lg:w-2/3'
            >
              <div className="mb-6 text-left">
                <h1 className="text-4xl gradient-text font-bold font-bonanova mb-2 underline">
                  Partner Application Process
                </h1>
              </div>
              <Process/>
            </motion.main>
          </div>
        </div>
      </div>
        {/* Modal */}
    <AnimatePresence>
      {isModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="min-h-screen px-4 text-center">
              <div className="inline-block align-middle my-8 w-full max-w-4xl">
                <div className="relative">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white z-50"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <PartnerForm />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </div>

  
  );
}

export default Home;