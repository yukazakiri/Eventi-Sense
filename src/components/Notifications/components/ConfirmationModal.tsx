import { FiX, FiAlertTriangle } from 'react-icons/fi';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm, 
  onCancel 
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: 'text-red-600 dark:text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/20',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'text-yellow-600 dark:text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-6">
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${colors[type].bg} flex items-center justify-center`}>
            {type === 'danger' ? (
              <FiX className={`w-6 h-6 ${colors[type].icon}`} />
            ) : (
              <FiAlertTriangle className={`w-6 h-6 ${colors[type].icon}`} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white ${colors[type].button} rounded-md transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal; 