import { useState, useEffect } from 'react';
import Button from '../components/Button/button';
import { NavLink, useNavigate } from 'react-router-dom';
import supabase from '../api/supabaseClient';
import ProfileAvatar from '../components/Profile/profileAvatar';

function MainNavbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Track user authentication state
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchProfile(user.id);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
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

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // When opening the menu, disable body scroll
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // User role specific navbar
  if (profile?.role === 'user') {
    return (
      <div>
        <nav className="shadow-3xl fixed top-0 left-0 w-full z-50 bg-navy-blue-5 text-white ">
          {/* Top row with logo, search, dashboard and profile */}
          <div className="w-full border-b border-gray-700">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              {/* Logo on left */}
              <div className="flex-shrink-0">
                <a href="#" className="text-[1.3rem] gradient-text font-bonanova uppercase">
                  EventiSense
                </a>
              </div>
              
              {/* Search bar in middle - hidden on mobile */}
              <div className="hidden md:flex flex-grow mx-8">
                <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="w-full py-2 pl-4 pr-10 text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Mobile menu button - visible only on mobile */}
              <button 
                className="md:hidden focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  // X icon when menu is open
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon when menu is closed
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              
              {/* Dashboard link and profile on right - hidden on mobile */}
              <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/user-dashboard" className="uppercase hover:gradient-text">
                  Dashboard
                </NavLink>
                <ProfileAvatar user={user} profile={profile} />
              </div>
            </div>
          </div>
          
          {/* Bottom row with main navigation - aligned left */}
          <div className="w-full">
            <div className="container mx-auto px-4 py-3">
              {/* Desktop navigation - hidden on mobile */}
              <div className="hidden md:flex items-center justify-start space-x-8 text-sm font-sofia uppercase">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}
                >
                  About
                </NavLink>
                <NavLink 
                  to="/services" 
                  className={({ isActive }) => `${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}
                >
                  Services
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}
                >
                  Contact
                </NavLink>
                <NavLink 
                  to="/create-event" 
                  className={({ isActive }) => `${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}
                >
                  Create Event
                </NavLink>
              </div>
            </div>
          </div>
          
          {/* Full-screen Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-navy-blue-5 z-50 flex flex-col pt-16">
              <div className="px-6 py-8 flex flex-col space-y-6 text-xl">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink 
                  to="/services" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </NavLink>
                <NavLink 
                  to="/create-event" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Event
                </NavLink>
                <NavLink 
                  to="/user-dashboard" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <div className="pt-4">
                  <ProfileAvatar user={user} profile={profile} />
                </div>
              </div>
              
              {/* Search bar in mobile menu */}
              <div className="px-6 py-4 mt-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="w-full py-2 pl-4 pr-10 text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </nav>
      </div>
    );
  }

  // Default navbar for other roles and non-authenticated users
  return (
    <div>
      <nav className="shadow-2xl fixed top-0 left-0 w-full z-50 bg-navy-blue-5 text-white">
        {/* Top row with logo, search, and profile */}
        <div className="w-full border-b border-gray-700">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo on left */}
            <div className="flex-shrink-0">
              <a href="#" className="text-[1.3rem] gradient-text font-bonanova uppercase">
                EventiSense
              </a>
            </div>
            
            {/* Search bar in middle - hidden on mobile */}
            <div className="hidden md:flex flex-grow mx-8">
              <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full py-2 pl-4 pr-10 text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
            
            {/* Mobile menu button - visible only on mobile */}
            <button 
              className="md:hidden focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                // X icon when menu is open
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon when menu is closed
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
            {/* Profile or auth buttons on right - hidden on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              {profile?.role && (
                <NavLink 
                  to={`/${profile.role.replace('_', '-')}-Dashboard/Home`} 
                  className="uppercase hover:gradient-text"
                >
                  Dashboard
                </NavLink>
              )}
              
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
        </div>
        
        {/* Bottom row with main navigation - aligned left */}
        <div className="w-full bg-white">
          <div className="container mx-auto px-4 py-3">
            {/* Desktop navigation - hidden on mobile */}
            <div className="hidden md:flex items-center justify-start space-x-8 font-montserrat tracking-widest text-[1rem]">
              <NavLink to="/" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}>
                About
              </NavLink>
              <div className="relative">
                <button
                  type="button"
                  id="menu-button"
                  className="uppercase flex items-center hover:text-gray-300"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  <span>Services</span>
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
                    <NavLink to="/service1" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Service 1
                    </NavLink>
                    <NavLink to="/service2" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Service 2
                    </NavLink>
                    <NavLink to="/service3" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Service 3
                    </NavLink>
                  </div>
                )}
              </div>
              <NavLink to="/contact" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text' : 'hover:text-gray-300'}`}>
                Contact
              </NavLink>
            </div>
          </div>
        </div>
        
        {/* Full-screen Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-navy-blue-5 z-50 flex flex-col pt-16">
            <div className="px-6 py-8 flex flex-col space-y-6 text-xl">
              <NavLink 
                to="/" 
                className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </NavLink>
              <div className="py-2">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                >
                  <span>Services</span>
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
                </div>
                {isDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-3">
                    <NavLink 
                      to="/service1" 
                      className="block py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Service 1
                    </NavLink>
                    <NavLink 
                      to="/service2" 
                      className="block py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Service 2
                    </NavLink>
                    <NavLink 
                      to="/service3" 
                      className="block py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Service 3
                    </NavLink>
                  </div>
                )}
              </div>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
              {profile?.role && (
                <NavLink 
                  to={`/${profile.role.replace('_', '-')}-Dashboard/Home`}
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              )}
              
              {/* User profile or signup button */}
              <div className="pt-4">
                {user ? (
                  <ProfileAvatar user={user} profile={profile} />
                ) : (
                  <Button
                    label="Sign Up"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/register');
                    }}
                    gradientText={true}
                    variant="secondary"
                  />
                )}
              </div>
            </div>
            
            {/* Search bar in mobile menu */}
            <div className="px-6 py-4 mt-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full py-2 pl-4 pr-10 text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default MainNavbar;