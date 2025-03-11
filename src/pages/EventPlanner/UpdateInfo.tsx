// File: src/pages/profile/UpdateProfile.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PulseLoader } from 'react-spinners';
import ProfileForm from './components/ProfileForm';
import Modal from './components/profileupdate/modal';
import { EventPlannerProfile, ModalData } from './components/profileupdate/api';
import { fetchUserProfile, updateUserProfile, uploadProfileImage, toggleVisibility } from './components/profileupdate/api';
import SocialMediaForm from './EPSocialMedia';
import EPGallery from './EPGallery';


export default function UpdateProfile() {
  const [profile, setProfile] = useState<EventPlannerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });
  const [formData, setFormData] = useState<Partial<EventPlannerProfile>>({});
  
  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        if (!isMounted) return;
        
        setProfile(data);
        setFormData(data);
      } catch (err) {
        if (isMounted) {
          showModal('Error Loading Profile', 
            err instanceof Error ? err.message : 'An unknown error occurred', 
            'error');
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
  }, []);

  const showModal = (title: string, description: string, type: 'success' | 'error') => {
    setModalData({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadProfileImage(file);
      
      // Update form data with new avatar URL
      setFormData({
        ...formData,
        avatar_url: publicUrl
      });
      
      showModal('Upload Successful', 'Your profile image has been uploaded successfully.', 'success');
    } catch (error: any) {
      showModal('Upload Failed', error.message || 'There was an error uploading your file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!profile) throw new Error('Profile not loaded');
      
      await updateUserProfile(profile, formData);
      showModal('Profile Updated', 'Your profile has been updated successfully.', 'success');
      
      // Refresh the profile data
      const refreshedProfile = await fetchUserProfile();
      setProfile(refreshedProfile);
    } catch (err) {
      showModal('Update Failed', 
        err instanceof Error ? err.message : 'There was an error updating your profile.', 
        'error');
    }
  };
  // Add this inside your UpdateProfile component
// In your handleToggleVisibility function
const handleToggleVisibility = async () => {
  if (!profile) {
      showModal('Error', 'Profile data not available. Please try again.', 'error');
      return;
  }

  try {
      setLoading(true);
      console.log('Before toggleVisibility:', profile);
      
      // Use the UUID formatted profile_id, not the numeric planner_id
      const profileId = profile.profile_id; // This should be the UUID string
      console.log('Using profile_id for update:', profileId);
      
      const updatedProfile = await toggleVisibility(profileId, !profile.is_public);
      console.log('After toggleVisibility:', updatedProfile);
      setProfile(updatedProfile);
      showModal('Visibility Updated', `Your profile is now ${updatedProfile.is_public ? 'public' : 'private'}`, 'success');
  } catch (err) {
      showModal('Update Failed', err instanceof Error ? err.message : 'Failed to update visibility', 'error');
  } finally {
      setLoading(false);
  }
};
  // Define all available tabs
  const tabs = [
    { id: 'profile', name: 'Profile', badge: null },
    { id: 'socialmedia', name: 'Social Media', badge: null },
    { id: 'gallery', name: 'Gallery', badge: null },
    
  ];
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader color="#0000ff" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:mx-16 md:mx-10 sm:mx-6   bg-white  dark:bg-gray-900 pb-8">
              {/* Avatar Card */}
<div className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 transition-all duration-300 ">
  {/* Colorful gradient banner */}
  <div className="w-full h-52 bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 rounded-t-2xl relative">
    {/* Edit button */}
    <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    </button>
  </div>

  {/* Main content container */}
  <div className=" px-4 sm:px-6 lg:px-8">
    <div className="relative -mt-16 pb-6">
      {/* Avatar circle */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 bg-white ml-6">
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

      {/* Profile info section */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {profile?.company_name || 'Emma Smith'}
          </h2>
          
     

          {/* Current role */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
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
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{profile?.city || 'City'}, {profile?.state || 'State'}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>{profile?.experience_years || '0'} Years Experience</span>
          </div>
       
        </div>
        <div className="flex items-center gap-4">
        <button 
        onClick={handleToggleVisibility}
        disabled={loading}
        className={`px-4 py-2 rounded-md transition-colors ${
          profile?.is_public 
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <PulseLoader color="#ffffff" size={8} />
        ) : (
          profile?.is_public ? 'Public' : 'Private'
        )}
      </button>
            <span className="text-sm text-gray-600">
              {profile?.is_public 
                ? 'Your profile is visible to everyone'
                : 'Your profile is hidden from others'}
            </span>
          </div>
      </section>
    </div>
  </div>
</div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700'
                }
              `}
            >
              {tab.name}
              {tab.badge && (
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="lg:mb-10 lg:mx-10 ">
        {activeTab === 'profile' && (
          <ProfileForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            uploading={uploading}
            fallbackAvatarUrl={fallbackAvatarUrl}
            profile={profile}
          />
        )}
        {activeTab === 'socialmedia' && (
          <SocialMediaForm />
        )}
        {activeTab === 'gallery' && (
          <EPGallery />
        )}
  
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
  );
}