import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/logoES.png';

// Add function to record user activity
const recordUserActivity = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_activity')
      .insert([{ user_id: userId }]);
    
    if (error) {
      console.error('Error recording user activity:', error);
    }
  } catch (err) {
    console.error('Exception recording user activity:', err);
  }
};

// Add function to record user logout
const recordUserLogout = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_activity')
      .update({ logged_out_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('logged_out_at', null);

    if (error) {
      console.error('Error recording user logout:', error);
    }
  } catch (err) {
    console.error('Exception recording user logout:', err);
  }
};

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [redirect, setRedirect] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role after successful sign-in
  useEffect(() => {
    if (redirect && userRole) {
      // Redirect logic is handled in the return statement
    }
  }, [redirect, userRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      // Record user activity on successful login
      if (data.user) {
        await recordUserActivity(data.user.id);
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      if (profileError) throw profileError;

      // Set user role and redirect based on role
      const role = profileData?.role || 'user';
      setUserRole(role);
      
      // Show success message and redirect
      setMessageType('success');
      setMessage('Login successful! Redirecting...');

      // Redirect based on user role
      const redirectPath = role === 'admin' 
        ? '/admin-dashboard/Home'
        : '/';

      setTimeout(() => {
        setRedirect(true);
        window.location.href = redirectPath;
      }, 1500);

    } catch (error: any) {
      setMessageType('error');
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await recordUserLogout(user.id);
      }
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Add cleanup for user activity on page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await recordUserLogout(user.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleLogout();
    };
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const signUpData = {
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: 'https://eventi-sense-1b32-8dkkz517y-jays-projects-45cd8be1.vercel.app/confirm-success',
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      };
      const { error } = await supabase.auth.signUp(signUpData);
      if (error) throw error;
  
      setMessageType('success');
      setMessage('Check your email for the confirmation link.');
      
      setTimeout(() => {
        setIsSignUp(false);
      }, 2500);
    } catch (error: any) {
      setMessageType('error');
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleForm = () => {
    setMessage('');
    setIsSignUp(!isSignUp);
  };

  // Redirect logic
  if (redirect && userRole) {
    const redirectTo = userRole === 'admin' ? '/admin-dashboard' : '/';
    return <Navigate to={redirectTo} />;
  }

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
    className="absolute inset-0 bg-[#101F36] "
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
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </div>
            </motion.h2>
            <motion.p 
              className="text-blue-100 text-center mt-2 font-sofia text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
            </motion.p>
          </div>

{/* Animated forms container */}
<div className="p-8">
  <AnimatePresence mode="wait">
    <motion.div
      key={isSignUp ? 'signup' : 'signin'}
      initial={{ opacity: 0, x: isSignUp ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isSignUp ? -50 : 50 }}
      transition={{ 
        duration: 0.7,
        ease: "easeInOut"
      }}
    >
      {isSignUp ? (
        // Sign-Up Form
        <form onSubmit={handleSignUp} className="space-y-4 font-sofia">
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label className="text-sm font-medium text-gray-200">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                       className="w-full px-4 py-3 bg-gray-400/10 rounded-lg  border-b-[1px]  text-sm  focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
                onChange={handleChange}
                value={formData.firstName}
                required
              />
            </div>
            <div >
             <label className="text-sm font-medium text-gray-200">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                 className="w-full px-4 py-3 bg-gray-400/10 rounded-lg  border-b-[1px]  text-sm focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
                onChange={handleChange}
                value={formData.lastName}
                required
              />
            </div>
          </div>
          <div >
           <label className="text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
               className="w-full px-4 py-3 bg-gray-400/10 rounded-lg  border-b-[1px]  text-sm focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
          <div >
           <label className="text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a secure password"
              className="w-full px-4 py-3 bg-gray-400/10 rounded-lg border-b-[1px]  text-sm focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
             
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full mt-6 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-lg hover:shadow-xl disabled:opacity-70 transition-all duration-300"
            style={{
              background: "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
            }}  disabled={isLoading}
            whileHover={{ translateY: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : 'Create Account'}
          </motion.button>
        </form>
      ) : (
        // Sign-In Form
        <form onSubmit={handleSignIn} className="space-y-4">
          <div >
           <label className="text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
               className="w-full px-4 py-3 bg-gray-400/10 rounded-lg  border-b-[1px]  text-sm focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
          <div >
            <div className="flex items-center justify-between">
             <label className="text-sm font-medium text-gray-200">Password</label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
                            className="w-full px-4 py-3 bg-gray-400/10 rounded-lg  border-b-[1px]  text-sm focus:outline-none focus:ring-0 transition-all duration-200 border-gray-600 text-white placeholder-gray-400"
              onChange={handleChange}
              value={formData.password}
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
              Signing in...
            </div>
          ) : 'Sign In'}
        </motion.button>
        </form>
      )}
    </motion.div>
  </AnimatePresence>

  {/* Message display */}
  <AnimatePresence>
    {message && (
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
  
  {/* Form toggle */}
  <div className="mt-6 text-center">
    <p className="text-sm text-gray-300">
      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
      <motion.button
        type="button"
        onClick={toggleForm}
        className="ml-2 text-blue-400 font-medium hover:text-blue-300 focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSignUp ? 'Sign In' : 'Sign Up'}
      </motion.button>
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