import React, { useState } from 'react';
import { Venue } from '../../../../types/venue'



interface VenueInfoFormProps {

    venue: Venue;

    onSave: (updatedVenue: Venue) => Promise<void>;

    isEditing: boolean;

    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;

}

const VenueInfoForm: React.FC<VenueInfoFormProps> = ({ venue, onSave, isEditing }) => {
    const [name, setName] = useState(venue.name);
    const [description, setDescription] = useState(venue.description);
    const [capacity, setCapacity] = useState(venue.capacity);
    const [phone_number, setPhoneNumber] = useState(venue.phone_number);
    const [website,setWebsite] = useState (venue.website);
    const [venue_type,setVenue_type] = useState (venue.venue_type);
    const [location, setLocation] = useState(venue.location);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedVenue: Venue = {
            ...venue,  // Important: Include the original venue properties
            name,
            capacity,
            website,
            phone_number,
            venue_type,
            description,
            location,

        };

        onSave(updatedVenue); // Call the callback function to save in the parent component
    };

    if (!isEditing) {
        return (
            <div className="bg-white p-[2.5rem]  shadow-md">
                <h2 className="text-xl font-semibold mb-4">Venue Information</h2>
                <p 
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Name:</strong> {venue.name}
                </p>
                <p
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Capacity:</strong>{venue.capacity}
                </p>
                <p
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Phone Number:</strong>{venue.phone_number}
                </p>
                <p
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Website:</strong>{venue.website}
                </p>
                <p
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Venue Type:</strong>{venue.venue_type}
                </p>
                <p 
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Description:</strong> {venue.description}
                </p>
                <p 
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <strong>Location:</strong> {venue.location}
                </p>
           
            </div>
        );
    }

    return (
        <div className="bg-white p-[2rem]  shadow-md">
            <h2 className="text-xl font-semibold mb-4">Venue Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Capacity</label>
                  <input
                        type="text"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Phone Number</label>
                  <input
                        type="number"
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Website</label>
                  <input
                        type="text"
                        value={name}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Venue Type</label>
                  <input
                        type="text"
                        value={name}
                        onChange={(e) => setVenue_type(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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

export default VenueInfoForm;