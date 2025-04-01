import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash'; 
import supabase from '../../api/supabaseClient';
import { UserNavbar, DefaultNavbar } from './NavbarComponents';
import DefaultFloatingActionButton from './floating';
import UserFloatingActionButton from './UserFloating';
import { RiMenu4Fill } from "react-icons/ri";


function MainNavbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(true);
  // Force isLoading to false initially to ensure navbar displays
  const [isLoading, setIsLoading] = useState(false);

  // Memoize profile with deep comparison
  const memoizedProfile = useMemo(() => profile, [JSON.stringify(profile)]);

  // Auth and profile logic
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted) return;
        
        if (user) {
          setUser(user);
          // Fetch profile but don't wait for it to complete
          fetchProfile(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        if (session?.user) {
          setUser(session.user);
          // Fetch profile but don't wait for it to complete
          fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Optimized scroll handler
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateVisibility = () => {
      setVisible(lastScrollY === 0);
      ticking = false;
    };

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized fetchProfile with error handling
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (!isEqual(data, profile)) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Exception in fetchProfile:", error);
    }
  }, [profile]);

  // Memoized handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  }, [searchQuery]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : 'auto';
      return !prev;
    });
  }, []);

  // Memoized navbar style
  const navbarStyle = useMemo(() => ({
    position: 'fixed' as 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000,
    transform: visible ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.3s ease-in-out',
  }), [visible]);

  // Determine which components to render based on profile
  const renderFloatingButton = () => {
    return memoizedProfile?.role === 'user' ? (
      <UserFloatingActionButton
        icon={<RiMenu4Fill />}
        user={user}
        profile={memoizedProfile}
        mobileMenuOpen={mobileMenuOpen}
        isDropdownOpen={isDropdownOpen}
        setSearchQuery={setSearchQuery}
        setDropdownOpen={setDropdownOpen}
        handleSearch={handleSearch}
        toggleMobileMenu={toggleMobileMenu}
        navigate={navigate}
        label="Menu"
        position="bottom-right"
        zIndex={9999}
      />
    ) : (
      <DefaultFloatingActionButton
        icon={<RiMenu4Fill />}
        user={user}
        profile={memoizedProfile}
        mobileMenuOpen={mobileMenuOpen}
        isDropdownOpen={isDropdownOpen}
        setSearchQuery={setSearchQuery}
        setDropdownOpen={setDropdownOpen}
        handleSearch={handleSearch}
        toggleMobileMenu={toggleMobileMenu}
        navigate={navigate}
        label="Menu"
        position="bottom-right"
        zIndex={9999}
      />
    );
  };

  const renderNavbar = () => {
    // Always render a navbar, defaulting to DefaultNavbar if not a user
    return memoizedProfile?.role === 'user' ? (
      <UserNavbar
        user={user}
        profile={memoizedProfile}
        searchQuery={searchQuery}
        mobileMenuOpen={mobileMenuOpen}
        isDropdownOpen={isDropdownOpen}
        setSearchQuery={setSearchQuery}
        setDropdownOpen={setDropdownOpen}
        handleSearch={handleSearch}
        toggleMobileMenu={toggleMobileMenu}
        navigate={navigate}
      />
    ) : (
      <DefaultNavbar
        user={user}
        profile={memoizedProfile}
        searchQuery={searchQuery}
        mobileMenuOpen={mobileMenuOpen}
        isDropdownOpen={isDropdownOpen}
        setSearchQuery={setSearchQuery}
        setDropdownOpen={setDropdownOpen}
        handleSearch={handleSearch}
        toggleMobileMenu={toggleMobileMenu}
        navigate={navigate}
      />
    );
  };

  // Debug output
  console.log('Navbar render state:', { isLoading, hasProfile: !!profile, userRole: profile?.role });

  return (
    <>
      {/* Always render the floating button */}
      {renderFloatingButton()}
      
      {/* Always render the navbar */}
      <div style={navbarStyle}>
        {renderNavbar()}
      </div>
    </>
  );
}

export default React.memo(MainNavbar);