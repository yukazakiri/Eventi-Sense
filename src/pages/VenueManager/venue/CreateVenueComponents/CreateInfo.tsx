import React from 'react';
import { VenueFormData } from '../../../../types/venue';

interface InfoVenueFormProps {
  formData: VenueFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; // Include HTMLSelectElement
  isEditing: boolean;
}

const CreateInfoVenueForm = ({ formData, handleInputChange, isEditing }: InfoVenueFormProps) => (
  <section className={`shadow-lg bg-white p-[2rem] ${isEditing ? 'border-indigo-400 border-2 rounded-lg' : ''}`}>
    {/* Use htmlFor for labels for accessibility */}
    <div className="mb-4">
      <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Name:</label>
      <input
        type="text"
        id="name" // Add id to input for label connection
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        readOnly={!isEditing}
        placeholder="Example: The Grand Ballroom"
      />
    </div>
    {/* ... other input fields (follow the same pattern with htmlFor and id) */}
        <div className="mb-4">
      <label htmlFor="phone_number" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Phone Number:</label>
      <input 
        type="text" 
        id="phone_number"
        name="phone_number" 
        value={formData.phone_number} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 123-456-7890"
      />
    </div>
        <div className="mb-4">
      <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Email:</label>
      <input 
        type="email" 
        id="email"
        name="email" 
        value={formData.email} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: venue@example.com"
      />
    </div>
        <div className="mb-4">
      <label htmlFor="website" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Website:</label>
      <input 
        type="text" 
        id="website"
        name="website" 
        value={formData.website} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: https://example.com"
      />
    </div>
        <div className="mb-4">
      <label htmlFor="capacity" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Capacity:</label>
      <input 
        type="number" 
        id="capacity"
        name="capacity" 
        value={formData.capacity} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 500"
      />
    </div>
        <div className="mb-4">
      <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Description:</label>
      <textarea 
        name="description" 
        id="description"
        value={formData.description} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: A beautiful venue with a great view"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="venue_type" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Venue Type:</label>
      <select 
        name="venue_type" 
        id="venue_type"
        value={formData.venue_type} 
        disabled={!isEditing}
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
   
      >
        <option value="">Select a venue type</option>
        <option value="restaurant">Restaurant</option>
        <option value="bar">Bar</option>
        <option value="club">Club</option>
        <option value="coffee">Coffee shop</option>
        <option value="other">Other</option>
      </select>
    </div>
  </section>
);

export default CreateInfoVenueForm;