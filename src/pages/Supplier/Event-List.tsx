import EventList from '../../pages/Supplier/Events/EventList'
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';



const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Event List', href: '' },

];
function EventListing() {
  return (
    <div  className='md:mx-10'>
     <div className='flex justify-between'>
            <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova ">Events</h1>
            <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl   mb-8 '>
            <div className='flex justify-between'>     
                  <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia  ">Event Lists</h1>
                  <div className='p-4'>
                  <Link to="/Supplier-Dashboard/CreateEvents" className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-2xl">Create Event</Link>
                  </div>
            </div>
 
        <EventList />
        </div>
    </div>
  )
}

export default EventListing