import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import PaymentSuccessModal  from './PaymentSuccessful'

interface Event {
  id: string;
  name: string;
  date: string;
 ticket_price: number;
 organizer_id:string;
}

interface Ticket {
  id: string;
  event_id: string;
  quantity: number;
  status: string;
}

interface Order {
  id: string;
  ticket_id: string;
  amount: number;
  payment_status: string;
  payment_date: string | null;
}

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal'>('credit_card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const ticketId = queryParams.get('ticketId');

        if (!ticketId) {
          throw new Error('No ticket ID provided');
        }

        // Fetch ticket details
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', ticketId)
          .single();

        if (ticketError) throw ticketError;
        if (!ticketData) throw new Error('Ticket not found');

        setTicket(ticketData);

        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', ticketData.event_id)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);
        console.log(eventData); // Add this line

        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('ticket_id', ticketId)
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error('Order not found');

        setOrder(orderData);
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const calculateTotal = (): string => {
    const price = event?.ticket_price ?? 0; // Corrected usage
    const quantity = ticket?.quantity ?? 0;
    return (price * quantity).toFixed(2);
};
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setProcessing(true);

      if (paymentMethod === 'credit_card') {
        if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
          throw new Error('Please fill in all card details');
        }

        if (cardDetails.cardNumber.length < 16) {
          throw new Error('Invalid card number');
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!expiryRegex.test(cardDetails.expiryDate)) {
          throw new Error('Invalid expiry date. Use MM/YY format.');
        }

        if (cardDetails.cvv.length < 3) {
          throw new Error('Invalid CVV');
        }
      }
      if (!ticket) {
        throw new Error('Ticket not found');
      }
        // Update order status to 'completed'
        const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ payment_status: 'completed', payment_date: new Date().toISOString() })
        .eq('id', order?.id);

      if (updateOrderError) throw updateOrderError;

      // Update ticket status to 'purchased'
      const { error: updateTicketError } = await supabase
        .from('tickets')
        .update({ status: 'purchased', purchase_date: new Date().toISOString() })
        .eq('id', ticket?.id);

      if (updateTicketError) throw updateTicketError;
            const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const notificationMessage = `Payment successful for ${ticket?.quantity} ticket(s) to ${event?.name}.`;
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          sender_id: user.id,
          type: 'payment_success',
          message: notificationMessage,
          link: `/tickets`,
          is_read: false,
        }]);

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
   // Notification for the event creator
   if (event?.organizer_id) { // Assuming 'creator_id' exists in the event table
    const creatorNotificationMessage = `${user.email} has purchased ${ticket?.quantity} ticket(s) for your event: ${event?.name}.`;
    await supabase.from('notifications').insert([{
        user_id: event.organizer_id,
        sender_id: user.id, // Or use a system user ID if preferred
        type: 'ticket_sale',
        message: creatorNotificationMessage,
        link: `/events/${event.id}`, // Link to the event page
        is_read: false,
    }]);
} else {
    console.warn("Event creator ID not found. Notification not sent to creator.");
}
      setIsModalOpen(true);
    } catch (error: any) {
      console.error('Payment failed:', error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-8 p-6 bg-red-50 rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/events')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go back to events
        </button>
      </div>
    );
  }
  return (
<div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
  <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
    Complete Your Payment
  </h1>

  <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-gray-600 font-medium mb-2">Event:</p>
        <p className="text-gray-800 font-semibold">{event?.name}</p>
      </div>
      <div>
        <p className="text-gray-600 font-medium mb-2">Date:</p>
        <p className="text-gray-800 font-semibold">
          {new Date(event?.date ?? "").toLocaleDateString()}
        </p>
      </div>
      <div>
        <p className="text-gray-600 font-medium mb-2">Quantity:</p>
        <p className="text-gray-800 font-semibold">{ticket?.quantity}</p>
      </div>
      <div>
        <p className="text-gray-600 font-medium mb-2">Price per ticket:</p>
        <p className="text-gray-800 font-semibold">
          ${(event?.ticket_price ?? 0).toFixed(2)}
        </p>
      </div>
      <div className="md:col-span-2">
        <p className="text-lg text-gray-600 font-semibold mb-2">Total:</p>
        <p className="text-3xl text-blue-600 font-bold">
          ${calculateTotal()}
        </p>
      </div>
    </div>
  </div>

  <form onSubmit={handlePayment} className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Payment Method
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="credit_card"
            checked={paymentMethod === "credit_card"}
            onChange={() => setPaymentMethod("credit_card")}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Credit Card</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => setPaymentMethod("paypal")}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">PayPal</span>
        </label>
      </div>
    </div>

    {paymentMethod === "credit_card" && (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Holder
          </label>
          <input
            type="text"
            name="cardHolder"
            value={cardDetails.cardHolder}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>
      </div>
    )}

    {paymentMethod === "paypal" && (
      <div className="bg-blue-50 p-6 rounded-xl text-center">
        <p className="mb-4 text-gray-700">
          You will be redirected to PayPal to complete your payment.
        </p>
        <p className="text-sm text-gray-600">
          Please note: This is a simulated PayPal integration.
        </p>
      </div>
    )}

    <div className="flex items-center justify-between mt-8">
      <button
        type="button"
        onClick={() => navigate(`/events/${event?.id}`)}
        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={processing}
        className={`px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          processing ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {processing ? "Processing..." : `Pay $${calculateTotal()}`}
      </button>
    </div>

  </form>
  
  <PaymentSuccessModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      ticketId={ticket?.id || ""} // Pass ticketId
    />
</div>
  );
};

export default PaymentPage;