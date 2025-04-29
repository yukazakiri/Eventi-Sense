import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { Venue, Booking } from '../../../types/venue';
import { getCurrentUser } from '../../../api/utiilty/profiles';


import { Modal } from '../../../assets/modal/modal';
import { successMessages, errorMessages } from '../../../assets/modal/message';

import { v4 as uuidv4 } from 'uuid';



const PaymentPage = () => {
  const { venueId, bookingId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning' | 'confirmation'>('info');
  const [modalMessageKey, setModalMessageKey] = useState<keyof typeof successMessages | keyof typeof errorMessages | undefined>(undefined);

   // Add this interface near the top of your file
   interface CardDetails {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }
  
  // Add this state with your other useState declarations
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  
  // Add this handler function before your return statement
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };
  

    // ... keep existing wrapper divs ...
    
  // Get booking and venue details
  // Inside useEffect, replace the existing payment calculation with:
  useEffect(() => {
      const fetchData = async () => {
        try {
          if (!venueId || !bookingId) {
            throw new Error('Venue ID and Booking ID are required');
          }
  
          // Fetch booking details first to check status
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();
  
          if (bookingError) throw bookingError;
  
          // Check booking status first
          if (bookingData.status === 'confirmed') {
            navigate(`/my-bookings/${bookingId}`); // Redirect to booking details
            return;
          }
  
          if (bookingData.status === 'cancelled') {
            throw new Error('Cannot process payment: This booking has been cancelled');
          }
  
          // Fetch venue details
          const { data: venueData, error: venueError } = await supabase
            .from('venues')
            .select('*')
            .eq('id', venueId)
            .single();
  
          if (venueError) throw venueError;
          setVenue(venueData);
          
          // Check if this booking belongs to the current user
          const user = await getCurrentUser();
          if (user?.id !== bookingData.user_id) {
            throw new Error('Unauthorized: This booking does not belong to you');
          }
  
          setBooking(bookingData);
          
          // Calculate total price based on duration and venue pricing
          const startDate = new Date(bookingData.start_date);
          const endDate = new Date(bookingData.end_date);
          const durationMs = endDate.getTime() - startDate.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          
          let totalPrice = 0;
          
          // Use hourly rate if duration is less than 24 hours
          if (durationHours < 24 && venueData.hourly_price) {
            totalPrice = venueData.hourly_price * durationHours;
          } 
          // Use daily rate if available and duration is 24 hours or more
          else if (venueData.daily_price) {
            const durationDays = Math.ceil(durationHours / 24);
            totalPrice = venueData.daily_price * durationDays;
          }
  
          // Add service price if any
          if (bookingData.service && venueData.additional_services) {
            const selectedService = venueData.additional_services.find(
              (service: { name: string }) => service.name === bookingData.service
            );
            if (selectedService) {
              totalPrice += selectedService.price;
            }
          }
  
          // Calculate downpayment
          const downpaymentPercentage = venueData.downpayment_percentage || 30;
          const downpaymentAmount = totalPrice * (downpaymentPercentage / 100);
          setPaymentAmount(downpaymentAmount);
  
        } catch (err: any) {
          setError(err.message);
          setTimeout(() => {
            navigate('/my-bookings');
          }, 3000);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [venueId, bookingId, navigate]);

  // Handle payment submission
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Inside handlePayment function, update the notification part
    try {
      // Generate unique transaction ID
      const transactionId = `TXN-${uuidv4()}`;
      
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert([{
          booking_id: bookingId,
          user_id: booking?.user_id,
          venue_id: venue?.id,
          amount: paymentAmount,
          payment_type: 'downpayment',
          payment_method: 'credit_card', // Or get from form input
          payment_status: 'completed',
          transaction_id: transactionId,
          payment_date: new Date().toISOString()
        }])
        .select()
        .single();
  
      if (paymentError) throw paymentError;
  
      // Generate receipt number
      const receiptNumber = `RCPT-${Date.now()}`;
      
      // Generate PDF path (you'll need to implement actual PDF generation)
      const pdfPath = `receipts/${receiptNumber}.pdf`;
  
      // Create receipt record
      const { error: receiptError } = await supabase
        .from('receipts')
        .insert([{
          payment_id: paymentData.id,
          receipt_number: receiptNumber,
          pdf_path: pdfPath
        }]);
  
      if (receiptError) throw receiptError;
  
      // Get current user information
      const user = await getCurrentUser();
      const userId = user?.id;
  
      // Create notification for the user
      const { error: userNotificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: booking?.user_id,
          sender_id: userId,
          type: 'payment_completed',
          message: `Your payment of ₱${paymentAmount.toFixed(2)} for ${venue?.name} has been processed successfully.`,
          link: `/receipts/${receiptNumber}`,
          is_read: false,
          created_at: new Date().toISOString()
        }]);
  
      if (userNotificationError) {
        console.error("Error creating user notification:", userNotificationError);
      }
  
      // Create notification for venue manager
      const { error: managerNotificationError } = await supabase
        .from('notifications')
        .insert([{
          user_id: venue?.company_id,
          sender_id: userId,
          type: 'payment_received',
          message: `Payment of ₱${paymentAmount.toFixed(2)} received for booking at ${venue?.name}.`,
          link: `/venue-manager/bookings/${bookingId}`,
          is_read: false,
          created_at: new Date().toISOString()
        }]);
  
      if (managerNotificationError) {
        console.error("Error creating manager notification:", managerNotificationError);
      }
  
      // Show success modal and navigate
      showSuccessModal('paymentSuccessful');
      
      setTimeout(() => {
        navigate(`/receipts/${receiptNumber}`);
      }, 3000);
    } catch (err: any) {
      console.error("Payment error:", err);
      showErrorModal('paymentFailed');
    } finally {
      setIsProcessing(false);
    }
  };

  const showSuccessModal = (messageKey: keyof typeof successMessages) => {
    setIsModalOpen(true);
    setModalTitle('Success');
    setModalType('success');
    setModalMessageKey(messageKey);
  };

  const showErrorModal = (messageKey: keyof typeof errorMessages) => {
    setIsModalOpen(true);
    setModalTitle('Error');
    setModalType('error');
    setModalMessageKey(messageKey);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p className="p-4 text-gray-600 ">Loading payment details...</p>;
  if (error) return <p className="p-4 text-red-500 ">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto py-14 pt-32 font-sofia " >
  
      
      <div className="bg-gray-950 p-8 mb-8 border border-gray-300 rounded-3xl "   style={{
      background: `
        linear-gradient(#152131, #152131) padding-box,
        linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
      `,
      border: '1px solid transparent',
      borderRadius: '0.75rem'
    }}>
        <h1 className="text-3xl font-bonanova font-semibold mb-6 text-gray-200 ">
          Payment for <span className="gradient-text">{venue?.name}</span>
        </h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-200 ">Booking Details</h2>
          <div className="bg-gray-900 p-4 rounded-lg ">
            <p className="text-gray-200 "><span className="font-medium">Service:</span> {booking?.service}</p>
            <p className="text-gray-200 "><span className="font-medium">Start Date:</span> {new Date(booking?.start_date || '').toLocaleString()}</p>
            <p className="text-gray-200 "><span className="font-medium">End Date:</span> {new Date(booking?.end_date || '').toLocaleString()}</p>
           {/*  <p className="text-gray-200 "><span className="font-medium">Total Price:</span> ₱{booking?.total_price?.toFixed(2)}</p>*/}
            <p className="text-gray-200  ">Downpayment Required: <span className='text-2xl gradient-text'>₱{paymentAmount.toFixed(2)}</span></p>
          </div>
        </div>


  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2 text-gray-200 ">Payment Method</h2>
    <div className="bg-gray-900 p-4 rounded-lg 0">
      <div className="mb-4">
        <label className="block text-gray-200 300 mb-2">Card Number</label>
        <input 
          type="text"
          name="cardNumber"
          value={cardDetails.cardNumber}
          onChange={handleInputChange}
                 className="w-full p-2 border border-gray-600 rounded  bg-gray-900 "
          placeholder="1234 5678 9012 3456"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-200 300 mb-2">Cardholder Name</label>
        <input 
          type="text"
          name="cardHolder"
          value={cardDetails.cardHolder}
          onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded  bg-gray-900 "
          placeholder="John Doe"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-200 300 mb-2">Expiry Date</label>
          <input 
            type="text"
            name="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded  bg-gray-900 "
            placeholder="MM/YY"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-200 300 mb-2">CVV</label>
          <input 
            type="text"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded  bg-gray-900 "
            placeholder="123"
          />
        </div>
      </div>
    </div>
       </div>
  
  <div className="flex justify-end space-x-4">
    <button
      type="button"
      onClick={() => navigate(`/my-bookings/${bookingId}`)}
      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      disabled={isProcessing}
    >
      Cancel
    </button>
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      {isProcessing ? 'Processing...' : `Pay ₱${paymentAmount.toFixed(2)}`}
    </button>
  </div>
      
      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        type={modalType}
        messageKey={modalMessageKey}
        onConfirm={closeModal}
      />
    </div>
    </div>
  );
};

export default PaymentPage;