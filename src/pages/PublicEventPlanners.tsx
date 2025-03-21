import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import Modal from '../pages/EventPlanner/components/profileupdate/modal';
import { EventPlannerProfile, ModalData, fetchUserProfileById, fetchSocialMediaById } from '../pages/EventPlanner/components/profileupdate/api';
import ProfileForm from '../pages/publivEventComponents/profileData';
import MainNavbar from '../layout/components/MainNavbar';
import EPGallery from '../pages/publivEventComponents/Gallery';
import Events from '../pages/publivEventComponents/events/cardList';
import bgimage from '../assets/images/plantbg.jpg';

export default function UpdateProfile() {
  const { id } = useParams<{ id: string }>(); // Get the planner ID from the URL
  const [profile, setProfile] = useState<EventPlannerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });
  const [socialMedia, setSocialMedia] = useState<any[]>([]); // State for social media data

  // Define all available tabs
  const tabs = [
    { id: 'events', name: 'Events', badge: null },
    { id: 'profile', name: 'Profile', badge: null },
    { id: 'socialmedia', name: 'Social Media', badge: null },
    { id: 'gallery', name: 'Gallery', badge: null },
  ];

  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';

  // Fetch profile data on component mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        if (!id) throw new Error('Profile ID is missing');

        const data = await fetchUserProfileById(id); // Fetch profile using the ID from URL
        if (!isMounted) return;

        setProfile(data);
      } catch (err) {
        if (isMounted) {
          showModal(
            'Error Loading Profile',
            err instanceof Error ? err.message : 'An unknown error occurred',
            'error'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  // Fetch social media data when the tab is active
  useEffect(() => {
    if (activeTab === 'socialmedia' && id) {
      const loadSocialMedia = async () => {
        try {
          const data = await fetchSocialMediaById(id);
          setSocialMedia(data);
        } catch (err) {
          showModal(
            'Error Loading Social Media',
            err instanceof Error ? err.message : 'An unknown error occurred',
            'error'
          );
        }
      };

      loadSocialMedia();
    }
  }, [activeTab, id]);

  // Function to show modal with custom title, description, and type
  const showModal = (title: string, description: string, type: 'success' | 'error') => {
    setModalData({
      isOpen: true,
      title,
      description,
      type,
    });
  };

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader color="#0000ff" />
      </div>
    );
  }

  return (
    <>
      <MainNavbar />
      <div className="bg-cover">
        <div>
          {/* Avatar Card */}
          <div
            className="transition-all duration-300"
            style={{ backgroundImage: `url(${bgimage})`, backgroundSize: 'cover' }}
          >
            <div className="p-6 lg:mx-16 md:mx-8 mx-4 pt-36">
              <div className="flex flex-col gap-4 p-8 h-full w-auto bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100/40">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={profile?.avatar_url || fallbackAvatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackAvatarUrl;
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-green-300 mb-2">
                    <div className="flex items-center">
                      <svg
                        className="mr-2 flex-shrink-0"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                      </svg>
                      <span className="truncate">Event Planner</span>
                    </div>
                  </h3>
                  <h1 className="text-4xl font-bold text-white mb-4">{profile?.company_name}</h1>

                  <div className="flex space-x-4 text-sm text-gray-500 mb-4">
                    <span>54,792 followers</span>
                    <span>1,054 following</span>
                    <span>107,082 likes</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium">Get in touch</button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">Follow</button>
                    <button className="p-2 border border-gray-300 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 pb-8 lg:mx-16 md:mx-8 mx-4 p-6">
            <div className="h-full w-full">
              {/* Tabs navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        console.log(`Tab ${tab.name} clicked. ID: ${id}`);
                      }}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                      {tab.name}
                      {tab.badge && (
                        <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2.5 rounded-full text-xs">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content based on active tab */}
              <div className="py-10">
                {activeTab === 'events' && id && <Events eventPlannerId={id.toString()} />}
                {activeTab === 'profile' && <ProfileForm fallbackAvatarUrl={fallbackAvatarUrl} profile={profile} />}
                {activeTab === 'socialmedia' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Social Media</h2>
                    {socialMedia.length > 0 ? (
                      <ul className="space-y-4">
                        {socialMedia.map((item) => (
                          <li key={item.id} className="flex items-center">
                            <span className="font-medium text-gray-700">{item.platform}:</span>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-500 hover:underline"
                            >
                              {item.link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No social media links available.</p>
                    )}
                  </div>
                )}
                {activeTab === 'gallery' && id && <EPGallery eventPlannerId={id.toString()} />}
              </div>
            </div>

            {/* Modal for notifications */}
            <Modal
              isOpen={modalData.isOpen}
              title={modalData.title}
              description={modalData.description}
              type={modalData.type}
              onClose={() => setModalData({ ...modalData, isOpen: false })}
            />
          </div>
        </div>
      </div>
    </>
  );
}