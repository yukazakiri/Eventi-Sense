import React, { useState, useEffect } from 'react';
import { Amenity, VenueAmenity, Venue } from '../../../../types/venue';
import { BsBuildingCheck } from 'react-icons/bs';
import { LuPencil } from 'react-icons/lu';

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsEditing(false);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-300 dark:border-gray-700 rounded-3xl shadow-md w-full">
                <div className="flex justify-between items-center mb-10 w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 font-bonanova flex items-center">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl mr-4">
                            <BsBuildingCheck className="text-emerald-600 dark:text-emerald-500" size={24} />
                        </div>
                        Amenities
                    </h2>
                    <div>
                        {!isEditing && (
                            <button
                                onClick={openModal}
                                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
                            >
                                <LuPencil className="mr-2" size={16} />
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-full">
                <ul className="space-y-4">
                    {localSelectedAmenities.length === 0 ? (
                    <div className="flex items-center justify-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.0a1 1 0 01-1 1h2a1 1 0 01-1-1v-3a1 1 0 011-1h2a1 1 0 011 1v2.586a1 1 0 00.293.707l1.414 1.414a1 1 0 01-.707 1.707H4.707a1 1 0 01-.707-1.707l1.414-1.414A1 1 0 005 15.586V13a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-2"
                        />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                        No amenities listed yet.
                        </p>
                    </div>
                    ) : (
                    localSelectedAmenities.map((venueAmenity) => {
                        const amenity = amenities.find((a) => a.id === venueAmenity.amenity_id);
                        return amenity ? (
                        <li
                            key={amenity.id}
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-sky-600 dark:text-sky-400 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                                </svg>
                                <strong className="text-gray-800 dark:text-gray-200 font-semibold">
                                {amenity.name}
                                </strong>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                (x{venueAmenity.quantity || 1})
                            </div>
                            </div>
                            {venueAmenity.description && (
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                {venueAmenity.description}
                            </p>
                            )}
                        </li>
                        ) : null;
                    })
                    )}
                </ul>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Edit Amenities</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            {amenities.map((amenity) => {
                                const existingAmenity = localSelectedAmenities.find((item) => item.amenity_id === amenity.id);
                                const isChecked = !!existingAmenity;
                                const initialQuantity = existingAmenity?.quantity || null;
                                const initialDescription = existingAmenity?.description || '';

                                return (
                                    <div key={amenity.id} className="mb-4 p-4 border rounded-md dark:border-gray-700">
                                        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) =>
                                                    handleAmenityChange(amenity, e.target.checked, initialQuantity, initialDescription)
                                                }
                                                className="rounded border-gray-300 dark:border-gray-600 text-sky-600 dark:text-sky-400"
                                            />
                                            <span>{amenity.name}</span>
                                        </label>
                                        {isChecked && (
                                            <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                                <input
                                                    className="border rounded-md p-2 w-full sm:w-1/2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                                    type="number"
                                                    placeholder="Quantity"
                                                    defaultValue={initialQuantity || ''}
                                                    onChange={(e) => {
                                                        const quantity = e.target.value ? parseInt(e.target.value, 10) : null;
                                                        handleAmenityChange(amenity, isChecked, quantity, initialDescription);
                                                    }}
                                                />
                                                <input
                                                    className="border rounded-md p-2 w-full sm:w-1/2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
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

                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-6 rounded-full transition-colors duration-300 dark:bg-gray-700 dark:text-gray-300"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AmenitiesForm;