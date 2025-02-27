import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'; // Import icons

interface ProfileAvatarProps {
  user: any; // User object from Supabase
  profile: any; // Profile data from the profiles table
}

function ProfileAvatar({ user, profile }: ProfileAvatarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';

  if (!user || !profile) {
    return (
      <div className="animate-pulse flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>
    );
  }

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      window.location.href = "/"; // Redirect to home page
      setTimeout(() => {
        window.location.reload(); // Reload after redirection
      }, 100); // Small delay to ensure redirection happens smoothly
    }
  };

  return (
    <div className="relative font-sofia">
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-full shadow-sm">
          {/* Profile Avatar and Name */}
          <button
            type="button"
            className="flex items-center focus:outline-none cursor-pointer"
          >
            <img
              src={profile?.avatar_url || fallbackAvatarUrl}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
            />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {profile.first_name}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-20">
            <div className="py-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile.first_name} {profile.last_name}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.email}
                </p>
              </div>

              {profile.role === 'venue_manager' ? (
                <NavLink 
                  to="/Venue-Manager-Dashboard/profiles" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiUser className="mr-3 h-4 w-4" />
                  View Profile
                </NavLink>
              ) : profile.role === 'supplier' ? (
                <NavLink 
                  to="/Supplier-Dashboard/profiles" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiUser className="mr-3 h-4 w-4" />
                  View Profile
                </NavLink>
              ) : null}

              <NavLink 
                to="/settings" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setDropdownOpen(false)}
              >
                <FiSettings className="mr-3 h-4 w-4" />
                Settings
              </NavLink>

              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
              >
                <FiLogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileAvatar;