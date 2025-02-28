import Profile from './Profile';
import Company from './Company';
import CreateCompany from './CreateCompany';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';

interface CompanyProfile {
    id: string;
    company_name: string;
    company_description?: string;
    company_address: string;
    company_email: string;
    company_phone: string;
    company_website?: string | null;
    company_logo_url?: string | null;
}

const breadcrumbItems = [
    { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Venues', href: '/Venue-Manager-Dashboard/Venue-List' },
    { label: 'Venue Details', href: '' },
];

function Profiles() {
    const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<{ company: string | null }>({ company: null });
    const [userId, setUserId] = useState<string | null>(null);
    
        useEffect(() => {
            let isMounted = true;
            const controller = new AbortController(); // Create an AbortController
        
            const fetchCompanyData = async () => {
                console.log("Checking company profile...");
                setIsLoading(true);
                try {
                    // Pass the signal to any fetch requests you make directly
                    // Note: Supabase doesn't directly support AbortController, but this will help with cleanup
                    const { data: { user }, error: authError } = await supabase.auth.getUser();
                    if (authError || !user) throw new Error('No user logged in');
        
                    if (isMounted) {
                        setUserId(user.id);
                        const { data, error } = await supabase
                            .from('company_profiles')
                            .select('*')
                            .eq('id', user.id)
                            .single();
        
                        if (error && error.code !== 'PGRST116') {
                            console.error('Supabase error:', error);
                            throw new Error(`Failed to fetch company profile: ${error.message}`);
                        }
                        
                        if (isMounted) {
                            setCompanyProfile(data as CompanyProfile);
                        }
                    }
                } catch (error: any) {
                    // Don't report errors if the component has unmounted or the request was aborted
                    if (error.name === 'AbortError') {
                        console.log('Fetch aborted');
                        return;
                    }
                    
                    console.error('Error fetching company profile:', error);
                    if (isMounted) {
                        setErrors({ company: error.message || 'Failed to fetch company profile' });
                    }
                } finally {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }
            };
        
            fetchCompanyData();
            
            // Clean-up function
            return () => {
                isMounted = false;
                controller.abort(); // Abort any in-progress fetch requests
            };
        }, []);

    return (
        <div className="md:mx-10">
            <div className="flex justify-between">
                <h1 className="text-[24px] flex items-center font-medium tracking-tight text-gray-700 my-4 font-sofia dark:text-gray-200">
                    Profiles
                </h1>
                <div className="flex items-end">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>
            </div>
            <div className="bg-white p-4 border-[1px] border-gray-300 rounded-3xl mb-8 dark:bg-gray-900 dark:border-gray-700">
                <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-gray-200">
                    Personal Profile
                </h1>
                <Profile />
            </div>
            <div className="bg-white p-4 border-[1px] border-gray-300 rounded-3xl my-4 dark:bg-gray-900 dark:border-gray-700">
                <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 my-4 ml-4 font-sofia dark:text-gray-200">
                    Business Profile
                </h1>
                {isLoading ? (
                    <div>Loading...</div>
                ) : errors.company ? (
                    <div>{errors.company}</div>
                ) : companyProfile ? (
                    <Company  />
                ) : userId ? (
                    <CreateCompany userId={userId} /> // Pass userId as prop
                ) : (
                    <div>Unable to determine user.</div>
                )}
            </div>
        </div>
    );
}

export default Profiles;