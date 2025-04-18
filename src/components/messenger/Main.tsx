
import { useState, useEffect } from 'react';
import { User } from './types';
import { getCurrentUser } from './services/supabaseService';
import MessengerContainer from './Messenger/MessengerContainer';
import UserList from './UserList';
import { useUsers } from './hooks/useUsers';
import { useUnreadMessages } from './hooks/unreadMessage';


function Main() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const unreadFromUsers = useUnreadMessages(currentUser?.id || '');


  
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching current user:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchCurrentUser();
    }, []);
    
    const { users, loading: usersLoading } = useUsers(currentUser?.id || '');
    
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading application...</p>
          </div>
        </div>
      );
    }
    
    if (!currentUser) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6 max-w-sm mx-auto bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-4">Please sign in to access the messenger.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }
  
    return (
        <div className="h-[800px] flex bg-gray-950 gap-4 font-sofia">
          {/* Sidebar - User List */}
          <div className="max-w-80 bg-gray-900 shadow-sm overflow-y-auto border-r border-gray-800 rounded-2xl">
            <div className="p-4 border-b border-gray-800">
              <h1 className="text-xl font-meduim text-gray-200">Messages</h1>
            </div>
            
            <UserList 
  users={users} 
  selectedUser={selectedUser} 
  onSelectUser={setSelectedUser} 
  loading={usersLoading}
  unreadFromUsers={unreadFromUsers}
/>

          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col ">
            {currentUser && (
           <MessengerContainer 
           currentUser={currentUser}
           selectedUser={selectedUser}

         />
         
            )}
          </div>
        </div>
      );
    };

export default Main



 