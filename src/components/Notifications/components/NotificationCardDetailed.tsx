import { FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import { TagNotification } from '../../../types/TagNotification';

interface NotificationCardDetailedProps {
  notification: TagNotification;
  onClick: () => void;
}

const NotificationCardDetailed = ({ notification, onClick }: NotificationCardDetailedProps) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg ${
        notification.is_confirmed 
          ? 'border-l-4 border-green-500' 
          : 'border-l-4 border-yellow-500'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              {notification.event.name}
            </h3>
            {!notification.is_confirmed && (
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                Pending
              </span>
            )}
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiCalendar className="w-4 h-4 mr-2" />
              Event Date: {new Date(notification.event.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiClock className="w-4 h-4 mr-2" />
              Created: {new Date(notification.created_at).toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <FiTag className="w-4 h-4 mr-2" />
              Type: {notification.tagged_entity_type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCardDetailed; 