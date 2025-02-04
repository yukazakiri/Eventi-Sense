
// AddressForm.tsx
import React, { useState } from 'react';
import { Venue } from '../../../../types/venue'


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
    };

    if (!isEditing) {
        return (
            <div className="bg-white p-[2.5rem] shadow-md">
            <h2 className="text-xl font-semibold mb-4">Venue Address</h2>
            <p 
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <strong>Street:</strong> {venue.address_street}
            </p>
            <p
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <strong>City:</strong>{venue.address_city}
            </p>
            <p
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <strong>State:</strong>{venue.address_state}
            </p>
            <p
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <strong>Zip:</strong>{venue.address_zip}
            </p>
           
       
        </div>
        );
    }

    return (
        <div className="bg-white p-[2rem]  shadow-md">
            <h2 className="text-xl mb-4">Venue Address</h2>
            <form onSubmit={handleSubmit}>
                {/* ... (input fields remain the same) */}
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Street</label>
                    <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        
                        tabIndex={0}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">State</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Zip Code</label>
                    <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               
                    />
                </div>

                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default AddressForm;