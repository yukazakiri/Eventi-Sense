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
        required: ["Full Name", "Email Address", "Business Name", "Short Business Description", "Business Address", "Contact Number", "TIN (Tax Identification Number)"],
        optional: ["Website/Social Media Links", "Business Photos"]
      },
      result: "Form ready for submission with accurate information and attachments."
    },
    {
      id: 4,
      title: "Upload Required Documents",
      action: "Submit clear scans or photos of the following documents:",
      documents: {
        required: [
          "Business Permit (Mayor's Permit)",
          "Business Registration (DTI Certificate for sole proprietorship, SEC Registration for corporations/partnerships, or CDA Registration for cooperatives)",
          "BIR Certificate of Registration",
          "Valid Government-issued ID of Business Owner/Representative",
          "Proof of Business Address (utility bill not older than 3 months)"
        ],
        conditional: [
          "Proof of Insurance (Public Liability Insurance for venues)",
          "Safety Certificates (for venues - Fire Safety Inspection Certificate)",
          "Sanitary Permit (for food suppliers)",
          "Special Permits (for alcohol service, entertainment, etc.)"
        ]
      },
      verification: "All documents will undergo verification with relevant Philippine government agencies. Documents must be valid and not expired.",
      result: "Documents uploaded for verification."
    },
    {
      id: 5,
      title: "Submit the Application",
      action: "Click the Submit Application button.",
      result: "Application sent to EventiSense for review."
    },
    {
      id: 6,
      title: "Confirmation of Submission",
      action: "Check your email and screen confirmation.",
      result: "Confirmation email received with application details and next steps."
    },
    {
      id: 7,
      title: "Verification Process",
      action: "Wait for document verification and business validation.",
      verificationSteps: [
        "Document authenticity check",
        "Business registration verification with DTI/SEC/CDA",
        "Business permit validation with LGU",
        "Physical address verification (for venues)"
      ],
      timeframe: "5-7 business days",
      result: "Completed verification process."
    },
    {
      id: 8,
      title: "Application Review",
      action: "Application reviewed by EventiSense team.",
      reviewPoints: [
        "Document validity",
        "Business legitimacy",
        "Service quality assessment",
        "Business reputation check"
      ],
      result: "Email notification with approval status (approved or denied with reason)."
    },
    {
      id: 9,
      title: "Access the Partner Portal",
      action: "Use provided credentials to log in.",
      result: "Access to profile management and business tools."
    },
    {
      id: 10,
      title: "Complete Your Profile",
      action: "Add business details, pricing, and availability.",
      result: "Profile visible to potential clients."
    },
    {
      id: 11,
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

                {step.documents && (
                  <div className="mt-3 bg-gray-50 p-3 border border-gray-200 rounded">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-semibold mb-1 text-xs text-red-700">Required Documents for Verification:</h4>
                        <ul className="ml-5 list-disc text-xs">
                          {step.documents.required.map((doc, index) => (
                            <li key={index} className="mb-1">
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-xs">Additional Documents (if applicable):</h4>
                        <ul className="ml-5 list-disc text-xs">
                          {step.documents.conditional.map((doc, index) => (
                            <li key={index} className="mb-1">
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-xs italic border-t border-gray-300 pt-2 mt-2 text-red-600">
                        <p><strong>Note:</strong> {step.verification}</p>
                        <p className="mt-1"><strong>Important:</strong> Applications without valid documents will be rejected. All documents must be current and issued by authorized Philippine government agencies.</p>
                      </div>
                    </div>
                  </div>
                )}

                {step.verificationSteps && (
                  <div className="mt-3">
                    <h4 className="font-semibold mb-1 text-xs">Verification Process Includes:</h4>
                    <ul className="ml-5 list-disc text-xs">
                      {step.verificationSteps.map((vStep, index) => (
                        <li key={index} className="mb-1">
                          {vStep}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs mt-2"><strong>Estimated timeframe:</strong> {step.timeframe}</p>
                  </div>
                )}

                {step.reviewPoints && (
                  <div className="mt-3">
                    <h4 className="font-semibold mb-1 text-xs">Review Criteria:</h4>
                    <ul className="ml-5 list-disc text-xs">
                      {step.reviewPoints.map((point, index) => (
                        <li key={index} className="mb-1">
                          {point}
                        </li>
                      ))}
                    </ul>
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
        <p className="mt-1">For inquiries about application requirements, please contact <strong>verification@eventisense.com</strong></p>
      </div>
    </div>
  );
};

export default ApplicationProcess;