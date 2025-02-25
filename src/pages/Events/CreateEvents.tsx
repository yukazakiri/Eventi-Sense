import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { createEvent, Event } from '../../types/event';
import supabase from '../../api/supabaseClient';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';



const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'CreateEvents', href: '' },

];
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
        console.log('Form submitted');

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

        if (createdEvent) {
            alert('Event created successfully!');
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
    };

    return (
        <div  className='md:mx-10'>
              <div className='flex justify-between'>
            <h1 className="text-3xl flex items-center font-semibold tracking-tight text-gray-700 my-4 font-bonanova ">Create Events</h1>
            <div className="flex items-end  ">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
        </div>
        <div className='m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia'>
        <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Event Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={event.name}
                    onChange={handleInputChange}
                    required
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={event.description}
                    onChange={handleInputChange}
                    required
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
                    Date and Time
                </label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={event.date}
                    onChange={handleInputChange}
                    required
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={event.location}
                    onChange={handleInputChange}
                    required
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                    Category
                </label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={event.category}
                    onChange={handleInputChange}
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-700">
                    Tags
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        placeholder="Add a tag"
                         className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="mt-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {event.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-blue-800 hover:text-blue-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">
                    Event Image
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 max-h-40" />}
                {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
            </div>

            <div>
                <label htmlFor="ticket_price" className="block mb-2 text-sm font-medium text-gray-700">
                    Ticket Price
                </label>
                <input
                    type="number"
                    id="ticket_price"
                    name="ticket_price"
                    value={event.ticket_price}
                    onChange={handleInputChange}
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>

            <div>
                <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-700">
                    Capacity
                </label>
                <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={event.capacity}
                    onChange={handleInputChange}
                     className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : 'Create Event'}
                </button>
            </div>
        </form>
    </div>
    </div>
    );
};

export default CreateEventForm;