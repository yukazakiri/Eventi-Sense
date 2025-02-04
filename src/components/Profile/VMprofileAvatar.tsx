import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import supabase from '../../api/supabaseClient';

interface ProfileAvatarProps {
  user: any; // User object from Supabase
  profile: any; // Profile data from the profiles table
}

function ProfileAvatar({ user, profile }: ProfileAvatarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  console.log("ProfileAvatar - User:", user);
  console.log("ProfileAvatar - Profile:", profile);

  if (!user || !profile) {
    return <div>Loadingavatar...</div>; // Show loading if data is missing
  }

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
    <div className="relative font-montserrat text-gray-800 group">
      <div className='flex items-center space-x-2 group-hover:opacity-100 group cursor-pointer' onClick={() => setDropdownOpen(!isDropdownOpen)}>
        <button
          type="button"
          className="flex items-center focus:outline-none"
        >
          <img
            src={profile?.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'} // Use profile picture or placeholder
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </button>
        <div>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <rect width="20" height="20" fill="none" />
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        </div>
        
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-navy-blue-5 text-white shadow-2xl rounded-md py-2">
          <NavLink to="/Venue-Manager-Dashboard/Profile" className="block px-4 py-2 hover:bg-gray-100">
            View Profile
          </NavLink>
          <NavLink to="/settings" className="block px-4 py-2 hover:bg-gray-100">
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;