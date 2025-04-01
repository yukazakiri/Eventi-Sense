import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import supabase from '../../api/supabaseClient'; // Adjust the import path as needed

interface ProfileAvatarProps {
  user: any; // User object from Supabase
  profile: any; // Profile data from the profiles table
}

function ProfileAvatar({ user, profile }: ProfileAvatarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('User updated:', user);
    }
  }, [user]);

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

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      window.location.href = "/"; // Redirect to home page
      setTimeout(() => {
        window.location.reload(); // Reload after redirection
      }, 100); // Small delay to ensure redirection happens smoothly
    }
  };

  return (
    <div className="relative font-Monserrat group font-sofia">
      <div 
        className='flex items-center space-x-4 group-hover:opacity-100'
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <button
          type="button"
          className="flex items-center focus:outline-none"
        >
          <img
            src={profile?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'} // Use profile picture or placeholder
            alt="Profile"
            className="w-8 h-8 rounded-full"  
          />
        </button> 
        <h1 className='text-sm cursor-pointer text-white'>My Profile</h1>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#08233E] border border-gray-700 text-white shadow-2xl rounded-lg py-3 text-sm transform transition-all duration-200 ease-in-out">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-gray-400 text-xs">Signed in as</p>
            <p className="font-medium truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <NavLink 
              to={getProfileLink()} 
              className="flex items-center px-4 py-2.5 text-white hover:bg-gray-700/50 transition-colors duration-150"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </NavLink>
            
            <NavLink 
              to="/settings" 
              className="flex items-center px-4 py-2.5 text-white hover:bg-gray-700/50 transition-colors duration-150"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </NavLink>
          </div>

          <div className="border-t border-gray-700 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-red-400 hover:bg-gray-700/50 transition-colors duration-150"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;