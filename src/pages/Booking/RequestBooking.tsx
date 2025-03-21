import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../api/utiilty/profiles';
import Combine from './RequestBooking/Combine';

function UserBookings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      try {
        const user = await getCurrentUser();

        if (!user) {
          setError('User not authenticated.');
          return;
        }
        setUserId(user.id);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='md:m-10 m-4 '>
      <h2 className='text-2xl font-bonanova font-semibold mb-6'>Your Bookings</h2>
      {userId && (
        <>
          < Combine userId={userId} />
         
        </>
      )}
    </div>
  );
}

export default UserBookings;
