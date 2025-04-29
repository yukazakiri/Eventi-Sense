import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../../api/supabaseClient';
import logo from '../../assets/images/logoES.png';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isResetSent, setIsResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      // Request password reset from Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https:/eventisense.koamishin.org/update-password',
      });
      
      if (error) throw error;
      
      // Show success message
      setMessageType('success');
      setMessage('Password reset link sent! Please check your email.');
      setIsResetSent(true);
    } catch (error: any) {
      setMessageType('error');
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col justify-center items-center min-h-screen p-4 relative w-full h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/images/elegant.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Half Background Overlay */}
      <div 
        className="absolute inset-0 bg-[#101F36]"
        style={{
          clipPath: 'polygon(0 0, 20% 0, 85% 100%, 0 100%)'
        }}
      ></div>

      <div className="w-full max-w-md">
        {/* Card with perspective effect */}
        <motion.div 
          className="relative bg-[#08233E] shadow-2xl overflow-hidden p-8 py-14 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-2 sm:inset-2 md:inset-4 pointer-events-none" 
            style={{ 
              border: '1px solid',
              borderImage: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) 1'
            }}>
          </div>
          
          {/* Form header with gradient */}
          <div className="bg-[#08233E] py-6 px-8 flex flex-col justify-center items-center">
            <motion.h2
              className="text-3xl font-bold uppercase text-white text-center font-bonanova"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <div className='gradient-text'>
                Reset Password
              </div>
            </motion.h2>
            <motion.p 
              className="text-blue-100 text-center mt-2 font-sofia text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              Enter your email to receive a password reset link
            </motion.p>
          </div>

          {/* Form container */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isResetSent ? 'success' : 'form'}
                initial={{ opacity: 0, x: isResetSent ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isResetSent ? -50 : 50 }}
                transition={{ 
                  duration: 0.7,
                  ease: "easeInOut"
                }}
              >
                {isResetSent ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Email Sent!</h3>
                    <p className="text-gray-300">Please check your inbox and follow the link to reset your password.</p>
                    <motion.button
                      onClick={() => {
                        setIsResetSent(false);
                        setEmail('');
                      }}
                      className="mt-6 text-blue-400 font-medium hover:text-blue-300 focus:outline-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try different email
                    </motion.button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-200">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 bg-gray-400/10 rounded-lg border-b-[1px] text-sm focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="w-full mt-6 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg hover:shadow-xl disabled:opacity-70 transition-all duration-300"
                      style={{
                        background: "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
                      }}
                      disabled={isLoading}
                      whileHover={{ translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </div>
                      ) : 'Send Reset Link'}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Message display */}
            <AnimatePresence>
              {message && !isResetSent && (
                <motion.div
                  className={`mt-6 p-3 rounded-lg ${
                    messageType === 'error' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <p className="text-sm">{message}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Back to sign in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Remember your password?
                <motion.a
                  href="/register"
                  className="ml-2 text-blue-400 font-medium hover:text-blue-300 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.a>
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-sky-300 rounded-full -translate-x-10 -translate-y-10 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-indigo-300 rounded-full translate-x-8 translate-y-8 opacity-20"></div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed bottom-8 left-8 h-32 w-32 z-50"
        >
          <img 
            src={logo} 
            alt="Background" 
            className="h-full w-full object-contain opacity-10 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0" 
          />
        </motion.div>
      </div>
    </div>
  );
}