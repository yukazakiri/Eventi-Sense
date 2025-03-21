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
    { label: 'Home', href: userRole === 'supplier' ? '/Supplier-Dashboard/Home' : userRole === 'venue_manager' ? '/Venue-Manager-Dashboard/Home' : '/Event-Planner-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Event List', href: '' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  // Render the appropriate dashboard based on the user's roless
  if (userRole === 'supplier') {
    return (
      <div className='md:mx-10'>
        <div className='flex justify-between'>
          <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova dark:text-gray-200 ">Events List</h1>
          <div className="flex items-end">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mb-8 dark:bg-gray-950 dark:border-gray-700'>
          <div className='flex justify-between'>
            <h1 className="text-[16px]  tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-white">Event Lists</h1>
            <div className='p-4'>
              <Link to="/Supplier-Dashboard/CreateEvents" className="text-white bg-sky-500 hover:bg-sky-600 px-5 py-4 rounded-full dark:bg-sky-500 dark:hover:bg-sky-600 font-sofia">Create Event</Link>
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
          <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova dark:text-gray-200">Event List</h1>
          <div className="flex items-end">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mb-8 dark:bg-gray-950 dark:border-gray-700'>
          <div className='flex justify-between'>
            <h1 className="text-[16px] tracking-wider text-gray-800 my-4 ml-4 font-sofia  dark:text-gray-200">Event Lists</h1>
            <div className='p-4'>
              <Link to="/Venue-Manager-Dashboard/CreateEvents" className="text-white bg-sky-500 hover:bg-sky-600 px-5 py-4 rounded-full dark:bg-sky-500 dark:hover:bg-sky-600 font-sofia">Create Event</Link>
            </div>
          </div>
          <EventList />
        </div>
      </div>
    );
    }
   else if (userRole === 'event_planner') {
    return (
      <div className='md:mx-10'>
        <div className='flex justify-between'>
          <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova dark:text-gray-200">Event List</h1>
          <div className="flex items-end">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mb-8 dark:bg-gray-950 dark:border-gray-700'>
          <div className='flex justify-between'>
            <h1 className="text-[16px]  tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-white"> Event Lists</h1>
            <div className='p-4'>
              <Link to="/Event-Planner-Dashboard/CreateEvents" className="text-white bg-sky-500 hover:bg-sky-600 px-5 py-4 rounded-full dark:bg-sky-500 dark:hover:bg-sky-600 font-sofia">Create Event</Link>
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