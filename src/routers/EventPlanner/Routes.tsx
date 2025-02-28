import { RouteObject } from 'react-router-dom';
import Home from '../../pages/EventPlanner/Home';
import Profiles from '../../pages/Profile/Profiles';


const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/Home', element: <Home /> },
  { path: '/Profiles', element: <Profiles /> },




];

export default routes;
