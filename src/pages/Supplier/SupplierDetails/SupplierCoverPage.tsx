import React, { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient';
import { LuPencil } from 'react-icons/lu';

interface ImageUploadFormProps {
    supplierId: string;
    isEditing: boolean;
    setIsEditingImage: (value: boolean) => void;
}
const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ supplierId, isEditing, setIsEditingImage }) => {
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const { data: supplierData, error: supplierError } = await supabase
                    .from('supplier')
                    .select('cover_image_url')
                    .eq('id', supplierId);

                if (supplierError) {
                    console.error("Error fetching supplier data:", supplierError);
                    return;
                }

                if (supplierData && supplierData.length > 0) {
                    setCurrentImageUrl(supplierData[0].cover_image_url);
                }

            } catch (error) {
                console.error("Error in useEffect:", error);
            }
        };

        fetchCurrentImage();
    }, [supplierId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image || !supplierId) {
            setError('Please select an image to upload.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const fileExt = image.name.split('.').pop();
            const fileName = `${supplierId}.${fileExt}`;
            const filePath = `CoverPhoto/${supplierId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('suppliers') // **CHECK YOUR BUCKET NAME HERE**
                .upload(filePath, image, { contentType: image.type });

            if (uploadError) {
                console.error("Supabase Storage Error:", uploadError);
                setError(uploadError.message);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('suppliers') // **CHECK YOUR BUCKET NAME HERE**
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('supplier')
                .update({ cover_image_url: publicUrl })
                .eq('id', supplierId);

            if (updateError) {
                console.error("Supabase Update Error:", updateError);
                setError(updateError.message);
                throw updateError;
            }

            setSuccess(true);
            setCurrentImageUrl(publicUrl);

        } catch (err: any) {
            console.error('Error uploading image:', err);
            setError(err.message || 'An error occurred while uploading the image.');
        } finally {
            setUploading(false);
            setImage(null);
        }
    };

    return (
        <div className={`bg-white  border-[1px] border-gray-300 rounded-3xl ${isEditing ? 'border-2 rounded-3xl border-indigo-400' : ''}`}>
             <div className='flex justify-between p-4 md:px-12 border-b-[1px] border-gray-300'>
                        <h1 className="text-xl md:mt-2 font-bold font-bonanova text-gray-700  justify-center">Cover Photo</h1>
                        <div>
                              {!isEditing &&  (
                            <>
                                <button
                                    onClick={() => setIsEditingImage(true)}
                                    className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center">
                                <LuPencil className="mr-2" />
                                    Edit 
                                </button>
                           
                            </>
                        )}
                        {isEditing  && (
                            <button
                                onClick={() => {
                                    setIsEditingImage(false);
                                  
                                }}
                                className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                            >
                                Cancel
                            </button>
                        )}</div>
                           </div>
            <div className='p-8'>
            {currentImageUrl && (
                <img
                    src={currentImageUrl}
                    alt="Current Logo"
                    className="mb-4 h-[500px] w-full flex justify-center"
                />
            )}

            <div className='py-4'>
                {isEditing ? (
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-4 file:px-6
                                file:rounded-full file:border-0 file:p-2
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-indigo-600
                                hover:file:bg-violet-100"
                    />
                ) : (
                    <p className="bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {currentImageUrl ? "Image uploaded" : "No image uploaded yet"}
                    </p>
                )}
            </div>

            {isEditing && (
                <button
                    onClick={handleUpload}
                    disabled={uploading || !image}
                    className="bg-indigo-600 text-white px-8 py-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                </button>
            )}
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">Logo uploaded successfully!</p>}
        </div>
    );
};

export default ImageUploadForm;