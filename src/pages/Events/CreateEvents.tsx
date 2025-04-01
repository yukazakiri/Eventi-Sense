import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createEvent, Event } from '../../types/event';
import supabase from '../../api/supabaseClient';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { tagEntity } from '../../types/tagging';
import TagSelector from '../../components/TagSelector/TagSelector';
import { useRef } from 'react';
import { MoonLoader } from 'react-spinners';

// Define animation variants
const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96],
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
    }
};

const CreateEventForm: React.FC = () => {
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event>({
        name: '',
        description: '',
        date: '',
        location: '',
        organizer_id: '',
        category: '',
        image_url: '',
        ticket_price: 0,
        capacity: 0,
        tags: [],
    });

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState<string>('');
    const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [userRole, setUserRole] = useState<string>('');
    const [isFreeEvent, setIsFreeEvent] = useState(false);
    // New states for tracking event limits
    const [createdEventsCount, setCreatedEventsCount] = useState<number>(0);
    const [remainingEvents, setRemainingEvents] = useState<number>(0);
    const [userId, setUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Maximum events a user can create
    const MAX_USER_EVENTS = 2;
    
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                
                // Fetch user role
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching user role:', profileError);
                } else if (profileData) {
                    setUserRole(profileData.role);
                    
                    // If user is a regular user, count their events
                    if (profileData.role === 'user') {
                        const { data: eventData, error: eventError } = await supabase
                            .from('events')
                            .select('id')
                            .eq('organizer_id', user.id);
                            
                        if (eventError) {
                            console.error('Error fetching user events:', eventError);
                        } else if (eventData) {
                            const eventCount = eventData.length;
                            setCreatedEventsCount(eventCount);
                            setRemainingEvents(MAX_USER_EVENTS - eventCount);
                        }
                    }
                }
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    // Define breadcrumb items based on user role
    const breadcrumbItems = userRole === 'supplier'
        ? [
            { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
            { label: 'EventList', href: '/Supplier-Dashboard/EventList' },
            { label: 'Create Event', href: '' }
        ]   
        : userRole === 'venue_manager'
        ? [
            { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
            { label: 'EventList', href: '/Venue-Manager-Dashboard/EventList' },
            { label: 'Create Event', href: '' }
        ]
        : userRole === 'event_planner'
        ? [
            { label: 'Home', href: '/Event-Planner-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
            { label: 'EventList', href: '/Venue-Manager-Dashboard/EventList' },
            { label: 'Create Event', href: '' }
        ]: [];
        

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !event.tags?.includes(tagInput.trim())) {
            setEvent((prevEvent) => ({
                ...prevEvent,
                tags: [...(prevEvent.tags || []), tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setEvent((prevEvent) => ({
            ...prevEvent,
            tags: (prevEvent.tags || []).filter((t) => t !== tag),
        }));
    };

    const uploadFile = async (file: File | null): Promise<string | undefined> => {
        if (!file) return undefined;

        setUploading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not found');
            alert('You must be logged in to upload an image.');
            setUploading(false);
            return undefined;
        }

        const fileName = `eventsPhoto/${user.id}_${file.name}`;

        const { data, error } = await supabase.storage
            .from('events')
            .upload(fileName, file);

        if (error) {
            console.error('Error uploading file:', error);
            alert('There was an error uploading your file.');
            setUploading(false);
            return undefined;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('events')
            .getPublicUrl(data.path);

        console.log('Public URL:', publicUrl);

        setUploading(false);
        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user has reached the event creation limit
        if (userRole === 'user' && remainingEvents <= 0) {
            alert('You have reached the maximum number of events you can create. Please contact support to upgrade your account.');
            return;
        }

        if (!isFreeEvent && event?.ticket_price !== undefined && event.ticket_price <= 0) {
            alert('Please enter a valid ticket price or mark the event as free.');
            return;
        }
        console.log('Form submitted');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('You must be logged in to create an event.');
                return;
            }

            let imageUrl = event.image_url;
            if (file) {
                console.log('Uploading file...');
                imageUrl = await uploadFile(file);
                if (!imageUrl) {
                    alert('Failed to upload image.');
                    return;
                }
            }

            const updatedEvent = {
                ...event,
                organizer_id: user.id,
                image_url: imageUrl,
            };

            console.log('Creating event with data:', updatedEvent);
            const createdEvent = await createEvent(updatedEvent);
            console.log('Created Event:', createdEvent);

            if (createdEvent && createdEvent.id) {
                // Tag venues
                for (const venueId of selectedVenues) {
                    await tagEntity({
                        eventId: createdEvent.id,
                        taggedEntityId: venueId,
                        taggedEntityType: 'venue',
                        taggedBy: user.id
                    });
                }

                // Tag suppliers
                for (const supplierId of selectedSuppliers) {
                    await tagEntity({
                        eventId: createdEvent.id,
                        taggedEntityId: supplierId,
                        taggedEntityType: 'supplier',
                        taggedBy: user.id
                    });
                }

                // Update event count for user roles
                if (userRole === 'user') {
                    setCreatedEventsCount(prev => prev + 1);
                    setRemainingEvents(prev => prev - 1);
                }

                alert('Event created successfully!');
                // Create Notification
                const notificationMessage = "A new event has been created.";
                const { error: notificationError } = await supabase
                    .from('notifications')
                    .insert([
                        {
                            user_id: user.id,
                            sender_id: user.id,
                            type: "event_creation",
                            message: notificationMessage,
                            link: `/events/${createdEvent.id}`,
                            is_read: false
                        }
                    ]);

                if (notificationError) {
                    console.error("Error creating notification:", notificationError);
                }
                setEvent({
                    name: '',
                    description: '',
                    date: '',
                    location: '',
                    organizer_id: '',
                    category: '',
                    image_url: '',
                    ticket_price: 0,
                    capacity: 0,
                    tags: [],
                });
                setFile(null);
                setPreviewUrl(null);
                setTagInput('');

                // Redirect to the event details page
                navigate(`/events/${createdEvent.id}`);
            } else {
                alert('Failed to create event. Please check the console for details.');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event.');
        }
    };
    
    // Function to trigger the date picker
    const handleDateInputClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    // Determine if form should be disabled
    const isFormDisabled = userRole === 'user' && remainingEvents <= 0;

    // If still loading, show a loading indicator
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <MoonLoader color="#ffffff" size={60} />
                <span className="ml-4 text-white text-lg">Loading...</span>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='md:mx-10'
        >
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className='flex justify-between mb-8'
            >
                <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl flex items-center font-semibold tracking-tight gradient-text font-bonanova"
                >
                    Create New Event
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-end"
                >
                    <Breadcrumbs items={breadcrumbItems} />
                </motion.div>
            </motion.div>

            {userRole === 'user' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-6"
                >
                    <div className="bg-[#152131] rounded-lg p-4 border border-blue-500/50"
                       style={{
                        background: `
                        linear-gradient(#152131, #152131) padding-box,
                        linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                        `,
                        border: '1px solid transparent',
                        borderRadius: '0.75rem'
                    }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-white">Event Creation Limit</h3>
                                <p className="text-gray-300 mt-1">
                                    As a user, you can create up to {MAX_USER_EVENTS} events.
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-white">{remainingEvents} / {MAX_USER_EVENTS}</div>
                                <p className="text-gray-300 text-sm">events remaining</p>
                            </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-3">
                            <div 
                                className="bg-blue-500 h-2.5 rounded-full" 
                                style={{ width: `${(createdEventsCount / MAX_USER_EVENTS) * 100}%` }}
                            ></div>
                        </div>
                        
                        {/* Warning message if limit reached */}
                        {remainingEvents <= 0 && (
                            <div className="mt-3 text-yellow-400 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                You've reached your event creation limit. Contact support to upgrade your account.
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
            
            <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className='bg-[#152131] p-8 border border-gray-300 rounded-2xl font-sofia shadow-sm'
                style={{
                    background: `linear-gradient(#152131, #152131) padding-box,
                    linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) border-box
                    `,
                    border: '1px solid transparent',
                    borderRadius: '0.75rem'
                }}
            >
                {isFormDisabled ? (
                    <motion.div 
                        variants={itemVariants}
                        className="text-center py-8"
                    >
                        <motion.svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-16 w-16 mx-auto text-yellow-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </motion.svg>
                        <motion.h2 
                            className="mt-4 text-xl font-semibold text-white"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Event Creation Limit Reached
                        </motion.h2>
                        <motion.p 
                            className="mt-2 text-gray-300 max-w-md mx-auto"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            You've used all your available event creations. Please contact support to upgrade your account for unlimited event creation.
                        </motion.p>
                        <motion.button
                            onClick={() => navigate('/User-Dashboard/EventList')}
                            className="mt-6 px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Your Events
                        </motion.button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div 
                            variants={itemVariants}
                            className="flex space-x-4 justify-end mb-6"
                        >
                            <motion.button
                                type="button"
                                onClick={() => setIsVenueModalOpen(true)}
                                className="px-6 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Select Venues</span>
                                <span className="bg-sky-400/20 px-2 py-0.5 rounded-md">{selectedVenues.length}</span>
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setIsSupplierModalOpen(true)}
                                className="px-6 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>Select Suppliers</span>
                                <span className="bg-purple-400/20 px-2 py-0.5 rounded-md">{selectedSuppliers.length}</span>
                            </motion.button>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="grid gap-8 mb-6 md:grid-cols-2"
                        >
                            {/* Event Name */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={event.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    required
                                />
                            </motion.div>
                            
                            {/* Event Date */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="date" className="block text-sm font-medium text-white mb-2">
                                    Event Date
                                </label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    ref={dateInputRef}
                                    value={event.date}
                                    onChange={handleInputChange}
                                    onClick={handleDateInputClick}
                                    className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    required
                                />
                            </motion.div>
                            
                            {/* Location */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={event.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    required
                                />
                            </motion.div>
                            
                            {/* Category */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={event.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    required
                                />
                            </motion.div>
                            
                            {/* Capacity */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="capacity" className="block text-sm font-medium text-white mb-2">
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    id="capacity"
                                    name="capacity"
                                    value={event.capacity}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    required
                                    min="1"
                                />
                            </motion.div>
                            
                            {/* Ticket Price */}
                            <motion.div variants={itemVariants}>
                                <label htmlFor="ticket_price" className="block text-sm font-medium text-white mb-2">
                                    Ticket Price
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="number"
                                        id="ticket_price"
                                        name="ticket_price"
                                        value={isFreeEvent ? 0 : event.ticket_price}
                                        onChange={handleInputChange}
                                        disabled={isFreeEvent}
                                        className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 disabled:opacity-50"
                                        min="0"
                                    />
                                    <label className="flex items-center space-x-2 text-white">
                                        <input
                                            type="checkbox"
                                            checked={isFreeEvent}
                                            onChange={(e) => {
                                                setIsFreeEvent(e.target.checked);
                                                if (e.target.checked) {
                                                    setEvent(prev => ({ ...prev, ticket_price: 0 }));
                                                }
                                            }}
                                            className="rounded border-gray-600/30 text-sky-500 focus:ring-sky-500/50"
                                        />
                                        <span>Free Event</span>
                                    </label>
                                </div>
                            </motion.div>
                            
                            {/* Description */}
                            <motion.div variants={itemVariants} className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={event.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    required
                                />
                            </motion.div>
                            
                            {/* Image Upload */}
                            <motion.div variants={itemVariants} className="md:col-span-2">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Event Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600/30 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        {previewUrl ? (
                                            <div className="relative">
                                                <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFile(null);
                                                        setPreviewUrl(null);
                                                    }}
                                                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="flex text-sm text-gray-400">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-sky-500 hover:text-sky-400">
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="file-upload"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleFileChange}
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Tags */}
                            <motion.div variants={itemVariants} className="md:col-span-2">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {event.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-500/20 text-sky-400"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 inline-flex items-center"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={handleTagInputChange}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                        placeholder="Add tags..."
                                        className="flex-1 px-4 py-2 bg-[#1e2a3a] border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200"
                                    >
                                        Add Tag
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="flex justify-end pt-6 border-t border-gray-600/30"
                        >
                            <motion.button
                                type="submit"
                                disabled={uploading || (userRole === 'user' && remainingEvents <= 0)}
                                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {uploading ? (
                                    <>
                                        <MoonLoader size={20} color="#ffffff" className="mr-3" />
                                        <span>Creating Event...</span>
                                    </>
                                ) : (
                                    'Create Event'
                                )}
                            </motion.button>
                        </motion.div>
                    </form>
                )}
            </motion.div>

            <AnimatePresence>
                {(isVenueModalOpen || isSupplierModalOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TagSelector
                            type="venue"
                            selectedIds={selectedVenues}
                            onSelect={(id) => setSelectedVenues([...selectedVenues, id])}
                            onDeselect={(id) => setSelectedVenues(selectedVenues.filter(v => v !== id))}
                            isOpen={isVenueModalOpen}
                            onClose={() => setIsVenueModalOpen(false)}
                        />
                        <TagSelector
                            type="supplier"
                            selectedIds={selectedSuppliers}
                            onSelect={(id) => setSelectedSuppliers([...selectedSuppliers, id])}
                            onDeselect={(id) => setSelectedSuppliers(selectedSuppliers.filter(s => s !== id))}
                            isOpen={isSupplierModalOpen}
                            onClose={() => setIsSupplierModalOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CreateEventForm;
