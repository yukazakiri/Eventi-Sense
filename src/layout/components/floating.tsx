import React, { useState, useRef } from 'react';
import { VscClose } from "react-icons/vsc";
import { NavLink } from 'react-router-dom';
import Button from '../../components/Button/button';
import ProfileAvatar from '../../components/Profile/profileAvatar';

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  position?: 'top-right' | 'middle-right' | 'bottom-right';
  zIndex?: number;
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

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon = '+',
  label,
  position = 'bottom-right',
  zIndex = 9999,
  user,
  profile,
  searchQuery,
  isDropdownOpen,
  setSearchQuery,
  setDropdownOpen,
  handleSearch,


}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  
  const handleNavigation = (path: string) => {
    document.body.style.overflow = 'auto';

    // Force full page reload
    window.location.href = path;
  };
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-5 right-5';
      case 'middle-right':
        return 'top-1/2 right-5 -translate-y-1/2';
      case 'bottom-right':
      default:
        return 'bottom-5 right-5';
    }
  };
  const handleButtonClick = () => {
    setIsMenuOpen(!isMenuOpen);
    // Keep in sync with body overflow
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const handleCloseMenu = () => {
    document.body.style.overflow = 'auto'; // Add this
    setIsMenuOpen(false);
  };


  const positionClasses = getPositionClasses();

  const buttonClasses = `
    fixed
    ${positionClasses}
    top-6
    md:top-2
    mr-16
    w-10 h-10
    md:w-14 md:h-14
    rounded-lg
    md:rounded-xl
    flex items-center justify-center
    shadow-2xl
    transform transition-all duration-500
    hover:scale-105
    
    z-[9999]
  `;

  const contentClasses = `
    relative z-10
    px-3 py-2
    md:px-5 md:py-3
    flex items-center justify-center
    rounded-full 
    bg-navy-blue-2
    border-[1px]
    border-gray-500/90
    font-thin
    text-white text-md
    font-sofia
    md:text-lg
    font-sofia tracking-wide
    hover:bg-gray-800
  
    group
  `;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`${buttonClasses} ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ zIndex }}
        aria-label={label || "Menu button"}
        aria-expanded={isMenuOpen}
      >
        <div className={contentClasses}>
          <span className="relative z-10 transform group-hover:rotate-90 duration-500 ">{icon}</span>
          {label && <span className="relative z-10 ml-2 ">{label}</span>}
        </div>
      </button>

      <div 
        className={`fixed inset-0 transition-transform duration-700 ease-in-out bg-cover bg-center ${
          isMenuOpen 
            ? 'transform translate-x-0' 
            : 'transform -translate-x-full'
        }`}
        style={{ 
          zIndex: zIndex - 1,
          backgroundImage: "url('/images/overlay.jpg')",
          backgroundBlendMode: "overlay"
        }}
        onClick={handleCloseMenu}
      >
        {/* Overlay background */}
      </div>
   
      <div 
        className={`fixed top-0 left-0 h-full w-full  bg-navy-blue-5/90 transition-transform duration-700 ease-in-out bg-cover bg-center ${
          isMenuOpen 
            ? 'transform translate-x-0' 
            : 'transform -translate-x-full'
        }`}
        style={{ zIndex: zIndex - 1
     
         }}
        
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="grid grid-cols-1 md:grid-cols-2 h-full relative overflow-y-auto">
          <button 
            onClick={handleCloseMenu}
            className={`absolute top-3 right-3 md:top-5 md:right-5 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full border-[1px] border-white text-white transition-all ${
              isMenuOpen 
                ? 'opacity-100 transform rotate-0 scale-100' 
                : 'opacity-0 transform rotate-90 scale-50'
            }`}
            aria-label="Close menu"
          >
            <VscClose className="text-xl md:text-2xl transform hover:rotate-90 duration-500" />
          </button>
          
          <nav className="flex flex-col items-center justify-center space-y-4 md:space-y-8 p-4 md:p-8">
            <div className="flex flex-col pt-12 md:pt-16 text-white/80 font-bonanova tracking-widest">
              <div className="px-4 py-4 md:px-6 md:py-8 flex flex-col space-y-6 md:space-y-10 text-xl md:text-3xl">
                <div className="flex items-center gap-4 md:gap-12">
                  <span className="text-sm md:text-xl font-thin">I.</span>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                    onClick={() => handleNavigation('/')}
                  >
                    Home
                  </NavLink>
                </div>
                <div className="flex items-center gap-4 md:gap-10">
                  <span className="text-sm md:text-xl font-thin">II.</span>
                  <NavLink 
                    to="/about" 
                    className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                    onClick={() => handleNavigation('/about')}
                  >
                    About
                  </NavLink>
                </div>
                <div className="py-2">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setDropdownOpen?.(!isDropdownOpen)}
                  >
                    <div className="flex items-center gap-4 md:gap-8">
                      <span className="text-sm md:text-xl font-thin">III.</span>
                      <span>Services</span>
                    </div>
                    <svg
                      className={`ml-2 w-4 h-4 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-yellow-300' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isDropdownOpen && (
                    <div className="pl-6 md:pl-12 mt-2 space-y-2 md:space-y-3 text-base md:text-lg">
                      <NavLink 
                        to="/service1" 
                        onClick={(e) => {
                          e.preventDefault();
             
                          window.location.href = '/service1';
                        }}
                      >
                        Service 1
                      </NavLink>
                      <NavLink 
                        to="/service2" 
                        className="block py-1"
                        onClick={(e) => {
                          e.preventDefault();
             
                          window.location.href = '/service1';
                        }}>
                        Service 2 
                      </NavLink>
                      <NavLink 
                        to="/service3" 
                        className="block py-1"
                        onClick={(e) => {
                          e.preventDefault();
             
                          window.location.href = '/service1';
                        }}
                      >
                        Service 3
                      </NavLink>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <span className="text-sm md:text-xl font-thin">IV.</span>
                  <NavLink 
                    to="/contact" 
                    className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
                    onClick={() => handleNavigation('/contact')}
                  >
                    Contact
                  </NavLink>
                </div>
                {profile?.role && (
                  <div className="flex items-center gap-4 md:gap-10">
                    <span className="text-sm md:text-xl font-thin">V.</span>
                    <NavLink 
                      to={`/${profile.role.replace('_', '-')}-Dashboard/Home`}
                      className={({ isActive }) => `block ${isActive ? 'gradient-text' : ''}`}
        
                    >
                      Dashboard
                    </NavLink>
                  </div>
                )}
                <div className="pt-4">
                  {user ? (
                    <ProfileAvatar 
                      user={user} 
                      profile={profile} 
           
                    />
                  ) : (
                    <Button
                      label="Sign Up"
                      onClick={() => {
           
                        window.location.href = '/register';
                      }}
                  
                      gradientText={true}
                      variant="secondary"
                    />
                  )}
                </div>
              </div>
              <div className="px-4 md:px-6 py-4 mt-2 md:mt-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="w-full py-2 pl-3 pr-8 md:pl-4 md:pr-10 text-xs md:text-sm text-gray-900 bg-white rounded-lg focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </nav>

          <section className="hidden md:flex justify-center items-center bg-navy-blue-4 h-full p-4 md:p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4 md:space-y-8 max-w-md">
              <div className="mb-2 md:mb-4">
                <h1 className="text-white text-xl md:text-3xl font-light tracking-wider">EVENTISENSE</h1>
                <p className="text-gray-300 text-xs md:text-sm mt-1">HOTEL & SPA RESORT</p>
              </div>
              <div>
                <h2 className="text-white text-lg md:text-2xl font-light mb-4 md:mb-6">Hotel & Spa<br />Resort Eventisense</h2>
                <p className="text-gray-300 text-sm md:text-base">Letecká 19</p>
                <p className="text-gray-300 text-sm md:text-base">962 31 Sliač — Sielnica</p>
                <p className="text-gray-300 text-sm md:text-base">Slovakia</p>
              </div>
              <div className="mt-4 md:mt-8">
                <p className="text-gray-300 text-sm md:text-base mb-1 md:mb-2">+421 45 530 00 00</p>
                <p className="text-gray-300 text-sm md:text-base mb-2 md:mb-4">recepcia@hoteleventisense.sk</p>
                <div className="flex items-center justify-center text-sm md:text-base">
                  <p className="text-gray-300">Contacts</p>
                  <span className="text-gray-300 ml-2">→</span>
                </div>
              </div>
              <div className="flex space-x-4 md:space-x-6 mt-6 md:mt-12">
                {['T', 'f', 'I', 'Y'].map((icon, index) => (
                  <div 
                    key={index}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-500 flex items-center justify-center text-xs md:text-sm text-white"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default FloatingActionButton;