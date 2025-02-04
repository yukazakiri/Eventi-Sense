import React, { useEffect, useState } from 'react';
import { fetchAllUsers, assignRoleToUser, deleteUser } from '../../../api/apiCall'; // Ensure deleteUser is imported
import { User, ApiResponse } from '../../../types/types';
import Modal from '../../../assets/modal/modal';

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<{ [userId: string]: string }>({});
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; title: string; description: string; type: "success" | "error" }>({ isOpen: false, title: '', description: '', type: 'success' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response: ApiResponse = await fetchAllUsers();
        console.log('API Response:', response);

        if (response.error) {
          setError(response.error);
        } else if (response.users) {
          setUsers(response.users);
          console.log('Users State:', response.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignRole = async (userId: string) => {
    const role = selectedRole[userId];
    if (!role) {
      setModalInfo({
        isOpen: true,
        title: 'Error',
        description: 'Please select a role before assigning.',
        type: 'error',
      });
      return;
    }
  
    try {
      console.log(`Assigning role ${role} to user ${userId}`);
      const response = await assignRoleToUser(userId, role);
      console.log('API Response:', response);
  
      if (response && response.data) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role } : user
          )
        );
        setModalInfo({
          isOpen: true,
          title: 'Success',
          description: 'Role assigned successfully!',
          type: 'success',
        });
      } else {
        setModalInfo({
          isOpen: true,
          title: 'Error',
          description: 'An error occurred while assigning the role.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      setModalInfo({
        isOpen: true,
        title: 'Error',
        description: 'An error occurred while assigning the role.',
        type: 'error',
      });
    }
  };
  
  
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setModalInfo({
        isOpen: true,
        title: 'Success',
        description: 'User deleted successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      setModalInfo({
        isOpen: true,
        title: 'Error',
        description: 'An error occurred while deleting the user.',
        type: 'error',
      });
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Avatar</th>
            <th className="p-2 border">Website</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td className="p-2 border">{user.id}</td>
              <td className="p-2 border">{user.full_name || 'N/A'}</td>
              <td className="p-2 border">{user.email || 'N/A'}</td>
              <td className="p-2 border">{user.role || 'N/A'}</td>
              <td className="p-2 border">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.username || 'User'}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td className="p-2 border">{user.website || 'N/A'}</td>
              <td className="p-2 border">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-700">
                  <select
                    value={selectedRole[user.id] || ''}
                    onChange={(e) =>
                      setSelectedRole((prev) => ({
                        ...prev,
                        [user.id]: e.target.value,
                      }))
                    }
                    className="p-2 border rounded"
                  >
                    <option value="">Select a role</option>
                    <option value="supplier">Supplier</option>
                    <option value="venue_manager">Venue Manager</option>
                  </select>
                  <button
                    onClick={() => handleAssignRole(user.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Assign Role
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete User
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying success/error messages */}
      <Modal
        isOpen={modalInfo.isOpen}
        title={modalInfo.title}
        description={modalInfo.description}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        type={modalInfo.type}
      />
    </div>
  );
};

export default UserTable;
