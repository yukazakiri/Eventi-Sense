
import Profile from './Profile'
import Company from './Company'
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';



const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Profiles', href: '' },

];
function Profiles() {
  return (
    <div  className='md:mx-10'>
      <div className='flex justify-between'>
            <h1 className="text-[24px] flex items-center font-meduim tracking-tight text-gray-700 my-4 font-sofia dark:text-gray-200">Profiles</h1>
            <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl   mb-8 dark:bg-gray-900 dark:border-gray-700'>
        <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-gray-200">Personal Profile</h1>
            <Profile />
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl  my-4 dark:bg-gray-900 dark:border-gray-700'>
        <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-gray-200">Business Profile</h1>
            <Company />
        </div>
        
      
    </div>
  )
}

export default Profiles