import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdOutlineManageAccounts,
    MdPeople,
    MdAttachMoney,
    MdAssignment,
} from 'react-icons/md';
import { IoIosArrowBack, IoIosMenu } from 'react-icons/io';
import { RiHome9Line } from 'react-icons/ri';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { PiConfetti } from 'react-icons/pi';
import { IoTicketOutline } from 'react-icons/io5';
import { LuCalendarCheck } from 'react-icons/lu';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const SidebarItem: React.FC<{
    to: string;
    icon: JSX.Element;
    label: string;
    isCollapsed: boolean;
}> = ({ to, icon, label, isCollapsed }) => {
    const handleClick = () => {
        // Force a page refresh after navigation
        setTimeout(() => {
            window.location.reload();
        }, 100); // Small delay to ensure navigation happens first
    };

    return (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `flex items-center p-2 mx-5 font-medium rounded-lg relative group ${
                        isActive ? 'bg-indigo-50 text-blue-500' : 'hover:bg-gray-200 text-gray-600'
                    }`
                }
                onClick={handleClick} // Add onClick handler
            >
                {icon}
                {!isCollapsed && <span className="ml-5">{label}</span>}
                {isCollapsed && (
                    <div className="hidden group-hover:block z-50 absolute left-14 bg-gray-800 text-white px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                        {label}
                    </div>
                )}
            </NavLink>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            {!isSidebarOpen && (
                <button
                    className="fixed top-4 left-4 text-gray-400 bg-gray-800 rounded-lg border border-gray-700 p-2 hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <IoIosMenu />
                </button>
            )}

            <aside
                className={`fixed inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-72'} bg-white text-[1rem] text-gray-600 border-r-[1px] border-gray-200 font-sofia overflow-visible transform transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:block z-50 shadow-sm`}
            >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white p-4 z-10 mt-3">
                    <div className="flex items-center">
                        <TbLayoutDashboardFilled className={`text-[2rem] mr-2 text-blue-1 ${isCollapsed ? 'ml-2' : ''}`} />
                        <h1 className={`text-[24px] font-semibold tracking-tight text-gray-800 font-montserrat ${isCollapsed ? 'hidden' : ''}`}>Dashboard</h1>
                    </div>
                </div>

                {/* Scrollable Container with Hidden Scrollbar */}
                <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
                    <button
                        className="hidden lg:block absolute top-6 -right-[18px] text-white bg-blue-1 rounded-full p-2 text-[20px] hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md"
                        onClick={toggleCollapse}
                    >
                        <IoIosArrowBack
                            className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                    <button
                        className="lg:hidden absolute top-6 -right-[1px] text-gray-800 bg-gray-800 rounded-full border border-gray-700 p-1 text-[20px] hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <IoIosArrowBack />
                    </button>

                    <h2 className={`text-sm uppercase my-2 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>menu</h2>
                    <nav>
                        <ul className={`space-y-2 text-gray-800 ${isCollapsed ? 'mt-[1rem]' : 'mt-0'}`}>
                            <SidebarItem to="/Venue-Manager-Dashboard/Home" icon={<RiHome9Line className={`text-xl ${isCollapsed ? 'mx-auto ' : ''}`} />} label="Home" isCollapsed={isCollapsed} />
                            <SidebarItem to="/Venue-Manager-Dashboard/Profiles" icon={<MdOutlineManageAccounts className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Profiles" isCollapsed={isCollapsed} />
                            <SidebarItem to="/Venue-Manager-Dashboard/Create-User" icon={<MdPeople className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Attendee Management" isCollapsed={isCollapsed} />
                            <SidebarItem to="/Venue-Manager-Dashboard/Financial-Overview" icon={<MdAttachMoney className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Financial Overview" isCollapsed={isCollapsed} />
                            <SidebarItem to="/Venue-Manager-Dashboard/Venue-List" icon={<MdAssignment className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Venue" isCollapsed={isCollapsed} />
                            <SidebarItem to="/Venue-Manager-Dashboard/Booking-List" icon={<LuCalendarCheck  className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} label="Bookings" isCollapsed={isCollapsed} />
                        </ul>
                    </nav>
                    {isCollapsed &&
                                <div className='flex justify-center my-4'>
                                 <HiOutlineDotsHorizontal className='flex justify-center text-[1.6rem] text-gray-400'/>
                                 </div>
                     }

           
                    <h2 className={`text-sm uppercase my-4  ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>events</h2>
                    <nav>
                        <ul className="space-y-2 text-gray-800">
                        <SidebarItem to="/Venue-Manager-Dashboard/EventList" icon={<PiConfetti  className={`text-xl ${isCollapsed ? 'mx-auto ' : ''}`} />} label="Events List" isCollapsed={isCollapsed} />
                        <SidebarItem to="/Venue-Manager-Dashboard/TicketList" icon={<IoTicketOutline     className={`text-xl ${isCollapsed ? 'mx-auto ' : ''}`} />} label="Ticket List" isCollapsed={isCollapsed} />
                                    
                        </ul>
                    </nav>  

                </div>
            </aside>
        </>
    );
};

export default Sidebar;