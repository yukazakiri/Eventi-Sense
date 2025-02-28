import React, { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient';
import { Supplier } from '../../../types/supplier';
import { LuPencil } from 'react-icons/lu';

interface SupplierInfoFormProps {
    supplier: Supplier;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupplierInfoForm: React.FC<SupplierInfoFormProps> = ({ supplier, isEditing, setIsEditing }) => {
    const [formData, setFormData] = useState<Supplier>(supplier);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Update formData when the supplier prop changes (e.g., after a successful save).
        setFormData(supplier); 
    }, [supplier]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!supplier || !supplier.id) {
                console.error("Supplier object or ID is missing.");
                setError("Supplier information is missing. Cannot update.");
                return;
            }

            const { error: supplierUpdateError } = await supabase
                .from('supplier')
                .update(formData)
                .eq('id', supplier.id);

            if (supplierUpdateError) {
                throw supplierUpdateError;
            }

            alert("Supplier information updated successfully!");
            setIsEditing(false); // Close edit mode after successful update
        } catch (error) {
            console.error("Error updating supplier:", error);
            setError("An error occurred while updating the supplier.");
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={`bg-white  border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
               <div className='flex justify-between p-4 md:px-6 border-b-[1px] border-gray-300 dark:border-gray-700'>
                        <h1 className="text-xl md:mt-2 font-bold font-bonanova text-gray-700 dark:text-white justify-center">Information</h1>
                        <div>
                              {!isEditing &&  (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                     className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center dark:bg-blue-500 dark:hover:bg-blue-600">
                                    <LuPencil className="mr-2" />
                                    Edit 
                                </button>
                           
                            </>
                        )}
                        {isEditing  && (
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
            <form onSubmit={handleSubmit}>
                <div className='grid md:grid-cols-2 gap-2 p-8'>
                    {/* ... (form fields) */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Supplier Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''} // Access name from formData
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Example: Acme Corp"
                            disabled={!isEditing}
                        />
                    </div>
                    {/* ... other input fields similar to the name field ... */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Email:</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price_range" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Price Range:</label>
                        <input
                            type="text"
                            id="price_range"
                            name="price_range"
                            value={formData.price_range || ''}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Example: Ranging from PHP5000-PHP10000"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone_number" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Phone Number:</label>
                        <input
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number || ''}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Example: 123-456-7890"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="website" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Website:</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={formData.website || ''}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Example: https://example.com"
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Description:</label>
                        <textarea // Changed to textarea for multi-line input
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-48 p-2.5 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none" // Added resize-none
                            disabled={!isEditing}
                        />
                    </div>

                </div>

                <input type="hidden" name="id" value={supplier.id} /> {/* Keep the hidden ID input */}
          
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

export default SupplierInfoForm;