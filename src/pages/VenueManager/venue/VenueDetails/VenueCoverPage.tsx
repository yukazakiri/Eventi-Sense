import React, { useState, useEffect } from 'react';
import supabase from '../../../../api/supabaseClient';
import { IoMdInformationCircle } from 'react-icons/io';
import { FaQuestionCircle } from 'react-icons/fa';
import { LuImage, LuPencil } from 'react-icons/lu';
interface ImageUploadFormProps {
    venueId: string;
    isEditing: boolean;
    setIsEditingImage: (value: boolean) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ venueId, isEditing, setIsEditingImage  }) => {
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const { data: venueData, error: venueError } = await supabase
                    .from('venues')
                    .select('cover_image_url')
                    .eq('id', venueId);

                if (venueError) {
                    console.error("Error fetching venue data:", venueError);
                    return;
                }

                if (venueData && venueData.length > 0) {
                    setCurrentImageUrl(venueData[0].cover_image_url);
                }

            } catch (error) {
                console.error("Error in useEffect:", error);
            }
        };

        fetchCurrentImage();
    }, [venueId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            setError('Please select an image to upload.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const fileExt = image.name.split('.').pop();
            const fileName = `${venueId}_${new Date().getTime()}.${fileExt}`;
            const filePath = `VenuesPhoto/CoverPhoto/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('company_logos')
                .upload(filePath, image);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('company_logos')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('venues')
                .update({ cover_image_url: publicUrl })
                .eq('id', venueId);

            if (updateError) {
                throw updateError;
            }

            setSuccess(true);

            // Update current image URL after successful upload
            const { data: venueData, error: venueError } = await supabase
                .from('venues')
                .select('cover_image_url')
                .eq('id', venueId);

            if (venueError) {
                console.error("Error fetching venue data:", venueError);
                return;
            }

            if (venueData && venueData.length > 0) {
                setCurrentImageUrl(venueData[0].cover_image_url);
            }

        } catch (err: any) {
            console.error('Error uploading image:', err);
            setError(err.message || 'An error occurred while uploading the image.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`bg-white sm:p-6 md:p-[2rem] border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
        <div className='flex flex-col space-y-4'>
            {/* Header Section with Information */}
            <div className='flex items-start justify-between'>
                <div className='flex flex-col space-y-4'>
                    <h1 className="text-xl sm:text-2xl font-bold font-bonanova text-gray-700 dark:text-white flex items-center gap-2">
                        <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-xl mr-4">
                            <LuImage className="text-violet-600 dark:text-violet-500" size={24} />
                        </div>
                        Cover Photo
                        <div className="group relative">
                            <IoMdInformationCircle className="text-gray-400 hover:text-gray-600 cursor-help" />
                            <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg -right-1 top-6">
                                Upload a cover photo to make your profile stand out
                            </div>
                        </div>
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add a high-quality image that represents your venue
                    </p>
                     {/* Instructions Panel */}
                     <div className="bg-blue-50 dark:bg-gray-800 bg-sky-50 p-4 rounded-lg mb-4 ">
                                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                    <FaQuestionCircle />
                                    Supported Image Types:
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-400 space-y-1">
                                    <li>JPEG (.jpeg, .jpg)</li>
                                    <li>PNG (.png)</li>
                                    <li>GIF (.gif)</li>
                                    <li>WebP (.webp)</li>
                                </ul>
                                <p className="text-sm text-gray-700 dark:text-gray-400 mt-2">
                                    Please ensure your image is one of the supported types for optimal display.
                                </p>
                            </div>
                </div>
    
                {/* Edit/Cancel Button */}
                <div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditingImage(true)}
                            className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-sm px-4 py-2.5 flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
                        >
                            <LuPencil className="mr-2" size={16} />
                            Edit
                        </button>
                    )}
                    {isEditing && (
                        <button
                            onClick={() => setIsEditingImage(false)}
                            className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-2.5 flex items-center gap-2 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
    
            {/* Current Cover Photo */}
            {currentImageUrl && (
                <img
                    src={currentImageUrl}
                    alt="Current Cover Image"
                    className="mb-4 h-[500px] w-full object-cover rounded-lg shadow-md"
                />
            )}
    
            {/* Upload Section */}
            {isEditing && (
                <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                        Upload a New Cover Photo
                    </h4>
                    <div className="space-y-4">
                        {/* File Input */}
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-slate-500 dark:text-gray-400
                                file:mr-4 file:py-4 file:px-6
                                file:rounded-full file:border-0 file:p-2
                                file:text-sm file:font-semibold
                                file:bg-violet-50 dark:file:bg-violet-900/20 
                                file:text-indigo-600 dark:file:text-indigo-400
                                hover:file:bg-violet-100 dark:hover:file:bg-violet-900/30"
                        />
    
                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-2.5 px-5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg focus:ring-4 focus:ring-sky-300 transition-all duration-200 dark:focus:ring-sky-800 disabled:bg-sky-300 dark:disabled:bg-sky-700"
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                    </div>
                </div>
            )}
    
            {/* Success/Error Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg flex items-center mt-4">
                    <span>✗</span>
                    <p className="ml-2 text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center mt-4">
                    <span>✓</span>
                    <p className="ml-2 text-sm">Image uploaded successfully!</p>
                </div>
            )}
        </div>
    </div>
    );
};

export default ImageUploadForm;