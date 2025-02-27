interface SuccessModalProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const SuccessModal = ({ show, message, type, onClose }: SuccessModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`
        relative px-6 py-4 rounded-lg shadow-lg 
        ${type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}
        transform transition-all duration-200
      `}>
        <div className="flex items-center">
          {type === 'success' ? (
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
              <svg className="w-5 h-5 text-green-600 dark:text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
              <svg className="w-5 h-5 text-red-600 dark:text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              type === 'success' 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 