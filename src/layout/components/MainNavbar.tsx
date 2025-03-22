import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash'; // Make sure to install lodash
import supabase from '../../api/supabaseClient';
import { UserNavbar, DefaultNavbar } from './NavbarComponents';
import FloatingActionButton from './floating';
import { RiMenu4Fill } from "react-icons/ri";

function MainNavbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(true);

  // Memoize profile with deep comparison
  const memoizedProfile = useMemo(() => profile, [JSON.stringify(profile)]);

  // Auth and profile logic
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted && user && !isEqual(user, user)) {
        setUser(user);
        fetchProfile(user.id);
      }
    };

    fetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          if (session?.user && !isEqual(session.user, user)) {
            setUser(session.user);
            fetchProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
          }
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

  // Memoized fetchProfile
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && !isEqual(data, profile)) {
      setProfile(data);
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

  const handleCreateEvent = useCallback(() => {
    navigate('/create-event');
  }, [navigate]);

  return (
    <>
      <FloatingActionButton
        onClick={handleCreateEvent}
        icon={<RiMenu4Fill/>}
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
      
      <div style={navbarStyle}>
        {memoizedProfile?.role === 'user' ? (
          <UserNavbar
            user={user}
            profile={memoizedProfile}
            searchQuery={searchQuery}
            mobileMenuOpen={mobileMenuOpen}
            setSearchQuery={setSearchQuery}
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
        )}
      </div>
    </>
  );
}

export default React.memo(MainNavbar);