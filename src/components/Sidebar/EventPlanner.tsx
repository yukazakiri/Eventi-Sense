import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdOutlineManageAccounts,
    MdPeople,

} from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp, IoIosMenu } from 'react-icons/io';
import { RiHome9Line, RiHotelLine } from 'react-icons/ri';
import { TbLayoutDashboardFilled } from 'react-icons/tb';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { PiConfetti, PiListPlus } from 'react-icons/pi';
import { IoTicketOutline } from 'react-icons/io5';
import { LuCalendarCheck, LuMessageCircleMore } from 'react-icons/lu';
import { PulseLoader } from 'react-spinners';
import { getCurrentUser } from '../../api/utiilty/profiles';
import { fetchEventPlanner } from '../../api/utiilty/eventplanner';
import { HiOutlineUserGroup } from 'react-icons/hi'; // Add this import at the top with other icons
import { useUnreadMessages } from '../messenger/hooks/unreadMessage'; // <-- Add this import

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
        if (dropdownItems) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    return (
        <li className="relative">
            {dropdownItems ? (
                <div
                    className={`flex items-center p-2 mx-5 font-medium rounded-lg relative group cursor-pointer ${
                        isDropdownOpen
                        ? 'bg-indigo-50 dark:bg-sky-400/10 text-sky-500 dark:text-sky-400 transition-colors duration-200 shadow-sky-500/20 dark:shadow-sky-400/20' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={handleClick}
                >
                    {icon}
                    {!isCollapsed && <span className="ml-5">{label}</span>}
                    {!isCollapsed && (
                        <span className="ml-auto">
                            {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </span>
                    )}
                    {isCollapsed && (
                        <div className="hidden group-hover:block z-50 absolute left-14 bg-gray-900 text-gray-100 px-3 py-1 border border-gray-700 rounded-lg shadow-lg whitespace-nowrap">
                            {label}
                        </div>
                    )}
                </div>
            ) : (
                <NavLink
                    to={to}
                    className={({ isActive }) =>
                        `flex items-center p-2 mx-5 font-medium rounded-lg relative group ${
                            isActive
                            ? 'bg-indigo-50 dark:bg-sky-400/10 text-sky-500 dark:text-sky-400 transition-colors duration-200 shadow-sky-500/20 dark:shadow-sky-400/20 shadow-lg' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`
                    }
                    onClick={handleClick}
                >
                    {icon}
                    {!isCollapsed && <span className="ml-5">{label}</span>}
                </NavLink>
            )}
            
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
                                        : 'hover:bg-gray-100  mx-4 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
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

interface EventPlannerProfile {
    id: string;
    // Add other profile fields as needed
    [key: string]: any;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [profileData, setProfileData] = useState<EventPlannerProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasEventPlanner, setHasEventPlanner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // <-- Add this state

    // Get unread messages (returns array of sender IDs with unread messages)
    const unreadFromUsers = useUnreadMessages(currentUserId);

    // Calculate total unread count (if you want the total, not just per-user)
    const unreadCount = unreadFromUsers?.length || 0;

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

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            if (user) {
                setCurrentUserId(user.id); // <-- Set current user ID for unread hook
                try {
                    const eventPlanner = await fetchEventPlanner(user.id);
                    if (eventPlanner) {
                        setProfileData(eventPlanner as EventPlannerProfile);
                        setHasEventPlanner(true);
                    } else {
                        setHasEventPlanner(false);
                    }
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching profile:", err);
                    setError(err instanceof Error ? err.message : "An error occurred");
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <PulseLoader color="#0000ff" />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
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
                <div className="sticky top-0  p-4 z-10 mt-3">
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
                                className="  dark:border-gray-700  border-[1px] border-gray-300 rounded-md p-2 text-[20px] text-gray-800 dark:text-gray-200 hover:text-sky-400 hover:scale-110 transform transition-all duration-300 ease-in-out shadow-md"
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
                    {hasEventPlanner && profileData ? (
                        <>
                            <nav>
                                <ul className={`space-y-4 text-gray-800 ${isCollapsed ? 'mt-[1rem]' : 'mt-0'}`}>
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/Home" 
                                        icon={<RiHome9Line className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Home" 
                                        isCollapsed={isCollapsed} 
                                    />
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/Profile" 
                                        icon={<MdOutlineManageAccounts className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Profile" 
                                        isCollapsed={isCollapsed} 
                                    />
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/UpdateInfo" 
                                        icon={<MdPeople className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Business Profile" 
                                        isCollapsed={isCollapsed}
                                    
                                    />
                                
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/Calendar" 
                                        icon={<LuCalendarCheck className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Calendar" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                            {isCollapsed &&
                        <div className='flex justify-center my-4'>
                            <HiOutlineDotsHorizontal className='flex justify-center text-[1.6rem] text-gray-400'/>
                        </div>
                    }
                      <h2 className={`text-sm uppercase my-4 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>StockHolders</h2>
                            <nav>
                                <ul className="space-y-2 text-gray-800">
                                <SidebarItem 
                                        to="/Event-Planner-Dashboard/Venue-List" 
                                        icon={<RiHotelLine className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Venue" 
                                        isCollapsed={isCollapsed} 
                                    />
                                      <SidebarItem 
                                        to="/Event-Planner-Dashboard/Supplier-List" 
                                        icon={<PiListPlus  className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Supplier" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                            {isCollapsed &&
                        <div className='flex justify-center my-4'>
                            <HiOutlineDotsHorizontal className='flex justify-center text-[1.6rem] text-gray-400'/>
                        </div>
                    }
                            <h2 className={`text-sm uppercase my-4 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>Management</h2>
                            <nav>
                                <ul className="space-y-2 text-gray-800">
                                    <SidebarItem
                                        to="#"
                                      
                                        icon={<PiConfetti className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Events Management " 
                                        isCollapsed={isCollapsed} 
                                        dropdownItems={[
                                            {
                                                to: "/Event-Planner-Dashboard/CreateEvents",
                                                label: "Create Event"
                                            },
                                            {
                                                to: "/Event-Planner-Dashboard/EventList",
                                                label: "Events List"
                                            }
                                        ]}
                                    />
                                 
                                </ul>
                            </nav>
                         
                            <nav className='my-4'>
                                <ul className="space-y-2 text-gray-800">
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/EventList" 
                                        icon={<HiOutlineUserGroup className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Attendee Management" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                     
                            <nav>
                                <ul className="space-y-2 text-gray-800">
                                 
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/TicketList" 
                                        icon={<IoTicketOutline className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Ticket Management" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                            {isCollapsed &&
                        <div className='flex justify-center my-4'>
                            <HiOutlineDotsHorizontal className='flex justify-center text-[1.6rem] text-gray-400'/>
                        </div>
                    }
                            <h2 className={`text-sm uppercase my-4 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>Budget Management</h2>
                            <nav>
                                <ul className="space-y-2 text-gray-800">
                                 
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/BudgetTracker" 
                                        icon={<IoTicketOutline className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Budget Tracker" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                            {isCollapsed &&
                        <div className='flex justify-center my-4'>
                            <HiOutlineDotsHorizontal className='flex justify-center text-[1.6rem] text-gray-400'/>
                        </div>
                    }
                    
                            <h2 className={`text-sm uppercase my-4 ml-4 ${isCollapsed ? 'hidden' : 'block'} text-gray-600`}>Messages</h2>
                            <nav>
                                <ul className="space-y-2 text-gray-800">
                                 
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/messenger" 
                                        icon={
                                            <div className="relative">
                                                <LuMessageCircleMore className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />
                                                {unreadCount > 0 && (
                                                    <span
                                                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center"
                                                        style={{ minWidth: 18, height: 18 }}
                                                    >
                                                        {unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        label="Chat" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                        </> 
                    ) : (
                        <>
                            <nav>
                                <ul className={`space-y-2 text-gray-800 ${isCollapsed ? 'mt-[1rem]' : 'mt-0'}`}>
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/Home" 
                                        icon={<RiHome9Line className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Home" 
                                        isCollapsed={isCollapsed} 
                                    />
                                    <SidebarItem 
                                        to="/Event-Planner-Dashboard/Profile" 
                                        icon={<MdOutlineManageAccounts className={`text-xl ${isCollapsed ? 'mx-auto' : ''}`} />} 
                                        label="Profiles" 
                                        isCollapsed={isCollapsed} 
                                    />
                                </ul>
                            </nav>
                        </>
                    )}
           
                </div>
            </aside>
        </>
    );
};

export default Sidebar;