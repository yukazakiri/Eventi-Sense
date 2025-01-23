import { Routes, Route } from 'react-router-dom';
import Register from '../pages/AuthForm/Register';
import Login from '../pages/AuthForm/Login';

import AdminDashboard from '../pages/Admin/Dashboard';
import Dashboard from '../pages/Admin/Dashboard';

import ScrollToTop from '../layout/ScrolltoTop';
import ScrollToTopButton from '../layout/ScrollTop';

import LandingPage from '../pages/LandingPage';
import AboutUs from '../pages/AboutUs';
import FAQ from '../pages/FAQ';
import ContactUs from '../pages/ContactUs';
import PricingPage from '../pages/PricingPage';

import ProtectedRoute from '../components/Route-Protection/Admin'; // Import the ProtectedRoute component
import UnauthorizedPage from '../pages/NoAccess/Unauthorized'; // Import the UnauthorizedPage component
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
        <Route path="/dashboard" element={<Dashboard />} /> {/* Regular user dashboard */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> {/* Protected admin dashboard */}
      </Routes>
      <ScrollToTopButton />
    </>
  );
};

export default AppRouter;