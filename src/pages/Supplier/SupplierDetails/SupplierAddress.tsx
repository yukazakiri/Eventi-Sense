// AddressForm.tsx
import React, { useState } from 'react';
import { Supplier } from '../../../types/supplier'; // Updated type
import { LuPencil } from 'react-icons/lu';

interface AddressFormProps {
    supplier: Supplier; // Updated prop type
    onSave: (updatedSupplier: Supplier) => Promise<void>; // Updated type
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ supplier, onSave, isEditing, setIsEditing }) => {
    const [street, setStreet] = useState(supplier.address_street || ""); // Handle potential nulls
    const [city, setCity] = useState(supplier.address_city || "");
    const [state, setState] = useState(supplier.address_state || "");
    const [zip, setZip] = useState(supplier.address_zip || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedSupplier: Supplier = {
            ...supplier,
            address_street: street,
            address_city: city,
            address_state: state,
            address_zip: zip,
        };

        onSave(updatedSupplier);
        setIsEditing(false);
    };



    return (
        <div className={`bg-white   border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
                   <div className='flex justify-between p-4 md:px-6 border-b-[1px] border-gray-300 dark:border-gray-700'>
                        <h1  className="text-xl md:mt-2 font-bold font-bonanova text-gray-700 dark:text-white justify-center">Address</h1>
                        <div>
                        {!isEditing && (
                            <>
                            
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center dark:bg-blue-500 dark:hover:bg-blue-600">
                                     <LuPencil className="mr-2" />
                                     Edit
                                </button>
                            </>
                        )}
                        {isEditing && (
                            <button
                                onClick={() => {
                                
                                    setIsEditing(false);
                                }}
                                className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                            >
                                Cancel
                            </button>
                        )}</div>
                           </div>
            <form onSubmit={handleSubmit} className='p-8'>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Street</label>
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        disabled={!isEditing}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        disabled={!isEditing}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">State</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        disabled={!isEditing}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Zip Code</label>
                    <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        disabled={!isEditing}
                    />
                </div>

                {isEditing && (
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Changes
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddressForm;