import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdOutlineManageAccounts,
    MdAssignment,
} from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp, IoIosMenu } from 'react-icons/io';
import { RiHome9Line } from 'react-icons/ri';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { PiConfetti } from 'react-icons/pi';
import { IoTicketOutline } from 'react-icons/io5';
import { LuCalendarCheck } from 'react-icons/lu';
import { PulseLoader } from 'react-spinners';

interface SidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

interface DropdownItem {
    to: string;
    label: string;
}

interface SidebarItemProps {
    to: string;
    icon: JSX.Element;
    label: string;
    isCollapsed: boolean;
    dropdownItems?: DropdownItem[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isCollapsed, dropdownItems }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleClick = () => {
        if (!dropdownItems) {
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    return (
        <li className="relative">
            <NavLink
                to={dropdownItems ? "#" : to}
                className={({ isActive }) =>
                    `flex items-center p-2 mx-5 font-medium rounded-lg relative group ${
                        (isActive && !dropdownItems) || (dropdownItems && isDropdownOpen)
                        ? 'bg-indigo-50 dark:bg-sky-400/10 text-sky-500 dark:text-sky-400 transition-colors duration-200 shadow-sky-500/20 dark:shadow-sky-400/20' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`
                }
                onClick={handleClick}
            >
                {icon}
                {!isCollapsed && <span className="ml-5">{label}</span>}
                {!isCollapsed && dropdownItems && (
                    <span className="ml-auto">
                        {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                )}
                {isCollapsed && (
                    <div className="hidden group-hover:block z-50 absolute left-14 bg-gray-900 text-gray-100 px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                        {label}
                    </div>
                )}
            </NavLink>
            
            {dropdownItems && isDropdownOpen && !isCollapsed && (
                <ul className="ml-8 mt-4 space-y-1">
                    {dropdownItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-lg ${
                                        isActive 
                                        ? 'bg-indigo-50 mx-4 dark:bg-sky-400/10 text-sky-500 dark:text-sky-400 transition-colors duration-200 shadow-sky-500/20 dark:shadow-sky-400/20' 
                                        : 'hover:bg-gray-100 mx-4 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`
                                }
                                onClick={() => {
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 100);
                                }}
                            >
                                <span className="ml-8">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
            
            {dropdownItems && isCollapsed && (
                <div className="hidden group-hover:block z-50 absolute left-14 top-0 mt-10 bg-gray-900 text-gray-100 p-2 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap min-w-48">
                    {dropdownItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className="flex items-center p-2 hover:bg-gray-800 rounded-lg"
                            onClick={() => {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 100);
                            }}
                        >
                            <span className="ml-1">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            )}
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoading, _setIsLoading] = useState(false);

    // Auto-expand sidebar on hover
    const expandSidebar = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        }
    };

    const collapseSidebar = () => {
        // We only want manual collapse with the button now
    };

    // Handle manual collapse with button
    const handleManualCollapse = () => {
        setIsCollapsed(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <PulseLoader color="#0000ff" />
            </div>
        );
    }

    return (
        <>
            {!isSidebarOpen && (
                <button
                    className="fixed top-4 left-4 text-gray-400 bg-gray-950 rounded-lg border border-gray-700 p-2 hover:text-gray-200 hover:scale-110 transform transition-all duration-300 ease-in-out z-50 shadow-md lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <IoIosMenu />
                </button>
            )}

            <aside
                className={`fixed inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-72'} 
                    bg-white dark:bg-gray-950 text-[1rem] text-gray-600 dark:text-gray-400 
                    border-r-[1px] border-gray-200 dark:border-gray-800 font-sofia overflow-visible 
                    transform transition-all duration-300 ease-in-out 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 lg:static lg:block z-50 shadow-sm`}
                onMouseEnter={expandSidebar}
                onMouseLeave={collapseSidebar}
            >
                <div className="sticky top-0 p-4 z-10 mt-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <TbLayoutDashboardFilled className={`text-[2rem] mr-2 text-sky-500 dark:text-sky-400 ${isCollapsed ? 'ml-2' : ''}`} />
                            <h1 className={`text-[24px] font-semibold tracking-tight dark:text-gray-100 text-gray-800 font-montserrat ${isCollapsed ? 'hidden' : ''}`}>
                                Dashboard
                            </h1>
                        </div>
                    </div>
                    <div className='absolute -right-12 top-4'>
                        {!isCollapsed && (
                            <button
                                className="dark:border-gray-700 border-[1px] border-gray-300 rounded-md p-2 text-[20px] text-gray-800 dark:text-gray-200 hover:text-sky-400 hover:scale-110 transform transition-all duration-300 ease-in-out shadow-md"
                                onClick={handleManualCollapse}
                            >
                                <IoIosArrowBack />
                            </button>
                        )}
                    </div>
                </div>

                <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
                    <h2 className={`text-sm uppercase my-2 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600 dark:text-gray-400`}>
                        menu
                    </h2>

                    <nav>
                        <ul className={`space-y-4 text-gray-800 ${isCollapsed ? 'mt-[1rem]' : 'mt-0'}`}>
                            <SidebarItem 
                                to="/Venue-Manager-Dashboard/Home" 
                                icon={<RiHome9Line className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                label="Home" 
                                isCollapsed={isCollapsed} 
                            />
                            <SidebarItem 
                                to="/Venue-Manager-Dashboard/Profiles" 
                                icon={<MdOutlineManageAccounts className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                label="Profiles" 
                                isCollapsed={isCollapsed} 
                            />
                            <SidebarItem 
                                to="/Venue-Manager-Dashboard/Venue-List" 
                                icon={<MdAssignment className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                label="Venue" 
                                isCollapsed={isCollapsed} 
                                dropdownItems={[
                              {
                                   to: "/Venue-Manager-Dashboard/CreateVenue",
                                   label: "Create Venue"
                              },
                              {
                                to: "/Venue-Manager-Dashboard/Venue-List",
                                label: "Venue List"
                           }
                                ]}
                            />
                            <SidebarItem 
                                to="/Venue-Manager-Dashboard/Booking-List" 
                                icon={<LuCalendarCheck className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                label="Bookings" 
                                isCollapsed={isCollapsed} 
                                dropdownItems={[
                                    {
                                         to: "/Venue-Manager-Dashboard/Booking-List",
                                         label: "Bookings"
                                    },
                                    {
                                      to: "/Venue-Manager-Dashboard/Requested-Bookings",
                                      label: "My Request Bookings"
                                 }
                                      ]}
                            />
                        </ul>
                    </nav>
                    
                    {isCollapsed &&
                        <div className='flex justify-center my-4'>
                            <HiOutlineDotsHorizontal className='flex justify-center text-[1.6rem] text-gray-400'/>
                        </div>
                    }
                    
                    <h2 className={`text-sm uppercase my-4 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>events</h2>
                    <nav>
                        <ul className="space-y-2 text-gray-800">
                            <SidebarItem 
                                to="/Venue-Manager-Dashboard/EventList" 
                                icon={<PiConfetti className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                label="Events List" 
                                isCollapsed={isCollapsed} 
                                dropdownItems={[
                                    {
                                        to: "/Venue-Manager-Dashboard/CreateEvents",
                                        label: "Create Event"
                                    },
                                    {
                                        to: "/Venue-Manager-Dashboard/EventList",
                                        label: "Events List"
                                    }
                                ]}
                            />
                            <SidebarItem 
                                to="/Venue-Manager-Dashboard/TicketList" 
                                icon={<IoTicketOutline className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                label="Ticket List" 
                                isCollapsed={isCollapsed} 
                            />
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;