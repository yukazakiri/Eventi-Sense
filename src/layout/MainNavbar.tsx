import { useState, useEffect } from 'react';
import Button from '../components/Button/button';
import { NavLink, useNavigate } from 'react-router-dom';
import supabase from '../api/supabaseClient'; // Adjust the import path as needed
import ProfileAvatar from '../components/Profile/profileAvatar'; // Import the reusable component

function MainNavbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [user, setUser] = useState<any>(null); // Store user data
  const [profile, setProfile] = useState<any>(null); // Store profile data

  // Track user authentication state
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchProfile(user.id); // Fetch profile data
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id); // Fetch profile data
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  // Scroll direction logic
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarStyle =
    scrollDirection === 'down' ? 'bg-white text-black' : 'bg-navy-blue-5 text-white';

  return (
    <div>
      <nav className={`py-4 shadow-2xl fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${navbarStyle}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="#" className="text-[1.3rem] gradient-text font-bonanova uppercase">
            EventiSense
          </a>
          <button id="menu-btn" className="block lg:hidden focus:outline-none">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div id="menu" className="hidden lg:flex space-x-8 font-montserrat tracking-widest text-[1rem]">
            <NavLink to="/" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text ' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text ' : ''}`}>
              About
            </NavLink>
            <div className="relative">
              <button
                type="button"
                id="menu-button"
                className="uppercase flex items-center"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <a className="uppercase flex items-center">Services</a>
                <svg
                  className={`ml-2 w-4 h-4 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-yellow-300' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div
                  id="services-dropdown"
                  className="absolute bg-gray-100 shadow-lg rounded-md mt-2 text-[1rem] w-40 font-montserrat tracking-widest"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <NavLink to="/service1" className="block px-4 py-2">
                    Service 1
                  </NavLink>
                  <NavLink to="/service2" className="block px-4 py-2">
                    Service 2
                  </NavLink>
                  <NavLink to="/service3" className="block px-4 py-2">
                    Service 3
                  </NavLink>
                </div>
              )}
            </div>
            <NavLink to="/contact" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text ' : ''}`}>
              Contact
            </NavLink>
            {profile?.role === 'venue_manager' && <NavLink to="/venue-manager-dashboard" className="uppercase">Dashboard</NavLink>}
            {profile?.role === 'supplier' && <NavLink to="/supplier-dashboard" className="uppercase">Dashboard</NavLink>}
          </div>

          <div id="menu" className="hidden lg:flex space-x-4">
            {user ? (
              <ProfileAvatar user={user} profile={profile} />
            ) : (
              <div className="flex space-x-3">
                <Button
                  label="Sign Up"
                  onClick={() => navigate('/register')}
                  gradientText={true}
                  variant="secondary"
                />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MainNavbar;
