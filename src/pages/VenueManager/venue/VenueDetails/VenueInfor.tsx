import React, { useState, useEffect } from 'react';
import supabase from '../../../../api/supabaseClient';
import { Venue } from '../../../../types/venue';

interface VenueInfoFormProps {
    venue: Venue;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const VenueInfoForm: React.FC<VenueInfoFormProps> = ({ venue, isEditing, setIsEditing }) => {
    const [formData, setFormData] = useState<Venue>(venue);
    const [venueTypes, setVenueTypes] = useState<any[]>([]);
    const [accessibilities, setAccessibilities] = useState<any[]>([]);
    const [pricingModels, setPricingModels] = useState<any[]>([]);
    const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
    const [selectedAccessibilities, setSelectedAccessibilities] = useState<string[]>([]);
    const [selectedPricingModels, setSelectedPricingModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
    
                const [venueTypesPromise, accessibilitiesPromise, pricingModelsPromise] = [
                    supabase.from('venue_types').select('*'),
                    supabase.from('venue_accessibilities').select('*'),
                    supabase.from('venue_pricing_models').select('*'),
                ];
    
                const results = await Promise.all([venueTypesPromise, accessibilitiesPromise, pricingModelsPromise]);
    
                const [
                    { data: venueTypesData, error: venueTypesError },
                    { data: accessibilitiesData, error: accessibilitiesError },
                    { data: pricingModelsData, error: pricingModelsError },
                ] = results;
    
                if (venueTypesError) {
                    console.error("Error fetching venue types:", venueTypesError);
                    setError("Error fetching venue types.");
                } else {
                    setVenueTypes(venueTypesData || []);
                }
    
                if (accessibilitiesError) {
                    console.error("Error fetching accessibilities:", accessibilitiesError);
                    setError("Error fetching accessibilities.");
                } else {
                    setAccessibilities(accessibilitiesData || []);
                }
    
                if (pricingModelsError) {
                    console.error("Error fetching pricing models:", pricingModelsError);
                    setError("Error fetching pricing models.");
                } else {
                    setPricingModels(pricingModelsData || []);
                }
    
                if (venue && venue.id) {
                    const { data: venueData, error: venueError } = await supabase
                        .from('venues')
                        .select('id') // Only select the ID from the venues table
                        .eq('id', venue.id)
                        .single();
    
                    if (venueError) {
                        console.error("Error fetching venue details:", venueError);
                        setError("Error fetching venue details."); // Set an error message
                    } else if (venueData) {
                        const fetchJoinTableData = async (tableName: string, foreignKeyColumn: string) => {
                            const { data, error } = await supabase
                                .from(tableName)
                                .select(foreignKeyColumn)
                                .eq('venue_id', venueData.id);
    
                            if (error) {
                                console.error(`Error fetching ${tableName}:`, error);
                                setError(`Error fetching ${tableName}.`); // Set an error message
                                return []; // Return an empty array in case of an error
                            }
                            return data ? data.map((item:any) => item[foreignKeyColumn]) : [];
                        };
    
                        const venueTypes = await fetchJoinTableData('venues_venue_types', 'venue_type_id');
                        const accessibilities = await fetchJoinTableData('venues_venue_accessibilities', 'venue_accessibility_id');
                        const pricingModels = await fetchJoinTableData('venues_venue_pricing_models', 'venue_pricing_model_id');
    
                        setSelectedVenueTypes(venueTypes);
                        setSelectedAccessibilities(accessibilities);
                        setSelectedPricingModels(pricingModels);
                    }
                }
    
            } catch (err) {
                console.error("Error fetching options:", err);
                setError("An error occurred while fetching options."); // Set a general error message
            } finally {
                setLoading(false);
            }
        };
    
