import React, { ChangeEvent } from 'react'; 
import { SupplierFormData } from '../../../types/supplier';

interface InfoSupplierFormProps {
  formData: SupplierFormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isEditing: boolean;

}

const CreateInfoSupplierForm: React.FC<InfoSupplierFormProps> = ({ 
  formData, 
  handleInputChange,
  isEditing,

}) => {
  // Handler for checkbox changes

  return (
    <section className={`shadow-lg bg-white p-8 border-gray-300 border-[1px] rounded-2xl ${isEditing ? 'border-indigo-400 border-2 rounded-lg bg-indigo-50' : ''}`}>
      {/* Pricing Model Section */}
      <div className='grid md:grid-cols-2 gap-4'>
      <div className="mb-4 col-span-2">
      <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Business Name:</label>
      <input
        type="text"
        id="name" // Add id to input for label connection
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        readOnly={!isEditing}
        placeholder="Example: J & J Catering Services"
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
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: 0917-123-4567"
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
        placeholder="Example: jjcatering@gmail.com"
      />
    </div>
 
    
    <div className="mb-4 col-span-2">
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
        placeholder="Example: https://jjcatering.com"
      />
    </div>
    <div className="mb-4 col-span-2">
      <label htmlFor="price" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Price Start:</label>
      <input 
        type="text" 
        id="price_range"
        name="price_range" 
        value={formData.price_range} 
        onChange={handleInputChange} 
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
        required 
        readOnly={!isEditing}
        placeholder="Example: PHP5000-PHP10000"
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
        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required 
        readOnly={!isEditing}
        placeholder="Example: J & J Catering Services is a food catering business that offers a variety of dishes for events and gatherings. Our menu includes Filipino dishes such as adobo, sinigang, and lechon kawali. We also offer international dishes such as pasta, pizza, and burgers. Our team of experienced chefs and event coordinators will ensure that your event is a success."
                  
      />
    </div>

   

          
   
    </section>
  );
};

export default CreateInfoSupplierForm;

