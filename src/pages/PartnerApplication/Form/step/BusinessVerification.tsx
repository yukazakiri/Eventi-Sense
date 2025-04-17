import { StepComponentProps } from '../types';
import { FileUpload } from '../fileUpload';

export const BusinessVerificationStep = ({ formData, errors, handleInputChange, handleFileChange, handleMultipleFileChange }: StepComponentProps) => (
  <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm font-sofia">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-bonanova">Step 4: Business Verification</h2>
    
    <FileUpload
      id="businessRegistration"
      name="businessRegistration"
      label="Business Registration Certificate (DTI or SEC) *"
      accept=".pdf,.jpg,.jpeg,.png"
      error={errors.businessRegistration}
      value={formData.businessRegistration}
      onChange={handleFileChange}
  
    />
    
    <FileUpload
      id="businessPermit"
      name="businessPermit"
      label="Mayor's Permit / Business Permit *"
      accept=".pdf,.jpg,.jpeg,.png"
      error={errors.businessPermit}
      value={formData.businessPermit}
      onChange={handleFileChange}
  
    />
    
    <FileUpload
      id="governmentId"
      name="governmentId"
      label="Valid Government ID (Owner/Rep) *"
      accept=".pdf,.jpg,.jpeg,.png"
      error={errors.governmentId}
      value={formData.governmentId}
      onChange={handleFileChange}
  
    />
    
    <FileUpload
      id="proofOfAddress"
      name="proofOfAddress"
      label="Proof of Address (Utility bill or lease)"
      accept=".pdf,.jpg,.jpeg,.png"
      value={formData.proofOfAddress}
      onChange={handleFileChange}
  
    />
    
    <div>
      <label htmlFor="tin" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Tax Identification Number (TIN)
      </label>
      <input
        type="text"
        id="tin"
        name="tin"
        value={formData.tin}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder="Optional"
      />
    </div>
    
    {formData.businessType === 'Venue Manager' && (
      <FileUpload
        id="fireSafetyCert"
        name="fireSafetyCert"
        label="Fire Safety Certificate *"
        accept=".pdf,.jpg,.jpeg,.png"
        error={errors.fireSafetyCert}
        value={formData.fireSafetyCert}
        onChange={handleFileChange}
    
      />
    )}
    
    <FileUpload
      id="otherCertificates"
      name="otherCertificates"
      label="Other Relevant Certificates"
      accept=".pdf,.jpg,.jpeg,.png"
      multiple
      value={formData.otherCertificates}
      onChange={handleMultipleFileChange}
  
    />
  </div>
);