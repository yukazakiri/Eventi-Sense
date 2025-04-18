import { useState, useEffect } from 'react';
import {  NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../../api/supabaseClient'; // Adjust the import path as needed

interface ProfileAvatarProps {
  user: any; // User object from Supabase
  profile: any; // Profile data from the profiles table
}

function ProfileAvatar({ user, profile }: ProfileAvatarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('User updated:', user);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.profile-dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Determine profile link based on user role
  const getProfileLink = () => {
    switch (profile?.role) {
      case 'event_planner':
        return "/Event-Planner-Dashboard";
      case 'supplier':
        return "/Supplier-dashboard";
      case 'venue_manager':
        return "/Venue-Manager-dashboard";
      case 'admin':
        return "/staff-profile";
      default:
        return "/profile"; // Fallback to generic profile page
    }
  };
  console.log("Logging out, profile:", profile);


  // Handle logout
  const handleLogout = async () => {
    if (profile?.id) {
      await supabase
        .from('profiles')
        .update({
          last_online: new Date().toISOString(),
      
        })
        .eq('id', profile.id);
    }

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Failed to update last_online:', error.message);
    } else {
   
      localStorage.removeItem('userRole');
      window.location.href = "/";
    }
  };


  // Gold gradient border for avatar
  const goldBorderStyle = {
    background: `
      linear-gradient(#08233E, #08233E) padding-box,
      linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
    `,
    border: '1px solid transparent',
    borderRadius: '9999px', // Full rounded for circle
    padding: '2px' // Border thickness
  };

  return (
    <div className="relative font-Monserrat group font-sofia profile-dropdown-container">
      <motion.div 
        className='flex items-center space-x-4 cursor-pointer'
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          whileHover={{ rotate: [-5, 5, -5, 5, 0] }}
          transition={{ duration: 0.5 }}
          style={goldBorderStyle}
          className="rounded-full"
        >
          <motion.img
            src={profile?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'} // Use profile picture or placeholder
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
              borderColor: isHovered ? "#fcf6ba" : "#bf953f" 
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div> 
        <motion.h1 
          className='text-sm text-white'
          animate={{ 
            color: isHovered ? "#fcf6ba" : "#ffffff"
          }}
          transition={{ duration: 0.3 }}
        >
          My Profile
        </motion.h1>
      </motion.div>
      
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-56 bg-[#232f3f] border border-gray-700 text-white shadow-2xl rounded-lg py-3 text-sm z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div 
              className="px-4 py-2 border-b border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-gray-400 text-xs">Signed in as</p>
              <p className="font-medium truncate">{user?.email}</p>
            </motion.div>
            
            <div className="py-1">
              <NavLink 
                to={getProfileLink()} 
                className="flex items-center px-4 py-2.5 text-white hover:bg-gray-700/50 transition-colors duration-150"
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </motion.div>
              </NavLink>
              
              <NavLink 
                to="/settings" 
                className="flex items-center px-4 py-2.5 text-white hover:bg-gray-700/50 transition-colors duration-150"
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </motion.div>
              </NavLink>
            </div>

            <div className="border-t border-gray-700 py-1">
              <motion.button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-red-400 hover:bg-gray-700/50 transition-colors duration-150"
                whileHover={{ 
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileAvatar;