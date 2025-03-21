import React, { useState, useEffect, ChangeEvent } from 'react';
import { EventPlannerImage, getEventPlannerImages, addEventPlannerImage, deleteEventPlannerImage } from './api';
import  {Modal} from '../../../../assets/modal/modal';
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';

interface EventPlannerGalleryProps {
    eventPlannerId: string;
    isEditing: boolean;
    setIsEditingGallery: (value: boolean) => void;
}

const EventPlannerGallery: React.FC<EventPlannerGalleryProps> = ({ eventPlannerId, isEditing, setIsEditingGallery }) => {
    const [images, setImages] = useState<EventPlannerImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "confirmation">("success");
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [showGuidelines, setShowGuidelines] = useState(true);

    useEffect(() => {
        if (eventPlannerId) {
            loadImages();
        }
    }, [eventPlannerId]);

    const loadImages = async () => {
        if (!eventPlannerId) {
            console.error("eventPlannerId is undefined");
            return;
        }
        try {
            const gallery = await getEventPlannerImages(eventPlannerId);
            setImages(gallery);
            setError(null);
        } catch (err) {
            console.error("Error loading images:", err);
            setError("Failed to load images. Please try again later.");
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            await handleFileUpload(file);
        }
    };

    const handleFileUpload = async (file: File) => {
        // Basic file validation
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            showModal("Error", "File size exceeds 5MB limit. Please choose a smaller image.", "error");
            return;
        }

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            showModal("Error", "Only image files are allowed.", "error");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            if (eventPlannerId) {
                const newImage = await addEventPlannerImage(eventPlannerId, file);
                setImages(prev => [newImage, ...prev]);
                showModal("Success", "Image uploaded successfully.", "success");
            } else {
                showModal("Error", "Event planner ID is missing. Cannot upload.", "error");
            }
        } catch (err) {
            console.error('Upload failed:', err);
            showModal("Error", "Upload failed. Please check the file and try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDelete = (imageId: string) => {
        setImageToDelete(imageId);
        showModal("Confirm Delete", "Are you sure you want to delete this image?", "confirmation");
    };

    const confirmDelete = async () => {
        if (imageToDelete) {
            try {
                await deleteEventPlannerImage(imageToDelete);
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
        <div className={`bg-white border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 ${isEditing ? 'border-[1px] rounded-3xl border-indigo-400 dark:border-indigo-400' : ''}`}>
            <div className='flex justify-between p-4 md:px-6 border-b-[1px] border-gray-300 dark:border-gray-700'>
                <div className="flex items-center">
                    <PhotoIcon className="w-6 h-6 text-gray-700 dark:text-white mr-2" />
                    <h1 className="text-xl font-bold font-bonanova text-gray-700 dark:text-white">
                        {isEditing ? 'Edit Gallery' : 'Image Gallery'}
                    </h1>
                    <button
                        data-tooltip-id="gallery-help"
                        data-tooltip-content="Click 'Add Images' to start uploading. You can drag & drop images or browse your files."
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        <InformationCircleIcon className="w-5 h-5" />
                    </button>
                    <Tooltip id="gallery-help" className="max-w-xs" />
                </div>
                <div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditingGallery(true)}
                            className="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors duration-200"
                            data-tooltip-id="add-images"
                            data-tooltip-content="Click to start adding images to your gallery"
                        >
                            <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                            Add Images
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditingGallery(false)}
                            className="inline-flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
                        >
                            <XMarkIcon className="w-5 h-5 mr-2" />
                            Done Editing
                        </button>
                    )}
                    <Tooltip id="add-images" />
                </div>
            </div>

            <div className='p-8'>
                {isEditing && showGuidelines && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                        <div className="flex items-start">
                            <InformationCircleIcon className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Quick Guide</h4>
                                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                                    <li>Drag and drop images directly into the upload area</li>
                                    <li>Or click "Browse Files" to select from your computer</li>
                                    <li>Images must be less than 5MB in size</li>
                                    <li>Supported formats: JPG, PNG, GIF</li>
                                </ul>
                                <button 
                                    onClick={() => setShowGuidelines(false)}
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                                >
                                    Got it, don't show again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors duration-200 ${
                            dragActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <ArrowUpTrayIcon className={`w-12 h-12 mx-auto mb-4 transition-colors duration-200 ${
                            dragActive ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {dragActive 
                                ? "Drop your image here" 
                                : "Drag and drop your images here, or"
                            }
                        </p>
                        <label className="cursor-pointer inline-block">
                            <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                                Browse Files
                            </span>
                            <input
                                type="file"
                                onChange={handleUpload}
                                disabled={uploading}
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Maximum file size: 5MB
                        </p>
                    </div>
                )}

                {uploading && (
                    <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                        <p className="text-blue-600 dark:text-blue-400">Uploading your image...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                        <div className="flex">
                            <XMarkIcon className="w-5 h-5 text-red-400 mr-2" />
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.length > 0 ? (
                        images.map(image => (
                            <div 
                                key={image.id} 
                                className="group relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                            >
                                <div className="aspect-w-16 aspect-h-12">
                                    <img
                                        className="object-cover w-full h-full"
                                        src={image.image_url}
                                        alt="Event gallery"
                                        loading="lazy"
                                    />
                                </div>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={() => handleDelete(image.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                                            data-tooltip-id="delete-image"
                                            data-tooltip-content="Remove this image from your gallery"
                                        >
                                            <XMarkIcon className="w-5 h-5 mr-2" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                            <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No images yet</p>
                            <p className="text-gray-400 dark:text-gray-500">
                                {isEditing 
                                    ? "Start by uploading your first image above"
                                    : "Click 'Add Images' to start building your gallery"
                                }
                            </p>
                        </div>
                    )}
                </div>

                <Modal
                    isOpen={isModalOpen}
                    title={modalTitle}
                    description={modalDescription}
                    onClose={closeModal}
                    type={modalType}
                    confirmText={modalType === "confirmation" ? "Yes, Delete" : "OK"}
                    cancelText={modalType === "confirmation" ? "Cancel" : "Close"}
                    onConfirm={modalType === "confirmation" ? confirmDelete : closeModal}
                />
                <Tooltip id="delete-image" />
            </div>
        </div>
    );
};

export default EventPlannerGallery;