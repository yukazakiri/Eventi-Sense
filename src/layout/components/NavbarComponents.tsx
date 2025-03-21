import { NavLink } from 'react-router-dom';
import Button from '../../components/Button/button';
import ProfileAvatar from '../../components/Profile/profileAvatar';
interface NavbarProps {
    user: any;
    profile: any;
    searchQuery: string;
    mobileMenuOpen: boolean;
    isDropdownOpen?: boolean;
    setSearchQuery: (value: string) => void;
    setDropdownOpen?: (value: boolean) => void;
    handleSearch: (e: React.FormEvent) => void;
    toggleMobileMenu: () => void;
    navigate: (path: string) => void;
  }
  
  export const UserNavbar = ({
    user,
    profile,
    searchQuery,
    mobileMenuOpen,
    setSearchQuery,
    handleSearch,
    toggleMobileMenu,
    navigate
  }: NavbarProps) => (
    <div>
        <nav className="shadow-3xl fixed top-0 left-0 w-full z-20 bg-navy-blue-5 text-white ">
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
                      onClick={toggleMobileMenu}
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                      onClick={toggleMobileMenu}
                >
                  About
                </NavLink>
                <NavLink 
                  to="/services" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                      onClick={toggleMobileMenu}
                >
                  Services
                </NavLink>
                <NavLink 
                  to="/contact" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                      onClick={toggleMobileMenu}
                >
                  Contact
                </NavLink>
                <NavLink 
                  to="/create-event" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                      onClick={toggleMobileMenu}
                >
                  Create Event
                </NavLink>
                <NavLink 
                  to="/user-dashboard" 
                  className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                      onClick={toggleMobileMenu}
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



export const DefaultNavbar = ({
    user,
    profile,

    isDropdownOpen,

    setDropdownOpen,

    navigate
  }: NavbarProps) => (
    <div>
      <nav className="shadow-2xl  w-full z-20 h-auto bg-white-400  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 
 text-white">
     <div className="w-full border-b-[1px] border-gray-400/50 py-3">
  <div className="container mx-auto px-4 py-3 flex items-start md:items-center justify-between">
    
    {/* Logo - left aligned on mobile, center on larger screens */}
    <div className="flex-shrink-0 flex justify-start md:justify-center flex-grow">
      <a href="#" className="text-[1.3rem] gradient-text font-bonanova uppercase">
        EventiSense
      </a>
    </div>
    
  </div>
</div>
        
       {/* Bottom row with main navigation */}
<div className="w-full  h-auto bg-white-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border-b-[1px] border-gray-400/50">
<div className='flex flex-row justify-between max-w-7xl mx-auto'>
  {/* Left side - Dashboard link (hidden on mobile) */}
  <div className="hidden md:flex items-center pl-4">
    {profile?.role && (
      <NavLink 
        to={`/${profile.role.replace('_', '-')}-Dashboard/Home`} 
        className="uppercase font-semibold tracking-widest text-sm hover:gradient-text"
      >
        Dashboard
      </NavLink>
    )}
  </div>
  
  {/* Center - Main navigation */}
  <div className="flex-1">
    {/* Desktop navigation - hidden on mobile */}
    <div className="hidden md:flex items-center justify-center space-x-8 font-sofia tracking-widest text-sm text-gray-100 py-3">
      <NavLink to="/" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text' : 'hover:text-white'}`}>
        Home
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text' : 'hover:text-white'}`}>
        About
      </NavLink>
      <div className="relative">
        <button
          type="button"
          id="menu-button"
          className="uppercase flex items-center hover:text-white"
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          onClick={() => setDropdownOpen?.(!isDropdownOpen)}
        >
          <span>Services</span>
          <svg
            className={`ml-1 mb-1 w-3 h-3 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-yellow-300' : ''}`}
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
      <NavLink to="/contact" className={({ isActive }) => `uppercase ${isActive ? 'gradient-text' : 'hover:text-white'}`}>
        Contact
      </NavLink>
    </div>
  </div>
  
  {/* Right side - Profile/Auth buttons (hidden on mobile) & Mobile menu button */}
  <div className="flex items-center pr-4">
 
    
    {/* Profile or auth buttons - hidden on mobile */}
    <div className="hidden md:flex items-center space-x-4">
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
</div>
      
      </nav>
    </div>
  );
