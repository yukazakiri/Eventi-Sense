import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  MdOutlineWest,
  MdOutlineManageAccounts,
  MdPeople,
  MdAttachMoney,
  MdAssignment,
  MdAnalytics,
  MdSettings,
  MdHelpOutline,
} from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import { GoHome } from 'react-icons/go';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-gray-800 border-r border-gray-700 text-gray-300 font-montserrat p-4 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:block z-50 shadow-sm`}
    >
      {/* Collapse Button */}
      <button
        className="absolute top-4 right-4 lg:hidden text-gray-400 text-2xl z-50 hover:text-gray-200"
        onClick={() => setSidebarOpen(false)}
      >
        <MdOutlineWest />
      </button>
      <button
        className="hidden lg:block absolute top-6 -right-[10px] text-gray-400 bg-gray-800 rounded-full border border-gray-700 p-1 text-[20px] hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md"
        onClick={toggleCollapse}
      >
        <IoIosArrowBack
          className={`transform transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Sidebar Content */}
      <h2 className={`text-xl font-bold mb-4 ${isCollapsed ? 'hidden' : 'block'} text-white`}>
        Dashboard
      </h2>
      <nav>
        <ul className={`space-y-2 ${isCollapsed ? 'mt-[4rem]' : 'mt-0'}`}>
          {/* Home */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Home"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <GoHome className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Home</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Home
                </div>
              )}
            </NavLink>
          </li>

          {/* User Management */}
          <li>
            <NavLink
              to="/Admin-Dashboard/User-Management"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdOutlineManageAccounts className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">User Management</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  User Management
                </div>
              )}
            </NavLink>
          </li>

          {/* Attendee Management */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Create-User"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdPeople className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Attendee Management</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Attendee Management
                </div>
              )}
            </NavLink>
          </li>

          {/* Financial Overview */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Financial-Overview"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdAttachMoney className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Financial Overview</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Financial Overview
                </div>
              )}
            </NavLink>
          </li>

          {/* Task & Team Management */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Task-Team-Management"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdAssignment className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Task & Team Management</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Task & Team Management
                </div>
              )}
            </NavLink>
          </li>

          {/* Analytics */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Analytics"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdAnalytics className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Analytics</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Analytics
                </div>
              )}
            </NavLink>
          </li>

          {/* Settings */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Settings"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdSettings className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Settings</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Settings
                </div>
              )}
            </NavLink>
          </li>

          {/* Support & Help */}
          <li>
            <NavLink
              to="/Admin-Dashboard/Support-Help"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg relative group ${
                  isActive
                    ? 'bg-blue-800 text-white border border-blue-700'
                    : 'hover:bg-gray-800 text-gray-300'
                }`
              }
            >
              <MdHelpOutline className={`text-2xl ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="ml-2">Support & Help</span>}
              {isCollapsed && (
                <div className="hidden group-hover:block absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                  Support & Help
                </div>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;