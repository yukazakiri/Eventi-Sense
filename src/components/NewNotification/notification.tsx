import { useState, useEffect } from "react";
import NotificationsComponent from "./components/notif";
import { Bell } from "lucide-react";
import supabase from '../../api/supabaseClient'
interface NotificationProps {
    userId: string | null;
}

interface NotificationItem {
    id: string;
    user_id: string;
    sender_id: string;
    type: string;
    message: string;
    link: string;
    is_read: boolean;
    created_at: string;
}

function Notification({ userId }: NotificationProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    
    // Fetch notifications when component mounts or userId changes
    useEffect(() => {
        if (userId) {
            fetchNotifications();
            
            // Set up real-time subscription for new notifications
            const subscription = supabase
                .channel('notifications')
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                }, (payload) => {
                    // Add new notification to state
                    setNotifications(current => [payload.new as NotificationItem, ...current]);
                    if (!(payload.new as NotificationItem).is_read) {
                        setUnreadCount(count => count + 1);
                    }
                })
                .subscribe();
                
            // Cleanup subscription on unmount
            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [userId]);
    
    const fetchNotifications = async () => {
        if (!userId) return;
        
        try {
            // Fetch notifications from Supabase
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            if (data) {
                setNotifications(data);
                
                // Calculate unread count
                const unread = data.filter(notification => !notification.is_read).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        
        // Mark notifications as read when opening the panel
        if (!showNotifications && unreadCount > 0) {
            markNotificationsAsRead();
        }
    };
    
    const markNotificationsAsRead = async () => {
        if (!userId) return;
        
        try {
            // Update all unread notifications for this user
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .eq('is_read', false);
                
            if (error) throw error;
            
            // Update local state
            setUnreadCount(0);
            setNotifications(notifications.map(notification => ({
                ...notification,
                is_read: true
            })));
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };
    
    if (!userId) {
        return <div>Please login to view notifications.</div>;
    }
    
    return (
        <div className="relative">
            {/* Notification Bell Icon with Badge */}
            <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 relative"
                aria-label="Toggle notifications"
            >
                <Bell size={24} />
                
                {/* Notification Badge */}
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center w-5 h-5">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </button>
            
            {/* Notification Panel (conditionally rendered) */}
            {showNotifications && (
                <div className="absolute right-0 mt-2  bg-white z-10 dark:bg-gray-800 rounded-xl w-auto">
                    <div className="">
               
                        <NotificationsComponent userId={userId} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notification;