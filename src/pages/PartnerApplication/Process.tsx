import React from 'react';

const ApplicationProcess: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Visit the Partner Application Page",
      action: "Go to the EventiSense website and click on the Partner Application link in the main menu or footer.",
      result: "Redirected to the Partner Application Page to begin the process."
    },
    {
      id: 2,
      title: "Choose Your Business Type",
      action: "Select either:",
      options: ["Supplier (event-related products/services)", "Venue Manager (event spaces)"],
      result: "Application form customized based on your business type."
    },
    {
      id: 3,
      title: "Fill Out the Application Form",
      action: "Complete required fields:",
      fields: {
        required: ["Full Name", "Email Address", "Business Name", "Short Business Description"],
        optional: ["Website/Social Media Links", "Business Photos", "Documents (permits, licenses, insurance)"]
      },
      result: "Form ready for submission with accurate information and attachments."
    },
    {
      id: 4,
      title: "Submit the Application",
      action: "Click the Submit Application button.",
      result: "Application sent to EventiSense for review."
    },
    {
      id: 5,
      title: "Confirmation of Submission",
      action: "Check your email and screen confirmation.",
      result: "Confirmation email received with application details and next steps."
    },
    {
      id: 6,
      title: "Wait for Application Review",
      action: "3-5 business days processing time.",
      result: "Email notification with approval status (approved or denied)."
    },
    {
      id: 7,
      title: "Access the Partner Portal",
      action: "Use provided credentials to log in.",
      result: "Access to profile management and business tools."
    },
    {
      id: 8,
      title: "Complete Your Profile",
      action: "Add business details, pricing, and availability.",
      result: "Profile visible to potential clients."
    },
    {
      id: 9,
      title: "Start Receiving Bookings",
      action: "Monitor portal for event requests.",
      result: "Receive and manage bookings through the platform."
    }
  ];

  return (
    <div className="max-w-4xl mx-4 p-6 bg-white font-serif">
      {/* Document Header */}
      <div className="mb-6 text-center">
        
        <p className="text-black text-xs">EventiSense Partner Onboarding Documentation</p>
      </div>

      {/* Process Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="text-gray-800">
            {/* Step Header */}
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center mr-3">
                {step.id}
              </div>
              <h2 className="text-md font-bold">{step.title}</h2>
            </div>

            {/* Content */}
            <div className="ml-9 space-y-3">
              <div className="mb-3">
                <h3 className="font-bold mb-1 text-xs underline">Actions Required:</h3>
                <p className="ml-3 text-xs">{step.action}</p>
                
                {step.options && (
                  <ul className="ml-5 list-disc mt-1 text-xs">
                    {step.options.map((option, index) => (
                      <li key={index} className="mb-1">
                        {option}
                      </li>
                    ))}
                  </ul>
                )}

                {step.fields && (
                  <div className="mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1 text-xs">Required Fields:</h4>
                        <ul className="ml-5 list-disc text-xs">
                          {step.fields.required.map((field, index) => (
                            <li key={index} className="mb-1">
                              {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-xs">Optional Fields:</h4>
                        <ul className="ml-5 list-disc text-xs">
                          {step.fields.optional.map((field, index) => (
                            <li key={index} className="mb-1">
                              {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Expected Result */}
              <div className="border-l-2 border-gray-400 pl-2">
                <h3 className="font-bold mb-1 text-xs underline">Expected Outcome:</h3>
                <p className="ml-2 text-xs">{step.result}</p>
              </div>
            </div>

            {/* Separator */}
            {step.id !== steps.length && (
              <div className="border-b border-gray-200 my-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Document Footer */}
      <div className="mt-6 text-center text-xs text-gray-600">
        <p>EventiSense Partner Process Documentation v1.0</p>
      </div>
    </div>
  );
};

export default ApplicationProcess;