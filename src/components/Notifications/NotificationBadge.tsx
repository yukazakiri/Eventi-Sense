import { useState } from 'react';
import { IoNotificationsOutline, IoClose } from 'react-icons/io5';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import TagNotifications from '../TagNotifications/TagNotifications';

const NotificationBadge = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  return (
    <div className="relative flex items-center z-50">
      {/* Notification Icon with Badge */}
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none dark:text-gray-200"
        aria-label="Notifications"
        aria-expanded={showNotifications}
      >
        <IoNotificationsOutline className="w-5 h-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-screen max-w-md bg-white border border-gray-200 dark:border-gray-600  dark:bg-gray-900 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <IoClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <TagNotifications 
              onNotificationCountChange={(count) => setNotificationCount(count)}
              limit={5} // Show only 5 notifications in the dropdown
            />
          </div>

          <Link 
            to="/Venue-Manager-Dashboard/notifications"
            className="block p-4 text-sm dark:text-gray-200 text-gray-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-600 transition-colors"
            onClick={() => setShowNotifications(false)}
          >
            <div className="flex items-center justify-between">
              <span>View all notifications</span>
              <FiChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}

      {/* Backdrop */}
      {showNotifications && (
        <div 
          className="fixed inset-0  "
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default NotificationBadge;