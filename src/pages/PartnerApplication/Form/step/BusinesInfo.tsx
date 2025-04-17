import { StepComponentProps } from '../types';
import { businessTypes, serviceTypes } from '../constant';
import { AlertCircle } from 'lucide-react';

export const BusinessInfoStep = ({ formData, errors, handleInputChange }: StepComponentProps) => (
  <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm font-sofia">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-bonanova">Step 1: Business Information</h2>
    
    <div>
      <label htmlFor="businessName" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Business/Brand Name *
      </label>
      <input
        type="text"
        id="businessName"
        name="businessName"
        value={formData.businessName}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 rounded-lg bg-white border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
        placeholder="Enter your business name"
      />
      {errors.businessName && (
        <p className="mt-1 text-red-600 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.businessName}
        </p>
      )}
    </div>
    
    <div>
      <label htmlFor="businessType" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Business Type *
      </label>
      <select
        id="businessType"
        name="businessType"
        value={formData.businessType}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 rounded-lg bg-white border ${errors.businessType ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
      >
        <option value="">Select business type</option>
        {businessTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      {errors.businessType && (
        <p className="mt-1 text-red-600 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.businessType}
        </p>
      )}
    </div>
    
    <div>
      <label htmlFor="serviceType" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Type of Service / Venue *
      </label>
      <select
        id="serviceType"
        name="serviceType"
        value={formData.serviceType}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 rounded-lg bg-white border ${errors.serviceType ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
      >
        <option value="">Select service type</option>
        {serviceTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      {errors.serviceType && (
        <p className="mt-1 text-red-600 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.serviceType}
        </p>
      )}
    </div>
    
    <div>
      <label htmlFor="businessDescription" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Business Description *
      </label>
      <textarea
        id="businessDescription"
        name="businessDescription"
        value={formData.businessDescription}
        onChange={handleInputChange}
        rows={4}
        className={`w-full px-4 py-2 rounded-lg bg-white border ${errors.businessDescription ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
        placeholder="Brief overview of what you offer"
      />
      {errors.businessDescription && (
        <p className="mt-1 text-red-600 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.businessDescription}
        </p>
      )}
    </div>
  </div>
);