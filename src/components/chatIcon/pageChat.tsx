
import { useState, useEffect } from 'react';
import { User } from '../messenger/types';
import { getCurrentUser } from '../messenger/services/supabaseService';
import MessengerContainer from '../messenger/Messenger/MessengerContainer';
import UserList from '../messenger/UserList';
import { useUsers } from '../messenger/hooks/useUsers';
import { useUnreadMessages } from '../messenger/hooks/unreadMessage';



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
        <div className="flex items-center justify-center min-h-screen ">
          <div className="text-center  p-6 max-w-sm mx-auto bg-gray-900 rounded-lg shadow-md">
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

   <div className='min-h-screen pt-32'>
        <div className="max-w-7xl h-[800px]  mx-auto py-6 flex gap-4 font-sofia">
          {/* Sidebar - User List */}
          <div className="max-w-sm bg-gray-900 shadow-sm overflow-y-auto border-r border-gray-800 rounded-2xl"
              style={{
                background: `
                  linear-gradient(#152131, #152131) padding-box,
                  linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                `,
                border: '1px solid transparent',
                borderRadius: '0.75rem'
              }}
          >
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
          <div className="flex-1 flex flex-col "     style={{
      background: `
        linear-gradient(#152131, #152131) padding-box,
        linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
      `,
      border: '1px solid transparent',
      borderRadius: '0.75rem'
    }}>
            {currentUser && (
           <MessengerContainer 
           currentUser={currentUser}
           selectedUser={selectedUser}

         />
         
            )}
          </div>
        </div>
        </div>
      );
    };

export default Main



 