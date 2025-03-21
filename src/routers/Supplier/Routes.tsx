import { RouteObject } from 'react-router-dom';
import Home from '../../pages/Supplier/Home';
import Profiles from '../../pages/Profile/Profiles';
//import CreateInfo from '../../pages/Supplier/Create-Information';
import CreateCompany from '../../pages/Profile/CreateCompany';
import SupplierInfo from '../../pages/Supplier/Supplier-Information';
import Services from '../../pages/Supplier/ServicesPage'
import CalendarPage from '../../pages/Supplier/Calendar';
import Booking from '../../pages/Supplier/BookingPage';
import CreateEventForm from '../../pages/Events/CreateEvents';
import UpdateEvents from '../../pages/Events/UpdateEvent';
import EventListing from '../../components/EventsCards/Event-List';
import TicketList from '../../pages/Events/TicketsList';
import RequestTicket from '../../pages/Events/RequestTickets';
import UserBookings from '../../pages/Booking/RequestBooking';


const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/Home', element: <Home /> },
  { path: '/Profiles', element: <Profiles /> },
  { path: '/Supplier', element: <SupplierInfo /> },
  { path: '/CreateCompany/:userId', element: <CreateCompany /> },
  { path: '/Services', element: <Services/>},
  { path: '/Calendar', element: <CalendarPage /> },
  { path: '/Booking', element: <Booking/> },
  { path: '/CreateEvents', element: <CreateEventForm/>},
  { path: '/UpdateEvents/:id', element: <UpdateEvents/>},
  { path: '/EventList', element: <EventListing /> },
  { path: '/TicketList', element: <TicketList  /> },
  { path: '/tickets', element: <RequestTicket   /> },
  { path: '/Requested-Bookings', element: <UserBookings/> },


];

export default routes;
