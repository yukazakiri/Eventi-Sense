import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import supabase from '../../../api/supabaseClient'; // Adjust path
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa'; // Import icons

interface SupplierSocialMedia {
    id?: string;
    supplier_id: string;
    platform: string;
    link: string;
    created_at?: string;

}

function SocialMediaLinks() {
    const user = useUser();
    const [socialMedia, setSocialMedia] = useState<SupplierSocialMedia[]>([]);
    const [_loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);
    const [newSocialMedia, setNewSocialMedia] = useState<SupplierSocialMedia>({
        supplier_id: '',
        platform: '',
        link: '',
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showInput, setShowInput] = useState(false); // Track if input fields should be shown
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null); // Track the selected platform
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchLinks = async () => {
            if (!user) {
                setError('User is not authenticated.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const { data: supplier, error: supplierError } = await supabase
                    .from('supplier')
                    .select('id')
                    .eq('company_id', user.id)
                    .single();

                if (supplierError || !supplier) {
                    setError('Supplier not found for this user.');
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('supplier_social_media')
                    .select('*')
                    .eq('supplier_id', supplier.id);

                if (error) {
                    setError('Error fetching social media links.');
                    console.error('Error fetching links:', error);
                } else {
                    setSocialMedia(data.map(item => ({...item, isEditing: false}))); //add is editing state
                }
            } catch (err) {
                setError('An unexpected error occurred.');
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSocialMedia((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user) {
            setError('User is not authenticated.');
            return;
        }

        try {
            const { data: supplier, error: supplierError } = await supabase
                .from('supplier')
                .select('id')
                .eq('company_id', user.id)
                .single();

            if (supplierError || !supplier) {
                setError('Supplier not found for this user.');
                return;
            }

            const { error } = await supabase
                .from('supplier_social_media')
                .insert([{ ...newSocialMedia, supplier_id: supplier.id }]);

            if (error) {
                setError('Error adding social media link.');
                console.error('Error adding link:', error);
            } else {
                setSuccessMessage('Social media link added successfully!');
                setNewSocialMedia({ supplier_id: '', platform: '', link: '' });
                setShowInput(false); // Hide input fields after submission
                const updatedLinks = await supabase.from('supplier_social_media').select('*').eq('supplier_id', supplier.id);
                if (updatedLinks.data) {
                    setSocialMedia(updatedLinks.data.map(item => ({...item, isEditing: false})));
                }
            }
        } catch (err) {
            setError('An error occurred while adding the link.');
            console.error('Error adding link:', err);
        }
    };

    const handleIconClick = (platform: string) => {
        setSelectedPlatform(platform);
        setNewSocialMedia((prev) => ({ ...prev, platform }));
        setShowInput(true); // Show input fields when an icon is clicked
    };

    const handleCancel = () => {
        setShowInput(false);
        setNewSocialMedia({supplier_id: '', platform: '', link: ''});
        setSelectedPlatform(null);
    };
    return (
        <div className={`bg-white p-[2rem]  border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
          

            <div className='flex justify-between md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0'>
                <h3 className="text-xl font-bold font-bonanova text-gray-700 dark:text-white ">Social Media Links</h3>
                {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
    
                {/* Social Media Icons */}
                <div className="flex space-x-4 mb-4">
                    <div className="rounded-full border-[1px] border-gray-200 p-4 dark:border-gray-700">
                    <FaFacebook
                        className="text-blue-1 cursor-pointer hover:text-blue-2"
                        size={24}
                        onClick={() => handleIconClick('Facebook')}
                    />
                    </div>
                    <div className="rounded-full border-[1px] border-gray-200 p-4 dark:border-gray-700">
                    <FaTwitter
                        className="text-blue-1 cursor-pointer hover:text-blue-2"
                        size={24}
                        onClick={() => handleIconClick('Twitter')}
                    />
                    </div>
                    <div className="rounded-full border-[1px] border-gray-200 p-4 dark:border-gray-700">
                    <FaInstagram
                        className="text-pink-600 cursor-pointer hover:text-pink-700"
                        size={24}
                        onClick={() => handleIconClick('Instagram')}
                    />
                    </div>
                    <div className="rounded-full border-[1px] border-gray-200 p-4 dark:border-gray-700">
                    <FaLinkedin
                        className="text-blue-1 cursor-pointer hover:text-blue-2"
                        size={24}
                        onClick={() => handleIconClick('LinkedIn')}
                    />
                    </div>
                    <div className="rounded-full border-[1px] border-gray-200 p-4 dark:border-gray-700">
                    <FaTiktok
                        className="text-black cursor-pointer hover:text-gray-700"
                        size={24}
                        onClick={() => handleIconClick('TikTok')}
                    />
                    </div>
                     
                </div>
                <div className='flex item-end justify-end mb-4'>
                  
                  <div>
                        {!isEditing &&  (
                      <>
                          <button
                              onClick={() => setIsEditing(true)}
                              className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-6 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 mr-2"
                          >
                             Add Link +
                          </button>
                     
                      </>
                  )}
                  {isEditing  && (
                      <button
                          onClick={() => {
                              setIsEditing(false);
                            
                          }}
                          className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                      >
                          Cancel
                      </button>
                  )}</div>
                     </div>
            </div>
          
         
            {showInput && (
                <div className="mb-4">
                    {isEditing && (
                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="mb-4">
                                <label htmlFor="platform" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">
                                    Platform
                                </label>
                                <input
                                    type="text"
                                    name="platform"
                                    id="platform"
                                    value={newSocialMedia.platform}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    disabled // Disabled because the platform is selected via icons
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="link" className="block mb-2 text-md font-medium text-gray-800 dark:text-white">
                                    Link
                                </label>
                                <input
                                    type="text"
                                    name="link"
                                    id="link"
                                    placeholder={`Enter ${selectedPlatform} link`}
                                    value={newSocialMedia.link}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className='flex '>
                                <button
                                    type="submit"
                                    className="w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add Link
                                </button>
                                <button type='button' onClick={handleCancel} className='w-auto ml-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        
    
            {/* Display Existing Links */}
      
                <ul className="space-y-2">
                    {socialMedia.map((link) => (
                        <li key={link.id} className="flex items-center space-x-2 dark:text-white">
                            {link.platform === 'Facebook' && <FaFacebook className="text-blue-1" size={20} />}
                            {link.platform === 'Twitter' && <FaTwitter className="text-blue-1" size={20} />}
                            {link.platform === 'Instagram' && <FaInstagram className="text-pink-600" size={20} />}
                            {link.platform === 'LinkedIn' && <FaLinkedin className="text-blue-1" size={20} />}
                            {link.platform === 'TikTok' && <FaTiktok className="text-black dark:text-white" size={20} />}
                            <a
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline dark:text-white"
                            >
                                {link.platform}
                            </a>
                        </li>
                    ))}
                </ul>
        
            
        </div>
    );
};

export default SocialMediaLinks;