import { useState } from 'react';
import { CreditCard, Calendar, Lock, CheckCircle, ArrowLeft, Shield, X, Smartphone } from 'lucide-react';

interface PlanDetails {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  billingPeriod: 'monthly' | 'annual';
}

interface PaymentPageProps {
  selectedPlan: PlanDetails;
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function PaymentPage({ selectedPlan, onBack, onSuccess }: PaymentPageProps) {
  const [formState, setFormState] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: '',
    gcashNumber: '',
    paymentMethod: 'credit-card',
    billingPeriod: selectedPlan.billingPeriod
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Calculate the actual price based on billing period
  const finalPrice = formState.billingPeriod === 'annual' 
    ? selectedPlan.annualPrice 
    : selectedPlan.monthlyPrice;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setFormState({
        ...formState,
        [name]: formattedValue
      });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '');
      let formattedValue = cleaned;
      
      if (cleaned.length > 2) {
        formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      
      setFormState({
        ...formState,
        [name]: formattedValue.slice(0, 5)
      });
      return;
    }
    
    // Format CVV to only allow 3 or 4 digits
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setFormState({
        ...formState,
        [name]: formattedValue
      });
      return;
    }
    
    // Format GCash number to only allow digits
    if (name === 'gcashNumber') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 11);
      setFormState({
        ...formState,
        [name]: formattedValue
      });
      return;
    }
    
    setFormState({
      ...formState,
      [name]: value
    });
  };
  
  const handlePaymentMethodChange = (method: 'credit-card' | 'paypal' | 'bank' | 'gcash') => {
    setFormState({
      ...formState,
      paymentMethod: method
    });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      onSuccess?.(); // Call the success callback if provided
    }, 1500);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8" 
          style={{
            background: `
              linear-gradient(#152131, #152131) padding-box,
              linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
            `,
            border: '1px solid transparent',
            borderRadius: '0.75rem'
          }}>
        <div className="text-center">
          <div className="mx-auto bg-green-500 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6">
            <CheckCircle size={24} className="text-white sm:hidden" />
            <CheckCircle size={32} className="text-white hidden sm:block" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Payment Successful!</h2>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Thank you for upgrading to {selectedPlan.name}.</p>
          <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">A confirmation email has been sent to {formState.email}</p>
          <button 
            onClick={() => onSuccess?.()} 
            className="bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 w-full"
          >
            Go to Dashboard
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl lg:max-w-3xl relative" 
        style={{
          background: `
            linear-gradient(#152131, #152131) padding-box,
            linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
          `,
          border: '1px solid transparent',
          borderRadius: '0.75rem'
        }}>
      
      {/* Close Button */}
      <button
        onClick={() => onBack?.()}
        className="absolute -top-4 -right-4 w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-300 hover:text-white rounded-full shadow-lg border border-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
        aria-label="Close payment page"
      >
        <X size={18} />
      </button>

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-800 flex items-center mt-6">
        <button 
          onClick={() => onBack?.()} 
          className="text-gray-400 hover:text-white mr-3 sm:mr-4"
        >
          <ArrowLeft size={18} className="sm:hidden" />
          <ArrowLeft size={20} className="hidden sm:block" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-white">Complete Your Purchase</h2>
      </div>
      
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 font-medium">Payment Method</h3>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('credit-card')}
                  className={`p-2 sm:p-3 border rounded-md flex flex-col items-center justify-center transition-all ${
                    formState.paymentMethod === 'credit-card' 
                      ? 'border-amber-500 bg-gray-800' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <CreditCard size={16} className="text-gray-300 mb-1 sm:hidden" />
                  <CreditCard size={18} className="text-gray-300 mb-1 hidden sm:block" />
                  <span className="text-xs text-gray-300">Credit Card</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('gcash')}
                  className={`p-2 sm:p-3 border rounded-md flex flex-col items-center justify-center transition-all ${
                    formState.paymentMethod === 'gcash' 
                      ? 'border-amber-500 bg-gray-800' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center bg-blue-500 w-4 h-4 sm:w-5 sm:h-5 rounded-full mb-1">
                    <Smartphone size={12} className="text-white sm:hidden" />
                    <Smartphone size={14} className="text-white hidden sm:block" />
                  </div>
                  <span className="text-xs text-gray-300">GCash</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('paypal')}
                  className={`p-2 sm:p-3 border rounded-md flex flex-col items-center justify-center transition-all ${
                    formState.paymentMethod === 'paypal' 
                      ? 'border-amber-500 bg-gray-800' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-blue-400 font-bold mb-1">Pay</span>
                  <span className="text-xs text-gray-300">PayPal</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('bank')}
                  className={`p-2 sm:p-3 border rounded-md flex flex-col items-center justify-center transition-all ${
                    formState.paymentMethod === 'bank' 
                      ? 'border-amber-500 bg-gray-800' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <span className="text-gray-300 font-semibold mb-1">₱</span>
                  <span className="text-xs text-gray-300">Bank Transfer</span>
                </button>
              </div>
              
              {/* Credit Card Form */}
              {formState.paymentMethod === 'credit-card' && (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formState.cardName}
                      onChange={handleInputChange}
                      placeholder="Name on card"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formState.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute right-3 top-2.5">
                        <CreditCard size={16} className="text-gray-500 sm:hidden" />
                        <CreditCard size={18} className="text-gray-500 hidden sm:block" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formState.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                        <div className="absolute right-3 top-2.5">
                          <Calendar size={16} className="text-gray-500 sm:hidden" />
                          <Calendar size={18} className="text-gray-500 hidden sm:block" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        Security Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formState.cvv}
                          onChange={handleInputChange}
                          placeholder="CVV"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                        <div className="absolute right-3 top-2.5">
                          <Lock size={16} className="text-gray-500 sm:hidden" />
                          <Lock size={18} className="text-gray-500 hidden sm:block" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* GCash Form */}
              {formState.paymentMethod === 'gcash' && (
                <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <Smartphone size={20} className="sm:hidden" />
                      <Smartphone size={24} className="hidden sm:block" />
                    </div>
                    <span className="text-white font-bold text-lg ml-2">GCash</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4 text-sm text-center">
                    Enter your GCash number to complete the payment
                  </p>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label htmlFor="gcashNumber" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        GCash Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">+63</span>
                        <input
                          type="text"
                          id="gcashNumber"
                          name="gcashNumber"
                          value={formState.gcashNumber}
                          onChange={handleInputChange}
                          placeholder="9XX XXX XXXX"
                          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-10 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        We'll send a verification code to this number
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        Email for Receipt
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-md text-xs text-blue-200">
                    <p>You will be redirected to GCash to confirm your payment after clicking "Complete Payment"</p>
                  </div>
                </div>
              )}
              
              {/* PayPal Form */}
              {formState.paymentMethod === 'paypal' && (
                <div className="bg-gray-800 border border-gray-700 rounded-md p-4 text-center">
                  <p className="text-gray-300 mb-4 text-sm">You'll be redirected to PayPal to complete your payment</p>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded mx-auto inline-block">
                    <span className="font-bold">Pay</span>Pal
                  </div>
                </div>
              )}
              
              {/* Bank Transfer Form */}
              {formState.paymentMethod === 'bank' && (
                <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
                  <p className="text-gray-300 mb-4 text-sm">Bank transfer details will be provided after you complete this form</p>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        Email for Transfer Instructions
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {formState.paymentMethod !== 'gcash' && (
              <div className="mb-6">
                <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 font-medium">Billing Details</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Order Summary */}
            <div className="lg:hidden mb-6">
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5">
                <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider mb-3 font-medium">Order Summary</h3>
                
                <div className="border-b border-gray-800 pb-3 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Plan</span>
                    <span className="text-white font-medium text-sm">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Billing</span>
                    <span className="text-white text-sm">{formState.billingPeriod}</span>
                  </div>
                </div>
                
                <div className="border-b border-gray-800 pb-3 mb-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Subtotal</span>
                    <span className="text-white text-sm">₱{finalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Tax</span>
                    <span className="text-white text-sm">₱0.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-amber-400 font-bold">₱{finalPrice}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <span>Complete Payment</span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Order Summary - Desktop */}
        <div className="hidden lg:block">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-white text-sm uppercase tracking-wider mb-4 font-medium">Order Summary</h3>
            
            <div className="border-b border-gray-800 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Billing</span>
                <span className="text-white">{formState.billingPeriod}</span>
              </div>
            </div>
            
            <div className="border-b border-gray-800 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">₱{finalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="text-white">₱0.00</span>
              </div>
            </div>
            
            <div className="flex justify-between mb-6">
              <span className="text-white font-medium">Total</span>
              <span className="text-amber-400 font-bold">₱{finalPrice}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs">
              <Shield size={16} className="text-gray-500" />
              <span>All payments are secure and encrypted</span>
            </div>
            
            <div className="flex justify-center space-x-2">
              <img src="/api/placeholder/32/20" alt="Visa" className="h-5" />
              <img src="/api/placeholder/32/20" alt="Mastercard" className="h-5" />
              <img src="/api/placeholder/32/20" alt="Amex" className="h-5" />
              <img src="/api/placeholder/32/20" alt="GCash" className="h-5" />
              <img src="/api/placeholder/32/20" alt="PayPal" className="h-5" />
            </div>
          </div>
        </div>
        
        {/* Security info (Mobile only) */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-4 text-gray-400 text-xs">
          <Shield size={14} className="text-gray-500" />
          <span>All payments are secure and encrypted</span>
        </div>
        
        {/* Payment methods (Mobile only) */}
        <div className="lg:hidden flex justify-center space-x-2 mb-2">
          <img src="/api/placeholder/32/20" alt="Visa" className="h-4" />
          <img src="/api/placeholder/32/20" alt="Mastercard" className="h-4" />
          <img src="/api/placeholder/32/20" alt="Amex" className="h-4" />
          <img src="/api/placeholder/32/20" alt="GCash" className="h-4" />
          <img src="/api/placeholder/32/20" alt="PayPal" className="h-4" />
        </div>
      </div>
    </div>
    </div>
  );
}