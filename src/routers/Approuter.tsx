import { Routes, Route } from 'react-router-dom';
import Register from '../pages/AuthForm/Register';


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

import PublicVenueDetails from '../pages/PublicVenueDetails';
import PublicSupplierDetails from '../pages/PublicSupplierDetails';
import BookVenue from '../pages/Booking/VenueBooking';
import BookSupplier from '../pages/Booking/SupplierBooking';
import EventDetails from '../pages/Events/Event';
import EventUpdate from '../pages/Events/UpdateEvent';

import EventPlannerDashboard from '../app/EventPlanner';
import PublicVenueList from '../pages/List/PublicVenueList';
import PublicSupplierList from '../pages/List/PublicSupplier';
import PaymentPage from '../components/payment/paymentPages';
import TicketPage from '../components/payment/TicketPage';
import PublicEventPlannerList from '../pages/List/PublicEventPlanner';
import PublicEventPlanner from '../pages/PublicEventPlanners';
import EventsList from '../pages/Events/AllEventList'

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

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/venues/:venueId/book" element={<BookVenue />} /> {/* New route */}
        <Route path="/suppliers/:supplierId/book" element={<BookSupplier />} /> {/* New route */}

        <Route path="/UserDetails" element={<UserDetails />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/UpdateEvent/:id" element={<EventUpdate />} />
      
        {/* Venue Public */}
        <Route path="/venue/:venueId" element={<PublicVenueDetails/>} />
        <Route path="/supplier/:supplierId" element={<PublicSupplierDetails/>} />
        
        <Route path="/dashboard" element={<Dashboard />} /> {/* Regular user dashboard */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/test-supabase" element={<TestSupabase />} />
       
        <Route path="/profile" element={<Profile/>} />
        <Route path="/settings" element={<Settings/>} />

        <Route path="/venue-list" element={<PublicVenueList/>} /> 
        <Route path="/supplier-list" element={<PublicSupplierList/>} />
        <Route path="/payment" element={<PaymentPage />} />   
        <Route path="/tickets/:ticketId" element={<TicketPage />} />  
        <Route path="/Event-Planner" element={< PublicEventPlannerList/>} /> 
        <Route  path="/Event-Planner/:id/Profile"  element={< PublicEventPlanner/>} /> 
        <Route path="/Event-List" element={<EventsList/>} />
   

 

        <Route path="/Venue-Manager-dashboard/*" element={
          <ProtectedRoute requiredRole="venue_manager">
          <VenueManagerDashboard />
        </ProtectedRoute>
          } /> 

          



        <Route path="/Supplier-dashboard/*" element={
          <ProtectedRoute requiredRole="supplier">
          <SupplierDashboard />
          </ProtectedRoute>
          } />
          
        <Route path="/Event-Planner-Dashboard/*" element={
          <ProtectedRoute requiredRole="event_planner">
          <EventPlannerDashboard />
          </ProtectedRoute>
          } />



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