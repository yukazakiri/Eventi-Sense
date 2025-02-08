import { RouteObject } from 'react-router-dom';
import  Home  from '../../pages/VenueManager/Home';
import Profile from '../../pages/VenueManager/Profile/Profile';
import Company from '../../pages/VenueManager/Profile/Company';
import Testimage from '../../pages/VenueManager/testimage';
import CreateVenue from '../../pages/VenueManager/venue/CreateVenueComponents/CreatePage';
import VenueDetail from '../../pages/VenueManager/venue/VenueDetails';
import VenueList from '../../pages/VenueManager/venue/ListVenues';
//import  AvailabilityPage  from '../../pages/VenueManager/venue/VenueDetails/Availabilty/AvailabilityPage';
import VenueCalendar from '../../pages/VenueManager/venue/VenueDetails/AvailabiltyGallery/AddVenueAvailabilityForm';
import VenueGallery from '../../pages/VenueManager/venue/VenueDetails/AvailabiltyGallery/Gallery';



const routes: RouteObject[] = [ 
 { path: '/', element: <Home /> },
 { path: '/Home', element: <Home /> },

 { path: '/Profile', element: <Profile /> },
 { path: '/CompanyProfile', element: <Company /> },

 { path: '/Financial-Overview', element: <Testimage /> },

 { path: '/CreateVenue', element: <CreateVenue/> },
 

 { path: '/VenueDetails/:venueId', element: <VenueDetail  /> },
 { path: '/Venue-List', element: <VenueList/> },
 
 { path: '/Venue-Details/:venueId/add-availability', element: <VenueCalendar/> },

 { path: '/Venue-Details/:venueId/add-photos', element: <VenueGallery/> }





];

export default routes;