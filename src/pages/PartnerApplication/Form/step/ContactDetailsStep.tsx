import { AlertCircle } from 'lucide-react';
import { StepComponentProps } from '../types';

export const ContactDetailsStep = ({ formData, errors, handleInputChange }: StepComponentProps) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-white mb-4">Step 2: Contact Details</h2>
    
    <div>
      <label htmlFor="ownerName" className="block text-white font-medium mb-2">
        Owner/Manager Name *
      </label>
      <input
        type="text"
        id="ownerName"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 rounded-lg bg-navy-blue-3 border ${errors.ownerName ? 'border-red-500' : 'border-gray-600'} text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
        placeholder="Enter full name"
      />
      {errors.ownerName && (
        <p className="mt-1 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.ownerName}
        </p>
      )}
    </div>
    
    <div>
      <label htmlFor="emailAddress" className="block text-white font-medium mb-2">
        Email Address *
      </label>
      <input
        type="email"
        id="emailAddress"
        name="emailAddress"
        value={formData.emailAddress}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 rounded-lg bg-navy-blue-3 border ${errors.emailAddress ? 'border-red-500' : 'border-gray-600'} text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
        placeholder="example@domain.com"
      />
      {errors.emailAddress && (
        <p className="mt-1 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.emailAddress}
        </p>
      )}
    </div>
    
    <div>
      <label htmlFor="phoneNumber" className="block text-white font-medium mb-2">
        Phone Number *
      </label>
      <input
        type="tel"
        id="phoneNumber"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        className={`w-full px-4 py-2 rounded-lg bg-navy-blue-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-600'} text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
        placeholder="WhatsApp or Messenger contact is a plus"
      />
      {errors.phoneNumber && (
        <p className="mt-1 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.phoneNumber}
        </p>
      )}
    </div>
    
    <div>
      <label htmlFor="businessAddress" className="block text-white font-medium mb-2">
        Business Address *
      </label>
      <textarea
        id="businessAddress"
        name="businessAddress"
        value={formData.businessAddress}
        onChange={handleInputChange}
        rows={3}
        className={`w-full px-4 py-2 rounded-lg bg-navy-blue-3 border ${errors.businessAddress ? 'border-red-500' : 'border-gray-600'} text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
        placeholder="Include Barangay, City, Province"
      />
      {errors.businessAddress && (
        <p className="mt-1 text-red-500 text-sm flex items-center">
          <AlertCircle size={16} className="mr-1" /> {errors.businessAddress}
        </p>
      )}
    </div>
  </div>
);