import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import supabase from '../../api/supabaseClient';

interface CompanyProfileProps {
  company: any; // Add company prop
}

function CompanyProfile({ company }: CompanyProfileProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCompanyProfileAvailable, setIsCompanyProfileAvailable] = useState(false);

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('company_profile')
          .select('company_logo_url')
          .eq('id', company.id)
          .single();

        if (error) {
          console.error('Error fetching company logo:', error);
        } else {
          console.log('Company logo URL:', data.company_logo_url);
          setIsCompanyProfileAvailable(true); // Set to true if profile exists
        }
      } catch (error) {
        console.error('Unexpected error fetching company logo:', error);
      }
    };

    if (company?.id) {
      fetchCompanyLogo();
    }
  }, [company]);

  console.log("CompanyProfile - Company:", company);

  // Handle logout logic
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
    <div className="relative font-sofia group">
      <div className="flex items-center space-x-2 group-hover:opacity-100" onClick={() => setDropdownOpen(!isDropdownOpen)}>
        <button
          type="button"
          className="flex items-center focus:outline-none"
        >
          <img
            src={company?.company_logo_url || 'https://www.gravatar.com/avatar/?d=mp'} // Use company avatar or placeholder
            alt="Company Profile"
            className="w-10 h-10 rounded-full"
          />
        </button>
        <div>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <rect width="20" height="20" fill="none" />
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-navy-blue-5 text-white shadow-2xl rounded-md py-2">
          <NavLink to="/Venue-Manager-Dashboard/CompanyProfile" className="block px-4 py-2 hover:bg-gray-100">
            View Profile
          </NavLink>
          <NavLink to="/settings" className="block px-4 py-2 hover:bg-gray-100">
            Settings
          </NavLink>
          {isCompanyProfileAvailable && (
            <NavLink to="/switch" className="block px-4 py-2 hover:bg-gray-100">
              Switch Company Profile
            </NavLink>
          )}
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

export default CompanyProfile;