        fetchOptions();
    }, [venue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let checked: boolean | undefined;
    
        if (e.target instanceof HTMLInputElement) {
            checked = e.target.checked;
        }
    
        if (name === 'venue_type') {
            const updatedVenueTypes = checked === true
              ? [...selectedVenueTypes, value]
              : selectedVenueTypes.filter((type) => type!== value);
            setSelectedVenueTypes(updatedVenueTypes);
        } else if (name === 'accessibility') {
            const updatedAccessibilities = checked === true
              ? [...selectedAccessibilities, value]
              : selectedAccessibilities.filter((access) => access!== value);
            setSelectedAccessibilities(updatedAccessibilities);
        } else if (name === 'pricing_model') {
            const updatedPricingModels = checked === true
              ? [...selectedPricingModels, value]
              : selectedPricingModels.filter((model) => model!== value);
            setSelectedPricingModels(updatedPricingModels);
        } else if (type === 'checkbox') { // Handles other checkbox fields in venues table
            if (checked !== undefined) {
                setFormData({...formData, [name]: checked });
            }
        } else { // Handles text, number, and other input types in venues table
            setFormData({...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            if (!venue || !venue.id) {
                console.error("Venue object or ID is missing.");
                setError("Venue information is missing. Cannot update.");
                return;
            }
    
            // Update other venue data (if any) in the 'venues' table *before* updating join tables.
            const { error: venueUpdateError } = await supabase
                .from('venues')
                .update(formData) // Assuming formData contains other venue fields (name, address, etc.)
                .eq('id', venue.id);
    
            if (venueUpdateError) {
                throw venueUpdateError; // Re-throw to be caught in the main try/catch
            }
    
    
            const updateJoinTable = async (tableName: string, venueId: string, selectedIds: string[], foreignKeyColumn: string) => {
                const { data: existingIdsData, error: existingIdsError } = await supabase
                    .from(tableName)
                    .select(foreignKeyColumn)
                    .eq('venue_id', venueId);
    
                if (existingIdsError) {
                    throw existingIdsError;
                }
    
                const existingIds = existingIdsData?.map((item:any) => item[foreignKeyColumn]) || [];
    
                const idsToAdd = selectedIds.filter(id => !existingIds.includes(id));
                const idsToRemove = existingIds.filter(id => !selectedIds.includes(id));
    
                if (idsToAdd.length > 0) {
                    const newEntries = idsToAdd.map(id => ({
                        venue_id: venueId,
                        [foreignKeyColumn]: id,
                    }));
                    const { error: insertError } = await supabase.from(tableName).insert(newEntries);
                    if (insertError) throw insertError;
                }
    
                if (idsToRemove.length > 0) {
                    const { error: deleteError } = await supabase
                        .from(tableName)
                        .delete()
                        .in(foreignKeyColumn, idsToRemove)
                        .eq('venue_id', venueId);
                    if (deleteError) throw deleteError;
                }
            };
    
            // Now update the join tables
            await updateJoinTable('venues_venue_types', venue.id.toString(), selectedVenueTypes, 'venue_type_id');
            await updateJoinTable('venues_venue_accessibilities', venue.id.toString(), selectedAccessibilities, 'venue_accessibility_id');
            await updateJoinTable('venues_venue_pricing_models', venue.id.toString(), selectedPricingModels, 'venue_pricing_model_id');
    
            alert("Venue and related information updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating venue:", error);
            setError("An error occurred while updating the venue.");  // Set the error state
        }
    };

    if (loading) {
        return <div>Loading options...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    return ( 
        <div className={`bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${
            isEditing ? 'border-2 rounded-3xl border-indigo-400 dark:border-indigo-500' : ''
        }`}>
            <div className="flex justify-between mb-4">
                <h1 className="text-3xl font-bold font-bonanova text-gray-700 dark:text-gray-200">Venue Information</h1>
                <div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={`bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${
                    isEditing ? 'border-2 rounded-3xl border-indigo-400 dark:border-indigo-500' : ''
                }`}>
                    <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-2'>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Venue Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}   
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                                placeholder="Example: The Grand Ballroom"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="capacity" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Capacity:</label>
                            <input
                                type="text"
                                id="capacity"
                                name="capacity"
                                value={formData.capacity || ''}
                                onChange={handleChange}
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                        
                                placeholder="Example: 500-600 people, depending on the event"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Email:</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Price:</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price || ''}
                                onChange={handleChange}                   
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Example: Ranging from PHP5000-PHP10000"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone_number" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Phone Number:</label>
                            <input
                                type="text"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number || ''}
                                onChange={handleChange}                   
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                       
                                placeholder="Example: 123-456-7890"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="website" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Website:</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                value={formData.website || ''}
                                onChange={handleChange}                    
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Example: https://example.com" 
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-4 col-span-3">
                            <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-800  dark:text-white">Description:</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}                    
                                className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                disabled={!isEditing}
                            />
                        </div>
                        
                    </div>
                    <div className={`bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${
                        isEditing ? 'border-2 rounded-3xl border-indigo-400 dark:border-indigo-500' : ''
                    }`}>
                        <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Venue Type:</label>
                        <div className="grid lg:grid-cols-4">
                            {venueTypes.map((type) => (
                                <label key={type.id} className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="venue_type"
                                        value={type.id.toString()}
                                        checked={selectedVenueTypes.includes(type.id.toString())}
                                        onChange={handleChange}
                                        className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400"
                                        disabled={!isEditing}
                                    />
                                    <span>{type.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    </div>  
            <section className='grid grid-cols-2 gap-4 mb-4'>
            <div className={`bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${
                isEditing ? 'border-2 rounded-3xl border-indigo-400 dark:border-indigo-500' : ''
            }`}>

                    <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Accessibility:</label>
                    <div className="grid md:grid-cols-2 gap-2">
                    {accessibilities.map((access) => (
                        <label key={access.id} className="inline-flex items-center mr-4 text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                name="accessibility"
                                value={access.id.toString()}
                                checked={selectedAccessibilities.includes(access.id.toString())}
                                onChange={handleChange}
                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400"
                                disabled={!isEditing}
                            />
                            <span>{access.name}</span>
                        </label>
                    ))}
                </div>
                </div>
        
                <div className={`bg-white dark:bg-gray-900 p-[2rem] border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl ${
                    isEditing ? 'border-2 rounded-3xl border-indigo-400 dark:border-indigo-500' : ''
                }`}>
                    <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">Pricing Model:</label>
                    <div className="grid md:grid-cols-2 gap-2">
                    {pricingModels.map((model) => (
                        <label key={model.id} className="inline-flex items-center mr-4 text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                name="pricing_model"
                                value={model.id.toString()}
                                checked={selectedPricingModels.includes(model.id.toString())}
                                onChange={handleChange}
                                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400"
                                disabled={!isEditing}
                            />
                            <span>{model.name}</span>
                        </label>
                    ))}
                    </div>
                </div>
     </section>    
    
                {/* Add other form fields here as needed */}
        
                <input type="hidden" name="id" value={venue.id} />
                {isEditing &&
                <>
                 <button type="submit" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 px-8 rounded-full focus:outline-none focus:shadow-outline">Save</button>
                 <button
                 className="inline-flex justify-center py-2 px-4 mx-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                 onClick={() => setIsEditing(false)}
             >
                 Cancel
             </button>
             </>
                }

            </form>
            </div>      
        );
    };

    export default VenueInfoForm;