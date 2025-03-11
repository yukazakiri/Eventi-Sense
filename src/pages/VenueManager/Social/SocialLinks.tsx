import React, { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient'; // Adjust path
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTiktok, FaQuestionCircle } from 'react-icons/fa'; // Import icons
import { IoMdInformationCircle } from 'react-icons/io'; // Import info icon
import { LuLink } from 'react-icons/lu';
interface VenueSocialMedia {
    id?: string;
    venues_id: string;
    platform: string;
    link: string;
    created_at?: string;
    isEditing?: boolean;
}

interface VenueSocialMediaLinksProps {
    venues_id: string;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
}

function VenueSocialMediaLinks({ venues_id, isEditing, setIsEditing }: VenueSocialMediaLinksProps) {
    const [socialMedia, setSocialMedia] = useState<VenueSocialMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newSocialMedia, setNewSocialMedia] = useState<VenueSocialMedia>({
        venues_id: '',
        platform: '',
        link: '',
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showInput, setShowInput] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('venues_social_media')
                    .select('*')
                    .eq('venues_id', venues_id);

                if (error) {
                    setError('Error fetching social media links.');
                    console.error('Error fetching links:', error);
                } else {
                    setSocialMedia(data.map(item => ({ ...item, isEditing: false })));
                }
            } catch (err) {
                setError('An unexpected error occurred.');
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [venues_id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSocialMedia((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const { error } = await supabase
                .from('venues_social_media')
                .insert([{ ...newSocialMedia, venues_id: venues_id }]);

            if (error) {
                setError('Error adding social media link.');
                console.error('Error adding link:', error);
            } else {
                setSuccessMessage('Social media link added successfully!');
                setNewSocialMedia({ venues_id: '', platform: '', link: '' });
                setShowInput(false);
                const updatedLinks = await supabase.from('venues_social_media').select('*').eq('venues_id', venues_id);
                if (updatedLinks.data) {
                    setSocialMedia(updatedLinks.data.map(item => ({ ...item, isEditing: false })));
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
        setShowInput(true);
    };

    const handleCancel = () => {
        setShowInput(false);
        setNewSocialMedia({ venues_id: '', platform: '', link: '' });
        setSelectedPlatform(null);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className={`bg-white sm:p-6 md:p-[2rem] border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
            <div className='flex flex-col space-y-4'>
                {/* Header Section with Information */}
                <div className='flex items-start justify-between'>
                    <div className='flex flex-col space-y-2'>
                        <h3 className="text-xl sm:text-2xl font-bold font-bonanova text-gray-700 dark:text-white flex items-center gap-2">
                            <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-xl mr-4">
                                <LuLink className="text-sky-600 dark:text-sky-500" size={24} />
                            </div>
                            Social Media Links
                            <div className="group relative">
                                <IoMdInformationCircle className="text-gray-400 hover:text-gray-600 cursor-help" />
                                <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg -right-1 top-6">
                                    Connect with your audience by adding your social media profiles
                                </div>
                            </div>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Share your social media presence with your audience
                        </p>
                    </div>
                    
                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center">
                            <span>✓</span>
                            <p className="ml-2 text-sm">{successMessage}</p>
                        </div>
                    )}
                </div>

                {/* Instructions Panel */}
                <div className="bg-blue-50 dark:bg-gray-800 bg-sky-50 p-4 rounded-lg mb-4 ">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                        <FaQuestionCircle />
                        How to add your social media links:
                    </h4>
                    <ol className="list-decimal list-inside text-sm text-gray-700 dark:text-gray-400 space-y-1">
                        <li>Click the "Add Link +" button to start</li>
                        <li>Select a social media platform icon</li>
                        <li>Enter your profile URL</li>
                        <li>Click "Add Link" to save</li>
                    </ol>
                </div>

                {/* Social Media Icons Section */}
                <div className="flex flex-wrap gap-4 items-center">
                    <p className="text-sm text-sky-600 dark:text-sky-400 w-full">
                        {isEditing ? 'Select a platform to add:' : 'Available platforms:'}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { icon: <FaFacebook size={20} />, name: 'Facebook', color: 'text-blue-1' },
                            { icon: <FaTwitter size={20} />, name: 'Twitter', color: 'text-blue-1' },
                            { icon: <FaInstagram size={20} />, name: 'Instagram', color: 'text-pink-600' },
                            { icon: <FaLinkedin size={20} />, name: 'LinkedIn', color: 'text-blue-1' },
                            { icon: <FaTiktok size={20} />, name: 'TikTok', color: 'text-black dark:text-white' }
                        ].map((platform) => (
                            <div key={platform.name} className="relative group">
                                <button
                                    onClick={() => isEditing && handleIconClick(platform.name)}
                                    className={`rounded-full border-[1px] border-gray-200 p-3 sm:p-4 dark:border-gray-700 
                                        ${isEditing ? 'hover:border-sky-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200' : ''}
                                        ${selectedPlatform === platform.name ? 'border-sky-500 shadow-lg' : ''}
                                        ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                                    disabled={!isEditing}
                                >
                                    <div className={platform.color}>{platform.icon}</div>
                                </button>
                                <div className="hidden group-hover:block absolute z-50 -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                    {platform.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Cancel Button */}
                    <div className='flex justify-end ml-auto'>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm px-6 py-2.5 flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                            >
                                Add Link +
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setShowInput(false);
                                }}
                                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-2.5 flex items-center gap-2 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Input Form */}
                {isEditing && showInput && (
                    <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                            Add {selectedPlatform} Link
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="platform" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Selected Platform
                                </label>
                                <input
                                    type="text"
                                    name="platform"
                                    id="platform"
                                    value={newSocialMedia.platform}
                                    className="bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="link" className=" mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    Profile URL
                                    <div className="group relative">
                                        <IoMdInformationCircle className="text-gray-400 hover:text-gray-600 cursor-help" />
                                        <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg">
                                            Enter the full URL to your {selectedPlatform || 'social media'} profile
                                            {selectedPlatform && ` (e.g., https://www.${selectedPlatform.toLowerCase()}.com/yourprofile)`}
                                        </div>
                                    </div>
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    id="link"
                                    placeholder={`https://www.${selectedPlatform?.toLowerCase()}.com/yourprofile`}
                                    value={newSocialMedia.link}
                                    onChange={handleInputChange}
                                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div className='flex gap-3'>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 px-5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg focus:ring-4 focus:ring-sky-300 transition-all duration-200 dark:focus:ring-sky-800"
                                >
                                    Add Link
                                </button>
                                <button 
                                    type='button' 
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 px-5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 transition-all duration-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Existing Links */}
                {socialMedia.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                            Your Connected Accounts
                        </h4>
                        <ul className="space-y-3">
                            {socialMedia.map((link) => (
                                <li key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200">
                                    {link.platform === 'Facebook' && <FaFacebook className="text-blue-1" size={20} />}
                                    {link.platform === 'Twitter' && <FaTwitter className="text-blue-1" size={20} />}
                                    {link.platform === 'Instagram' && <FaInstagram className="text-pink-600" size={20} />}
                                    {link.platform === 'LinkedIn' && <FaLinkedin className="text-blue-1" size={20} />}
                                    {link.platform === 'TikTok' && <FaTiktok className="text-black dark:text-white" size={20} />}
                                    <a
                                        href={link.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300 text-sm font-medium break-all"
                                    >
                                        {link.platform} Profile
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VenueSocialMediaLinks;