import React, { useEffect, useState } from 'react';
import { getAllAuthusers} from '../../../api/apiCall';
import { UserAuth } from '../../../types/types'; // Update with the correct path to your API and interface file
import { NavLink } from 'react-router-dom';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserAuth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllAuthusers();
        setUsers(users);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    ID
                </th>
                <th scope="col" className="px-6 py-3">
                    Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Created At
                </th>
                <th scope="col" className="px-6 py-3">
                    Confirmed At
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.id}
                    </th>
                    <td className="px-6 py-4">
                        {user.email}
                    </td>
                    <td className="px-6 py-4">
                        {user.created_at}
                    </td>
                    <td className="px-6 py-4">
                        {user.confirmed_at}
                    </td>
                    <td className="px-6 py-4">
                        <NavLink to={`/Admin-Dashboard/UserDetails/${user.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</NavLink>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  );
};

export default UserList;
