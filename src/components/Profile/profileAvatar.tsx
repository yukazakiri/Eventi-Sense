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
    <div className="relative font-Monserrat group">
        <div className='flex items-center space-x-4 group-hover:opacity-100 'onClick={() => setDropdownOpen(!isDropdownOpen)}>
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
    <h1 className='text-[14px] cursor-pointer text-white'>My Profile</h1>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-navy-blue-5 text-white shadow-2xl rounded-md py-2">
          <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">
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