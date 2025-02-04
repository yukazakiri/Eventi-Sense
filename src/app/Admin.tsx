import  { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar/AdminSidebar';
//import Header from '../../components/venuemanager/header';
import routes from '../routers/Admin/Router';

function VenueManagerDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
       {/* <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
}
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default VenueManagerDashboard;