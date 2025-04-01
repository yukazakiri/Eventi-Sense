import React from 'react';
import { ProfileData } from './type';
import { FiEdit2, FiSave, FiX, FiUser, FiMail } from 'react-icons/fi';

interface ProfileFormProps {
  formData: ProfileData;
  setFormData: (data: ProfileData) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isUploadingAvatar?: boolean;
}

export default function ProfileForm({ 
  formData, 
  setFormData, 
  isEditing, 
  setIsEditing, 
  handleSubmit,
  isUploadingAvatar = false
}: ProfileFormProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
    className="transition-all relative duration-300 bg-[#152131] rounded-xl font-sofia p-4 sm:p-6 w-full border-3 border-transparent"
    style={{
      background: `
        linear-gradient(#152131, #152131) padding-box,
        linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
      `,
      border: '1px solid transparent',
      borderRadius: '0.75rem'
    }}
  >
      <div className="flex flex-row justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-white tracking-wider">Personal Information</h2>
        {!isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="flex items-center justify-center gap-2 text-white hover:text-sky-800 px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-50 transition-all"
            disabled={isUploadingAvatar}
          >
            <FiEdit2 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        // Edit Mode - Show Form with Input Fields
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="first_name" className="block text-sm font-medium text-white">First name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-sky-300 bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-gray-900 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last_name" className="block text-sm font-medium text-white">Last name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-sky-300 bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-gray-900 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-700"
              disabled
              required
            />
            <p className="text-xs text-gray-300 mt-1">Email cannot be changed</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-3 pt-4 border-t border-gray-100/30">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all w-full sm:w-auto"
              disabled={isUploadingAvatar}
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button 
              type="submit" 
              className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-all w-full sm:w-auto ${isUploadingAvatar ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        // View Mode - Show Information as Text
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">First name</p>
              <div className="flex items-center gap-2">
                <div className='bg-sky-500/50 rounded-full'> 
                  <FiUser className="text-sky-400 m-2" />
                </div>
                <p className="text-lg font-medium text-gray-100">{formData.first_name}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">Last name</p>
              <div className="flex items-center gap-2">
                <div className='bg-sky-500/50 rounded-full sm:hidden'> 
                  <FiUser className="text-sky-400 m-2" />
                </div>
                <p className="text-lg font-medium text-gray-100">{formData.last_name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-gray-300">Email address</p>
            <div className="flex items-center gap-2">
              <div className='bg-sky-500/50 rounded-full'> 
                <FiMail className="text-sky-400 m-2" />
              </div>
              <p className="text-lg font-medium text-gray-100 break-all">{formData.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}