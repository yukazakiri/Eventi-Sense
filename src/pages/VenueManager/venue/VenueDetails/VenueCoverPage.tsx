import React, { useState, useEffect } from 'react';
import supabase from '../../../../api/supabaseClient';

interface ImageUploadFormProps {
    venueId: string;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ venueId }) => {
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
        <div className="p-8 border bg-white  shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Upload Venue Cover Image</h2>

            {currentImageUrl && (
                <img
                    src={currentImageUrl}
                    alt="Current Cover Image"
                    className="mb-4 w-auto h-auto flex justify-center"
                />
            )}
            
            <div className='py-4'>
            <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-4 file:px-6
                        file:rounded-full file:border-0  file:p-2
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-indigo-600
                        hover:file:bg-violet-100
                    "
                />
            </div>
            <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-indigo-600 text-white px-8 py-2 rounded-full  hover:bg-blue-600 disabled:bg-blue-300"
            >
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">Image uploaded successfully!</p>}
        </div>
    );
};

export default ImageUploadForm;