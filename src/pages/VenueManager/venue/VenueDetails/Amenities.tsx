import React, { useState, useEffect } from 'react';
import { Amenity, VenueAmenity, Venue } from '../../../../types/venue';

interface AmenitiesFormProps {
    venue: Venue;
    amenities: Amenity[];
    selectedAmenities: VenueAmenity[];
    onSave: (venue: Venue, venueAmenities: VenueAmenity[]) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

const AmenitiesForm: React.FC<AmenitiesFormProps> = ({
    venue,
    amenities,
    selectedAmenities,
    onSave,
    isEditing,
    setIsEditing,
}) => {
    const [localSelectedAmenities, setLocalSelectedAmenities] = useState<VenueAmenity[]>(selectedAmenities);

    useEffect(() => {
        setLocalSelectedAmenities(selectedAmenities);
    }, [selectedAmenities]);

    const handleAmenityChange = (amenity: Amenity, isChecked: boolean, quantity: number | null, description: string | null) => {
        const updatedAmenity: VenueAmenity = {
            venue_id: venue.id,
            amenity_id: amenity.id,
            quantity: quantity,
            description: description,
        };

        const newSelected = isChecked
            ? [...localSelectedAmenities.filter((item) => item.amenity_id !== amenity.id), updatedAmenity]
            : localSelectedAmenities.filter((item) => item.amenity_id !== amenity.id);

        setLocalSelectedAmenities(newSelected);
    };

    const handleSubmit = () => {
        onSave(venue, localSelectedAmenities);
        setIsEditing(false);
    };

    return (
        <div className={`bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${
            isEditing ? 'border-2 rounded-3xl border-indigo-400 dark:border-indigo-500' : ''
        }`}>
            <div className='flex justify-between mb-4'>
                <h1 className="text-3xl font-bold font-bonanova text-gray-700 dark:text-gray-200">Amenities</h1>
                <div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center"
                        >
                            Edit
                        </button>
                    )}
                    {isEditing && (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div>
                    {amenities.map((amenity) => {
                        const existingAmenity = localSelectedAmenities.find((item) => item.amenity_id === amenity.id);
                        const isChecked = !!existingAmenity;
                        const initialQuantity = existingAmenity?.quantity || null;
                        const initialDescription = existingAmenity?.description || '';

                        return (
                            <div key={amenity.id} className="mb-4">
                                <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) =>
                                            handleAmenityChange(amenity, e.target.checked, initialQuantity, initialDescription)
                                        }
                                        className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400"
                                    />
                                    <span>{amenity.name}</span>
                                </label>
                                {isChecked && (
                                    <div className='flex'>
                                        <input
                                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                                            type="number"
                                            placeholder="Quantity"
                                            defaultValue={initialQuantity || ''}
                                            onChange={(e) => {
                                                const quantity = e.target.value ? parseInt(e.target.value, 10) : null;
                                                handleAmenityChange(amenity, isChecked, quantity, initialDescription);
                                            }}
                                        />
                                        <input
                                            className="bg-white dark:bg-gray-800 border mx-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
                                            type="text"
                                            placeholder="Description"
                                            defaultValue={initialDescription}
                                            onChange={(e) => {
                                                const description = e.target.value || null;
                                                handleAmenityChange(amenity, isChecked, initialQuantity, description);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex space-x-4">
                        <button
                            className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={handleSubmit}
                        >
                            Save
                        </button>
                        <button
                            className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <ul className="space-y-2">
                        {localSelectedAmenities.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No amenities listed yet.</p>
                        ) : (
                            localSelectedAmenities.map((venueAmenity) => {
                                const amenity = amenities.find((a) => a.id === venueAmenity.amenity_id);
                                return amenity ? (
                                    <li key={amenity.id} className="text-gray-700 dark:text-gray-300">
                                        <strong>{amenity.name}:</strong> (x{venueAmenity.quantity || 1}) - {venueAmenity.description}
                                    </li>
                                ) : null;
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AmenitiesForm;