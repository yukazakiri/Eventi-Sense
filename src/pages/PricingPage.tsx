import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainFooter from '../layout/MainFooter';
import MainNavbar from '../layout/components/MainNavbar'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: 'Free Plan',
      price: 'Free',
      features: [
        'Access to basic venue and supplier directories',
        'Limited to 1 active event project',
        'Standard customer support',
      ],
      cta: 'Get Started',
      url: '/register',
      popular: false,
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pro Plan',
      price: isAnnual ? '₱4,999/year' : '₱499/month',
      features: [
        'Access to the full venue and supplier directories',
        'Manage up to 5 active event projects',
        'Advanced filters for venue and supplier searches',
        'AI-powered chatbot assistance',
        'Priority customer support',
      ],
      cta: 'Upgrade Now',
      url: '/upgrade-pro',
      popular: true,
      bgColor: 'bg-navy-blue-4',
    },
    {
      name: 'Business Plan',
      price: isAnnual ? '₱9,999/year' : '₱999/month',
      features: [
        'Unlimited active event projects',
        'Customizable event templates',
        'Team collaboration tools for multiple users',
        'Event performance evaluation and reporting',
        'Dedicated account manager and 24/7 support',
      ],
      cta: 'Upgrade Now',
      url: '/upgrade-business',
      popular: false,
      bgColor: 'bg-navy-blue-4',
    },
    {
      name: 'Enterprise Plan',
      price: 'Contact Us for a Quote',
      features: [
        'All features from the Business Plan',
        'Personalized training and onboarding',
        'API access for custom integrations',
        'Exclusive insights and analytics tools',
        'Dedicated technical support',
      ],
      cta: 'Contact Us',
      url: '/enterprise',
      popular: false,
      bgColor: 'bg-cyan-200',
    },
  ];

  return (
    <div className="min-h-screen bg-white ">
      <MainNavbar />
      <div className="container mx-auto px-4  py-[14rem] font-montserrat">
        {/* Pricing Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-semibold text-gray-900 mb-4 font-montserrat mx-auto xl:w-[60rem]" >Flexible Pricing, Tailored to Your Needs</h1>
          <p className="text-lg text-gray-600">
          Choose a plan that fits your business and scale effortlessly as you grow.
          </p>
          {/* Toggle for Monthly/Annual Billing */}
          <div className="mt-6 flex justify-center items-center ">
            <span className="text-gray-600 font-medium">Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`mx-4 w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
                isAnnual ? 'bg-navy-blue-1' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <span className="text-gray-600 font-medium">Annual</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-[2rem] shadow-lg p-8 ${
                plan.popular ? 'border-2 border-yellow-500' : 'border border-gray-200'
              } ${plan.bgColor} ${
                // Apply larger height and white text to the middle two plans
                (index === 1 || index === 2) ? 'h-auto text-white' : 'h-auto'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="bg-navy-blue-1 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              {/* Plan Name */}
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              {/* Plan Price */}
              <p className="text-4xl font-bold mb-6">
                {plan.price}
              </p>
              {/* Plan Features */}
              <ul className="mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="mb-3 flex items-center ">
                    <svg
                      className="w-5 h-5 text-cyan-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {/* Call-to-Action Button */}
              <button
                onClick={() => navigate(plan.url)} // Use React Router's navigate function
                className={`w-full py-3 font-semibold rounded-full transition-colors duration-300 ${
                  plan.popular
                    ? 'bg-navy-blue-1 text-white hover:bg-navy-blue-2'
                    : plan.name === 'Enterprise Plan'
                    ? 'bg-navy-blue-4 text-white hover:bg-navy-blue-1'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Why Choose EventiSense Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EventiSense?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-[60rem] justify-center items-center mx-auto">
            Simplify event planning with cutting-edge tools. Access comprehensive resources to streamline your workflow. Enjoy flexible pricing designed to fit your needs.
          </p>
          <button className="bg-navy-blue-1 text-white font-semibold py-3 px-8 rounded-full hover:bg-navy-blue-2 transition-colors duration-300">
            Start for Free or Upgrade Anytime!
          </button>
        </div>
      </div>
      <MainFooter />
    </div>
  );
};

export default PricingPage;