import React, { ChangeEvent } from 'react'; 
import { VenueFormData } from '../../../../types/venue';

interface InfoVenueFormProps {
  formData: VenueFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMultiCheckboxChange: (name: keyof VenueFormData, value: string) => void;
  isEditing: boolean;
  accessibilities: { id: string; name: string }[]; // New prop
  pricingModels: { id: string; name: string }[];    // New prop
  venueTypes: { id: string; name: string }[];       // New prop
}

const CreateInfoVenueForm: React.FC<InfoVenueFormProps> = ({ 
  formData, 
  handleInputChange,
  handleMultiCheckboxChange,
  isEditing,
  accessibilities,  // Use these props
  pricingModels,
  venueTypes
}) => {
  // Handler for checkbox changes
  const handleCheckbox = (name: keyof VenueFormData, value: string) => {
    handleMultiCheckboxChange(name, value);
  };

  return (
    <section className={`shadow-lg bg-white p-8 dark:bg-gray-900 border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${isEditing ? 'border-sky-400  border-2 rounded-lg dark:border-sky-400' : ''}`}>
      {/* Pricing Model Section */}
      <div className='grid md:grid-cols-2 gap-4'>
      <div className="mb-4">
      <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Name:</label>
      <input
        type="text"
        id="name" // Add id to input for label connection
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        readOnly={!isEditing}
        placeholder="Example: The Grand Ballroom"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="phone_number" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Phone Number:</label>
      <input 
        type="text" 
        id="phone_number"
        name="phone_number" 
        value={formData.phone_number} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
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
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: venue@example.com"
      />
    </div>
 
       
        <div className="mb-4">
      <label htmlFor="capacity" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Capacity:</label>
      <input 
        type="text" 
        id="capacity"
        name="capacity" 
        value={formData.capacity} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 500-600 people, depending on the event"
      />
    </div>
    <div className="mb-4 ">
      <label htmlFor="website" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Website:</label>
      <input 
        type="text" 
        id="website"
        name="website" 
        value={formData.website} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: https://example.com"
      />
    </div>
    <div className="mb-4 ">
      <label htmlFor="price" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Price:</label>
      <input 
        type="price" 
        id="price"
        name="price" 
        value={formData.price} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        required 
        readOnly={!isEditing}
        placeholder="Example: Ranging from PHP5000-PHP10000"
      />
    </div>
 
      </div>
 
      <div className="mb-4">
      <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Description:</label>
      <textarea 
        name="description" 
        id="description"
        value={formData.description} 
        onChange={handleInputChange} 
        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-48 p-2.5 dark:bg-gray-950 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required 
        readOnly={!isEditing}
        placeholder="Example: The Grand Ballroom is a luxurious event space located in the heart of downtown. It features a grand staircase, high ceilings, and a large dance floor. The venue is perfect for weddings, corporate events, and other special occasions."
                  
      />
    </div>
<div className='grid md:grid-cols-2 gap-4'>
    <div className="mb-4 border-[1px] border-gray-300 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-950">
                <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Accessibility:</label>
                <div className="grid md:grid-cols-2 gap-2">
                    {accessibilities.map((option) => { // Map over accessibilities
                        const id = `accessibility_${option.name.replace(/\s+/g, '_')}`;
                        return (
                            <div className="flex items-center" key={id}>
                                <input
                                    type="checkbox"
                                    id={id}
                                    name="accessibility"
                                    value={option.name} // Use option.name
                                    checked={formData.accessibility?.includes(option.name)} // Check using name
                                    onChange={() => handleCheckbox('accessibility', option.name)} // Pass option.name
                                    className="h-4 w-4 border-gray-300 rounded"
                                    disabled={!isEditing}
                                />
                                <label htmlFor={id} className="ml-2 text-sm  text-gray-800 dark:text-gray-400">
                                    {option.name}  {/* Display option.name */}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Similar changes for pricingModels and venueTypes */}
              <div className="mb-4 border-[1px] border-gray-300 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-950">
                <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Pricing Model:</label>
                <div className="grid md:grid-cols-2 gap-2">
                    {pricingModels.map((option) => { // Map over pricingModels
                        const id = `pricing_${option.name.replace(/\s+/g, '_')}`;
                        return (
                            <div className="flex items-center" key={id}>
                                <input
                                    type="checkbox"
                                    id={id}
                                    name="pricing_model"
                                    value={option.name} // Use option.name
                                    checked={formData.pricing_model?.includes(option.name)} // Check using name
                                    onChange={() => handleCheckbox('pricing_model', option.name)} // Pass option.name
                                    className="h-4 w-4 border-gray-300 rounded"
                                    disabled={!isEditing}
                                />
                                <label htmlFor={id} className="ml-2 text-sm  text-gray-800 dark:text-gray-400">
                                    {option.name}  {/* Display option.name */}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
    </div>
            <div className="mb-4 border-[1px] border-gray-300 dark:border-gray-700 rounded-lg p-4 dark:bg-gray-950">
                <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Venue Type:</label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {venueTypes.map((option) => { // Map over venueTypes
                        const id = `venue_type_${option.name.replace(/\s+/g, '_')}`;
                        return (
                            <div className="flex items-center" key={id}>
                                <input
                                    type="checkbox"
                                    id={id}
                                    name="venue_type"
                                    value={option.name} // Use option.name
                                    checked={formData.venue_type?.includes(option.name)} // Check using name
                                    onChange={() => handleCheckbox('venue_type', option.name)} // Pass option.name
                                    className="h-4 w-4 border-gray-300 rounded"
                                    disabled={!isEditing}
                                />
                                <label htmlFor={id} className="ml-2 text-sm  text-gray-800 dark:text-gray-400">
                                    {option.name}  {/* Display option.name */}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
   
    </section>
  );
};

export default CreateInfoVenueForm;