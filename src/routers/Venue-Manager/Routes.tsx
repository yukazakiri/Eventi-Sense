import { RouteObject } from 'react-router-dom';
import  Home  from '../../pages/VenueManager/Home';
import Profile from '../../pages/VenueManager/Profile/Profile';
import Company from '../../pages/VenueManager/Profile/Company';
import Testimage from '../../pages/VenueManager/testimage';
import CreateVenue from '../../pages/VenueManager/venue/CreateVenue';
import VenueDetail from '../../pages/VenueManager/venue/VenueDetails';
import VenueList from '../../pages/VenueManager/venue/ListVenues';



const routes: RouteObject[] = [ 
 { path: '/', element: <Home /> },
 { path: '/Home', element: <Home /> },
 { path: '/Profile', element: <Profile /> },
 { path: '/CompanyProfile', element: <Company /> },
 { path: '/Financial-Overview', element: <Testimage /> },
 { path: '/CreateVenue', element: <CreateVenue/> },
 { path: '/Venue/:venueId', element: <VenueDetail  /> },
 { path: '/Venue-List', element: <VenueList/> },

];

export default routes;