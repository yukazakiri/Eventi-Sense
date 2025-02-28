import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import Modal from '../../assets/modal/modal';
import { LuPencil } from 'react-icons/lu';
import { MdOutlineMailOutline } from 'react-icons/md';
import { fetchProfile, updateProfile, getCurrentUser, uploadAvatar } from '../../api/utiilty/profiles';
import { PulseLoader } from 'react-spinners';

interface ModalData {
  isOpen: boolean;
  title: string;
  description: string;
  type: 'success' | 'error';
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  avatar_url: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [_email, setEmail] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    avatar_url: '',
  });

  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';
  useEffect(() => {
    let isMounted = true; // Track component mount status
    const controller = new AbortController(); 
  
    const loadProfile = async () => {
      try {
        const user = await getCurrentUser();
        
        if (!isMounted) return; // Exit if component unmounted
        
        if (user) {
          const profileData = await fetchProfile(user.id);
          
          if (!isMounted) return; // Check again after async operation
          
          if (profileData) {
            setProfile(profileData);
            setFormData({
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              email: user.email || '',
              role: profileData.role,
              avatar_url: profileData.avatar_url || '',
            });
            setAvatarUrl(profileData.avatar_url || fallbackAvatarUrl);
            setEmail(user.email || '');
          } else {
            console.error('Error fetching profile: Profile not found');
          }
        }
      } catch (error: any) {
        // Don't log errors if request was aborted or component unmounted
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        if (isMounted) {
          console.error('Error loading profile:', error);
        }
      }
    };
    
    loadProfile();
  
    return () => {
      isMounted = false;
      controller.abort(); // Abort any pending requests
    };
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === 'avatar_url') {
      setAvatarUrl(value);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setModalData({
          isOpen: true,
          title: 'Upload Failed',
          description: 'Please upload a valid image file (JPEG, JPG, or PNG).',
          type: 'error',
        });
        return;
      }
  
      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setModalData({
          isOpen: true,
          title: 'Upload Failed',
          description: 'Image size exceeds the limit (5MB).',
          type: 'error',
        });
        return;
      }
  
      setUploading(true);
      const user = await getCurrentUser();
      if (user) {
        try {
          const publicUrl = await uploadAvatar(user.id, file);
          if (publicUrl) {
            setFormData((prevFormData) => ({ ...prevFormData, avatar_url: publicUrl }));
            setAvatarUrl(publicUrl);
            setModalData({
              isOpen: true,
              title: 'Upload Successful',
              description: 'Your file has been uploaded successfully.',
              type: 'success',
            });
          } else {
            setModalData({
              isOpen: true,
              title: 'Upload Failed',
              description: 'There was an error uploading your file.',
              type: 'error',
            });
          }
        } catch (error: any) {
          if (error.statusCode === 409) {
            setModalData({
              isOpen: true,
              title: 'Upload Failed',
              description: 'A file with the same name already exists. Please try again.',
              type: 'error',
            });
          } else {
            setModalData({
              isOpen: true,
              title: 'Upload Failed',
              description: error.message || 'There was an error uploading your file.',
              type: 'error',
            });
          }
        }
      } else {
        setModalData({
          isOpen: true,
          title: 'Upload Failed',
          description: 'User not found. Please log in again.',
          type: 'error',
        });
      }
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await getCurrentUser();
    if (user) {
      const success = await updateProfile(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: formData.avatar_url,
      });
      if (success) {
        setModalData({
          isOpen: true,
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
          type: 'success',
        });
        setIsEditing(false);
      } else {
        setModalData({
          isOpen: true,
          title: 'Update Failed',
          description: 'There was an error updating your profile.',
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="py-b px-2">
      <div className="m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
              <img src={avatarUrl} alt="Profile avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="capitalize tracking-wide">
            <p className="font-semibold text-gray-700 text-lg mt-2 dark:text-gray-200 ">
              {formData.first_name} {formData.last_name}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <p className="text-sm text-gray-500 mt-2 pr-4 border-r border-gray-300 dark:text-gray-400 dark:border-gray-700">{formData.role}</p>
              <p className="text-sm text-gray-500 mt-2 sm:px-3 normal-case dark:text-gray-400">{formData.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia dark:bg-gray-900 dark:border-gray-700 ${isEditing ? 'border-[1px] border-indigo-300 dark:border-indigo-300' : ''}`}>
        {profile ? (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 dark:text-gray-200 font-sofia">Edit Personal Information</h1>
              {isEditing ? (
                <div className="flex space-x-4">
                  <button type="submit" className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-2xl dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-full flex items-center dark:bg-blue-600 dark:hover:bg-blue-700">
                  <LuPencil className="mr-2" />
                  Edit
                </button>
              )}
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r-[1px] border-gray-200 dark:border-gray-700">
                  <MdOutlineMailOutline className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="bg-white pl-14 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled
                  required
                />
              </div>
            </div>
            <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Profile Avatar</label>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={!isEditing || uploading}
              accept=".jpg, .jpeg, .png" // Restrict file types
              className="mt-2 block w-full text-sm text-gray-600 dark:text-gray-200"
            />
            {formData.avatar_url && (
              <img
                src={formData.avatar_url}
                alt="Profile Avatar"
                className="mt-4 w-48 h-48 rounded-md"
                onError={(e) => console.error("Image load error", e)}
              />
            )}
          </div>
          </form>
        ) : (
          <PulseLoader color="#0000ff" />
        )}
      </div>
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