import React, { useEffect, useState } from 'react';
import { fetchAllProfiles, deleteProfile } from '../../../api/utiilty/profiles';
import { Profile } from '../../../types/profile';
import { NavLink } from 'react-router-dom';
import { FiEye, FiSearch, FiTrash2, FiUsers, FiShoppingBag, FiCalendar, FiHome, FiUser } from 'react-icons/fi';
import { Modal } from '../../../assets/modal/modal';
import { MoonLoader } from 'react-spinners';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const ROLES = ['admin', 'venue_manager', 'supplier', 'event_planner', 'user'];
  
  // Define initial user stats object to avoid duplication
  const initialUserStats = {
    total: 0,
    venue_manager: 0,
    supplier: 0,
    event_planner: 0,
    user: 0,
    admin: 0
  };

  const [userStats, setUserStats] = useState({...initialUserStats});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const profiles = await fetchAllProfiles();
      setUsers(profiles);
      
      // Calculate user statistics
      const stats = profiles.reduce((acc, user) => {
        acc.total++;
        if (user.role && acc.hasOwnProperty(user.role)) {
          acc[user.role as keyof typeof acc]++;
        }
        return acc;
      }, {...initialUserStats});
      
      setUserStats(stats);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      setLoading(true);
      await deleteProfile(userToDelete);
      setUsers(prev => prev.filter(user => user.id !== userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setSuccessMessage("User has been successfully deleted.");
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      setError(`Failed to delete user: ${error.message}`);
      setIsDeleteModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 font-sofia">
        <MoonLoader color="#3B82F6" size={40} />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading users...</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative font-sofia">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
      <button 
        onClick={fetchUsers}
        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
      >
        Retry
      </button>
    </div>;
  }

  const StatCard = ({ title, count, icon: Icon, color }: { title: string; count: number; icon: any; color: string }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border-l-4  font-sofia ${color} hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${color.replace('border', 'bg')} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${color.replace('border', 'text').replace('-500', '-600')}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {count}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and monitor user accounts</p>
        </div>
      </div>

      {/* Display error as an alert if there is one but we still have users */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative  font-sofia">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4  font-sofia">
        <StatCard
          title="Total Users"
          count={userStats.total}
          icon={FiUsers}
          color="border-pink-500"
        />
        <StatCard
          title="Venue Managers"
          count={userStats.venue_manager}
          icon={FiHome}
          color="border-green-500"
        />
        <StatCard
          title="Suppliers"
          count={userStats.supplier}
          icon={FiShoppingBag}
          color="border-sky-500"
        />
        <StatCard
          title="Event Planners"
          count={userStats.event_planner}
          icon={FiCalendar}
          color="border-yellow-500"
        />
        <StatCard
          title="Regular Users"
          count={userStats.user}
          icon={FiUser}
          color="border-red-500"
        />
        <StatCard
          title="Admins"
          count={userStats.admin}
          icon={FiUsers}
          color="border-violet-500"
        />
      </div>

      <div className="flex gap-4 mb-6  font-sofia">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by email or ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-48 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Roles</option>
          {ROLES.map(role => (
            <option key={role} value={role}>
              {role.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {loading && users.length > 0 && (
        <div className="flex justify-center items-center h-12 mb-4">
          <MoonLoader color="#3B82F6" size={20} />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Updating...</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden  font-sofia">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">ID</th>
                <th scope="col" className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Email</th>
                <th scope="col" className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Role</th>
                <th scope="col" className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Full Name</th>
                <th scope="col" className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Created At</th>
                <th scope="col" className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {user.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full 
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        user.role === 'venue_manager' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        user.role === 'supplier' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300' :
                        user.role === 'event_planner' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-pink-100 text-pink-800 dark:bg-pink-400/30 dark:text-pink-300'}`}>
                        {user.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {user.first_name && user.last_name ? 
                        `${user.first_name} ${user.last_name}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {user.created_at 
                        ? new Date(user.created_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <NavLink
                          to={`/Admin-Dashboard/UserDetails/${user.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          View
                        </NavLink>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || selectedRole !== 'all' ? 
                      'No users match your search criteria.' : 
                      'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        type="confirmation"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
      />

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Success"
        description={successMessage}
        type="success"
        confirmText="OK"
      />
    </div>
  );
};

export default UserList;