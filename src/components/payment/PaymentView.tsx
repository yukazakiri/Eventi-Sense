import React from 'react';
import { Event, Ticket, CardDetails } from './payment';

interface PaymentViewProps {
  ticket: Ticket | null;
  event: Event | null;
  loading: boolean;
  paymentMethod: 'credit_card' | 'paypal';
  cardDetails: CardDetails;
  processing: boolean;
  error: string | null;
  animateTotal: boolean;
  totalAmount: string;
  onPaymentMethodChange: (method: 'credit_card' | 'paypal') => void;
  onCardDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaymentSubmit: (e: React.FormEvent) => void;
  onNavigateBack: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({
  ticket,
  event,
  loading,
  paymentMethod,
  cardDetails,
  processing,
  error,
  animateTotal,
  totalAmount,
  onPaymentMethodChange,
  onCardDetailsChange,
  onPaymentSubmit,
  onNavigateBack,
}) => {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-sky-600 animate-spin"></div>
          <div className="mt-4 text-sky-600 font-medium">Loading payment details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Payment Error</h2>
          <p className="text-red-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={onNavigateBack}
              className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Return to Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 font-sofia">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onNavigateBack}
          className="group flex items-center text-sky-600 hover:text-sky-800 font-medium mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Event
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            <h1 className="text-3xl font-bold relative z-10">Complete Your Purchase</h1>
            <p className="mt-2 opacity-90 relative z-10">
              You're just a few steps away from securing your tickets
            </p>
          </div>

          <div className="p-8">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span>Order Summary</span>
                <div className="ml-auto text-sm bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-medium">
                  {ticket?.quantity} {ticket?.quantity === 1 ? 'Ticket' : 'Tickets'}
                </div>
              </h2>

              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-sm uppercase font-medium mb-1">Event</p>
                      <p className="text-gray-900 font-semibold text-xl">{event?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm uppercase font-medium mb-1">Date</p>
                      <p className="text-gray-900 font-semibold">
                        {event?.date && new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-sm uppercase font-medium mb-1">Quantity</p>
                      <p className="text-gray-900 font-semibold">{ticket?.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm uppercase font-medium mb-1">Price per ticket</p>
                      <p className="text-gray-900 font-semibold">${event?.ticket_price?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 bg-sky-50 flex justify-between items-center transition-all duration-500 ${animateTotal ? 'bg-sky-100' : ''}`}>
                  <p className="text-gray-800 font-bold text-lg">Total</p>
                  <p className={`text-3xl text-sky-700 font-bold transition-all duration-500 ${animateTotal ? 'scale-110' : ''}`}>
                    ${totalAmount}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={onPaymentSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => onPaymentMethodChange('credit_card')}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === 'credit_card' ? 'bg-sky-600 text-white' : 'bg-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className={`font-semibold ${paymentMethod === 'credit_card' ? 'text-sky-700' : 'text-gray-800'}`}>
                        Credit Card
                      </p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPaymentMethodChange('paypal')}
                    className={`flex items-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      paymentMethod === 'paypal' ? 'bg-sky-600 text-white' : 'bg-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className={`font-semibold ${paymentMethod === 'paypal' ? 'text-sky-700' : 'text-gray-800'}`}>
                        PayPal
                      </p>
                      <p className="text-sm text-gray-500">Fast & secure checkout</p>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={onCardDetailsChange}
                        placeholder="1234 5678 9012 3456"
                        className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent pr-12"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 text-sky-600">
                          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 11h.01M12 11h.01M17 11h.01" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={cardDetails.cardHolder}
                      onChange={onCardDetailsChange}
                      placeholder="John Doe"
                      className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={onCardDetailsChange}
                        placeholder="MM/YY"
                        className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Code (CVV)
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={onCardDetailsChange}
                        placeholder="123"
                        className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="bg-sky-50 border border-sky-100 p-6 rounded-xl text-center animate-fadeIn">
                  <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">
                    You'll be redirected to PayPal to complete your payment.
                  </p>
                  <p className="text-sm text-gray-500">
                    Note: This is a simulated PayPal integration for demonstration purposes.
                  </p>
                </div>
              )}

              <div className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Secure Checkout</p>
                  <p>Your payment information is protected with industry-standard encryption</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={onNavigateBack}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                    processing ? "opacity-80" : ""
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Complete Payment: $${totalAmount}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Event Tickets | Need help? Contact support@eventtickets.com</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;