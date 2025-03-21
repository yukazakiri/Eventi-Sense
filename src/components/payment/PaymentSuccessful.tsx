
import { useNavigate } from 'react-router-dom';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void; // Explicitly define the onClose prop type
    ticketId: string; // Add ticketId prop
  }
  
  const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose, ticketId, }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full">
        <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100 mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Thank you for your purchase. Your tickets have been confirmed and will
          be available in your account.
        </p>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={() => {
                navigate(`/tickets/${ticketId}`); // Use ticketId to navigate
                onClose();
            }}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            View My Tickets
          </button>
          <button
            onClick={() => {
              navigate('/events');
              onClose();
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
          >
            Browse More Events
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;