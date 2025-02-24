import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react'
import Calendar from '../Supplier/SupplierDetails/AvailabilityGallery/AddSupplierAvailabilityForm';
import supabase from '../../api/supabaseClient';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';



const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Calendar', href: '' }
];
function CalendarPage() {

   
    const [supplier, setSupplier] = useState<any>(null);
    const user = useUser();
    useEffect(() => {
        const fetchSupplier = async () => {
            if (!user) {
                return;
            }    
            try {
                const { data: supplierData, error: supplierError } = await supabase
                    .from('supplier')
                    .select('*')
                    .eq('company_id', user.id)
                    .single();
                if (supplierError) {
                    console.error("Error fetching supplier:", supplierError);
                } else if (supplierData) {
                    setSupplier(supplierData);
                } else {
                    console.error("Supplier not found for this user/company.");
                }
            } catch (err) {
                console.error('Error in fetchSupplier:', err);
            }
        };
        fetchSupplier();
    }, [user]);

  return (
    <div>
        <div className='flex justify-between mx-6'>
        <h1 className="text-3xl font-bold flex items-center font-bonanova text-gray-700">Calendar</h1>
        <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
        <div className='md:mb-10 md:mx-10'>
           <Calendar supplierId={supplier?.id?.toString() || ''} />
        </div>
    </div>
  )
}

export default CalendarPage