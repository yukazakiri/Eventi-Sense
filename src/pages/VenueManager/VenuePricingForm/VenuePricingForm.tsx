import { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient';
import { Venue, VenueService } from '../../../types/venue';
import { Modal } from '../../../assets/modal/modal';
import { successMessages, errorMessages } from '../../../assets/modal/message';

interface VenuePricingFormProps {
  venueId: string;
  onSave?: () => void;
}

const VenuePricingForm = ({ venueId, onSave }: VenuePricingFormProps) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [services, setServices] = useState<VenueService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [hourlyPrice, setHourlyPrice] = useState<number>(0);
  const [dailyPrice, setDailyPrice] = useState<number>(0);
  const [minimumHours, setMinimumHours] = useState<number>(1);
  const [downpaymentPercentage, setDownpaymentPercentage] = useState<number>(30);
  const [weekendSurcharge, setWeekendSurcharge] = useState<number>(0);
  const [holidaySurcharge, setHolidaySurcharge] = useState<number>(0);
  
  // New service form
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState<VenueService>({
    name: '',
    description: '',
    price: 0,
    is_required: false
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning' | 'confirmation'>('info');
  const [modalMessageKey, setModalMessageKey] = useState<keyof typeof successMessages | keyof typeof errorMessages | undefined>(undefined);
  
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        // Fetch venue details
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', venueId)
          .single();
          
        if (venueError) throw venueError;
        setVenue(venueData);
        
        // Set form values from venue data
        if (venueData) {
          // Try to use the new columns first, with fallback to legacy format
          if (venueData.hourly_price !== undefined && venueData.hourly_price !== null) {
            setHourlyPrice(venueData.hourly_price);
          } else if (venueData.base_price && venueData.price_unit === 'hour') {
            setHourlyPrice(venueData.base_price);
          }
          
          if (venueData.daily_price !== undefined && venueData.daily_price !== null) {
            setDailyPrice(venueData.daily_price);
          } else if (venueData.base_price && venueData.price_unit === 'day') {
            setDailyPrice(venueData.base_price);
          }
          
          setMinimumHours(venueData.minimum_hours || 1);
          setDownpaymentPercentage(venueData.downpayment_percentage || 30);
          setWeekendSurcharge(venueData.weekend_surcharge_percentage || 0);
          setHolidaySurcharge(venueData.holiday_surcharge_percentage || 0);
        }
        
        // Fetch venue services
        const { data: servicesData, error: servicesError } = await supabase
          .from('venue_services')
          .select('*')
          .eq('venue_id', venueId);
          
        if (servicesError) throw servicesError;
        setServices(servicesData || []);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenueDetails();
  }, [venueId]);
  
  const handleSavePricing = async () => {
    setSaving(true);
    try {
      // Calculate which price unit to use for legacy compatibility
      // If both prices are set, we'll default to hourly for the legacy fields
      let legacyPriceUnit: 'hour' | 'day' = 'hour';
      let legacyBasePrice = hourlyPrice;
      
      if (hourlyPrice > 0 && dailyPrice === 0) {
        legacyPriceUnit = 'hour';
        legacyBasePrice = hourlyPrice;
      } else if (dailyPrice > 0 && hourlyPrice === 0) {
        legacyPriceUnit = 'day';
        legacyBasePrice = dailyPrice;
      } else if (hourlyPrice > 0 && dailyPrice > 0) {
        // Both are set, default to hourly for legacy fields
        legacyPriceUnit = 'hour';
        legacyBasePrice = hourlyPrice;
      }
      
      const { error } = await supabase
        .from('venues')
        .update({
          // New fields
          hourly_price: hourlyPrice,
          daily_price: dailyPrice,
          
          // Legacy fields (for backward compatibility)
          base_price: legacyBasePrice,
          price_unit: legacyPriceUnit,
          
          minimum_hours: minimumHours,
          downpayment_percentage: downpaymentPercentage,
          weekend_surcharge_percentage: weekendSurcharge,
          holiday_surcharge_percentage: holidaySurcharge,
          updated_at: new Date().toISOString()
        })
        .eq('id', venueId);
        
      if (error) throw error;
      
      showSuccessModal('pricingUpdated');
      if (onSave) onSave();
      
    } catch (err: any) {
      console.error("Error saving pricing:", err);
      showErrorModal('savingError');
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddService = async () => {
    if (!newService.name || newService.price <= 0) {
      showErrorModal('invalidInput');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('venue_services')
        .insert([
          {
            venue_id: venueId,
            name: newService.name,
            description: newService.description,
            price: newService.price,
            is_required: newService.is_required
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Add new service to the list
      if (data && data.length > 0) {
        setServices([...services, data[0]]);
      }
      
      // Reset form
      setNewService({
        name: '',
        description: '',
        price: 0,
        is_required: false
      });
      
      setShowServiceForm(false);
      showSuccessModal('serviceAdded');
      
    } catch (err: any) {
      console.error("Error adding service:", err);
      showErrorModal('savingError');
    }
  };
  
  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('venue_services')
        .delete()
        .eq('id', serviceId);
        
      if (error) throw error;
      
      // Remove service from list
      setServices(services.filter(service => service.id !== serviceId));
      showSuccessModal('serviceDeleted');
      
    } catch (err: any) {
      console.error("Error deleting service:", err);
      showErrorModal('deletingError');
    }
  };
  
  const showSuccessModal = (messageKey: keyof typeof successMessages) => {
    setIsModalOpen(true);
    setModalTitle('Success');
    setModalType('success');
    setModalMessageKey(messageKey);
  };
  
  const showErrorModal = (messageKey: keyof typeof errorMessages) => {
    setIsModalOpen(true);
    setModalTitle('Error');
    setModalType('error');
    setModalMessageKey(messageKey);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  if (loading) return <p className="p-4 text-gray-600 dark:text-white">Loading pricing details...</p>;
  if (error) return <p className="p-4 text-red-500 dark:text-red-400">Error: {error}</p>;
  
  return (
    <div className="bg-white p-8 mb-8 border border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 dark:text-white">
        Pricing Settings for <span className="gradient-text">{venue?.name}</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Base Price Section */}
        <div className="bg-gray-50 p-6 rounded-xl dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Base Pricing</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Hourly Rate
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                ₱
              </span>
              <input
                type="number"
                value={hourlyPrice}
                onChange={(e) => setHourlyPrice(Number(e.target.value))}
                className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                step="100"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
              Set to 0 if no hourly rate is offered
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Daily Rate
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                ₱
              </span>
              <input
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                step="100"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
              Set to 0 if no daily rate is offered
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Minimum Hours (for hourly bookings)
            </label>
            <input
              type="number"
              value={minimumHours}
              onChange={(e) => setMinimumHours(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="1"
              max="24"
            />
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg mt-2 dark:bg-blue-900">
            <p className="text-sm text-blue-700 dark:text-blue-200">
              <strong>Note:</strong> You can offer both hourly and daily rates. Customers will be able to choose their preferred option when booking.
            </p>
          </div>
        </div>
        
        {/* Payment Settings Section */}
        <div className="bg-gray-50 p-6 rounded-xl dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Payment Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Downpayment Percentage
            </label>
            <div className="flex">
              <input
                type="number"
                value={downpaymentPercentage}
                onChange={(e) => setDownpaymentPercentage(Number(e.target.value))}
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                max="100"
              />
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                %
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
              Percentage of total booking price required as downpayment
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Weekend Surcharge
            </label>
            <div className="flex">
              <input
                type="number"
                value={weekendSurcharge}
                onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                max="100"
              />
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                %
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Holiday Surcharge
            </label>
            <div className="flex">
              <input
                type="number"
                value={holidaySurcharge}
                onChange={(e) => setHolidaySurcharge(Number(e.target.value))}
                className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
                max="100"
              />
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                %
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Services Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Additional Services</h3>
          <button
            type="button"
            onClick={() => setShowServiceForm(!showServiceForm)}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            {showServiceForm ? 'Cancel' : 'Add Service'}
          </button>
        </div>
        
        {showServiceForm && (
          <div className="bg-gray-50 p-6 rounded-xl mb-4 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Catering, Sound System"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Price
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    ₱
                  </span>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                    className="flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={2}
                placeholder="Brief description of the service"
              />
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isRequired"
                checked={newService.is_required}
                onChange={(e) => setNewService({...newService, is_required: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isRequired" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Required Service (automatically added to all bookings)
              </label>
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={handleAddService}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Service
              </button>
            </div>
          </div>
        )}
        
        {services.length > 0 ? (
          <div className="bg-white shadow overflow-hidden border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Required
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {service.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ₱{service.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {service.is_required ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteService(service.id!)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No additional services added yet.</p>
        )}
      </div>
      
      {/* Save Button */}
      <div className="text-right">
        <button
          type="button"
          onClick={handleSavePricing}
          disabled={saving}
          className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Pricing Settings'}
        </button>
      </div>
      
      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        type={modalType}
        messageKey={modalMessageKey}
        onConfirm={closeModal}
      />
    </div>
  );
};

export default VenuePricingForm;