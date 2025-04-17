import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationsComponent from "./components/notif";
import { Bell } from "lucide-react";
import supabase from '../../api/supabaseClient';

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
    const [isHovered, setIsHovered] = useState(false);
    
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
            <motion.button
                onClick={toggleNotifications}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="p-2 rounded-full text-gray-400 relative"
                whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                }}
                animate={{
                    background: isHovered 
                        ? "linear-gradient(#1a2940, #1a2940) padding-box, linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box"
                        : "linear-gradient(#152131, #152131) padding-box, linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box"
                }}
                style={{
                    border: '1px solid transparent',
                    borderRadius: '2rem'
                }}
                aria-label="Toggle notifications"
            >
                {/* Bell Icon with Animation */}
                <motion.div
                    animate={{ 
                        rotate: unreadCount > 0 && isHovered ? [0, 15, -15, 10, -10, 5, -5, 0] : 0 
                    }}
                    transition={{ 
                        duration: 0.5,
                        repeat: isHovered && unreadCount > 0 ? 1 : 0
                    }}
                >
                    <Bell size={24} strokeWidth={2} />
                </motion.div>
                
         
                {/* Notification Badge with Animation */}
                {unreadCount > 0 && (
                    <motion.div 
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center w-5 h-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.div>
                )}
            </motion.button>
            
            {/* Notification Panel (conditionally rendered) */}
            {showNotifications && (
                <motion.div 
                    className="absolute right-0 mt-2 bg-white z-10 dark:bg-gray-800 rounded-xl w-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="">
                        <NotificationsComponent userId={userId} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default Notification;