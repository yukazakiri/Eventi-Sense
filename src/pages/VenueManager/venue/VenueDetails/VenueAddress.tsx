import React, { useState } from 'react';
import { Venue } from '../../../../types/venue';
import { LuPencil } from 'react-icons/lu';
import { BsBuildingUp } from 'react-icons/bs';
interface AddressFormProps {
    venue: Venue;
    onSave: (updatedVenue: Venue) => Promise<void>;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ venue, onSave, isEditing, setIsEditing }) => {
    const [street, setStreet] = useState(venue.address_street);
    const [city, setCity] = useState(venue.address_city);
    const [state, setState] = useState(venue.address_state);
    const [zip, setZip] = useState(venue.address_zip);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setStreet(venue.address_street);
        setCity(venue.address_city);
        setState(venue.address_state);
        setZip(venue.address_zip);
        setIsEditing(true);
        setIsModalOpen(true); // Open the modal
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedVenue: Venue = {
            ...venue,
            address_street: street,
            address_city: city,
            address_state: state,
            address_zip: zip,
        };

        onSave(updatedVenue);
        setIsEditing(false); // Exit editing mode after save
        setIsModalOpen(false); //Close the modal after save.
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl"
         
        >
            <div className='flex justify-between mb-10'>
                <h1 className="text-3xl font-bold font-bonanova text-gray-700 dark:text-gray-200 flex items-center">
                    <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-xl mr-4">
                        <BsBuildingUp className="text-pink-600 dark:text-pink-500" size={24} />
                    </div>
                    Address
                    </h1>
                <div>
           
                        <button
                            onClick={openModal}
                            className="text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2.5 text-center flex items-center"
                        >
                            <LuPencil className="mr-2" size={16} />
                            Edit
                        </button>
        
           
                </div>
            </div>
            
            <div className="space-y-3 font-sofia">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Street Address</p>
                            <p className="text-base text-gray-800 dark:text-gray-200">{street}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                            <p className="text-base text-gray-800 dark:text-gray-200">{city}</p>
                        </div>
                
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">State</p>
                            <p className="text-base text-gray-800 dark:text-gray-200">{state}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ZIP Code</p>
                            <p className="text-base text-gray-800 dark:text-gray-200">{zip}</p>
                        </div>
                    </div>
                </div>
           
            

            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {isEditing ? "Edit Address" : "Address Details"}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Street Address */}
                            <div>
                                <label htmlFor="street" className="block mb-2 text-md font-medium text-gray-800 dark:text-gray-200">
                                    Street Address
                                </label>
                                <input
                                    id="street"
                                    type="text"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="123 Main St"
                                    tabIndex={0}
                                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                />
                            </div>

                            {/* City, State, and ZIP in a row for larger screens */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block mb-2 text-md font-medium text-gray-800 dark:text-gray-200">
                                        City
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Anytown"
                                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label htmlFor="state" className="block mb-2 text-md font-medium text-gray-800 dark:text-gray-200">
                                        State
                                    </label>
                                    <input
                                        id="state"
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="CA"
                                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                    />
                                </div>

                                {/* Zip Code */}
                                <div>
                                    <label htmlFor="zip" className="block mb-2 text-md font-medium text-gray-800 dark:text-gray-200">
                                        ZIP Code
                                    </label>
                                    <input
                                        id="zip"
                                        type="text"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="12345"
                                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition duration-150 ease-in-out"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Edit Address
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressForm;