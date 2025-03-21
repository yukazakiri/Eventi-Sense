import React, { useState, useEffect } from 'react';
import { EventPlannerImage, getEventPlannerImages } from '../../pages/EventPlanner/components/gallery/api';
import { PhotoIcon, InformationCircleIcon,XMarkIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import { PulseLoader } from 'react-spinners';


interface EventPlannerGalleryProps {
    eventPlannerId: string;
}

const EventPlannerGallery: React.FC<EventPlannerGalleryProps> = ({ eventPlannerId }) => {
    const [images, setImages] = useState<EventPlannerImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (eventPlannerId) {
            loadImages();
        }
    }, [eventPlannerId]);

    const loadImages = async () => {
        try {
            const gallery = await getEventPlannerImages(eventPlannerId);
            setImages(gallery);
            setError(null);
        } catch (err) {
            console.error("Error loading images:", err);
            setError("Failed to load images. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <PulseLoader color="#4F46E5" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                <div className="flex">
                    <XMarkIcon className="w-5 h-5 text-red-400 mr-2" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700">
            <div className='flex justify-between p-4 md:px-6 border-b-[1px] border-gray-300 dark:border-gray-700'>
                <div className="flex items-center">
                    <PhotoIcon className="w-6 h-6 text-gray-700 dark:text-white mr-2" />
                    <h1 className="text-xl font-bold font-bonanova text-gray-700 dark:text-white">
                        Image Gallery
                    </h1>
                    <button
                        data-tooltip-id="gallery-help"
                        data-tooltip-content="This gallery showcases images uploaded by the event planner."
                        className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                        <InformationCircleIcon className="w-5 h-5" />
                    </button>
                    <Tooltip id="gallery-help" className="max-w-xs" />
                </div>
            </div>

            <div className='p-8'>
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
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                            <PhotoIcon className="w-16 h-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No images yet</p>
                            <p className="text-gray-400 dark:text-gray-500">
                                This gallery is currently empty.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventPlannerGallery;