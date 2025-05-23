import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Booking } from '../../../../types/venue';

const BookingModal: React.FC<{
    booking: Booking | null;
    onClose: () => void;
    onConfirm: () => void;
    onDecline: () => void;
  }> = ({ booking, onClose, onConfirm, onDecline }) => {
    if (!booking) return null;
    const phTimeZone = 'Asia/Manila';

    const getStatusButton = () => {
      switch (booking.status) {
        case 'pending':
          return (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-600"
            >
              Approve for Payment
            </button>
          );
        case 'confirmed':
          return (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Request Payment
            </button>
          );
        case 'confirmed-for-downpayment':
          return (
            <button
              disabled
              className="px-4 py-2 bg-blue-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Waiting for Payment
            </button>
          );
        case 'confirmed-paid':
          return (
            <button
              disabled
              className="px-4 py-2 bg-green-500 text-white rounded-lg opacity-50 cursor-not-allowed"
            >
              Confirmed
            </button>
          );
        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-lg dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 tracking-wider text-gray-800 dark:text-white">Booking Details</h2>
          <div className="space-y-4 text-gray-700 dark:text-white">
            {/* Existing booking details */}
            <div>
              <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Status:</label>
              <p className={`mt-1 ${
                booking.status === 'confirmed-paid' ? 'text-green-600' :
                booking.status === 'confirmed-for-downpayment' ? 'text-blue-600' :
                booking.status === 'cancelled' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {booking.status === 'confirmed-for-downpayment' ? 'Pending Payment' : booking.status}
              </p>
            </div>
            <div>
              <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Name:</label>
              <p>{booking.name}</p>
            </div>
            <div>
              <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Email:</label>
              <p>{booking.email}</p>
            </div>
            <div>
              <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Phone:</label>
              <p>{booking.phone}</p>
            </div>
            <div>
              <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Service:</label>
              <p>{booking.service}</p>
            </div>
            <div>
              <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Message:</label>
              <p>{booking.message || 'No message'}</p>
            </div>
            <div>
            <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">Start Date:</label>
            <p>{format(toZonedTime(new Date(booking.start_date), phTimeZone), 'yyyy-MM-dd hh:mm a')}</p>
          </div>
          <div>
            <label className="font-semibold tracking-wider text-[16px] dark:text-gray-200">End Date:</label>
            <p>{format(toZonedTime(new Date(booking.end_date), phTimeZone), 'yyyy-MM-dd hh:mm a')}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          {booking.status !== 'cancelled' && booking.status !== 'confirmed-paid' && (
            <button
              onClick={onDecline}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Decline
            </button>
          )}
          {getStatusButton()}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
      </div>
    );
  };

export default BookingModal;
