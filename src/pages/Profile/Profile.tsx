import { useEffect, useState } from 'react';
import supabase from '../../api/supabaseClient'; // Adjust the import path as needed
import Modal from '../../assets/modal/modal';
import { LuPencil } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    avatar_url: '', // Add avatar_url to formData
  });

  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg'; // Path to your fallback image

  useEffect(() => {
    const fetchProfileAndEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
          setFormData({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: user.email || '',
            role: profileData.role,
            avatar_url: profileData.avatar_url || '', // Initialize avatar_url in formData
          });
          setAvatarUrl(profileData.avatar_url || fallbackAvatarUrl);
        }
        setEmail(user.email || '');
        console.log(email);
      }
    };

    fetchProfileAndEmail();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'avatar_url') {
      setAvatarUrl(e.target.value); // Update avatarUrl state when avatar_url input changes
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
  
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not found');
        setModalData({
          isOpen: true,
          title: 'Upload Failed',
          description: 'User not found. Please log in again.',
          type: 'error',
        });
        setUploading(false);
        return;
      }
  
      // Define the file path
      const fileName = `logo/${user.id}_${file.name}`;
  
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile') // Use the bucket name 'profile'
        .upload(fileName, file);
  
      if (error) {
        console.error('Error uploading file:', error);
        setModalData({
          isOpen: true,
          title: 'Upload Failed',
          description: 'There was an error uploading your file.',
          type: 'error',
        });
      } else {
        // Get the public URL of the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('profile')
          .getPublicUrl(data.path);
  
        console.log('Public URL:', publicUrl); // Debugging: Log the public URL
  
        // Update the form data and avatar URL
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar_url: publicUrl,
        }));
        setAvatarUrl(publicUrl);
  
        setModalData({
          isOpen: true,
          title: 'Upload Successful',
          description: 'Your file has been uploaded successfully.',
          type: 'success',
        });
      }
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log("Avatar URL to be saved:", formData.avatar_url); // Add this line
  
      const { error } = await supabase
      .from('profiles')
      .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          avatar_url: formData.avatar_url,
      })
      .eq('id', user.id);

      console.log('avatar_url', formData.avatar_url);

  if (error) {
      console.error('Error updating profile:', error);
      if (error.message) {
          console.error('Error message:', error.message);
      }
      if (error.details) {
          console.error('Error details:', error.details);
      }
      setModalData({
          isOpen: true,
          title: 'Update Failed',
          description: 'There was an error updating your profile.',
          type: 'error',
      });
  }

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
  };

  return (
    <div className="py-b  px-2">
      <div className="m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="capitalize tracking-wide">
            <p className="font-semibold text-gray-700 text-lg mt-2">{formData.first_name} {formData.last_name}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <p className="text-sm text-gray-500 mt-2 pr-4 border-r border-gray-300">{formData.role}</p>
              <p className="text-sm text-gray-500 mt-2 sm:px-3 normal-case">{formData.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia ${isEditing ? 'border-2 border-indigo-300' : ''}`}>
        {profile ? (
          <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 font-sofia  ">Edit Personal Information</h1>
              {isEditing ? (
                <div className="flex space-x-4">
                  <button type="submit" className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-2xl">Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-full flex items-center">
                  <LuPencil className="mr-2" />
                  Edit
                </button>
              )}
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-700">First name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-700">Last name</label>
                <div>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
              <div className='relative'>
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r-[1px]  border-gray-200">
                  <MdOutlineMailOutline  className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="bg-white pl-14 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  disabled
                  required
                />
              </div>
            </div>
            {/* Avatar Upload */}
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Profile Avatar</label>
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={!isEditing || uploading}
                className="mt-2 block w-full text-sm text-gray-600"
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
          <p>Loading profile...</p>
        )}
      </div>

      <Modal isOpen={modalData.isOpen} title={modalData.title} description={modalData.description} type={modalData.type} onClose={() => setModalData({ ...modalData, isOpen: false })} />
    </div>
  );
}