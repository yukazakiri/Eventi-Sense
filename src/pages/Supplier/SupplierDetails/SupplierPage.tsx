import React, { useEffect, useState } from 'react';
import supabase from '../../../api/supabaseClient';
import { useParams } from 'react-router-dom';
import SupplierInfoForm from './SupplierInfo';
import AddressForm from './SupplierAddress';
import ImageUploadForm from './SupplierCoverPage';
import { Supplier } from '../../../types/supplier';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/24/solid';

import { useUser } from '@supabase/auth-helpers-react';
import Gallery from './AvailabilityGallery/Gallery';
import Calendar from './AvailabilityGallery/AddSupplierAvailabilityForm'
import Services from '../Services/services'
import SocialMediaLinks from '../Social Media/SocialLinks';

const breadcrumbItems = [
    { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Supplier Informations', href: '' }
];

const SupplierDetailPage: React.FC = () => {
    const { supplierId: supplierIdFromParams = '' } = useParams<{ supplierId: string }>();
    const [_supplierId, setSupplierId] = useState<number | string | null>(null);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingImage, setIsEditingImage]= useState(false)
    const [isEditingGallery, setIsEditingGallery]= useState(false)
    const [isEditingServices, setIsEditingServices]= useState(false)
 
    const user = useUser();

    useEffect(() => {
        const parsedSupplierId = Number(supplierIdFromParams);
        setSupplierId(isNaN(parsedSupplierId) ? supplierIdFromParams : parsedSupplierId);
    }, [supplierIdFromParams]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError("User is not logged in.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const { data: supplierData, error: supplierError } = await supabase
                    .from('supplier')
                    .select('*')
                    .eq('company_id', user.id)
                    .single();

                if (supplierError) {
                    console.error("Error fetching supplier:", supplierError);
                    setError("Error fetching supplier.");
                } else if (supplierData) {
                    setSupplier(supplierData);
                } else {
                    setError("Supplier not found for this user/company.");
                }

            } catch (err) {
                console.error('Error in fetchData:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleSaveSupplier = async (updatedSupplier: Supplier) => {
        try {
            const { error } = await supabase
                .from('supplier')
                .update(updatedSupplier)
                .eq('id', supplier!.id);

            if (error) throw error;

            setSupplier(updatedSupplier);
            setIsEditingInfo(false);
            setIsEditingAddress(false);
            alert('Supplier updated successfully!');
        } catch (err: any) {
            console.error('Error updating supplier:', err);
            setError(err?.message || 'An error occurred while updating.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!supplier) {
        return <div>Supplier not found.</div>;
    }

    return (
        <div className="px-2 ">
             
        <div className=' px-[2rem] '>
         <div className='flex justify-between items-center h-full '>

            <h1 className="text-3xl font-semibold tracking-wide text-gray-700 font-bonanova ">Supplier</h1>
            {/* Buttons Section */}
            <section className=" flex justify-end items-end h-full flex-grow">
            <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            </section>
            </div>
            <div className="mx-auto font-sofia   px-2 grid lg:grid-cols-2 gap-8 mb-8">
                <div className='col-span-2'>
                    <SocialMediaLinks/>
                </div>
             
                  <div className='col-span-2'>
                         
                        <ImageUploadForm supplierId={supplier?.id?.toString() || ''} isEditing={isEditingImage} setIsEditingImage={setIsEditingImage} />
                        
                        </div>
               
                    <section >
                        <SupplierInfoForm
                            supplier={supplier}
                            isEditing={isEditingInfo}
                            setIsEditing={setIsEditingInfo}
                        />

                    </section>
                   <div className='h-full'>
                     <AddressForm
                            supplier={supplier}
                            onSave={handleSaveSupplier}
                            isEditing={isEditingAddress}
                            setIsEditing={setIsEditingAddress}
                        /> </div>
                    <div className='col-span-2 '>
                        <Services supplier_id={supplier?.id?.toString() || ''} isEditing={isEditingServices} setIsEditingServices={setIsEditingServices} />
                    </div>
                        <div className='col-span-2 h-auto'>
                      <Gallery supplierId={supplier?.id?.toString() || ''} isEditing={isEditingGallery} setIsEditingGallery={setIsEditingGallery} />
                     </div>
                     <div className='col-span-2 h-auto'>
                        <Calendar supplierId={supplier?.id?.toString() || ''} />
                     </div>
                     
                
            </div>
       
            </div>

        </div>
    );
};

export default SupplierDetailPage;