import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { createEvent, Event } from '../../types/event';
import supabase from '../../api/supabaseClient';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import { tagEntity } from '../../types/tagging';
import TagSelector from '../../components/TagSelector/TagSelector';
import { useRef } from 'react';
import { MoonLoader } from 'react-spinners';



const CreateEventForm: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate
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
        tags: [], // Add tags to the initial state
    });

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState<string>(''); // State for the tag input field
    const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [userRole, setUserRole] = useState<string>('');
    const [isFreeEvent, setIsFreeEvent] = useState(false);
    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user role:', error);
                } else if (data) {
                    setUserRole(data.role);
                }
            }
        };

        fetchUserRole();
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
     
        ]
        : [];

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
                tags: [...(prevEvent.tags || []), tagInput.trim()], // Add the new tag to the tags array
            }));
            setTagInput(''); // Clear the input field
        }
    };

    const handleRemoveTag = (tag: string) => {
        setEvent((prevEvent) => ({
            ...prevEvent,
            tags: (prevEvent.tags || []).filter((t) => t !== tag), // Remove the tag from the tags array
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

                alert('Event created successfully!');
                  // Create Notification
                  const notificationMessage = "A new event has been created.";
                  const { error: notificationError } = await supabase
                      .from('notifications')
                      .insert([
                          {
                              user_id: user.id, // Notify the user who created the event
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
                    tags: [], // Reset tags
                });
                setFile(null);
                setPreviewUrl(null);
                setTagInput(''); // Reset tag input

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

    return (
        <div  className='md:mx-10'>
              <div className='flex justify-between mb-8'>
            <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 font-bonanova dark:text-gray-200">Create New Event</h1>
            <div className="flex items-end">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
        <div className='m-4 bg-white p-8 border border-gray-300 rounded-2xl font-sofia shadow-sm dark:bg-gray-900 dark:border-gray-700'>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-4 justify-end mb-6">
                <button
                    type="button"
                    onClick={() => setIsVenueModalOpen(true)}
                    className="px-6 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 flex items-center space-x-2 dark:bg-sky-600 dark:hover:bg-sky-700"
                >
                    <span>Select Venues</span>
                    <span className="bg-sky-400/20 px-2 py-0.5 rounded-md">{selectedVenues.length}</span>
                </button>
                <button
                    type="button"
                    onClick={() => setIsSupplierModalOpen(true)}
                    className="px-6 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2 dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                    <span>Select Suppliers</span>
                    <span className="bg-purple-400/20 px-2 py-0.5 rounded-md">{selectedSuppliers.length}</span>
                </button>
            </div>
        <div className="grid gap-8 mb-6 md:grid-cols-2">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Event Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter event name"
                    value={event.name}
                    onChange={handleInputChange}
                    required
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event"
                    value={event.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Date and Time *
                </label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={event.date}
                    onChange={handleInputChange}
                    onClick={handleDateInputClick}
                    ref={dateInputRef}
                    required
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Location *
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Enter event location"
                    value={event.location}
                    onChange={handleInputChange}
                    required
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Category
                </label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    placeholder="e.g., Conference, Workshop, Concert"
                    value={event.category}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Tags
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        placeholder="Add relevant tags"
                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 dark:bg-sky-600 dark:hover:bg-sky-700"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {event.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-sky-50 text-sky-700 text-sm font-medium px-3 py-1.5 rounded-full flex items-center dark:bg-sky-900/30 dark:text-sky-300"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Event Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-sky-500 transition-colors duration-200 dark:border-gray-600 dark:hover:border-sky-500">
                    <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 dark:bg-transparent dark:text-sky-400 dark:hover:text-sky-300">
                                <span>Upload a file</span>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="sr-only"
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>
                {previewUrl && (
                    <div className="mt-3 relative">
                        <img src={previewUrl} alt="Preview" className="mt-2 rounded-lg max-h-40 w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => {
                                setFile(null);
                                setPreviewUrl(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                            ×
                        </button>
                    </div>
                )}
                {uploading && <div className="mt-3"><MoonLoader color="#0ea5e9" /></div>}
            </div>

            <div className="space-y-2">
        
                <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Ticket Price
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="number"
                        id="ticket_price"
                        name="ticket_price"
                        placeholder="0.00"
                        value={event.ticket_price}
                        onChange={handleInputChange}
                        disabled={isFreeEvent}
                        min="0"
                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full pl-7 p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        <input
            type="checkbox"
            checked={isFreeEvent}
            onChange={(e) => {
                setIsFreeEvent(e.target.checked);
                setEvent(prev => ({
                    ...prev,
                    ticket_price: e.target.checked ? 0 : prev.ticket_price
                }));
            }}
            className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-gray-600 dark:bg-gray-800"
        />
        Free Event
    </label>
</div>
            </div>

            <div className="space-y-2">
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Capacity
                </label>
                <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    placeholder="Enter maximum attendees"
                    value={event.capacity}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-3 transition-colors duration-200 dark:bg-gray-950 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
            </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-sky-600 dark:hover:bg-sky-700"
                >
                    {uploading ? (
                        <>
                            <MoonLoader size={20} color="#ffffff" className="mr-3" />
                            <span>Creating Event...</span>
                        </>
                    ) : (
                        'Create Event'
                    )}
                </button>
            </div>
        </form>
    </div>
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
    </div>
    );
};

export default CreateEventForm;