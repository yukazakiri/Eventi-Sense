import { useState } from 'react';
import { Calendar, BarChart2, FileText, Users, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import PaymentPage from './payment';

export default function BusinessPlanOverview() {
  const [isHovering, setIsHovering] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  // Pricing calculations
  const monthlyPrice = 499;
  const annualPrice = 5988;
  const monthlyEquivalent = Math.round(annualPrice / 12);
  
  // Features list with icons
  const features = [
    {
      icon: <Calendar size={18} />,
      title: "Unlimited Event Projects",
      description: "Scale operations without limits"
    },
    {
      icon: <FileText size={18} />,
      title: "Customizable Templates",
      description: "Reusable, branded event templates"
    },
    {
      icon: <BarChart2 size={18} />,
      title: "Advanced Event Tools",
      description: "Streamline complex planning and execution"
    },
    {
      icon: <Users size={18} />,
      title: "Integrated Ticketing & Attendee Management",
      description: "Handle sales and check-ins from one platform"
    },
    {
      icon: <TrendingUp size={18} />,
      title: "Performance Reporting & Evaluation",
      description: "Track success with detailed analytics"
    },
    {
      icon: <CreditCard size={18} />,
      title: "Budget Planner & Financial Tracking",
      description: "Monitor spending and stay within budget"
    }
  ];
  
  const planDetails = {
    name: 'Business Plan',
    monthlyPrice: monthlyPrice,
    annualPrice: annualPrice,
    billingPeriod: isAnnual ? 'annual' : 'monthly' as 'annual' | 'monthly'
  };

  if (showPayment) {
    return (
      <PaymentPage 
        selectedPlan={planDetails}
        onBack={() => setShowPayment(false)}
        onSuccess={() => {
          // Handle successful payment
          // e.g., redirect to dashboard
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0" 
      style={{
        background: `
          linear-gradient(#152131, #152131) padding-box,
          linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
        `,
        border: '1px solid transparent',
        borderRadius: '0.75rem'
      }}>
      
      {/* Header */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-800">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Business Plan</h2>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm">
          Full-featured solution for growing event-based businesses
        </p>
      </div>
      
      {/* Pricing Toggle */}
      <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="flex items-center mb-4 sm:mb-6">
          <span className={`mr-2 sm:mr-3 text-xs sm:text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button 
            className="relative w-10 sm:w-12 h-5 sm:h-6 rounded-full bg-gray-700 cursor-pointer"
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing cycle"
          >
            <div 
              className={`absolute w-3 sm:w-4 h-3 sm:h-4 top-1 bg-white rounded-full transition-all duration-300 ease-in-out ${
                isAnnual ? 'left-6 sm:left-7' : 'left-1'
              }`} 
            />
          </button>
          <span className={`ml-2 sm:ml-3 text-xs sm:text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>Annual</span>
          {isAnnual && <span className="ml-1 sm:ml-2 bg-green-900 text-green-200 text-xs px-2 py-0.5 rounded">Save 15%</span>}
        </div>
        
        {/* Price Display */}
        <div className="text-center mb-4 sm:mb-6">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">₱{isAnnual ? monthlyEquivalent : monthlyPrice}</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {isAnnual ? 'per month, billed annually' : 'per month, scalable & powerful'}
          </p>
          {isAnnual && <p className="text-amber-300 text-xs sm:text-sm mt-1">₱{annualPrice} total per year</p>}
        </div>
        
        {/* Update CTA Button */}
        <button
          onClick={() => setShowPayment(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-600 hover:to-amber-400 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="text-sm sm:text-base">Upgrade to Business</span>
          <ArrowRight size={16} className={`transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} />
        </button>
      </div>
      
      {/* Features */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
        <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 font-medium">Everything in Pro, Plus:</h3>
        <ul className="space-y-3 sm:space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-2 sm:gap-3">
              <div className="flex-shrink-0 text-amber-400 mt-0.5 sm:mt-1">
                {feature.icon}
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-medium">{feature.title}</p>
                <p className="text-gray-400 text-xs">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        
        {/* Ideal For Section */}
        <div className="mt-4 sm:mt-6">
          <h3 className="text-white text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3 font-medium">Ideal For</h3>
          <ul className="grid grid-cols-1 gap-1 sm:gap-2">
            <li className="text-gray-300 text-xs sm:text-sm flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400"></div>
              Event planning agencies
            </li>
            <li className="text-gray-300 text-xs sm:text-sm flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400"></div>
              Corporate teams
            </li>
            <li className="text-gray-300 text-xs sm:text-sm flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400"></div>
              Growing event organizers managing multiple events
            </li>
          </ul>
        </div>
        
        {/* Guarantee */}
        <div className="mt-4 sm:mt-6 border border-gray-700 rounded p-2 sm:p-3 flex items-center gap-2 sm:gap-3 bg-gray-800 bg-opacity-50">
          <div className="text-amber-400 text-xs sm:text-sm">🔒</div>
          <p className="text-gray-300 text-xs">
            Flexible & secure. No contracts. Cancel anytime. Your data is encrypted and protected.
          </p>
        </div>
      </div>
    </div>
  );
}