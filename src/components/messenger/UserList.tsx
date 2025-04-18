import React from 'react';
import { User } from './types/index';
import { formatDistanceToNow } from 'date-fns';


interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  loading: boolean;
  unreadFromUsers: string[]; // NEW PROP
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  selectedUser, 
  onSelectUser, 
  loading,
  unreadFromUsers
}) => {
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="rounded-full bg-gray-500 h-10 w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-500 rounded w-3/4"></div>
                <div className="h-3 bg-gray-500 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className='font-sofia'>
      {users.map((user) => {
        const isUnread = unreadFromUsers.includes(user.id);

        return (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`relative w-full text-left  border-b border-gray-800 hover:bg-gray-800 focus:outline-none ${
              selectedUser?.id === user.id ? 'bg-sky-400/10 shadow-md text-sky-400 shadow-sky-400/30' : ''
            }`}
          >
        <div className="px-4 py-3  border-b border-gray-800 flex justify-between">
        <div className="flex items-center">
          <div className="relative">
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.first_name}
                className="w-12 h-12 rounded-full mr-3 object-cover" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                <span className="text-sky-800 font-medium">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </span>
              </div>
            )}
            {/* Online/Offline Dot */}
            <span
              className={`
                absolute left-10 -translate-x-1/2 -bottom-[1px]
                w-3 h-3 rounded-full border-[1px] border-gray-900/60
                ${user.online ? 'bg-green-500' : 'bg-red-500'}
              `}
            />
          </div>
          <div>
            <h2 className="font-medium text-white">{`${user.first_name} ${user.last_name}`}</h2>
            <p className="text-xs text-gray-400">
              {user.role || 'User'}
            </p>
          </div>
        </div>
        <div>
        <p className="text-xs text-gray-500 mt-1">
          {user.online
            ? 'Online now'
            : user.last_online
              ? `${formatDistanceToNow(new Date(user.last_online), { addSuffix: true })}`
              : 'Offline'}
        </p>

        </div>
      </div>

            {/* Unread Dot */}
            {isUnread && (
              <span className="absolute top-4 right-4 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default UserList;
