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
        <div className="bg-white p-8 shadow-xl">
            {isEditing ? (
                <div>
                    {amenities.map((amenity) => {
                        const existingAmenity = localSelectedAmenities.find((item) => item.amenity_id === amenity.id);
                        const isChecked = !!existingAmenity;
                        const initialQuantity = existingAmenity?.quantity || null;
                        const initialDescription = existingAmenity?.description || '';

                        return (
                            <div key={amenity.id} style={{ marginBottom: '10px' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) =>
                                            handleAmenityChange(amenity, e.target.checked, initialQuantity, initialDescription)
                                        }
                                    />
                                    {amenity.name}
                                </label>
                                {isChecked && (
                                    <div className='flex '>
                                        <input
                                            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            type="number"
                                            placeholder="Quantity"
                                            defaultValue={initialQuantity || ''}
                                            onChange={(e) => {
                                                const quantity = e.target.value ? parseInt(e.target.value, 10) : null;
                                                handleAmenityChange(amenity, isChecked, quantity, initialDescription);
                                            }}
                                        />
                                        <input
                                            className="bg-white border mx-2 border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            
                    <button
                        className="inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-full  text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                    <button
                        className="inline-flex justify-center py-2 px-8 mx-4 border border-transparent shadow-sm text-sm font-medium rrounded-full  text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
              
                </div>
            ) : (
                <div>
                    <ul>
                        {localSelectedAmenities.length === 0 ? (
                            <p>No amenities listed yet.</p>
                        ) : (
                            localSelectedAmenities.map((venueAmenity) => {
                                const amenity = amenities.find((a) => a.id === venueAmenity.amenity_id);
                                return amenity ? (
                                    <li key={amenity.id}>
                                        <strong className="text-gray-700">{amenity.name}:</strong> (x{venueAmenity.quantity || 1}) - {venueAmenity.description}
                                    </li>
                                ) : null;
                            })
                        )}
                    </ul>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 my-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AmenitiesForm;