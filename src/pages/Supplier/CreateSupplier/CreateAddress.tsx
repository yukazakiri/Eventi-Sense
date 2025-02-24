import React from 'react';
import { SupplierFormData } from '../../../types/supplier';

interface AddressSupplierFormProps {
  formData: SupplierFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Corrected type
  isEditing: boolean;
}

const CreateAddressSupplierForm = ({ formData, handleInputChange, isEditing }: AddressSupplierFormProps) => (
  <section className={`shadow-lg bg-white p-[2rem] border-gray-300 border-[1px] rounded-2xl ${isEditing ? 'border-indigo-400 border-2 rounded-lg' : ''}`}>
    <div className="mb-4">
      <label htmlFor="address_street" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Street Address:</label>
      <input
        type="text"
        id="address_street"
        name="address_street"
        value={formData.address_street}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        readOnly={!isEditing}
        placeholder="Example: 123 Main Street"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="address_city" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">City:</label>
      <input
        type="text"
        id="address_city"
        name="address_city"
        value={formData.address_city}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        readOnly={!isEditing}
        placeholder="Example: New York"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="address_state" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">State:</label>
      <input
        type="text"
        id="address_state"
        name="address_state"
        value={formData.address_state}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        readOnly={!isEditing}
        placeholder="Example: NY"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="address_zip" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">ZIP Code:</label>
      <input
        type="text"
        id="address_zip"
        name="address_zip"
        value={formData.address_zip}
        onChange={handleInputChange}
        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
        readOnly={!isEditing}
        placeholder="Example: 10001"
      />
    </div>

  </section>
);

export default CreateAddressSupplierForm;