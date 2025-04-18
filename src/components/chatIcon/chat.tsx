

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUnreadMessages } from "../messenger/hooks/unreadMessage";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../messenger/services/supabaseService";
import { motion } from "framer-motion";

function Chat() {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const unreadFromUsers = useUnreadMessages(currentUserId || "");
  const unreadCount = unreadFromUsers?.length || 0;

  return (
    <div className="flex items-center justify-center  ">
      <motion.button
        className="relative flex items-center justify-center p-2 text-gray-400 rounded-full shadow-lg hover:bg-gray-800 transition"
        onClick={() => navigate("/Messenger")}
        aria-label="Open Messenger"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
      >
        <motion.div
          animate={{
            rotate: unreadCount > 0 && isHovered ? [0, 15, -15, 10, -10, 5, -5, 0] : 0
          }}
          transition={{
            duration: 0.5,
            repeat: isHovered && unreadCount > 0 ? 1 : 0
          }}
        >
          <IoChatbubbleEllipsesOutline size={24} strokeWidth={2}/>
        </motion.div>
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center w-5 h-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}

export default Chat;