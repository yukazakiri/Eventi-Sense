import { Check, Upload } from 'lucide-react';
import { StepComponentProps } from '../types';


export const SocialPortfolioStep = ({ formData, handleInputChange, handleFileChange }: StepComponentProps) => (
  <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm font-sofia">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-bonanova">Step 3: Social Presence & Portfolio</h2>
    
    <div>
      <label htmlFor="website" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Website (if any)
      </label>
      <input
        type="url"
        id="website"
        name="website"
        value={formData.website}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder="https://example.com"
      />
      <p className="mt-1 text-gray-500 text-sm">Optional</p>
    </div>
    
    <div>
      <label htmlFor="socialMedia" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Facebook / Instagram Page
      </label>
      <input
        type="text"
        id="socialMedia"
        name="socialMedia"
        value={formData.socialMedia}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder="https://facebook.com/yourbusiness or @instagram_handle"
      />
      <p className="mt-1 text-gray-500 text-sm">At least one is recommended</p>
    </div>
    
    <div>
      <label htmlFor="portfolioLink" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Link to Portfolio or Gallery
      </label>
      <input
        type="url"
        id="portfolioLink"
        name="portfolioLink"
        value={formData.portfolioLink}
        onChange={handleInputChange}
        className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder="Google Drive or personal website is fine"
      />
    </div>
    
    <div>
      <label htmlFor="sampleWork" className="flex text-gray-700 font-medium mb-2 items-left justify-start">
        Upload Sample Work
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="sampleWork"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, JPG, PNG (Optional but preferred)</p>
          </div>
          <input
            id="sampleWork"
            name="sampleWork"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {formData.sampleWork && (
        <p className="mt-2 text-sm text-green-600 flex items-center">
          <Check size={16} className="mr-1" /> File uploaded: {formData.sampleWork.name}
        </p>
      )}
    </div>
  </div>
);