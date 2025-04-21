import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient'; // Adjust path

// Types based on your database schema
type EventPlanner = {
  planner_id: number;
  profile_id: string;
  company_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  experience_years: number | null;
  specialization: string | null;
  website: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

type SocialMedia = {
  id: string;
  event_planner_id: string;
  platform: string;
  link: string;
  created_at: string;
};

type GalleryImage = {
  id: number;
  url: string;
  title: string;
  description: string;
};

// Function to fetch social media links
const fetchSocialMediaLinks = async (profileId: string) => {
  const { data, error } = await supabase
    .from('event_planner_social_media')
    .select('*')
    .eq('event_planner_id', profileId);
    
  if (error) {
    console.error('Error fetching social media links:', error);
    return [];
  }
  
  return data as SocialMedia[];
};

// Function to fetch event planner data
const fetchEventPlannerData = async (profileId: string) => {
  const { data, error } = await supabase
    .from('eventplanners')
    .select('*')
    .eq('profile_id', profileId)
    .single();
    
  if (error) {
    console.error('Error fetching event planner data:', error);
    return null;
  }
  
  return data as EventPlanner;
};

// Mock function to fetch gallery images (assuming you'll create this table later)
const fetchGalleryImages = async (_profileId: string) => {
  // This would be replaced with an actual Supabase query to your gallery table
  // For now, returning mock data
  return [
    {
      id: 1,
      url: "/api/placeholder/600/400",
      title: "Smith-Johnson Wedding",
      description: "Elegant beachfront ceremony with 150 guests"
    },
    {
      id: 2,
      url: "/api/placeholder/600/400",
      title: "TechCorp Annual Gala",
      description: "Tech-themed corporate celebration for 300+ attendees"
    },
    {
      id: 3,
      url: "/api/placeholder/600/400",
      title: "Anderson 50th Anniversary",
      description: "Golden anniversary celebration with vintage touches"
    },
    {
      id: 4,
      url: "/api/placeholder/600/400",
      title: "Charity Fundraiser Ball",
      description: "Black-tie event raising over $100,000 for local charities"
    },
    {
      id: 5,
      url: "/api/placeholder/600/400",
      title: "Sweet 16 Celebration",
      description: "Modern luxury event with custom entertainment"
    },
    {
      id: 6,
      url: "/api/placeholder/600/400",
      title: "Corporate Product Launch",
      description: "Immersive product reveal experience for industry leaders"
    }
  ] as GalleryImage[];
};

// Icons
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Map platform names to components
const socialIcons: Record<string, React.FC> = {
  'instagram': InstagramIcon,
  'facebook': FacebookIcon,
  'twitter': TwitterIcon,
  'linkedin': LinkedInIcon,
};

interface EventPlannerProfileProps {
  profileId: string;
}

const EventPlannerProfile: React.FC<EventPlannerProfileProps> = ({ profileId }) => {
  const [activeTab, setActiveTab] = useState<'about'|'gallery'>('about');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [plannerData, setPlannerData] = useState<EventPlanner | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  
  // Parse specializations from comma-separated string (if exists)
  const specialties = plannerData?.specialization ? 
    plannerData.specialization.split(',').map(s => s.trim()) : 
    [];
    
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch event planner data
        const planner = await fetchEventPlannerData(profileId);
        if (!planner) {
          setError('Event planner not found');
          setLoading(false);
          return;
        }
        
        setPlannerData(planner);
        
        // Fetch social media links
        const social = await fetchSocialMediaLinks(profileId);
        setSocialLinks(social);
        
        // Fetch gallery images
        const images = await fetchGalleryImages(profileId);
        setGallery(images);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !plannerData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error || 'Unable to load profile'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="relative">
        <div className="h-64 w-full bg-gradient-to-r from-purple-500 to-pink-500">
          <img 
            src="/api/placeholder/1200/400" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-end -mt-12 sm:-mt-16">
            <div className="flex-shrink-0 mr-4">
              <img 
                src="/api/placeholder/150/150" 
                alt={plannerData.company_name || 'Event Planner'} 
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32" 
              />
            </div>
            <div className="flex-1 min-w-0 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {plannerData.company_name || 'Event Planner'}
              </h1>
              <p className="text-sm font-medium text-gray-500">
                {plannerData.city && plannerData.state ? 
                  `${plannerData.city}, ${plannerData.state}` : 
                  plannerData.specialization}
              </p>
            </div>
            <div className="flex-shrink-0 flex mt-4">
              {socialLinks.map((social) => {
                const IconComponent = socialIcons[social.platform.toLowerCase()] || (() => null);
                return (
                  <a 
                    key={social.id} 
                    href={social.link} 
                    className="text-gray-600 hover:text-purple-600 mr-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{plannerData.experience_years || 0}+</p>
              <p className="text-sm font-medium text-gray-500">Years Experience</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{gallery.length}+</p>
              <p className="text-sm font-medium text-gray-500">Events Showcased</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {new Date(plannerData.created_at).getFullYear()}
              </p>
              <p className="text-sm font-medium text-gray-500">Established</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('about')} 
              className={`${
                activeTab === 'about'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`${
                activeTab === 'gallery'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Gallery
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 mb-6">{plannerData.bio || 'No bio available.'}</p>
              
              {specialties.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {plannerData.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-700">
                      {[
                        plannerData.address,
                        plannerData.city,
                        plannerData.state,
                        plannerData.zip_code,
                        plannerData.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {plannerData.website && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a 
                      href={plannerData.website.startsWith('http') ? plannerData.website : `https://${plannerData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      {plannerData.website}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-150">
                  Contact Me
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'gallery' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Portfolio</h2>
            {gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((image) => (
                  <div 
                    key={image.id} 
                    className="bg-white rounded-lg shadow overflow-hidden cursor-pointer transform transition duration-200 hover:scale-105"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{image.title}</h3>
                      <p className="text-sm text-gray-500">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
                <p className="text-gray-500">No gallery images available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-medium text-gray-900">{selectedImage.title}</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="w-full object-contain max-h-96" 
              />
              <p className="mt-4 text-gray-700">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Example of how to use this component
const EventPlannerProfilePage: React.FC = () => {
  // You would get this ID from your router or context
  const profileId = "123e4567-e89b-12d3-a456-426614174000";
  
  return (
    <div>
      <EventPlannerProfile profileId={profileId} />
    </div>
  );
};

export default EventPlannerProfilePage;