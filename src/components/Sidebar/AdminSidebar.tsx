import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdOutlineWest,
} from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import { GoHome } from 'react-icons/go';

import { GiPartyPopper } from 'react-icons/gi';
import { BsBuildings } from 'react-icons/bs';
import { BiSolidStore } from 'react-icons/bi';
import { RiUserSettingsLine } from 'react-icons/ri';
import { TbReportAnalytics } from 'react-icons/tb';
import { IoSettingsOutline } from 'react-icons/io5';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

// Define route configuration for easy management
const ROUTES = [
  {
    path: "/Admin-Dashboard/Home",
    name: "Home",
    icon: GoHome
  },
  {
    path: "/Admin-Dashboard/User-Management",
    name: "User Management",
    icon: RiUserSettingsLine
  },
  {
    path: "/Admin-Dashboard/Venues",
    name: "Venues Management",
    icon: BsBuildings
  },
  {
    path: "/Admin-Dashboard/Supplier",
    name: "Supplier Management",
    icon: BiSolidStore
  },
  {
    path: "/Admin-Dashboard/Event-Planner",
    name: "Event Planner Management",
    icon: GiPartyPopper
  },
  {
    path: "/Admin-Dashboard/Analytics",
    name: "Analytics",
    icon: TbReportAnalytics
  },
  {
    path: "/Admin-Dashboard/Settings",
    name: "Settings",
    icon: IoSettingsOutline
  },
  {
    path: "/Admin-Dashboard/Support-Help",
    name: "Support & Help",
    icon: AiOutlineQuestionCircle
  }
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavClick = (path: string) => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    
    // Navigate to the path first
    navigate(path);
    
    // Force a full page reload after a small delay
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 font-sofia ${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-montserrat p-5 transform transition-all duration-500 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:block z-50 shadow-xl`}
    >
      {/* Mobile Close Button */}
      <button
        className="absolute top-5 right-5 lg:hidden text-gray-600 dark:text-gray-300 text-2xl z-50 hover:text-gray-900 dark:hover:text-white transition-all duration-300 ease-in-out"
        onClick={() => setSidebarOpen(false)}
      >
        <MdOutlineWest className="transform hover:scale-110 transition-transform duration-300 ease-in-out" />
      </button>

      {/* Collapse Toggle Button */}
      <button
        className="hidden lg:flex absolute top-6 -right-[12px] text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 p-1.5 text-[18px] hover:text-gray-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-sky-500 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-lg"
        onClick={toggleCollapse}
      >
        <IoIosArrowBack
          className={`transform transition-transform duration-500 ease-in-out ${
            isCollapsed ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dashboard Title */}
      <h2 className={`text-xl font-bold mb-6 ${isCollapsed ? 'hidden' : 'block'} text-gray-900 dark:text-white tracking-wide`}>
        Dashboard
      </h2>

      {/* Navigation */}
      <nav>
        <ul className={`space-y-3 ${isCollapsed ? 'mt-[4rem]' : 'mt-0'}`}>
          {ROUTES.map((route) => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(route.path);
                }}
                className={({ isActive }) =>
                  `flex items-center p-2 py-3 rounded-lg relative group ${
                    isActive
                      ? 'bg-blue-50 dark:bg-sky-900/70 text-blue-700 dark:text-white border-l-4 border-blue-500 dark:border-sky-500 pl-2'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white border-l-4 border-transparent dark:border-gray-900 hover:border-blue-500 dark:hover:border-sky-500'
                  } transition-all duration-300 ease-in-out`
                }
              >
                <route.icon className={`text-2xl ${isCollapsed ? 'mx-auto' : ''} transition-all duration-300 ease-in-out group-hover:text-blue-500 dark:group-hover:text-sky-400`} />
                
                {!isCollapsed && (
                  <span className="ml-3 font-medium transition-all duration-300 ease-in-out group-hover:translate-x-1">
                    {route.name}
                  </span>
                )}
                
                {isCollapsed && (
                  <div className="hidden group-hover:block absolute left-16 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 border-l-4 border-blue-500 dark:border-sky-500 rounded-r-lg shadow-xl whitespace-nowrap z-50 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 transform -translate-x-3 group-hover:translate-x-0">
                    {route.name}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;