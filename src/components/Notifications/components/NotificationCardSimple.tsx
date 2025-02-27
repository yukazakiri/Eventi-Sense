import { TagNotification } from '../../../types/TagNotification';

interface NotificationCardSimpleProps {
  notification: TagNotification;
  onClick: () => void;
}

const NotificationCardSimple = ({ notification, onClick }: NotificationCardSimpleProps) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 p-3 mx-2 rounded-lg  transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm ${
        notification.is_confirmed 
          ? 'border-l-4 border-green-500' 
          : 'border-l-4 border-yellow-500'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div  />
            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
              {notification.event.name}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${
              notification.is_confirmed 
                ? 'bg-green-500' 
                : 'bg-yellow-500'
            }`} />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {notification.is_confirmed ? 'Accepted' : 'Pending'}
            </p>
            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(notification.event.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCardSimple; 