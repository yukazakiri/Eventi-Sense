import { useEffect, useState } from 'react';
import EventList from './EventList';
import Breadcrumbs from '../BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { fetchProfile } from '../../api/utiilty/profiles';
import { getCurrentUser } from '../../api/utiilty/profiles';

function EventListing() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;
        
        const profileData = await fetchProfile(user.id);
        setUserRole(profileData?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Define breadcrumb items based on the user's role
  const breadcrumbItems = [
    { label: 'Home', href: userRole === 'supplier' ? '/Supplier-Dashboard/Home' : '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Event List', href: '' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render the appropriate dashboard based on the user's role
  if (userRole === 'supplier') {
    return (
      <div className='md:mx-10'>
        <div className='flex justify-between'>
          <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova ">Events</h1>
          <div className="flex items-end">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mb-8 dark:bg-gray-950 dark:border-gray-700'>
          <div className='flex justify-between'>
            <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-white">Event Lists</h1>
            <div className='p-4'>
              <Link to="/Supplier-Dashboard/CreateEvents" className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-2xl dark:bg-blue-500 dark:hover:bg-blue-600">Create Event</Link>
            </div>
          </div>
          <EventList />
        </div>
      </div>
    );
  } else if (userRole === 'venue_manager') {
    return (
      <div className='md:mx-10'>
        <div className='flex justify-between'>
          <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova ">Venue Manager Dashboard</h1>
          <div className="flex items-end">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mb-8 dark:bg-gray-950 dark:border-gray-700'>
          <div className='flex justify-between'>
            <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-white">Venue Manager Event Lists</h1>
            <div className='p-4'>
              <Link to="/Venue-Manager-Dashboard/CreateEvents" className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-2xl dark:bg-blue-500 dark:hover:bg-blue-600">Create Event</Link>
            </div>
          </div>
          <EventList />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xl text-gray-700 dark:text-white">You do not have access to this dashboard.</p>
      </div>
    );
  }
}

export default EventListing;