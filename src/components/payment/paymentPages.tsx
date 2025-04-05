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
      console.log("Ticket ID: ", ticketId);

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

      // Fetch order for all events (both free and paid)
      console.log("Fetching order for ticket ID:", ticketId);
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('ticket_id', ticketId)
        .maybeSingle();
    
      console.log("Order Data:", orderData);
      console.log("Error:", orderError);
      
      if (orderError) throw orderError;
      setOrder(orderData || null);

      setTimeout(() => setAnimateTotal(true), 500);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  // Remove handleFreeEventBooking function

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

      // Get current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Only validate card details for paid events
      if (event?.ticket_price !== 0 && paymentMethod === 'credit_card') {
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

      if (!ticket || !event) {
        throw new Error('Missing ticket or event information');
      }

      // Verify ticket ownership before proceeding
      const { data: ticketOwnership, error: ticketOwnershipError } = await supabase
        .from('tickets')
        .select('user_id')
        .eq('id', ticket.id)
        .single();

      if (ticketOwnershipError) throw ticketOwnershipError;
      if (!ticketOwnership || ticketOwnership.user_id !== user.id) {
        throw new Error('Unauthorized: You do not own this ticket');
      }

      // Try a different approach for updating the order
      if (order) {
        console.log("Updating existing order:", order.id, "Current status:", order.payment_status);
        
        // First, try with RPC if available (more direct database access)
        try {
          // Use a direct SQL query via RPC if you have one set up
          // This is just a placeholder - you would need to create this function in Supabase
          const { data: rpcResult, error: rpcError } = await supabase.rpc('update_order_status', {
            order_id: order.id,
            new_status: 'completed',
            payment_date: new Date().toISOString()
          });
          
          console.log("RPC update result:", rpcResult);
          
          if (rpcError) {
            console.warn("RPC update failed, falling back to standard update:", rpcError);
            // Fall through to standard update
          } else {
            console.log("Order updated via RPC successfully");
          }
        } catch (rpcErr) {
          console.warn("RPC method not available, using standard update");
        }
        
        // Standard update as fallback
        const { error: orderError } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'completed', 
            payment_date: new Date().toISOString() 
          })
          .eq('id', order.id);
          
        if (orderError) {
          console.error("Order update error:", orderError);
          throw orderError;
        }
        
        console.log("Order update completed without errors");
        
        // Update local state to reflect the change even if we don't get data back
        setOrder({
          ...order,
          payment_status: 'completed',
          payment_date: new Date().toISOString()
        });
        
        // Try a more specific query to verify the update
        const { data: verifyOrder, error: verifyError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', order.id)
          .eq('ticket_id', ticket.id) // Add this to be more specific
          .single();
          
        console.log("Verification query result:", verifyOrder);
        
        if (verifyError) {
          console.warn("Order verification error (non-fatal):", verifyError);
        } else if (verifyOrder) {
          // If verification still shows pending, try one more direct update
          if (verifyOrder.payment_status === 'pending') {
            console.log("Order still pending after update, trying one more time with different approach");
            
            // Try with a different approach - create a new order and delete the old one
            const { data: newOrder, error: createError } = await supabase
              .from('orders')
              .insert([{
                ticket_id: ticket.id,
                amount: order.amount,
                payment_status: 'completed',
                created_at: new Date().toISOString(),
                payment_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }])
              .select();
              
            if (createError) {
              console.warn("Failed to create replacement order:", createError);
            } else if (newOrder && newOrder.length > 0) {
              console.log("Created replacement order:", newOrder[0]);
              setOrder(newOrder[0]);
              
              // Try to delete the old order (non-critical)
              const { error: deleteError } = await supabase
                .from('orders')
                .delete()
                .eq('id', order.id);
                
              if (deleteError) {
                console.warn("Failed to delete old order (non-critical):", deleteError);
              }
            }
          } else {
            // Update with the latest data from the database
            setOrder(verifyOrder);
          }
        }
      } else {
        // If no order exists, create one
        console.log("Creating new order for ticket:", ticket.id);
        const { data: newOrder, error: createOrderError } = await supabase
          .from('orders')
          .insert([{
            ticket_id: ticket.id,
            amount: event.ticket_price * ticket.quantity,
            payment_status: 'completed',
            created_at: new Date().toISOString(),
            payment_date: new Date().toISOString()
          }])
          .select();
          
        console.log("New order created:", newOrder);
        
        if (createOrderError) {
          console.error("Order creation error:", createOrderError);
          throw createOrderError;
        }
        
        // Update local state with the new order
        if (newOrder && newOrder.length > 0) {
          setOrder(newOrder[0]);
        }
      }

      // Update ticket status
      console.log("Updating ticket status for ticket:", ticket.id);
      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ 
          status: 'purchased', 
          purchase_date: new Date().toISOString() 
        })
        .eq('id', ticket.id);

      if (ticketError) {
        console.error("Ticket update error:", ticketError);
        throw ticketError;
      }
      
      // Update local ticket state
      setTicket({
        ...ticket,
        status: 'purchased',
        purchase_date: new Date().toISOString()
      });

      // Create notifications with appropriate messaging based on event price
      const notificationType = event.ticket_price === 0 ? 'booking_success' : 'payment_success';
      const userMessage = event.ticket_price === 0
        ? `Booking confirmed for ${ticket.quantity} ticket(s) to ${event.name}.`
        : `Payment successful for ${ticket.quantity} ticket(s) to ${event.name}.`;
        
      await supabase.from('notifications').insert([{
        user_id: user.id,
        sender_id: user.id,
        type: notificationType,
        message: userMessage,
        link: `/tickets/${ticket.id}/Details`,
        is_read: false,
      }]);

      if (event.organizer_id) {
        const creatorNotificationType = event.ticket_price === 0 ? 'ticket_booking' : 'ticket_sale';
        const creatorMessage = `${user.email} ${event.ticket_price === 0 ? 'booked' : 'purchased'} ${ticket.quantity} ticket(s) for ${event.name}.`;
          
        await supabase.from('notifications').insert([{
          user_id: event.organizer_id,
          sender_id: user.id,
          type: creatorNotificationType,
          message: creatorMessage,
          link: `/events/${event.id}`,
          is_read: false,
        }]);
      }

      // Double-check the order status before showing success
      if (order && order.payment_status !== 'completed') {
        console.log("Verifying order status after update...");
        const { data: verifyOrder, error: verifyError } = await supabase
          .from('orders')
          .select('payment_status')
          .eq('id', order.id)
          .single();
          
        console.log("Verified order status:", verifyOrder);
        
        if (verifyError) {
          console.error("Order verification error:", verifyError);
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
    
    // Refresh the order data one more time before navigating
    if (ticket?.id) {
      console.log("Refreshing order data before navigation");
      
      // Force a small delay to ensure database consistency
      setTimeout(() => {
        supabase
          .from('orders')
          .select('*')
          .eq('ticket_id', ticket.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              console.log("Final order status:", data.payment_status);
              // Update local state one last time
              setOrder(data);
            } else if (error) {
              console.warn("Final order check error:", error);
            }
            
            // Navigate regardless of the result
            console.log("Navigating to: ", `/tickets/${ticket.id}/Details`);
            navigate(`/tickets/${ticket.id}/Details`);
          });
      }, 500); // Half-second delay
    } else {
      navigate(`/tickets/${ticket?.id}/Details`);
    }
  }, [navigate, ticket]);

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