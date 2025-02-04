import { NavLink } from 'react-router-dom';
//import Listing from '../../layouts/cards/Venue-Management-Cards/Listing';
import { PlusIcon } from "@heroicons/react/20/solid";
import UserAuthListing from '../Admin/UserManagement/UserAuthListing'; // Update the path to the correct file

function VenueManagement() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      {/* Create New Venue Button */}
      <div className="flex justify-end mb-6">
        <NavLink
          to="/Admin-Dashboard/Create-VM" // Navigate to the Create-Venue page
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" /> {/* Add the Plus icon */}
          <span>Create New Venue-Manager</span> {/* Button text */}
        </NavLink>
      </div>

      {/* Render the Listing component */}
     <UserAuthListing />
    </div>
  );
}

export default VenueManagement;