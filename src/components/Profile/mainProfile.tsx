import { useEffect, useState, useCallback } from 'react';
import supabase from '../../api/supabaseClient';
import { Modal } from '../../assets/modal/modal';
import ProfileForm from './components/ProfileForm';
import AvatarUpload from './components/UploadAvatar';
import { useProfileData } from './components/userProfiledata';
import {  ModalData } from './components/type';
import { UserBookings } from './components/Userbookings';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const { profile,  formData, setFormData, fetchProfileAndEmail } = useProfileData();
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');

  // Fetch profile data with loading state
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchProfileAndEmail();
      // Add a small delay to make the transition smoother
      setTimeout(() => setIsLoading(false), 300);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  // Memoized handler for updating profile
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading state in button
    setUploadingAvatar(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            avatar_url: avatarUrl || profile?.avatar_url,
          })
          .eq('id', user.id);

        if (error) {
          setModalData({
            isOpen: true,
            title: 'Update Failed',
            description: 'There was an error updating your profile.',
            type: 'error',
          });
        } else {
          setModalData({
            isOpen: true,
            title: 'Profile Updated',
            description: 'Your profile has been updated successfully.',
            type: 'success',
          });
          setIsEditing(false);
        }
      }
    } catch (error) {
      setModalData({
        isOpen: true,
        title: 'Update Failed',
        description: 'An unexpected error occurred.',
        type: 'error',
      });
    } finally {
      setUploadingAvatar(false);
    }
  }, [formData, avatarUrl, profile]);

  // Animation variants with improved timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1, // Faster staggering for smoother appearance
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 14, // Added damping for smoother spring animation
        mass: 0.9 // Lighter mass for quicker motion
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeInOut" } 
    }
  };
  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 14,
        duration: 0.3
      }
    },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <motion.div 
      className="min-h-screen pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="max-w-7xl mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className='py-4'
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <motion.h1 
              className="text-3xl font-bold mb-4 md:mb-0 gradient-text font-bonanova"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 130, damping: 15, delay: 0.05 }}
            >
              Profile
            </motion.h1>
          </div>
        </motion.div>

        {/* Static Avatar Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <AvatarUpload 
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            uploading={uploadingAvatar}
            setUploading={setUploadingAvatar}
            userId={profile?.id || ''}
          />
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 font-sofia tracking-wide border-b-[1px] border-gray-500">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2  transition-colors ${
              activeTab === 'profile' 
                ? ' gradient-text shadow-md border-b-[1px] border-yellow-400'
                : 'bg-transparent text-gray-600 hover:bg-gray-300'
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2  transition-colors ${
              activeTab === 'bookings' 
                ? ' gradient-text shadow-md border-b-[1px] border-yellow-400'
                : 'bg-transparent text-gray-600 hover:bg-gray-300'
            }`}
          >
            My Bookings
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center h-60"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1] // Subtler scale animation
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.2, // Slightly faster rotation
                  ease: "easeInOut" 
                }}
                className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full"
              />
              <p className="ml-4 text-gray-600">Loading profile...</p>
            </motion.div>
        ) : profile ? (
          <motion.div
            key="main-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInVariants}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.div
                  key="profile-content"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ProfileForm 
                    formData={formData}
                    setFormData={setFormData}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleSubmit={handleSubmit}
                    isUploadingAvatar={uploadingAvatar}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="bookings-content"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <UserBookings userId={profile.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-40 text-gray-600"
            >
              Could not load profile data. Please refresh the page.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <AnimatePresence>
        {modalData.isOpen && (
          <Modal 
            isOpen={modalData.isOpen} 
            title={modalData.title} 
            description={modalData.description} 
            type={modalData.type} 
            onClose={() => setModalData({ ...modalData, isOpen: false })} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}