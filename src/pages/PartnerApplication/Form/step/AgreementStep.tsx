import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { StepComponentProps } from '../types';

export const AgreementsStep = ({ formData, errors, handleInputChange, isSubmitting, submitSuccess }: StepComponentProps & { isSubmitting: boolean; submitSuccess: boolean }) => (
  <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm font-sofia">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-bonanova">Final Step: Agreements</h2>
    
    <div className="space-y-4">
      <div className="flex items-start">
        <div className="flex items-center h-6">
          <input
            id="certifyInformation"
            name="certifyInformation"
            type="checkbox"
            checked={formData.certifyInformation}
            onChange={handleInputChange}
            className={`w-4 h-4 rounded border-2 ${errors.certifyInformation ? 'border-red-500' : 'border-gray-300'} bg-white text-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors`}
          />
        </div>
        <div className="ml-3">
          <label htmlFor="certifyInformation" className="text-gray-700">
            I certify that all information provided is true and accurate to the best of my knowledge *
          </label>
          {errors.certifyInformation && (
            <p className="mt-1 text-red-600 text-sm flex items-center">
              <AlertCircle size={16} className="mr-1" /> {errors.certifyInformation}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-6">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className={`w-4 h-4 rounded border-2 ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'} bg-white text-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors`}
          />
        </div>
        <div className="ml-3">
          <label htmlFor="agreeToTerms" className="text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-800 hover:underline">
              Terms and Conditions
            </a>{' '}
            and understand that approval may take 3-5 business days *
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-red-600 text-sm flex items-center">
              <AlertCircle size={16} className="mr-1" /> {errors.agreeToTerms}
            </p>
          )}
        </div>
      </div>
    </div>

    {submitSuccess && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 mb-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200"
      >
        <div className="flex items-center">
          <Check size={20} className="mr-2 text-green-600" />
          <span>Application submitted successfully! You'll receive a confirmation email shortly.</span>
        </div>
      </motion.div>
    )}

    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Submitting...' : 'Submit Application'}
    </button>
  </div>
);