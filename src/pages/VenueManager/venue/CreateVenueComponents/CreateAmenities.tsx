import { VenueAmenity,Amenity } from '../../../../types/venue'; // Removed AmenityForm import

interface AmenitiesVenueFormProps {
  amenities: Amenity[];
  amenitiesLoading: boolean;
  amenitiesError: string | null;
  selectedAmenities: VenueAmenity[]; // Use VenueAmenity[] consistently
  onCheckboxChange: (amenity: Amenity) => void;
  onAmenityQuantityChange: (amenityId: string, value: number | null) => void; // Separate handlers
  onAmenityDescriptionChange: (amenityId: string, value: string | null) => void; // Separate handlers
  isEditing: boolean;
}


const CreateAmenitiesVenueForm = ({
  amenities,
  amenitiesLoading,
  amenitiesError,
  selectedAmenities,
  onCheckboxChange,
  onAmenityQuantityChange, // Use separate handlers
  onAmenityDescriptionChange, // Use separate handlers
  isEditing
}: AmenitiesVenueFormProps) => (
  <section className={`shadow-lg bg-white p-[2rem] col-span-2 ${isEditing ? 'border-indigo-400 border-2 rounded-lg' : ''}`}>
    <label htmlFor="amenities-section" className="block mb-2 text-md font-medium text-gray-800">Amenities:</label> {/* Added htmlFor */}
    {amenitiesLoading ? (
      <div>Loading amenities...</div>
    ) : amenitiesError ? (
      <div>Error: {amenitiesError}</div>
    ) : amenities.length > 0 ? (
      amenities.map((amenity) => {
        const isSelected = selectedAmenities.some(a => a.amenity_id === amenity.id); // Simplified check

        const venueAmenity = selectedAmenities.find(a => a.amenity_id === amenity.id); // Get the selected amenity if it exists

        return (
          <div key={amenity.id} className="mb-3 p-2 border rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`amenity-${amenity.id}`} // Add ID for label connection
                checked={isSelected}
                onChange={() => onCheckboxChange(amenity)}
                disabled={!isEditing} // Disable when not editing
              />
              <label htmlFor={`amenity-${amenity.id}`} className="ml-2">{amenity.name}</label> {/* Label for checkbox */}
            </div>
            {isSelected && isEditing && ( // Only show inputs when selected AND editing
              <div className="mt-2">
                <label htmlFor={`quantity-${amenity.id}`} className="block mb-1 text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  id={`quantity-${amenity.id}`} // Add ID
                  value={venueAmenity?.quantity ?? ''} // Use optional chaining and nullish coalescing
                  onChange={e => onAmenityQuantityChange(amenity.id, e.target.value === '' ? null : Number(e.target.value))} // Correct conversion
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!isEditing} // Disable when not editing
                />
              </div>
            )}
            {isSelected && isEditing && ( // Only show inputs when selected AND editing
              <div className="mt-2">
                <label htmlFor={`description-${amenity.id}`} className="block mb-1 text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  id={`description-${amenity.id}`} // Add ID
                  value={venueAmenity?.description ?? ''} // Use optional chaining and nullish coalescing
                  onChange={e => onAmenityDescriptionChange(amenity.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!isEditing} // Disable when not editing
                />
              </div>
            )}
          </div>
        );
      })
    ) : (
      <div>No amenities found.</div>
    )}
  </section>
);

export default CreateAmenitiesVenueForm;
