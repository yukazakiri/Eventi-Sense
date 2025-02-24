import React, { useState, ChangeEvent, useEffect } from 'react';
import supabase from '../../../api/supabaseClient';
import { LuPencil } from 'react-icons/lu';

interface SupplierService {
  id?: string; // Optional, as it might be auto-generated
  supplier_id: string;
  service_name: string;
  description: string;
  price: number | null;

}

interface SupplierServiceFormProps {
  supplier_id: string; // Receive supplier_id as a prop
    isEditing: boolean;
    setIsEditingServices: (value: boolean) => void;
}

function SupplierServiceForm({ supplier_id, isEditing, setIsEditingServices }: SupplierServiceFormProps) {
    const [service, setService] = useState<SupplierService>({
        supplier_id: supplier_id,
        service_name: '',
        description: '',
        price: null,
      });
  const [services, setServices] = useState<SupplierService[]>([]); // Store all services
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<SupplierService | null>(null); // Track service being edited

  // Fetch existing services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('suppliers_services')
          .select('*')
          .eq('supplier_id', supplier_id);

        if (error) {
          throw error;
        }

        setServices(data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to fetch services.');
      } finally{
        setLoading(false);
      }
    };

    fetchServices();
  }, [supplier_id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: name === 'price' ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!supplier_id) {
      setError("Supplier ID is not available. Please try again.");
      return;
    }

    try {
      if (editingService) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('suppliers_services')
          .update({
            service_name: service.service_name,
            description: service.description,
            price: service.price,
          })
          .eq('id', editingService.id);

        if (updateError) {
          throw updateError;
        }

        setServices((prevServices) =>
          prevServices.map((s) =>
            s.id === editingService.id ? { ...s, ...service } : s
          )
        );
        setSuccessMessage('Service updated successfully!');
      } else {
        // Add new service
        const { data, error: insertError } = await supabase
          .from('suppliers_services')
          .insert([{
            supplier_id: supplier_id,
            service_name: service.service_name,
            description: service.description,
            price: service.price,
          }])
          .select();

        if (insertError) {
          throw insertError;
        }

        setServices((prevServices) => [...prevServices, ...data]);
        setSuccessMessage('Service added successfully!');
      }

      // Reset form
      setService({
        supplier_id: supplier_id,
        service_name: '',
        description: '',
        price: null,
      });
      setEditingService(null);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleEdit = (service: SupplierService) => {
    setService(service);
    setEditingService(service);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suppliers_services')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setServices((prevServices) => prevServices.filter((s) => s.id !== id));
      setSuccessMessage('Service deleted successfully!');
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service.');
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`bg-white   border-[1px] border-gray-300 rounded-3xl ${isEditing ? 'border-2 rounded-3xl border-indigo-400' : ''}`}>
            <div className='flex justify-between p-4 md:px-6 border-b-[1px] border-gray-300'>
                        <h1 className="text-xl md:mt-2 font-bold font-bonanova text-gray-700  justify-center">Services</h1>
                        <div>
                              {!isEditing &&  (
                            <>
                                <button
                                    onClick={() => setIsEditingServices(true)}
                                     className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center">
                                     <LuPencil className="mr-2" />
                                    Edit
                                </button>
                           
                            </>
                        )}
                        {isEditing  && (
                            <button
                                onClick={() => {
                                    setIsEditingServices(false);
                                  
                                }}
                                className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                            >
                                Cancel
                            </button>
                        )}</div>
                           </div>
    <section className='grid md:grid-cols-2 gap-4 p-8'>
      <form onSubmit={handleSubmit} className={`bg-white p-[2rem]   border-[1px] border-gray-300 rounded-3xl ${isEditing ? 'border-2 rounded-3xl border-indigo-400' : ''}`}>
        <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 mb-4 font-sofia  ">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        
        <div className="mb-4">
          <label htmlFor="service_name" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">
            Service Name
          </label>
          <input
            type="text"
            name="service_name"
            id="service_name"
            value={service.service_name}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           
            required
          />
        </div>
      
        <div className="mb-4">
          <label htmlFor="price" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">
            Starting Price
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={service.price || ''}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={service.description}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           
          />
        </div>
        {isEditing && (
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        )}
      </form>

      <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 lg:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">{s.service_name}</h3>
            <p className="text-gray-600">{s.description}</p>
            <p className="text-blue-500 font-medium">${s.price}</p>
            {isEditing && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(s)}
                    className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center">
                   <LuPencil className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id!)}
                  className="text-sm text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}

export default SupplierServiceForm;