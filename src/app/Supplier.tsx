import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import Sidebar from '../components/Sidebar/Supplier';
import routes from '../routers/Supplier/Routes';
import { getCurrentUser, fetchProfile } from '../api/utiilty/profiles';
import UserProfile from '../components/Profile/StockHoldersProfileAvatar'; // Add import for UserProfile component
import { Profile } from '../types/profile';
import { FiMoon } from 'react-icons/fi';
import { FiSun } from 'react-icons/fi';


function SupplierDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    document.documentElement.classList.toggle('dark');
  };
  // Fetch the user's profile
  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const profileData = await fetchProfile(userId);
      if (!profileData) {
        console.error('Error fetching profile: Profile not found');
        return null;
      }
      return profileData;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Fetch the company profile


  // Fetch the currently authenticated user
  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user found');
        setLoading(false);
        return;
      }

      setUser(user);
      const profileData = await fetchUserProfile(user.id);
  

      if (profileData) {
        setProfile(profileData);
      }

    } catch (error) {
      console.error('Error in fetchUser:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial user fetch when the component mounts
    fetchUser();

    // Listening to auth state changes (sign-in/out)
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        const profileData = await fetchUserProfile(session.user.id);


        if (profileData) setProfile(profileData);

      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);

      }
    });

    // Cleanup the subscription on component unmount
    return () => {
      if (subscription && subscription.subscription) {
        subscription.subscription.unsubscribe();
      }
    };
  }, []);
  if (loading) {
    return  <div className="loader-container">
    <div className="loader"></div>
  </div>;
  }

  return (
    <div className="flex h-screen bg-blue-light-1 dark:bg-gray-950 ">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-end items-center p-4 bg-white dark:border-b-[1px] border-gray-500 dark:bg-gray-950 dark:border-gray-700 shadow-md z-0 font-sofia text-gray-800">
          <div className="flex items-center gap-2">
   
            <div>
            <button
            onClick={(e) => {
              e.stopPropagation();
              toggleDarkMode();
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 border-[1px] border-gray-300 dark:border-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            <div className="relative w-7 h-7">
              <span className={`absolute inset-0 transform transition-transform duration-500 text-gray-700  dark:text-gray-200 ${
                isDarkMode ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'
              }`}>
                <FiMoon className="w-full h-full " />
              </span>
              <span className={`absolute inset-0 transform transition-transform duration-500 text-gray-700 dark:text-gray-200 ${
                !isDarkMode ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
              }`}>
                <FiSun className="w-full h-full " />
              </span>
            </div>
          </button>
            </div>
            <UserProfile user={user} profile={profile} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-blue-light-1 dark:bg-gray-950 mx-4">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default SupplierDashboard;
