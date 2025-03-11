import React, { useState, useEffect } from 'react';
import supabase from '../../../../api/supabaseClient';
import { Venue } from '../../../../types/venue';
import { LuSave, LuX, LuInfo, LuTriangle} from 'react-icons/lu';
import { LuAccessibility, LuBuilding, LuDollarSign, LuCheck } from 'react-icons/lu';
import { LuPencil } from 'react-icons/lu';
interface VenueInfoFormProps {
    venue: Venue;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const VenueInformation: React.FC<VenueInfoFormProps> = ({ venue, isEditing, setIsEditing }) => {
    const [formData, setFormData] = useState<Venue>(venue);
    const [venueTypes, setVenueTypes] = useState<any[]>([]);
    const [accessibilities, setAccessibilities] = useState<any[]>([]);
    const [pricingModels, setPricingModels] = useState<any[]>([]);
    const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
    const [selectedAccessibilities, setSelectedAccessibilities] = useState<string[]>([]);
    const [selectedPricingModels, setSelectedPricingModels] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsEditing(true);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsEditing(false);
        setIsModalOpen(false);
      };

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
    const formCompletionPercentage = 50;
    const hasUnsavedChanges = true;
    return ( 
        <div className="  p-6">
        <div className="flex justify-between items-center mb-8 font-sofia">
          <h1 className="text-2xl font-bold font-bonanova text-gray-800 dark:text-gray-200 flex items-center">
            <LuBuilding className="mr-2  text-sky-600" size={24} />
            Venue Information
          </h1>
          {!isEditing && (
            <button
              onClick={openModal}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-full transition-all duration-300"
            >
              <LuPencil className="mr-2" size={16} />
              Edit 
            </button>
          )}
        </div>
  
        {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 scrollbar-hide">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 scrollbar-hide">
      <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center rounded-t-2xl z-10">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {isEditing ? "Edit Venue Details" : "Venue Details"}
        </h2>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <LuX size={24} />
        </button>
      </div>

      {/* Progress indicator */}
      {isEditing && (
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-600 to-purple-600 rounded-full" style={{ width: formCompletionPercentage + '%' }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">Form completion: {formCompletionPercentage}%</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Form status message */}
        {!isEditing && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="flex items-center text-blue-800 dark:text-blue-300">
              <LuInfo className="mr-2" size={20} />
              You are currently in view mode. Click the "Edit" button at the bottom to make changes.
            </p>
          </div>
        )}

        {/* Basic Information Card */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-200 flex items-center">
            <LuBuilding className="mr-2 text-sky-600" size={20} />
            Basic Information
            {isEditing && <span className="ml-2 text-sm font-normal text-red-500">* Required</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'name', label: 'Venue Name', value: formData.name, placeholder: 'The Grand Ballroom', required: true },
              { id: 'capacity', label: 'Capacity', value: formData.capacity, placeholder: '500-600 people', required: true },
              { id: 'email', label: 'Contact Email', value: formData.email, type: 'email', placeholder: 'contact@venue.com', required: true },
              { id: 'price', label: 'Price Range', value: formData.price, placeholder: 'PHP5000-PHP10000', required: true },
              { id: 'phone_number', label: 'Phone Number', value: formData.phone_number, placeholder: '123-456-7890', required: true },
              { id: 'website', label: 'Website URL', value: formData.website, placeholder: 'https://example.com', required: false },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label} {field.required && isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type || 'text'}
                  id={field.id}
                  name={field.id}
                  value={field.value || ''}
                  onChange={handleChange}
                  className={`w-full bg-white dark:bg-gray-700 border ${
                    isEditing ? 'border-gray-300 dark:border-gray-600' : 'border-transparent bg-gray-100 dark:bg-gray-800'
                  } rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
                  placeholder={isEditing ? field.placeholder : ''}
                  disabled={!isEditing}
                  required={field.required}
                  aria-label={field.label}
                />
                {isEditing && field.id === 'name' && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This is how your venue will appear in search results</p>
                )}
                {isEditing && field.id === 'price' && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Format: PHP[min]-PHP[max]</p>
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description {isEditing && <span className="text-red-500">*</span>}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className={`w-full ${
                  isEditing ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800 border-transparent'
                } border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 h-32`}
                placeholder={isEditing ? "Describe your venue, including unique features and selling points" : ""}
                disabled={!isEditing}
                required={isEditing}
                aria-label="Venue description"
              />
              {isEditing && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  A detailed description helps customers understand what makes your venue special
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Venue Type Card */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center">
            <LuBuilding className="mr-2 text-purple-600" size={20} />
            Venue Types
            {isEditing && <span className="ml-2 text-sm font-normal text-red-500">* Select at least one</span>}
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Choose the categories that best describe your venue
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {venueTypes.map((type) => (
              <label 
                key={type.id} 
                className={`flex items-center space-x-3 p-3 ${
                  isEditing ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer' : 
                  'bg-gray-100 dark:bg-gray-800'
                } rounded-lg border ${
                  selectedVenueTypes.includes(type.id.toString()) 
                    ? 'border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/30' 
                    : 'border-gray-200 dark:border-gray-600'
                } transition-colors`}
              >
                <input
                  type="checkbox"
                  name="venue_type"
                  value={type.id.toString()}
                  checked={selectedVenueTypes.includes(type.id.toString())}
                  onChange={handleChange}
                  className="h-5 w-5 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  disabled={!isEditing}
                  aria-label={`Venue type: ${type.name}`}
                />
                <span className="text-gray-700 dark:text-gray-300">{type.name}</span>
              </label>
            ))}
          </div>
          {isEditing && selectedVenueTypes.length === 0 && (
            <p className="mt-2 text-sm text-red-500">Please select at least one venue type</p>
          )}
        </div>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Accessibility Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center">
              <LuAccessibility className="mr-2 text-green-600" size={20} />
              Accessibility Features
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Help customers with accessibility needs find your venue
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessibilities.map((access) => (
                <label 
                  key={access.id} 
                  className={`flex items-center space-x-3 p-3 ${
                    isEditing ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer' : 
                    'bg-gray-100 dark:bg-gray-800'
                  } rounded-lg border ${
                    selectedAccessibilities.includes(access.id.toString()) 
                      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30' 
                      : 'border-gray-200 dark:border-gray-600'
                  } transition-colors`}
                >
                  <input
                    type="checkbox"
                    name="accessibility"
                    value={access.id.toString()}
                    checked={selectedAccessibilities.includes(access.id.toString())}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={!isEditing}
                    aria-label={`Accessibility feature: ${access.name}`}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{access.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing Model Card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center">
              <LuDollarSign className="mr-2 text-yellow-600" size={20} />
              Pricing Models
              {isEditing && <span className="ml-2 text-sm font-normal text-red-500">* Select at least one</span>}
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Specify how you charge for your venue
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricingModels.map((model) => (
                <label 
                  key={model.id} 
                  className={`flex items-center space-x-3 p-3 ${
                    isEditing ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer' : 
                    'bg-gray-100 dark:bg-gray-800'
                  } rounded-lg border ${
                    selectedPricingModels.includes(model.id.toString()) 
                      ? 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30' 
                      : 'border-gray-200 dark:border-gray-600'
                  } transition-colors`}
                >
                  <input
                    type="checkbox"
                    name="pricing_model"
                    value={model.id.toString()}
                    checked={selectedPricingModels.includes(model.id.toString())}
                    onChange={handleChange}
                    className="h-5 w-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    disabled={!isEditing}
                    aria-label={`Pricing model: ${model.name}`}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{model.name}</span>
                </label>
              ))}
            </div>
            {isEditing && selectedPricingModels.length === 0 && (
              <p className="mt-2 text-sm text-red-500">Please select at least one pricing model</p>
            )}
          </div>
        </section>
        
        {/* Action buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white rounded-full transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <LuSave size={18} />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white rounded-full transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
       
                  Edit Venue
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Unsaved changes warning */}
        {isEditing && hasUnsavedChanges && (
          <div className="fixed bottom-6 left-6 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-start">
              <LuTriangle className="flex-shrink-0 mt-0.5 mr-3" size={20} />   
              <div>
                <p className="font-medium">You have unsaved changes</p>
                <p className="text-sm mt-1">Make sure to save your changes before closing this form.</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  </div>
)}
        {!isModalOpen && (
          <form onSubmit={handleSubmit} className="space-y-8 font-sofia">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
           <section className=''>
          {/* Basic Information Card */}
          <div className="bg-white mb-6 dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <h3 className="text-lg  mb-6 text-gray-700 dark:text-gray-200 flex items-center">

              <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-xl mr-4">
                <LuBuilding className="text-sky-600 dark:text-sky-500" size={24} />
              </div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { id: 'name', label: 'Venue Name', value: formData.name },
                { id: 'capacity', label: 'Capacity', value: formData.capacity },
                { id: 'email', label: 'Email', value: formData.email },
                { id: 'price', label: 'Price Range', value: formData.price },
                { id: 'phone_number', label: 'Phone Number', value: formData.phone_number },
                { id: 'website', label: 'Website', value: formData.website },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                    {field.label}
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{field.value || 'Not provided'}</p>
                </div>
              ))}
              <div className="lg:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <p className="text-gray-900 dark:text-gray-100">{formData.description || 'Not provided'}</p>
              </div>
            </div>
          </div>
    
         {/* Venue Type Card */}
          <div className= " bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <h3 className="text-lg  mb-6 text-gray-700 dark:text-gray-200 flex items-center">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl mr-4">
              <LuBuilding className="text-purple-600 dark:text-purple-500" size={24} />
            </div>
            Venue Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {venueTypes.map((type) => {
              if (selectedVenueTypes.includes(type.id.toString())) {
                return (
                  <div key={type.id} className="flex items-center space-x-3">
                    <LuCheck className="text-purple-600" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{type.name}</span>
                  </div>
                );
              }
              return null; // Don't render anything if not selected
            })}
          </div>
         </div>
    </section>
    <section>
         {/* Accessibility Card */}
        <div className="bg-white mb-6 dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
    <h3 className="text-lg  mb-6 text-gray-700 dark:text-gray-200 flex items-center">
      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl mr-4">
      <LuAccessibility className="text-green-600 dark:text-green-500" size={24} />
      </div>
      Accessibility Features
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {accessibilities.map((access) => {
        if (selectedAccessibilities.includes(access.id.toString())) {
          return (
            <div key={access.id} className="flex items-center space-x-3">
              <LuCheck className="text-green-600" size={20} />
              <span className="text-gray-700 dark:text-gray-300">{access.name}</span>
            </div>
          );
        }
        return null; // Don't render anything if not selected
      })}
    </div>
        </div>

        {/* Pricing Model Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-200 flex items-center">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl mr-4">
              <LuDollarSign className="text-yellow-600 dark:text-yellow-500" size={24} />
            </div>
            Pricing Models
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingModels.map((model) => {
                if (selectedPricingModels.includes(model.id.toString())) {
                return (
                    <div key={model.id} className="flex items-center space-x-3">
                    <LuCheck className="text-yellow-600" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{model.name}</span>
                    </div>
                );
                }
                return null; // Don't render anything if not selected
            })}
            </div>
        </div>
  </section>
</section>
    
          {isEditing && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-700 hover:to-purple-700 text-white rounded-full transition-all flex items-center gap-2"
                >
                  <LuSave size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default VenueInformation;