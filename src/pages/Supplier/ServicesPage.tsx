import React, { useState, ChangeEvent, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import supabase from '../../api/supabaseClient'; // Adjust the path
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { LuPencil } from 'react-icons/lu';


const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Services', href: '' }
];
interface SupplierService {
  id?: string; // Optional, as it might be auto-generated
  supplier_id: string;
  service_name: string;
  description: string;
  price: number | null;
}

function SupplierServiceForm() {
  const user = useUser(); // Get the authenticated user
  const [_supplier, setSupplier] = useState<any>(null); // Store the supplier data
  const [service, setService] = useState<SupplierService>({
    supplier_id: '', // Will be populated with the supplier's ID
    service_name: '',
    description: '',
    price: null,
  });
  const [services, setServices] = useState<SupplierService[]>([]); // Store all services
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<SupplierService | null>(null); // Track service being edited
  const [isEditing, setIsEditing] = useState(false); // Track if the form is in edit mode

  // Fetch the supplier and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch the supplier associated with the logged-in user
        const { data: supplierData, error: supplierError } = await supabase
          .from('supplier')
          .select('*')
          .eq('company_id', user.id)
          .single();

        if (supplierError) {
          throw supplierError;
        }

        if (supplierData) {
          setSupplier(supplierData);
          setService((prev) => ({ ...prev, supplier_id: supplierData.id }));

          // Fetch services for the supplier
          const { data: servicesData, error: servicesError } = await supabase
            .from('suppliers_services')
            .select('*')
            .eq('supplier_id', supplierData.id);

          if (servicesError) {
            throw servicesError;
          }

          setServices(servicesData || []);
        } else {
          setError('Supplier not found for this user.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

    if (!service.supplier_id) {
      setError('Supplier ID is not available. Please try again.');
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
            supplier_id: service.supplier_id,
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
        supplier_id: service.supplier_id,
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
    setIsEditing(true);
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
  <>
    <div className='flex justify-between mx-6'>
        <h1 className="text-3xl font-bold flex items-center font-bonanova text-gray-700">Services</h1>
        <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
    <div className={`bg-white p-[2rem] border-[1px] mb-8 mx-10 border-gray-300 rounded-3xl ${isEditing ? 'border-2 rounded-3xl border-indigo-400' : ''}`}>
      <div className="flex justify-end mb-4">
      
        <div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center">
                                            <LuPencil className="mr-2" />
              Edit
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingService(null);
                setService({
                  supplier_id: service.supplier_id,
                  service_name: '',
                  description: '',
                  price: null,
                });
              }}
              className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    
        <form onSubmit={handleSubmit} className={`bg-white p-[2rem] border-[1px] border-gray-300 rounded-3xl font-sofia ${isEditing ? 'border-2 rounded-3xl border-indigo-400' : ''}`}>
          <h2 className="text-xl tracking-wide mb-4">
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
              disabled={!isEditing}
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
              disabled={!isEditing}
              className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              disabled={!isEditing}
              className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          {isEditing && (
            <div>
              <button
                type="submit"
                className="w-auto flex justify-center py-2 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          )}
        </form>

        <div className=" my-8">
        <h1 className="text-xl font-bold font-bonanova text-gray-700 p-4">List of Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sofia ">
            <div className='transition duration-300 ease-in-out hover:scale-105'>
          {services.map((s) => (
            <div key={s.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-lg  font-medium tracking-wide">{s.service_name}</h3>
              <p className="text-gray-600">{s.description}</p>
              <p className="text-indigo-600 font-medium">${s.price}</p>
              {isEditing && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
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
          </div>
        </div>
 
    </div>
  </>
  );
}

export default SupplierServiceForm;