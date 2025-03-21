import React, { useState, useEffect } from 'react';
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
        const handleClickOutside = () => setActiveMenu(null);
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

    if (loading) return (
        <div className="p-4 text-center text-blue-600 dark:text-blue-400">
            <div className="animate-pulse">Loading notifications...</div>
        </div>
    );
    
    if (error) return (
        <div className="p-4 text-red-500 dark:text-red-400">
            Error: {error}
        </div>
    );

    return (
        <div className="w-80 rounded-lg shadow p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold">Notifications</h2>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">No notifications yet.</p>
            ) : (
                <ul className="space-y-2">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={`p-3 border rounded-lg transition-colors duration-300 ${
                                notification.is_read 
                                ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300" 
                                : "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100"
                            }`}
                        >
                            <div className="flex justify-between">
                                <div 
                                    className="flex items-center cursor-pointer" 
                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                >
                                    {!notification.is_read && (
                                        <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></span>
                                    )}
                                    <span className="font-medium">{notification.type}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </span>
                                    <div className="relative">
                                        <button 
                                            className="px-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={(e) => toggleMenu(notification.id, e)}
                                        >
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </button>
                                        {activeMenu === notification.id && (
                                            <div 
                                                className="absolute right-0 mt-1 w-36 rounded-md shadow-lg border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 z-10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="py-1">
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400"
                                                        onClick={() => deleteNotification(notification.id)}
                                                    >
                                                        Delete 
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p 
                                className="text-sm mt-1 text-gray-600 dark:text-gray-300"
                                onClick={() => !notification.is_read && markAsRead(notification.id)}
                            >
                                {notification.message}
                            </p>
                            {notification.link && (
                                <a
                                    href={notification.link}
                                    className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2 block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View details
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationsComponent;