import { useEffect, useState } from "react";
import Gallery from "./components/gallery/Gallery";

import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { HomeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { fetchEventPlannerId } from "./components/api/api";

export default function EPGallery() {
    const [eventPlannerId, setEventPlannerId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
useEffect(() => {
    fetchEventPlannerId(setIsLoading, setEventPlannerId, setError);
}, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <PulseLoader color="#4F46E5" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-6 max-w-md w-full">
                    <div className="flex items-center justify-center text-red-500 mb-4">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-red-500 text-center mb-4">Error: {error}</p>
                    <div className="flex justify-center">
                        <Link 
                            to="/Event-Planner-Dashboard/Home"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                        >
                            <HomeIcon className="w-5 h-5 mr-2" />
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!eventPlannerId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-6 max-w-md w-full">
                    <div className="flex items-center justify-center text-yellow-500 mb-4">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-yellow-700 dark:text-yellow-200 text-center mb-4">No event planner profile found</p>
                    <div className="flex justify-center">
                        <Link 
                            to="/Event-Planner-Dashboard/Home"
                            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                        >
                            <HomeIcon className="w-5 h-5 mr-2" />
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 dark:bg-gray-900 bg-white rounded-2xl shadow-lg border-[1px] border-gray-300 dark:border-gray-700   hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-xl  font-bonanova sm:text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
                            <PhotoIcon className="w-8 h-8 mr-2" />
                            Gallery Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Showcase your best work and event highlights
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-sky-50 to-sky-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg mb-8 bg-sky-50">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-sky-800 dark:text-sky-200">Tips for a Great Gallery</h3>
                            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                                <li>Upload high-quality images (max 5MB per image)</li>
                                <li>Include a mix of event types to showcase your versatility</li>
                                <li>Keep your gallery updated with your latest work</li>
                                <li>Organize images with the most recent first</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Gallery 
                eventPlannerId={eventPlannerId} 
                isEditing={isEditing} 
                setIsEditingGallery={setIsEditing}
            />
        </div>
    );
}
