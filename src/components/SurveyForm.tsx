import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import  supabase  from '../api/supabaseClient';
// Simulated rating icons
const RatingIcons = {
  Sad: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16C8.33333 14.6667 9.6 12 12 12C14.4 12 15.6667 14.6667 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="9" r="1.5" fill="currentColor" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" />
    </svg>
  ),
  Neutral: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="15" x2="16" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="9" r="1.5" fill="currentColor" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" />
    </svg>
  ),
  Happy: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 13C8.33333 14.3333 9.6 17 12 17C14.4 17 15.6667 14.3333 16 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="9" r="1.5" fill="currentColor" />
      <circle cx="16" cy="9" r="1.5" fill="currentColor" />
    </svg>
  )
};

// Main types
interface SurveyFormProps {
  userId: string;
  onClose: () => void;
}

interface FormData {
  usability: number;
  responsiveness_performance: number;
  functionality: number;
  reliability: number;
  data_security: number; // Added new field for data security
  user_satisfaction: number;
  comment: string;
}

// Rating question definition
interface Question {
  id: keyof Omit<FormData, 'comment'>;
  label: string;
  question: string;
}

export default function EnhancedFeedbackSurvey({ userId, onClose }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    usability: 3,
    responsiveness_performance: 3,
    functionality: 3,
    reliability: 3,
    data_security: 3, // Initialize new field with default value
    user_satisfaction: 3,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Questions configuration - added new question for data security
  const questions: Question[] = [
    {
      id: 'usability',
      label: 'Usability',
      question: 'How easy is Eventi-Sense to navigate and use?'
    },
    {
      id: 'responsiveness_performance',
      label: 'Responsiveness',
      question: 'How would you rate the system speed and performance?'
    },
    {
      id: 'functionality',
      label: 'Functionality',
      question: 'Does Eventi-Sense provide all the features you need?'
    },
    {
      id: 'reliability',
      label: 'Reliability',
      question: 'How stable is the system during use?'
    },
    {
      id: 'data_security',
      label: 'Data & Security',
      question: 'How confident are you in the security and privacy of your data with Eventi-Sense?'
    },
    {
      id: 'user_satisfaction',
      label: 'Overall Satisfaction',
      question: 'How satisfied are you with your Eventi-Sense experience?'
    }
  ];

  const handleChange = (id: keyof FormData, value: number | string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          user_id: userId,
          usability: formData.usability,
          responsiveness_performance: formData.responsiveness_performance,
          functionality: formData.functionality,
          reliability: formData.reliability,
          data_security: formData.data_security, // Add new field to submission
          user_satisfaction: formData.user_satisfaction,
          comment: formData.comment
        });

      if (error) throw error;
      
      setSubmitSuccess(true);
    } catch (err: any) {
      setError(err.message || "Sorry, we couldn't submit your feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const predefinedComments = [
    "The interface is easy to use and very intuitive.",
  "The system could perform better during busy times.",
  "All the features I need work perfectly.",
  "It would be great to have more options to customize the system.",
  "The system is very stable and reliable.",
  "Navigation is quick and easy to use.",
  "Response time is very fast.",
  "Some features are a bit hard to find.",
  "I had a great experience using the platform overall.",
  "It would help to have more detailed guides or instructions.",
  "I love the modern look and design.",
  "There are occasional glitches, but they don't affect my experience much.",
  "I'm very happy with how the system works.",
  "The mobile experience could use some improvements.",
  "The customer support team is excellent and responsive.",
  "I feel confident that my data is kept secure.",
  "I would appreciate more transparency about data handling practices.",
  "The privacy controls are easy to find and adjust.",
  "I'm concerned about how my personal information is being used.",
  "The security measures in place give me peace of mind."
  ];
  

  const renderRatingSelector = (questionId: keyof Omit<FormData, 'comment'>) => {
    const value = formData[questionId];
    
    return (
      <div className="mt-6 font-sofia">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">Not satisfied</span>
          <span className="text-gray-500 text-sm">Very satisfied</span>
        </div>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleChange(questionId, rating)}
              className={`flex-1 p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${
                value === rating 
                  ? 'bg-gradient-to-r border from-amber-500 via-yellow-500 to-amber-400 text-white shadow-md' 
                  : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <div className={`mb-1 ${value === rating ? 'text-white' : 'text-gray-400'}`}>
                {rating <= 2 && <RatingIcons.Sad />}
                {rating === 3 && <RatingIcons.Neutral />}
                {rating >= 4 && <RatingIcons.Happy />}
              </div>
              <span className="text-sm font-medium">
                {rating}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Show success screen with smoother animation
  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.645, 0.045, 0.355, 1],
          opacity: { duration: 0.3 }
        }}
        className="text-center py-12 font-sofia"
      >
        <div className="mb-6 inline-block p-3 rounded-full bg-green-100">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-8">
          Your feedback helps us improve Eventi-Sense for everyone.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1]
      }}
      className="max-w-2xl mx-auto"
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 font-sofia">
            {currentStep < questions.length 
              ? `Question ${currentStep + 1} of ${questions.length}` 
              : "Final Step"}
          </span>
          <span className="text-sm text-gray-600 font-sofia">
            {currentStep < questions.length
              ? `${Math.round(((currentStep + 1) / questions.length) * 100)}% Complete`
              : "Almost Done!"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-amber-500 to-amber-400 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: currentStep < questions.length 
              ? `${((currentStep + 1) / questions.length) * 100}%` 
              : "95%" }}
          ></div>
        </div>
      </div>

      {/* Question screens with smoother transitions */}
      {currentStep < questions.length && (
        <motion.div
          key={`question-${currentStep}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{
            duration: 0.5,
            ease: [0.645, 0.045, 0.355, 1],
            opacity: { duration: 0.3 }
          }}
        >
          <h3 className="text-2xl uppercase font-bold text-gray-800/90 mb-3 font-bonanova">{questions[currentStep].label}</h3>
          <p className="text-gray-700 mb-2 font-sofia">{questions[currentStep].question}</p>
          
          {renderRatingSelector(questions[currentStep].id)}
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-5 py-2 rounded-lg ${
                currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}

    
      {currentStep === questions.length && (
        <motion.div
          key="comments-screen"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{
            duration: 0.5,
            ease: [0.645, 0.045, 0.355, 1],
            opacity: { duration: 0.3 }
          }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3 font-bonanova">Additional Comments</h3>
          <p className="text-gray-700 mb-4 font-sofia">Is there anything else you'd like to share with us?</p>
          
          {/* Add predefined comments section */}
          <div className="mb-4 font-sofia">
            <p className="text-sm text-gray-600 mb-2">Quick comments:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedComments.map((comment, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleChange('comment', comment)}
                  className="px-3 py-1 text-sm rounded-full border border-gray-300 
                    hover:border-indigo-500 hover:bg-indigo-50 transition-colors
                    text-gray-600 hover:text-indigo-600"
                >
                  {comment}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder="Your thoughts, suggestions or ideas..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sofia"
            rows={6}
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-sofia"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 font-sofia"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}