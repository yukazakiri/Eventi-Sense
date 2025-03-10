import { useState} from 'react';
import supabase from '../../api/supabaseClient';
import { EventPlannerFormData, initialFormData } from '../../api/utiilty/eventplanner';

export default function EventPlannerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventPlannerFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const steps = [
    { title: 'Company Information', fields: ['company_name', 'address'] },
    { title: 'Location Details', fields: ['city', 'state', 'zip_code', 'country'] },
    { title: 'Experience', fields: ['experience_years', 'specialization'] },
    { title: 'Additional Info', fields: ['website', 'bio'] },
  ];

  const validateStep = (): boolean => {
    const currentFields = steps[currentStep - 1].fields;
    return currentFields.every(field => {
      if (field === 'experience_years') return !!formData.experience_years;
      return !!formData[field as keyof EventPlannerFormData];
    });
  };

  const handleNext = () => {
    if (!validateStep()) {
      setError('Please fill all required fields');
      return;
    }
    setError(null);
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('eventplanners')
        .insert([{ 
          ...formData,
          profile_id: user.id,
          experience_years: Number(formData.experience_years)
        }]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData(initialFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };


  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 font-sofia">
      <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your event planner profile has been created successfully. You can now access all features and start creating memorable events for your clients. Visit your business profile to complete any additional information.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <button 
              onClick={handleRefresh}
              className="px-6 py-3 bg-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Page
            </button>
            <a 
              href="/business-profile" 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Business Profile
            </a>
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 font-sofia scrollbar-hide"> 
      <div className="max-w-3xl w-full mx-auto ">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="p-8">
            <div className="mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-6 rounded-lg mb-6">
                <div className="flex">  
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Don't worry! All the information you provide here can be edited later. Take your time to fill out what you can, and you can always update it later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h2>
                <div className="flex justify-center gap-2 mb-6">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index < currentStep 
                          ? 'bg-sky-600 dark:bg-sky-500 w-4' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name 
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                      placeholder="Enter your company name or business name"
                    />
                  </div>
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                      required
                      placeholder="Enter your company or business address"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                        className="w-full p-2 border rounded-md text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Zip Code *</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-black  "
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-black"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-black"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-black"
                      placeholder="e.g., Weddings, Corporate Events"
                      required
                    />
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md text-black"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md h-32 text-black"
                      placeholder="Tell us about your company..."
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Back
                  </button>
                )}
                
                <div className="flex-1" />
                
                <button
                  type="button"
                  onClick={currentStep === steps.length ? handleSubmit : handleNext}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    currentStep === steps.length ? 'Submit' : 'Next'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}