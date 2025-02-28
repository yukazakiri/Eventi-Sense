import React, { useState, useEffect, ChangeEvent } from 'react';
import { supplierImage } from '../../../../api/apiSupplierGallery';
import { getsupplierImages, addsupplierImage, deletesupplierImage } from '../../../../api/apiSupplierGallery';
import Modal from '../../../../assets/modal/modal';


interface SupplierGalleryProps {
    supplierId: string;
    isEditing: boolean;
    setIsEditingGallery: (value: boolean) => void;
}

const supplierGallery: React.FC<SupplierGalleryProps> = ({ supplierId, isEditing, setIsEditingGallery }) => {
    const [images, setImages] = useState<supplierImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "confirmation">("success");
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);

    useEffect(() => {
        if (supplierId) {
            loadImages();
        }
    }, [supplierId]);

    const loadImages = async () => {
        if (!supplierId) {
            console.error("supplierId is undefined");
            return;
        }
        try {
            const gallery = await getsupplierImages(supplierId);
            setImages(gallery);
            setError(null);
        } catch (err) {
            console.error("Error loading images:", err);
            setError("Failed to load images. Please try again later.");
        }
    };

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            if (supplierId) {
                await addsupplierImage(supplierId, file);
                await loadImages();
                showModal("Success", "Image uploaded successfully.", "success");
            } else {
                showModal("Error", "supplier ID is missing. Cannot upload.", "error");
            }
        } catch (err) {
            console.error('Upload failed:', err);
            showModal("Error", "Upload failed. Please check the file and try again.", "error");
        } finally {
            setUploading(false);
            if (e.target.files) {
                e.target.value = '';
            }
        }
    };

    const handleDelete = (imageId: string) => {
        setImageToDelete(imageId);
        showModal("Confirm Delete", "Are you sure you want to delete this image?", "confirmation");
    };

    const confirmDelete = async () => {
        if (imageToDelete) {
            try {
                await deletesupplierImage(imageToDelete);
                setImages(prev => prev.filter(img => img.id !== imageToDelete));
                showModal("Success", "Image deleted successfully.", "success");
            } catch (err) {
                console.error('Delete failed:', err);
                showModal("Error", "Delete failed. Please try again later.", "error");
            } finally {
                setImageToDelete(null);
            }
        }
    };

    const showModal = (title: string, description: string, type: "success" | "error" | "confirmation") => {
        setModalTitle(title);
        setModalDescription(description);
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
      <div className={`bg-white  border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
             <div className='flex justify-between p-4 md:px-6 border-b-[1px] border-gray-300 dark:border-gray-700'>
                        <h1 className="text-xl md:mt-2 font-bold font-bonanova text-gray-700 dark:text-white  justify-center">Gallery</h1>
                        <div>
                              {!isEditing &&  (
                            <>      
                                <button
                                    onClick={() => setIsEditingGallery(true)}
                                    className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full flex items-center dark:bg-blue-500 dark:hover:bg-blue-600"> 
                                    Add+
                                </button>
                           
                            </>
                        )}
                        {isEditing  && (
                            <button
                                onClick={() => {
                                    setIsEditingGallery(false);
                                  
                                }}
                                className="text-white bg-red-400 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800"
                            >
                                Cancel
                            </button>
                        )}</div>
                           </div>
       <div className='p-8'>
            {isEditing && (
                <div className='my-[2rem] max-w-56 '>
                    <input
                        type="file"
                        onChange={handleUpload}
                        disabled={uploading}
                        accept="image/*"
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-600 hover:file:bg-indigo-300 dark:bg-gray-900 dark:border-gray-700"
                    />
                </div>
            )}

            {uploading && <p className="text-gray-500">Uploading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="masonry columns-2 md:columns-4">
                {images.length > 0 ? (
                    images.map(image => (
                        <div key={image.id} className="relative group break-inside-avoid mb-8 dark:bg-gray-900 dark:border-gray-700">
                            <img
                                className="w-full h-auto rounded-lg"
                                src={image.image_url}
                                alt="supplier gallery"
                                loading="lazy"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded hover:opacity-75 dark:bg-red-500 dark:hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No images yet.</p>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title={modalTitle}
                description={modalDescription}
                onClose={closeModal}
                type={modalType}
                confirmText={modalType === "confirmation" ? "Yes" : "OK"}
                cancelText={modalType === "confirmation" ? "No" : "Close"}
                onConfirm={modalType === "confirmation" ? confirmDelete : closeModal}
            >
                {modalType === "error" && imageToDelete && (
                    <div className="mt-4">
                        <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 dark:bg-red-500 dark:hover:bg-red-700">
                            Yes, Delete
                        </button>
                        <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-500 dark:hover:bg-gray-700">
                            Cancel
                        </button>
                    </div>
                )}
            </Modal>
            </div>
        </div>
    );
};

export default supplierGallery;