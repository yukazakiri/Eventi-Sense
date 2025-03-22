import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import PaymentSuccessModal from './PaymentSuccessful';
import PaymentView from './PaymentView';
import { Event, Ticket, Order, CardDetails } from './payment';

const PaymentPage: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal'>('credit_card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateTotal, setAnimateTotal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const totalAmount = useMemo(() => {
    const price = event?.ticket_price ?? 0;
    const quantity = ticket?.quantity ?? 0;
    return (price * quantity).toFixed(2);
  }, [event, ticket]);

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(location.search);
      const ticketId = queryParams.get('ticketId');

      if (!ticketId) throw new Error('No ticket ID provided');

      // Fetch ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError) throw ticketError;
      if (!ticketData) throw new Error('Ticket not found');
      setTicket(ticketData);

      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', ticketData.event_id)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData || null);

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('ticket_id', ticketId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData || null);

      setTimeout(() => setAnimateTotal(true), 500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'cardNumber':
        const formattedCard = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        setCardDetails(prev => ({ ...prev, [name]: formattedCard.substring(0, 19) }));
        break;
      
      case 'expiryDate':
        const formattedExpiry = value.replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .substring(0, 5);
        setCardDetails(prev => ({ ...prev, [name]: formattedExpiry }));
        break;
      
      case 'cvv':
        const formattedCVV = value.replace(/\D/g, '').substring(0, 4);
        setCardDetails(prev => ({ ...prev, [name]: formattedCVV }));
        break;
      
      default:
        setCardDetails(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handlePayment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      setError(null);

      if (paymentMethod === 'credit_card') {
        if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
          throw new Error('Please fill in all card details');
        }

        const cardNumberValid = cardDetails.cardNumber.replace(/\s/g, '').length === 16;
        const expiryValid = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expiryDate);
        const cvvValid = cardDetails.cvv.length >= 3;

        if (!cardNumberValid || !expiryValid || !cvvValid) {
          throw new Error('Invalid card details');
        }
      }

      if (!ticket || !event || !order) {
        throw new Error('Missing order information');
      }

      // Update order
      const { error: orderError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'completed', 
          payment_date: new Date().toISOString() 
        })
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Update ticket
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ 
          status: 'purchased', 
          purchase_date: new Date().toISOString() 
        })
        .eq('id', ticket.id);

      if (ticketError) throw ticketError;

      // Create notifications
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userMessage = `Payment successful for ${ticket.quantity} ticket(s) to ${event.name}.`;
        await supabase.from('notifications').insert([{
          user_id: user.id,
          sender_id: user.id,
          type: 'payment_success',
          message: userMessage,
          link: `/tickets`,
          is_read: false,
        }]);

        if (event.organizer_id) {
          const creatorMessage = `${user.email} purchased ${ticket.quantity} ticket(s) for ${event.name}.`;
          await supabase.from('notifications').insert([{
            user_id: event.organizer_id,
            sender_id: user.id,
            type: 'ticket_sale',
            message: creatorMessage,
            link: `/events/${event.id}`,
            is_read: false,
          }]);
        }
      }

      setIsModalOpen(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  }, [paymentMethod, cardDetails, ticket, event, order]);

  const handleNavigateBack = useCallback(() => {
    navigate(`/events/${event?.id}`);
  }, [event?.id, navigate]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    navigate(`/tickets/${ticket?.id}`);
  }, [navigate]);

  return (
    <><div className='bg-gray-100'>
      <PaymentView
        ticket={ticket}
        event={event}
        loading={loading}
        paymentMethod={paymentMethod}
        cardDetails={cardDetails}
        processing={processing}
        error={error}
        animateTotal={animateTotal}
        totalAmount={totalAmount}
        onPaymentMethodChange={setPaymentMethod}
        onCardDetailsChange={handleInputChange}
        onPaymentSubmit={handlePayment}
        onNavigateBack={handleNavigateBack}
      />
      </div>
      <PaymentSuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ticketId={ticket?.id || ""}
      />
    </>
  );
};

export default PaymentPage;