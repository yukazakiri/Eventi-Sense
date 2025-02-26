import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import Sidebar from '../components/Sidebar/VenueManager';
import routes from '../routers/Venue-Manager/Routes';
import { getCurrentUser, fetchProfile } from '../api/utiilty/profiles';
import { Profile } from '../types/profile';

import UserProfile from '../components/Profile/StockHoldersProfileAvatar'; // Add import for UserProfile component

function VenueManagerDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);


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
    <div className="flex h-screen bg-blue-light-1  ">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-end p-4 bg-white shadow-md z-0 font-sofia text-gray-800">
         
                <UserProfile user={user} profile={profile} /> 
         
 
   
        </div>

        <main className="flex-1 overflow-y-auto bg-blue-light-1 mx-4 ">
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

export default VenueManagerDashboard;
