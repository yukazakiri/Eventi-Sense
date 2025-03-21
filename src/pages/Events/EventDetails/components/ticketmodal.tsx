import React from 'react';
import { LuPartyPopper } from 'react-icons/lu';
import { formatDateInPHTime } from './dateUtils';
import  supabase  from '../../../../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { BiMap } from 'react-icons/bi';
import { BsCalendar3 } from 'react-icons/bs';

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

  if (!isOpen) return null;

  const handleReserveTickets = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please log in to reserve tickets.');
      return;
    }

    if (event.capacity < quantity) {
      alert('Not enough tickets available.');
      return;
    }

    try {
      const isFreeEvent = event.ticket_price === 0;

      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            event_id: event.id,
            user_id: user.id,
            quantity,
            status: isFreeEvent ? 'confirmed' : 'reserved',
            purchase_date: new Date().toISOString(),
          },
        ])
        .select();

      if (ticketError) throw ticketError;

      const ticketId = ticketData[0].id;

      if (!isFreeEvent) {
        const { error: orderError } = await supabase
          .from('orders')
          .insert([
            {
              ticket_id: ticketId,
              amount: event.ticket_price * quantity,
              payment_status: 'pending',
            },
          ])
          .select();

        if (orderError) throw orderError;
      }

      const notificationType = isFreeEvent ? 'ticket_confirmation' : 'ticket_request';
      const senderMessage = isFreeEvent
        ? `You have confirmed ${quantity} free ticket(s) for ${event.name}!`
        : `You have requested ${quantity} ticket(s) for ${event.name}.`;

      const receiverMessage = isFreeEvent
        ? `${user.email} has reserved ${quantity} free ticket(s) for your event ${event.name}.`
        : `${user.email} has requested ${quantity} ticket(s) for your event ${event.name}.`;

      const { error: notificationErrorSender } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            sender_id: user.id,
            type: notificationType,
            message: senderMessage,
            link: `/tickets/ticketId=${ticketId}`,
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

      alert(
        isFreeEvent ? 'Free tickets reserved successfully!' : 'Tickets reserved successfully!'
      );

      if (isFreeEvent) {
        navigate(`/tickets/${ticketId}`);
      } else {
        navigate(`/payment?ticketId=${ticketId}`);
      }
      if(onReserve){
          onReserve();
      }
    } catch (error) {
      console.error('Error reserving tickets:', error);
      alert('Failed to reserve tickets. Please try again.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="bg-white/50 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl shadow-gray-400/20 w-full max-w-3xl overflow-hidden transform transition-all flex flex-col md:flex-row min-h-[400px]">
    
    {/* Image Section */}
    <div className="relative flex-1 bg-gray-100/50 min-h-[250px] md:min-h-auto">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90" 
        style={{ backgroundImage: `url(${event.image_url})` }}
      >
        <div className="absolute bottom-4 left-4 bg-black/40 text-white/80 px-3 py-1 rounded-full text-sm backdrop-blur">
          ADMIT ONE
        </div>
        <div className="absolute top-4 right-4 bg-white/80 text-gray-700 p-2 rounded-lg shadow-sm text-sm font-medium">
          #{new Date(event.date).getDate()}/{new Date(event.date).getFullYear()}
        </div>
      </div>
    </div>

    {/* Content Section */}
    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-bonanova uppercase  mb-2">{event.name}</h2>
          <div className="flex items-center space-x-2 text-sm bg-white/70 py-1 px-3 rounded-full w-max">
            <LuPartyPopper className="text-yellow-600" />
            <span className="font-medium text-gray-700">{event.status}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
              className="w-24 px-4 py-2 text-center bg-white/70 backdrop-blur border border-white/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-white/80 text-gray-700 rounded-full border border-white/50 shadow-sm hover:bg-white hover:shadow-md transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleReserveTickets}
            className="flex-1 px-6 py-2.5 bg-blue-600/90 text-white rounded-full border border-blue-700/50 shadow-sm hover:bg-blue-700 hover:shadow-md transition-all"
          >
            {event.ticket_price === 0 ? 'Confirm' : 'Reserve'}
          </button>
        </div>

        <div className="text-sm space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <BiMap className="flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <BsCalendar3 className="flex-shrink-0" />
            <span>{formatDateInPHTime(event.date)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default TicketReservationModal;