import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../../api/supabaseClient';

interface Notification {
    id: string;
    user_id: string;
    sender_id: string | null;
    type: string;
    message: string;
    link: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationsProps {
    userId: string;
}

const NotificationsComponent: React.FC<NotificationsProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            setNotifications(prevNotifications => 
                prevNotifications.map(notif =>
                    notif.id === notificationId ? { ...notif, is_read: true } : notif
                )
            );

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;
        } catch (err) {
            console.error('Error marking notification as read:', err);
            fetchNotifications();
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prevNotifications => 
                prevNotifications.map(notif => ({ ...notif, is_read: true }))
            );
            
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false);

            if (error) throw error;
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            fetchNotifications();
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            setNotifications(prevNotifications => 
                prevNotifications.filter(notif => notif.id !== notificationId)
            );

            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;
            
            // Close any open menus
            setActiveMenu(null);
        } catch (err) {
            console.error('Error deleting notification:', err);
            fetchNotifications();
        }
    };

    const toggleMenu = (notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === notificationId ? null : notificationId);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchNotifications();

        if (userId) {
            const subscription = supabase
                .channel('notifications_changes')
                .on('postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        setNotifications(current => [payload.new as Notification, ...current]);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [userId]);

    const getNotificationIcon = (type: string) => {
        switch(type.toLowerCase()) {
            case 'message':
                return (
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                );
            case 'alert':
                return (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'update':
                return (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // Update the loading state colors
    if (loading) return (
        <div className="w-full md:w-96 lg:w-112 p-4 text-center text-blue-400">
            <div className="animate-pulse flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
    );

    // Update error state colors
    if (error) return (
        <div className="w-full md:w-96 lg:w-112 p-4 text-red-400 bg-[#152131] rounded-lg shadow">
            <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error loading notifications: {error}</span>
            </div>
        </div>
    );

    return (
        <div className="w-full md:w-96 lg:w-112 rounded-lg shadow bg-[#152131] text-gray-200 border border-gray-700">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-white">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-900 text-blue-200 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="overflow-y-auto max-h-80 scrollbar-hide">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-400">
                        <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-center">No notifications yet</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-700">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                onClick={() => {
                                    if (!notification.is_read) {
                                        markAsRead(notification.id);
                                    }
                                    if (notification.link) {
                                        window.location.href = notification.link;
                                    }
                                }}
                                className={`p-4 transition-colors duration-200 hover:bg-[#1c2b3d] cursor-pointer ${
                                    !notification.is_read ? "bg-[#1a2433]" : ""
                                }`}
                            >
                                {/* Update notification item colors */}
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center">
                                                    <h3 className={`text-sm font-medium ${!notification.is_read ? "text-blue-300" : "text-gray-200"}`}>
                                                        {notification.type}
                                                    </h3>
                                                    {!notification.is_read && (
                                                        <span className="ml-2 w-2 h-2 bg-blue-400 rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className={`mt-1 text-sm ${!notification.is_read ? "text-gray-200" : "text-gray-400"}`}>
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end ml-4">
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatDate(notification.created_at)}
                                                </span>
                                                <div className="relative mt-1" ref={menuRef}>
                                                    <button 
                                                        className="p-1 rounded-full hover:bg-[#1c2b3d] transition-colors text-gray-400"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleMenu(notification.id, e);
                                                        }}
                                                        aria-label="Notification options"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                        </svg>
                                                    </button>
                                                    {activeMenu === notification.id && (
                                                        <div 
                                                            className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-[#1c2b3d] ring-1 ring-black ring-opacity-5 z-10"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="py-1">
                                                                {!notification.is_read && (
                                                                    <button
                                                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#243447]"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        <svg className="w-4 h-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Mark as read
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#243447]"
                                                                    onClick={() => deleteNotification(notification.id)}
                                                                >
                                                                    <svg className="w-4 h-4 mr-2 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-700 text-center">
                    <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationsComponent;