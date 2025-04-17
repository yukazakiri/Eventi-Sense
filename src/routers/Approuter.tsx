// Core imports
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Dashboard imports
import AdminDashboard from '../app/Admin';
import Dashboard from '../pages/RegularUser/Dashboard';
import VenueManagerDashboard from '../app/VenueManager';
import SupplierDashboard from '../app/Supplier';
import EventPlannerDashboard from '../app/EventPlanner';

// Layout and UI Components
import ScrollToTop from '../layout/ScrolltoTop';
import ScrollToTopButton from '../layout/ScrollTop';
import SurveyDisplay from '../components/SurveyDisplay';
import BotpressChat from '../components/ChatBot/BotpressChat';

// Public Pages
import LandingPage from '../pages/LandingPage';
import AboutUs from '../pages/AboutUs';
import FAQ from '../pages/FAQ';
import ContactUs from '../pages/ContactUs';
import PricingPage from '../pages/PricingPage';
import Register from '../pages/AuthForm/Register';

// Protected Routes and Auth
import ProtectedRoute from '../components/Route-Protection/Protection';
import UnauthorizedPage from '../pages/NoAccess/Unauthorized';

// User Management
import UserDetails from '../pages/Admin/UserManagement/main';
import Profile from '../pages/ProfilePage';
import Settings from '../pages/setting';

// Venue and Supplier Pages
import PublicVenueDetails from '../pages/PublicVenueDetails';
import PublicSupplierDetails from '../pages/PublicSupplierDetails';
import PublicVenueList from '../pages/List/PublicVenueList';
import PublicSupplierList from '../pages/List/PublicSupplier';
import BookVenue from '../pages/Booking/VenueBooking';
import BookSupplier from '../pages/Booking/SupplierBooking';

// Event Related Pages
import EventDetails from '../pages/Events/Event';
import EventUpdate from '../pages/Events/UpdateEvent';
import EventsList from '../pages/Events/AllEventList';
import { CreateEvent } from '../pages/CreateEvent';

// Event Planner Pages
import PublicEventPlannerList from '../pages/List/PublicEventPlanner';
import PublicEventPlanner from '../pages/PublicEventPlanners';

// Payment and Tickets
import PaymentPage from '../components/payment/paymentPages';
import TicketPage from '../components/payment/TicketPage';
import ApplicationProcess from '../pages/PartnerApplication/Home';
import ApplicationForm from '../pages/PartnerApplication/Form';
import BusinessPlan from '../pages/ProPlan/home';


// Page Transition Animation Component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };
  
  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="motion-page"
    >
      {children}
    </motion.div>
  );
};

// Route Groups Interface
interface RouteGroup {
  path: string;
  element: JSX.Element;
}

const AppRouter = () => {
  const location = useLocation();

  // Public Routes
  const publicRoutes: RouteGroup[] = [
    { path: "/", element: <LandingPage /> },
    { path: "/about", element: <AboutUs /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/contact", element: <ContactUs /> },
    { path: "/Pricing", element: <PricingPage /> },
    { path: "/register", element: <Register /> },
    { path: "/unauthorized", element: <UnauthorizedPage /> },
  ];

  // Protected Dashboard Routes
  const dashboardRoutes: RouteGroup[] = [
    { 
      path: "/Venue-Manager-dashboard/*", 
      element: <ProtectedRoute requiredRole="venue_manager"><VenueManagerDashboard /></ProtectedRoute> 
    },
    { 
      path: "/Supplier-dashboard/*", 
      element: <ProtectedRoute requiredRole="supplier"><SupplierDashboard /></ProtectedRoute> 
    },
    { 
      path: "/Event-Planner-Dashboard/*", 
      element: <ProtectedRoute requiredRole="event_planner"><EventPlannerDashboard /></ProtectedRoute> 
    },
    { 
      path: "/admin-dashboard/*", 
      element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute> 
    },
  ];
  
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.key}>
          {/* Render Public Routes */}
          {publicRoutes.map(({ path, element }) => (
            <Route 
              key={path}
              path={path} 
              element={<PageTransition>{element}</PageTransition>} 
            />
          ))}

          {/* Render Dashboard Routes */}
          {dashboardRoutes.map(({ path, element }) => (
            <Route 
              key={path}
              path={path} 
              element={<PageTransition>{element}</PageTransition>} 
            />
          ))}

          {/* Other Routes */}
          <Route path="/venues/:venueId/book" element={<PageTransition><BookVenue /></PageTransition>} />
          <Route path="/suppliers/:supplierId/book" element={<PageTransition><BookSupplier /></PageTransition>} />
          <Route path="/UserDetails" element={<PageTransition><UserDetails /></PageTransition>} />
          <Route path="/events/:id" element={<PageTransition><EventDetails /></PageTransition>} />
          <Route path="/UpdateEvent/:id" element={<PageTransition><EventUpdate /></PageTransition>} />
          <Route path="/venue/:venueId" element={<PageTransition><PublicVenueDetails/></PageTransition>} />
          <Route path="/supplier/:supplierId" element={<PageTransition><PublicSupplierDetails/></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile/></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings/></PageTransition>} />
          <Route path="/venue-list" element={<PageTransition><PublicVenueList/></PageTransition>} />
          <Route path="/supplier-list" element={<PageTransition><PublicSupplierList/></PageTransition>} />
          <Route path="/payment" element={<PageTransition><PaymentPage /></PageTransition>} />
          <Route path="/tickets/:ticketId/Details" element={<PageTransition><TicketPage /></PageTransition>} />
          <Route path="/Event-Planner" element={<PageTransition><PublicEventPlannerList/></PageTransition>} />
          <Route path="/Event-Planner/:id/Profile" element={<PageTransition><PublicEventPlanner/></PageTransition>} />
          <Route path="/Event-List" element={<PageTransition><EventsList/></PageTransition>} />
          <Route path="/Create-Event" element={<PageTransition><CreateEvent/></PageTransition>} />
          <Route path="/partner-application" element={<PageTransition><ApplicationProcess /></PageTransition>} />
          <Route path="/partner-application-form" element={<PageTransition><ApplicationForm /></PageTransition>} />
          <Route path="/upgrade-business" element={<PageTransition><BusinessPlan/></PageTransition>} />
    
        </Routes>
      </AnimatePresence>
      
      {/* Fixed Position Components */}
      <div className="fixed bottom-8 left-8 z-50">
        <SurveyDisplay />
      </div>
      <ScrollToTopButton />
      <BotpressChat />
    </>
  );
};

export default AppRouter;