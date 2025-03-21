import { RouteObject } from 'react-router-dom';
import  Home  from '../../pages/VenueManager/Home';
import Profile from '../../pages/Profile/Profile';
import Company from '../../pages/Profile/Company';
import Testimage from '../../pages/VenueManager/testimage';
import CreateVenue from '../../pages/VenueManager/venue/CreateVenueComponents/CreatePage';
import VenueDetail from '../../pages/VenueManager/venue/VenueDetails';
import VenueList from '../../pages/VenueManager/venue/ListVenues';
//import  AvailabilityPage  from '../../pages/VenueManager/venue/VenueDetails/Availabilty/AvailabilityPage';
import VenueCalendar from '../../pages/VenueManager/venue/VenueDetails/AvailabiltyGallery/AddVenueAvailabilityForm';
import VenueGallery from '../../pages/VenueManager/venue/VenueDetails/AvailabiltyGallery/Gallery';
import BookingDetails from '../../pages/VenueManager/Booking/BookingDetails';
import BookingList from '../../pages/VenueManager/BookingList';
import Profiles from '../../pages/Profile/Profiles';
import TicketList from '../../pages/Events/TicketsList';
import RequestTicket from '../../pages/Events/RequestTickets';
import EventListing from '../../components/EventsCards/Event-List';
import CreateEventForm from '../../pages/Events/CreateEvents';
import AllNotifications from '../../pages/Notifications/AllNotifications';
import CreateCompany from '../../pages/Profile/CreateCompany';
import UpdateEvent from '../../pages/Events/UpdateEvent';

import UserBookings from '../../pages/Booking/RequestBooking';

import EventListTicket from '../../components/TicketManagement/EventListTicket'
import EventAttendees from '../../components/TicketManagement/EventTicket';
const routes: RouteObject[] = [ 
 { path: '/', element: <Home /> },
 { path: '/Home', element: <Home /> },

 { path: '/Profile', element: <Profile /> },
 { path: '/CompanyProfile', element: <Company /> },
 { path: '/CreateCompany/:userId', element: <CreateCompany /> },
 { path: '/Financial-Overview', element: <Testimage /> },

 { path: '/CreateVenue', element: <CreateVenue/> },
 

 { path: '/VenueDetails/:venueId', element: <VenueDetail  /> },
 { path: '/Venue-List', element: <VenueList/> },
 
 { path: '/Venue-Details/:venueId/add-availability', element: <VenueCalendar/> },

 { path: '/Venue-Details/:venueId/add-photos', element: <VenueGallery/> },
 { path: '/BookingDetail/:venueId', element: <BookingDetails/> },

 { path: '/Booking-List', element: <BookingList/> },
 { path: '/CreateEvents', element: <CreateEventForm/>},
 { path: '/UpdateEvents/:id', element: <UpdateEvent/>},
 { path: '/Profiles', element: <Profiles /> },
 { path: '/EventList', element: <EventListing /> },
 { path: '/TicketList', element: <TicketList  /> },
 { path: '/tickets', element: <RequestTicket   /> },
 { path: '/notifications', element: <AllNotifications /> },

 { path: '/Requested-Bookings', element: <UserBookings/> },


 { path: '/EventListTicket', element: <EventListTicket/> },
 { path: '/EventAttendees/:eventId', element: <EventAttendees /> },




];

export default routes;