
import { useState } from 'react';
import UserAuthListing from '../Admin/UserManagement/UserAuthListing';
import { CreateUser } from './UserManagement/CreateUser';
import { FiUserPlus } from 'react-icons/fi';

function UserManagement() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleUserCreated = () => {
    // Refresh the user list
    window.location.reload();
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 font-sofia">
      <div className="flex justify-end items-end mb-6">
  
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <FiUserPlus className="w-5 h-5" />
          Create User
        </button>
      </div>

      <CreateUser
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />

      <UserAuthListing />
    </div>
  );
}

export default UserManagement;