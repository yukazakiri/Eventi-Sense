// components/ProfileDisplay.tsx
import { useState } from 'react';
import { LuPencil, LuX, LuSave, LuBuilding,  LuMapPin, LuBriefcase, LuUser } from 'react-icons/lu';
import { EventPlannerProfile } from './profileupdate/api'; // Import the interface from your main component

interface ProfileDisplayProps {
  profile: EventPlannerProfile | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
  fallbackAvatarUrl: string;
}

export default function ProfileDisplay({
  profile,
  handleSubmit,
  handleChange,
  handleFileUpload,
  uploading,
  fallbackAvatarUrl
}: ProfileDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<EventPlannerProfile>>(profile || {});
  const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatar_url || fallbackAvatarUrl);

  const openModal = () => {
    setFormData(profile || {});
    setAvatarUrl(profile?.avatar_url || fallbackAvatarUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    closeModal();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className=" font-sofia  transition-colors duration-200 ">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bonanova md:text-3xl font-bold text-gray-600 dark:text-gray-100 ">
          Business Profile
        </h1>
        <button 
          onClick={openModal} 
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <LuPencil size={18} />
          <span className="hidden sm:inline">Edit Profile</span>
        </button>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

     {/* About Section */}
     <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl mr-4">
                <LuUser className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">About</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              {profile?.bio || 'No bio provided.'}
            </p>
          </div>
        {/* Main Info Cards */}
        <div className=" space-y-6">
          {/* Company Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mr-4">
                <LuBuilding className="text-indigo-600 dark:text-indigo-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Company Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{profile?.company_name || 'Not provided'}</p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</p>
                <p className="text-base">
                  {profile?.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                       className="text-sky-500 hover:text-sky-600 dark:text-sky-500 dark:hover:text-sky-600 transition-colors hover:underline">
                      {profile.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              <div className="md:col-span-2 group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{profile?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl mr-4">
                <LuMapPin className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">City</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{profile?.city || 'Not provided'}</p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">State</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{profile?.state || 'Not provided'}</p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Zip Code</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{profile?.zip_code || 'Not provided'}</p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Country</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{profile?.country || 'Not provided'}</p>
              </div>
            </div>
          </div>

     
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Edit Profile</h2>
              <button 
                onClick={closeModal} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <LuX size={24} />
              </button>
            </div>
            
            <form onSubmit={submitForm} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Avatar Upload */}
                <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div>
                    <img
                      src={avatarUrl}
                      alt="Profile Avatar"
                      className="w-28 h-28 object-cover rounded-full border-4 border-white dark:border-gray-700"
                      onError={() => setAvatarUrl(fallbackAvatarUrl)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upload New Avatar
                    </label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".jpg, .jpeg, .png"
                      className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                    />
                    {uploading && <p className="mt-2 text-sm text-sky-500">Uploading...</p>}
                  </div>
                </div>
                
                {/* Company Information */}
                <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
                    <LuBuilding className="mr-2" /> Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company_name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={formData.company_name || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Experience */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
                    <LuBriefcase className="mr-2" /> Experience
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="experience_years" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="experience_years"
                        name="experience_years"
                        value={formData.experience_years || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="specialization" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Specialization
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Bio */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
                    <LuUser className="mr-2" /> About
                  </h3>
                  <div>
                    <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleFormChange}
                      className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 h-32"
                      placeholder="Tell us about yourself and your company"
                    />
                  </div>
                </div>
                
                {/* Location Details */}
                <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h3 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center">
                    <LuMapPin className="mr-2" /> Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleFormChange}
                            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state || ''}
                        onChange={handleFormChange}
                          className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="zip_code" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleFormChange}
                        className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 flex justify-end space-x-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <LuSave size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}