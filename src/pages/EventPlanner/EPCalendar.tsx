import { Link} from 'react-router-dom';
import Calendar from './components/Calendar';
import { fetchEventPlannerId } from './components/api/api';
import { useState, useEffect } from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';
import { PulseLoader } from 'react-spinners';
export default function EPCalendar() {
    const [eventPlannerId, setEventPlannerId] = useState<string | null>(null);
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
        <Calendar eventPlannerId={eventPlannerId} />
    );
}   
