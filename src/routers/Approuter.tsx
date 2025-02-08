import { Routes, Route } from 'react-router-dom';
import Register from '../pages/AuthForm/Register';
import Login from '../pages/AuthForm/Login';

import AdminDashboard from '../app/Admin';
import Dashboard from '../pages/RegularUser/Dashboard';
import VenueManagerDashboard from '../app/VenueManager';
import SupplierDashboard from '../app/Supplier';

import ScrollToTop from '../layout/ScrolltoTop';
import ScrollToTopButton from '../layout/ScrollTop';

import LandingPage from '../pages/LandingPage';
import AboutUs from '../pages/AboutUs';
import FAQ from '../pages/FAQ';
import ContactUs from '../pages/ContactUs';
import PricingPage from '../pages/PricingPage';


import ProtectedRoute from '../components/Route-Protection/Protection';
import UnauthorizedPage from '../pages/NoAccess/Unauthorized'; // Import the UnauthorizedPage component
import UserDetails from '../pages/Admin/UserManagement/UserDetails';

import TestSupabase from '../hooks/TestSupabase';
import Profile from '../pages/ProfilePage';
import Settings from '../pages/setting';


const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/Pricing" element={<PricingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/UserDetails" element={<UserDetails />} />
        
        <Route path="/dashboard" element={<Dashboard />} /> {/* Regular user dashboard */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/test-supabase" element={<TestSupabase />} />
       
        <Route path="/profile" element={<Profile/>} />
        <Route path="/settings" element={<Settings/>} />

        <Route path="/Venue-Manager-dashboard/*" element={
          <ProtectedRoute requiredRole="venue_manager">
          <VenueManagerDashboard />
          </ProtectedRoute>
          } /> {/* Regular user dashboard */}

        <Route path="/Supplier-dashboard/*" element={
          <ProtectedRoute requiredRole="supplier">
          <SupplierDashboard />
          </ProtectedRoute>
          } /> {/* Regular user dashboard */}



        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> 
         
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default AppRouter;