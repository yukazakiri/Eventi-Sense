import React from 'react';
import { LuPartyPopper } from 'react-icons/lu';
import { formatDateInPHTime } from './dateUtils';
import  supabase  from '../../../../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { BiMap } from 'react-icons/bi';
import { BsCalendar3 } from 'react-icons/bs';
import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../../../../assets/modal/modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  quantity: number;
  setQuantity: (value: number) => void;
  onReserve?: () => void; // Optional onReserve prop
}



const TicketReservationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  event,
  quantity,
  setQuantity,
  onReserve,
}) => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isFreeEvent, setIsFreeEvent] = useState<boolean>(false);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  const handleSuccessModalClose = () => {
    setShowSuccess(false);
    
    // Navigate after closing the success modal
    if (ticketId) {
      if (isFreeEvent) {
        navigate(`/tickets/${ticketId}/Details`);
      } else {
        navigate(`/payment?ticketId=${ticketId}`);
      }
      if (onReserve) {
        onReserve();
      }
      onClose();
    }
  };

  const handleReserveTickets = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please log in to reserve tickets.');
      setIsLoading(false);
      return;
    }

    if (event.capacity < quantity) {
      alert('Not enough tickets available.');
      setIsLoading(false);
      return;
    }

    try {
      const isEventFree = event.ticket_price === 0;
      setIsFreeEvent(isEventFree);

      // Create ticket with appropriate status
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            event_id: event.id,
            user_id: user.id,
            quantity,
            status: isEventFree ? 'purchased' : 'reserved',
            purchase_date: new Date().toISOString(),
          },
        ])
        .select();

      if (ticketError) throw ticketError;

      const newTicketId = ticketData[0].id;
      setTicketId(newTicketId);

      // Create order entry for both free and paid events
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            ticket_id: newTicketId,
            amount: event.ticket_price * quantity,
            payment_status: isEventFree ? 'completed' : 'pending',
            created_at: new Date().toISOString(),
            // For free events, set payment date to now
            payment_date: isEventFree ? new Date().toISOString() : null,
          },
        ])
        .select();

      if (orderError) throw orderError;


      // Update notification links to match the correct format
      const { error: notificationErrorSender } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            sender_id: user.id,
            type: isEventFree ? 'ticket_confirmation' : 'ticket_request',
            message: isEventFree
              ? `You have confirmed ${quantity} free ticket(s) for ${event.name}!`
              : `You have requested ${quantity} ticket(s) for ${event.name}.`,
            link: `/tickets/${newTicketId}/Details`,
            is_read: false,
          },
        ]);

      if (notificationErrorSender) {
        console.error('Error creating sender notification:', notificationErrorSender);
      }

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('organizer_id')
        .eq('id', event.id)
        .single();

      if (eventError) {
        console.error('Error fetching event organizer:', eventError);
        return;
      }

      // Define notification type and messages
      const notificationType = isEventFree ? 'ticket_confirmation' : 'ticket_request';
      const receiverMessage = isEventFree
        ? `${user.email} has confirmed ${quantity} free ticket(s) for your event ${event.name}.`
        : `${user.email} has requested ${quantity} ticket(s) for your event ${event.name}.`;

      const { error: notificationErrorReceiver } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: eventData.organizer_id,
            sender_id: user.id,
            type: notificationType,
            message: receiverMessage,
            link: `/events/${event.id}`,
            is_read: false,
          },
        ]);

      if (notificationErrorReceiver) {
        console.error('Error creating receiver notification:', notificationErrorReceiver);
      }

      // Set success message and show modal
      const message = isEventFree 
        ? `${quantity} free ticket${quantity > 1 ? 's' : ''} reserved successfully!` 
        : `${quantity} ticket${quantity > 1 ? 's' : ''} reserved successfully!`;
      setSuccessMessage(message);
      setShowSuccess(true);

    } catch (error) {
      console.error('Error reserving tickets:', error);
      alert('Failed to reserve tickets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Success Modal with higher z-index */}
      <div className="relative z-[100]">
        <Modal
          isOpen={showSuccess}
          onClose={handleSuccessModalClose}
          title="Reservation Successful"
          description={successMessage}
          type="success"
          confirmText="Great!"
        />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sofia"
          >
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white/10 border-white/30 shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all flex flex-col md:flex-row min-h-[400px] rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative flex-1 bg-gray-100/50 min-h-[250px] md:min-h-auto">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-90" 
                  style={{ backgroundImage: `url(${event.image_url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-black/40 text-white/80 px-3 py-1 rounded-full text-sm backdrop-blur">
                    ADMIT ONE
                  </div>
                  <div className="absolute top-4 right-4 bg-white/80 text-gray-700 p-2 rounded-lg shadow-sm text-sm font-medium">
                    #{new Date(event.date).getDate()}/{new Date(event.date).getMonth() + 1}/{new Date(event.date).getFullYear()}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white font-bonanova uppercase mb-2">{event.name}</h2>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm bg-white/70 py-1 px-3 rounded-full w-max">
                        <LuPartyPopper className="text-yellow-600" />
                        <span className="font-medium text-gray-700">{event.status}</span>
                      </div>
                      <div className="text-white font-medium">
                        {event.ticket_price === 0 ? 'FREE' : `₱${event.ticket_price.toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-4 w-full">
                        <button 
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          disabled={quantity <= 1 || isLoading}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white disabled:opacity-50 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={Math.min(10, event.capacity)}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Math.min(Math.min(10, event.capacity), Number(e.target.value))))}
                          className="w-full px-4 py-2 text-center bg-white/70 backdrop-blur border border-white/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                          disabled={isLoading}
                        />
                        <button 
                          onClick={() => quantity < Math.min(10, event.capacity) && setQuantity(quantity + 1)}
                          disabled={quantity >= Math.min(10, event.capacity) || isLoading}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white disabled:opacity-50 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      {event.ticket_price > 0 && (
                        <div className="text-white text-sm mt-2">
                          Total: ₱{(event.ticket_price * quantity).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1 px-6 py-2.5 bg-white/80 text-gray-700 rounded-full border border-white/50 shadow-sm hover:bg-rose-100 hover:shadow-md transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReserveTickets}
                      disabled={isLoading}
                      className="flex-1 px-6 py-2.5 text-white rounded-full shadow-sm hover:bg-blue-700 bg-green-500 hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        event.ticket_price === 0 ? 'Confirm' : 'Reserve'
                      )}
                    </button>
                  </div>

                  <div className="text-md space-y-2 text-gray-300 mt-8">
                    <div className="flex items-center gap-2">
                      <BiMap className="flex-shrink-0 text-2xl" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BsCalendar3 className="flex-shrink-0 text-lg ml-1" />
                      <span>{formatDateInPHTime(event.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TicketReservationModal;