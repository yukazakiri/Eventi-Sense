import { RouteObject } from 'react-router-dom';
import Home from '../../pages/EventPlanner/Home';
import Profiles from '../../pages/Profile/Profiles';
import CreateCompany from '../../pages/Profile/CreateCompany';
import EventListing from '../../components/EventsCards/Event-List';
import CreateEventForm from '../../pages/Events/CreateEvents';
import UpdateEvents from '../../pages/Events/UpdateEvent';
import TicketList from '../../pages/Events/TicketsList';
import RequestTicket from '../../pages/Events/RequestTickets';

import ProfilePage from '../../pages/Profile/Personal Profile/ProfilePage';

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/Home', element: <Home /> },
  { path: '/Profiles', element: <Profiles /> },
  { path: '/CreateCompany/:userId', element: <CreateCompany /> },
  { path: '/EventList', element: <EventListing /> },
  { path: '/CreateEvents', element: <CreateEventForm/>},
  { path: '/UpdateEvents/:id', element: <UpdateEvents/>},
  { path: '/TicketList', element: <TicketList  /> },
  { path: '/tickets', element: <RequestTicket   /> },

  { path: '/Profile', element: <ProfilePage /> },


];

export default routes;
