import React, { useState, useRef } from 'react';
import supabase from '../../../api/supabaseClient';
import { FiUpload, FiX, FiCamera, FiUser } from 'react-icons/fi';

interface AvatarUploadProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  userId: string;
}

export default function 
AvatarUpload({ 
  avatarUrl, 
  setAvatarUrl, 
  uploading, 
  setUploading, 
  userId 
}: AvatarUploadProps) {
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a unique file name for the upload
  const generateFileName = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${userId}_${timestamp}_${randomString}`;
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setAvatarError(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
  
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateFileName()}.${fileExt}`;
      const filePath = `${fileName}`;
  
      // 1. Upload the image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile/avatars')
        .upload(filePath, file);
  
      if (uploadError) {
        throw uploadError;
      }
  
      // 2. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile/avatars')
        .getPublicUrl(filePath);
  
      const publicUrl = publicUrlData.publicUrl;
  
      // 3. Update the profiles table with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
  
      if (updateError) {
        throw updateError;
      }
  
      // 4. Update local state
      setAvatarUrl(publicUrl);
  
    } catch (error: any) {
      setAvatarError(error.message);
      console.error('Error uploading avatar:', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Remove unused file declaration since we directly use e.dataTransfer.files in the event object
      
      // Create a new event-like object
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      uploadAvatar(event);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = () => {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      setAvatarUrl(null);
    }
  };

  return (
    <div className="flex flex-col items-start">
      <div className="relative group">
        {avatarUrl ? (
          <div className="relative">
        <div className="relative w-36 h-36 rounded-full p-1 shadow-lg transition-all duration-300 hover:shadow-xl"
     style={{
       background: "linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
     }}>
  <div className="w-full h-full rounded-full overflow-hidden  border-white">
    <img 
      src={avatarUrl} 
      alt="Avatar" 
      className="w-full h-full object-cover"
    />
  </div>
</div>
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <button 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-all duration-200 transform hover:scale-110"
                  title="Change avatar"
                >
                  <FiCamera size={18} />
                </button>
                <button 
                  onClick={removeAvatar}
                  disabled={uploading}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 transform hover:scale-110"
                  title="Remove avatar"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragging 
                ? 'bg-sky-100 border-2 border-dashed border-sky-400' 
                : 'bg-gray-100 border-2 border-dashed border-gray-300 hover:bg-gray-200'
            }`}
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FiUser size={40} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center px-2">
              {isDragging ? 'Drop image here' : 'No avatar'}
            </span>
          </div>
        )}

        {/* Status indicator */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-full">
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="mt-4">
        <button
          onClick={triggerFileInput}
          disabled={uploading}
          className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            uploading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow hover:shadow-md'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FiUpload className="mr-2" />
              <span>{avatarUrl ? 'Change Avatar' : 'Upload Avatar'}</span>
            </>
          )}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
      
      {/* Drag & drop hint */}
      {!avatarUrl && (
        <p className="text-sm text-gray-500 mt-2">
          or drag and drop an image
        </p>
      )}
      
      {/* Error message */}
      {avatarError && (
        <div className="mt-3 px-4 py-2 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm">
          <p className="flex items-center">
            <FiX className="mr-2" />
            {avatarError}
          </p>
        </div>
      )}
    </div>
  );
}