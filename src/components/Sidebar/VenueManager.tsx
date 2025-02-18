import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
 
  MdOutlineManageAccounts,
  MdPeople,
  MdAttachMoney,
  MdAssignment,
  MdAnalytics,
  MdSettings,
  MdHelpOutline,
} from 'react-icons/md';
import { IoIosArrowBack, IoIosMenu } from 'react-icons/io'; // Added IoIosMenu for the menu button
import { GoHome } from 'react-icons/go';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const SidebarItem: React.FC<{
  to: string;
  icon: JSX.Element;
  label: string;
  isCollapsed: boolean;
}> = ({ to, icon, label, isCollapsed }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg relative group ${
          isActive ? 'bg-blue-800 text-white border border-blue-700' : 'hover:bg-gray-800 text-gray-300'
        }`
      }
    >
      {icon}
      {!isCollapsed && <span className="ml-2">{label}</span>}
      {isCollapsed && (
        <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
          {label}
        </div>
      )}
    </NavLink>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Menu Button (Visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 p-2  hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <IoIosMenu />
        </button>
     
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-72'} bg-gray-800 border-r text-[1rem]  border-gray-700 text-gray-300 font-sofia p-4 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block z-50 shadow-sm`}
      >
        {/* Collapse Button */}
        <button
          className="hidden lg:block absolute top-6 -right-[18px] text-white bg-blue-1 rounded-full  p-2 text-[20px] hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md"
          onClick={toggleCollapse}
        >
          <IoIosArrowBack
            className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
        <button
          className="lg:hidden absolute top-6 -right-[1px] text-gray-400 bg-gray-800 rounded-full border border-gray-700 p-1 text-[20px] hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md"
          onClick={() => setSidebarOpen(false)}
        >
          <IoIosArrowBack />
        </button>


        {/* Sidebar Content */}
        <h2 className={`text-xl font-bold mb-4 ${isCollapsed ? 'hidden' : 'block'} text-white`}>Dashboard</h2>
        <nav>
          <ul className={`space-y-2 ${isCollapsed ? 'mt-[4rem]' : 'mt-0'}`}>
            <SidebarItem to="/Venue-Manager-Dashboard/Home" icon={<GoHome className={`text-2xl ${isCollapsed ? 'mx-auto ' : ''}`} />} label="Home" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Profiles" icon={<MdOutlineManageAccounts className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Profiles" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Create-User" icon={<MdPeople className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Attendee Management" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Financial-Overview" icon={<MdAttachMoney className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Financial Overview" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Venue-List" icon={<MdAssignment className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Venue" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Booking-List" icon={<MdAnalytics className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Bookings" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Settings" icon={<MdSettings className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Settings" isCollapsed={isCollapsed} />
            <SidebarItem to="/Venue-Manager-Dashboard/Support-Help" icon={<MdHelpOutline className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Support & Help" isCollapsed={isCollapsed} />
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;