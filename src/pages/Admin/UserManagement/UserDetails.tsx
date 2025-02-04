import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../../api/apiCall'; // Add this function to your API
import { UserAuth } from '../../../types/types';

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('userId:', userId); // Debug log

    const fetchUser = async () => {
      try {
        if (userId) {
          const user = await getUserById(userId); // Fetch user details by ID
          setUser(user);
        } else {
          setError('User ID is undefined');
        }
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg dark:bg-gray-800">
        
      <h1 className="text-2xl font-bold mb-4 text-white">User Details</h1>
      <form>
    <div className="grid gap-6 mb-6 md:grid-cols-2  ">
        <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" value={user.profile.username ?? ''} readOnly />
        </div>
        <div>
            <label htmlFor="full_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
            <input type="text" id="full_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Full Name" value={user.profile.full_name ?? ''} readOnly />
        </div>
        <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" value={user.email ?? ''} readOnly />
        </div>
        <div>
            <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Website</label>
            <input type="url" id="website" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Website" value={user.profile.website ?? ''} readOnly />
        </div>
        <div>
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
            <input type="text" id="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Role" value={user.profile.role ?? ''} readOnly />
        </div>
        <div>
            <label htmlFor="created_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Created At</label>
            <input type="text" id="created_at" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Created At" value={user.created_at} readOnly />
        </div>
    </div>
    <div className="mb-6">
        <label htmlFor="avatar_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avatar URL</label>
        <input type="url" id="avatar_url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Avatar URL" value={user.profile.avatar_url ?? ''} readOnly />
    </div>
    <div className="mb-6">
        <label htmlFor="confirmed_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmed At</label>
        <input type="text" id="confirmed_at" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Confirmed At" value={user.confirmed_at ?? ''} readOnly />
    </div>
    <div className="mb-6">
        <label htmlFor="updated_at" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Updated At</label>
        <input type="text" id="updated_at" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Updated At" value={user.profile.updated_at ?? ''} readOnly />
    </div>
</form>
      
    </div>
  );
};

export default UserDetails;
