import React from 'react';
import { Booking, Venue } from '../../../types/venue';
import { Booking as SupplierBooking, Supplier } from '../../../types/supplier';
import { Calendar, Clock, Package, MapPin, X,  User } from 'react-feather';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: (Booking & { venue?: Venue }) | (SupplierBooking & { supplier?: Supplier });
  type: 'venue' | 'supplier';
  // Add the entityDetails prop to the interface
  entityDetails?: Venue | Supplier;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  type,
  entityDetails
}) => {
  if (!isOpen) return null;

  const iconColor = type === 'venue' ? 'text-indigo-400' : 'text-pink-400';
  const bgColor = type === 'venue' ? 'bg-indigo-500/40' : 'bg-pink-500/40';

  // Get entity details based on type, using the entityDetails prop if provided
  const venueDetails = type === 'venue' ? 
    (entityDetails as Venue) || (booking as Booking & { venue?: Venue }).venue : 
    undefined;
  
  const supplierDetails = type === 'supplier' ? 
    (entityDetails as Supplier) || (booking as SupplierBooking & { supplier?: Supplier }).supplier : 
    undefined;

  // Get entity name with fallback
  const entityName = type === 'venue' 
    ? venueDetails?.name || 'Venue details unavailable'
    : supplierDetails?.name || 'Supplier details unavailable';

  // Get entity detail with fallback
  const entityDetail = type === 'venue'
    ? venueDetails?.location
    : supplierDetails?.suppliers_services;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block align-bottom bg-[#152131] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
             style={{
               background: `
                 linear-gradient(#152131, #152131) padding-box,
                 linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
               `,
               border: '1px solid transparent',
             }}>
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-200 transition-colors"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 pt-5 pb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {type === 'venue' ? 'Venue Booking Details' : 'Supplier Booking Details'}
              </h3>
              <span className={`px-3 py-1 ${type === 'venue' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'} rounded-full text-xs font-medium`}>
                #{booking.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-200">
                <div className={`${bgColor} rounded-full p-2`}>
                  <User className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Booking ID</p>
                  <p className="font-medium">{booking.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-200">
                <div className={`${bgColor} rounded-full p-2`}>
                  <Calendar className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Booking Date</p>
                  <p className="font-medium">
                    {booking.created_at
                      ? new Date(booking.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-200">
                <div className={`${bgColor} rounded-full p-2`}>
                  <Clock className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Booking Time</p>
                  <p className="font-medium">
                    {booking.created_at
                      ? new Date(booking.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-200">
                <div className={`${bgColor} rounded-full p-2`}>
                  {type === 'venue' ? (
                    <MapPin className={`h-5 w-5 ${iconColor}`} />
                  ) : (
                    <Package className={`h-5 w-5 ${iconColor}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{type === 'venue' ? 'Venue Name' : 'Supplier Name'}</p>
                  <p className="font-medium">{entityName}</p>
                  {entityDetail && (
                    <p className="text-sm text-gray-400 mt-1">
                      {type === 'venue' ? 'Address' : 'Service'}: {entityDetail}
                    </p>
                  )}
                </div>
                <div>
          
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-200/10">
            <button
              type="button"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;