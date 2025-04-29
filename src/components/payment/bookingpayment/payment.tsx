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
  
  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'gcash' | 'paypal'>('credit_card');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning' | 'confirmation'>('info');
  const [modalMessageKey, setModalMessageKey] = useState<keyof typeof successMessages | keyof typeof errorMessages | undefined>(undefined);

  // Credit Card Details
  interface CardDetails {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }
  
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // GCash Details
  interface GcashDetails {
    mobileNumber: string;
    email: string;
  }

  const [gcashDetails, setGcashDetails] = useState<GcashDetails>({
    mobileNumber: '',
    email: '',
  });

  // PayPal Details
  interface PaypalDetails {
    email: string;
  }

  const [paypalDetails, setPaypalDetails] = useState<PaypalDetails>({
    email: '',
  });
  
  // Credit Card input handler
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // GCash input handler
  const handleGcashInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'mobileNumber') {
      // Format mobile number for Philippines (09XX XXX XXXX)
      const formattedNumber = value.replace(/\D/g, '')
        .replace(/^(\d{4})(\d)/, '$1 $2')
        .replace(/^(\d{4}) (\d{3})(\d)/, '$1 $2 $3')
        .substring(0, 13);
      setGcashDetails(prev => ({ ...prev, [name]: formattedNumber }));
    } else {
      setGcashDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  // PayPal input handler
  const handlePaypalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaypalDetails(prev => ({ ...prev, [name]: value }));
  };
  
  // Get booking and venue details
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
          payment_method: paymentMethod, // Use the selected payment method
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

  // Handle GCash authentication (example)
  const handleGcashAuth = async () => {
    // In a real implementation, this would redirect to GCash for authentication
    setIsProcessing(true);
    
    // Simulate a delay for verification process
    setTimeout(() => {
      // Process the payment after verification
      handlePayment();
    }, 2000);
  };

  // Handle PayPal authentication (example)
  const handlePaypalAuth = async () => {
    // In a real implementation, this would redirect to PayPal for authentication
    setIsProcessing(true);
    
    // Simulate a delay for verification process
    setTimeout(() => {
      // Process the payment after verification
      handlePayment();
    }, 2000);
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

  if (loading) return <p className="p-4 text-gray-600">Loading payment details...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto pt-32 font-sofia">
      <div className="bg-gray-950 p-8 border border-gray-300 rounded-3xl" style={{
        background: `
          linear-gradient(#152131, #152131) padding-box,
          linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
        `,
        border: '1px solid transparent',
        borderRadius: '0.75rem'
      }}>
        <h1 className="text-3xl font-bonanova font-semibold mb-6 text-gray-200">
          Payment for <span className="gradient-text">{venue?.name}</span>
        </h1>
        
        {/* Booking Details Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Booking Details</h2>
          <div className="p-4 rounded-lg">
            <p className="text-gray-200"><span className="font-medium">Service:</span> {booking?.service}</p>
            <p className="text-gray-200"><span className="font-medium">Start Date:</span> {new Date(booking?.start_date || '').toLocaleString()}</p>
            <p className="text-gray-200"><span className="font-medium">End Date:</span> {new Date(booking?.end_date || '').toLocaleString()}</p>
            <p className="text-gray-200">Downpayment Required: <span className='text-2xl gradient-text'>₱{paymentAmount.toFixed(2)}</span></p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="">
          <h2 className="text-xl font-semibold mb-2 text-gray-200">Select Payment Method</h2>
          <div className=" p-4 rounded-lg flex flex-wrap gap-4">
            <button 
              onClick={() => setPaymentMethod('credit_card')}
              className={`flex items-center justify-center p-3 rounded-lg border ${paymentMethod === 'credit_card' 
                ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
                : 'border-gray-700 hover:border-gray-500'}`}
            >
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <span className="text-sm mt-1 text-gray-200">Credit Card</span>
              </div>
            </button>
            
            <button 
              onClick={() => setPaymentMethod('gcash')}
              className={`flex items-center justify-center p-3 rounded-lg border ${paymentMethod === 'gcash' 
                ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
                : 'border-gray-700 hover:border-gray-500'}`}
            >
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0063CF" stroke="#0063CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#0063CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#0063CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm mt-1 text-gray-200">GCash</span>
              </div>
            </button>
            
            <button 
              onClick={() => setPaymentMethod('paypal')}
              className={`flex items-center justify-center p-3 rounded-lg border ${paymentMethod === 'paypal' 
                ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
                : 'border-gray-700 hover:border-gray-500'}`}
            >
              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 6.5C19.5 9 17.5 11 15 11H10.5L9.5 16H5L6.5 6.5H15C17.5 6.5 19.5 4 19.5 6.5Z" fill="#0070E0" stroke="#0070E0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 9.5C16.5 12 14.5 14 12 14H7.5L6.5 19H2L3.5 9.5H12C14.5 9.5 16.5 7 16.5 9.5Z" fill="#003087" stroke="#003087" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm mt-1 text-gray-200">PayPal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Credit Card Payment Form */}
        {paymentMethod === 'credit_card' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Credit Card Details</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-gray-200 mb-2">Card Number</label>
                <input 
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white "
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-200 mb-2">Cardholder Name</label>
                <input 
                  type="text"
                  name="cardHolder"
                  value={cardDetails.cardHolder}
                  onChange={handleCardInputChange}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-200 mb-2">Expiry Date</label>
                  <input 
                    type="text"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleCardInputChange}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-200 mb-2">CVV</label>
                  <input 
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GCash Payment Form */}
        {paymentMethod === 'gcash' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">GCash Details</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-md bg-blue-600 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold">GCash Payment</h3>
                  <p className="text-blue-100 text-sm mt-1">Secure and quick electronic payment</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-200 mb-2">GCash Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-gray-700 border border-r-0 border-gray-600 rounded-l-md">
                    +63
                  </span>
                  <input 
                    type="text"
                    name="mobileNumber"
                    value={gcashDetails.mobileNumber}
                    onChange={handleGcashInputChange}
                    className="w-full p-2 border border-gray-600 rounded-r bg-gray-900"
                    placeholder="917 123 4567"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-200 mb-2">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={gcashDetails.email}
                  onChange={handleGcashInputChange}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-900"
                  placeholder="email@example.com"
                />
              </div>
              <div className="mt-2 text-gray-400 text-sm">
                <p>You will be redirected to GCash for authentication after confirming payment.</p>
              </div>
            </div>
          </div>
        )}

        {/* PayPal Payment Form */}
        {paymentMethod === 'paypal' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">PayPal Details</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-md bg-gradient-to-r from-blue-800 to-blue-600 p-4 rounded-lg text-center">
                  <div className="flex justify-center mb-2">
                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 6.5C19.5 9 17.5 11 15 11H10.5L9.5 16H5L6.5 6.5H15C17.5 6.5 19.5 4 19.5 6.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 9.5C16.5 12 14.5 14 12 14H7.5L6.5 19H2L3.5 9.5H12C14.5 9.5 16.5 7 16.5 9.5Z" fill="#CCE6FF" stroke="#CCE6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-bold">PayPal</h3>
                  <p className="text-blue-100 text-sm mt-1">Fast, safe, and secure payments</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-200 mb-2">PayPal Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={paypalDetails.email}
                  onChange={handlePaypalInputChange}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-900"
                  placeholder="email@example.com"
                />
              </div>
              <div className="mt-2 text-gray-400 text-sm">
                <p>You will be redirected to PayPal to complete your payment securely.</p>
                <p className="mt-1">Exchange Rate: 1 USD = ₱56.45 (Updated: {new Date().toLocaleDateString()})</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/my-bookings/${bookingId}`)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            disabled={isProcessing}
          >
            Cancel
          </button>
          
          {paymentMethod === 'credit_card' && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isProcessing ? 'Processing...' : `Pay ₱${paymentAmount.toFixed(2)}`}
            </button>
          )}
          
          {paymentMethod === 'gcash' && (
            <button
              onClick={handleGcashAuth}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isProcessing ? 'Connecting to GCash...' : `Pay with GCash`}
            </button>
          )}
          
          {paymentMethod === 'paypal' && (
            <button
              onClick={handlePaypalAuth}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isProcessing ? 'Connecting to PayPal...' : `Pay with PayPal`}
            </button>
          )}
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