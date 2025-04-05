// UserDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../../../api/utiilty/profiles';
import { Profile } from '../../../types/profile';
import { MoonLoader } from 'react-spinners';
import { FiArrowLeft } from 'react-icons/fi';
import { Modal } from '../../../assets/modal/modal';
import { UserDetailsDisplay } from './UserDetailsDisplay';
import { UserActivity } from './UserActivity';

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const profileData = await fetchProfile(userId);
          setUser(profileData);
        } else {
          setError('User ID is undefined');
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleRoleUpdate = async () => {
    if (!user || !selectedRole) return;
    
    setUpdateLoading(true);
    try {
      const updatedUser = await updateProfile(user.id, { role: selectedRole });
      if (updatedUser) {
        setUser(updatedUser);
        setIsEditingRole(false);
        setIsSuccessModalOpen(true);
      }
    } catch (error: any) {
      setError(`Failed to update role: ${error.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <MoonLoader color="#3B82F6" size={40} />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => navigate(-1)}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Not Found!</strong>
          <span className="block sm:inline"> User not found</span>
          <button 
            onClick={() => navigate(-1)}
            className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <FiArrowLeft /> Back to Users
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Update User Role"
        description={`Are you sure you want to change this user's role to ${selectedRole?.replace('_', ' ')}?`}
        type="confirmation"
        onConfirm={handleRoleUpdate}
      />

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Role Updated"
        description="User role has been successfully updated."
        type="success"
      />

      <UserDetailsDisplay
        user={user}
        isEditingRole={isEditingRole}
        selectedRole={selectedRole}
        updateLoading={updateLoading}
        onRoleChange={(e) => setSelectedRole(e.target.value)}
        onEditStart={() => {
          setIsEditingRole(true);
          setSelectedRole(user.role || '');
        }}
        onEditCancel={() => {
          setIsEditingRole(false);
          setSelectedRole(user.role || '');
        }}
        onEditConfirm={() => setIsConfirmModalOpen(true)}
      />
<div className='my-8'>    {/* Add UserActivity component */}
      {user && <UserActivity userId={user.id} />}</div>

    </div>
  );
};

export default UserDetails;