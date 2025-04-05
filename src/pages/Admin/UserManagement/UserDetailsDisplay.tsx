import React from 'react';
import { Profile } from '../../../types/profile';
import { MoonLoader } from 'react-spinners';
import { FiEdit2, FiCheck, FiX, FiUser, FiMail, FiCalendar, FiClock, FiHash } from 'react-icons/fi';

interface UserDetailsDisplayProps {
  user: Profile;
  isEditingRole: boolean;
  selectedRole: string;
  updateLoading: boolean;
  onRoleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditConfirm: () => void;
}

const ROLES = ['admin', 'venue_manager', 'supplier', 'event_planner', 'user'];

export const UserDetailsDisplay: React.FC<UserDetailsDisplayProps> = ({
  user,
  isEditingRole,
  selectedRole,
  updateLoading,
  onRoleChange,
  onEditStart,
  onEditCancel,
  onEditConfirm,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 font-sofia">
      {/* Header with Avatar */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute -bottom-12 left-6">
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt="User avatar" 
              className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
              <FiUser className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-16 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <FiHash className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiMail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FiClock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Role Management</h3>
            {!isEditingRole && (
              <button
                onClick={onEditStart}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit Role</span>
              </button>
            )}
          </div>

          <div className="mt-4">
            {isEditingRole ? (
              <div className="flex items-center gap-3">
                <select
                  value={selectedRole}
                  onChange={onRoleChange}
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  disabled={updateLoading}
                >
                  <option value="">Select Role</option>
                  {ROLES.map(role => (
                    <option key={role} value={role}>
                      {role.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={onEditConfirm}
                    disabled={updateLoading || !selectedRole}
                    className="inline-flex items-center justify-center p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {updateLoading ? (
                      <MoonLoader size={16} color="#ffffff" />
                    ) : (
                      <FiCheck className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={onEditCancel}
                    disabled={updateLoading}
                    className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`inline-block px-4 py-2 rounded-lg text-sm font-medium
                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                        user.role === 'venue_manager' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        user.role === 'supplier' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300' :
                        user.role === 'event_planner' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-pink-100 text-pink-800 dark:bg-pink-400/30 dark:text-pink-300'}`}>
                {user.role?.replace('_', ' ').toUpperCase() || 'N/A'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};