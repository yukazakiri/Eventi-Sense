import { RouteObject } from 'react-router-dom';
import Home from '../../pages/EventPlanner/Home';
import Profiles from '../../pages/Profile/Profiles';
import CreateCompany from '../../pages/Profile/CreateCompany';

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/Home', element: <Home /> },
  { path: '/Profiles', element: <Profiles /> },
  { path: '/CreateCompany/:userId', element: <CreateCompany /> },




];

export default routes;
