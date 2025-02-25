import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { LuPencil } from 'react-icons/lu';

const UpdateEvent: React.FC = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                setEvent(data);
                setPreviewUrl(data.image_url);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewUrl(event?.image_url || null); // Reset to original URL if cancel
        }
    };
    const handleSaveChanges = async () => {
        try {
            let imageUrl = event.image_url;
    
            if (file) {
                imageUrl = await uploadFile(file);
                if (!imageUrl) return; // Exit if upload fails
            }
    
            const updatedEvent = {
                ...event,
                image_url: imageUrl,
                tags: event.tags, // Ensure tags are included
            };
    
            const { error } = await supabase
                .from('events')
                .update(updatedEvent)
                .eq('id', id);
    
            if (error) throw error;
            alert('Event updated successfully!');
            setIsEditing(false);
            setEvent(updatedEvent); // Update the state with the new image URL and tags
        } catch (err) {
            console.error('Error updating event:', err);
            alert('Failed to update event. Please try again.');
        }
    };
    
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (!data.tags) {
                    data.tags = [];
                }

                setEvent(data);
                setPreviewUrl(data.image_url);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEvent((prevEvent: any) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !event.tags.includes(newTag.trim())) {
            setEvent((prevEvent: any) => ({
                ...prevEvent,
                tags: [...prevEvent.tags, newTag.trim()],
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setEvent((prevEvent: any) => ({
            ...prevEvent,
            tags: prevEvent.tags.filter((t: string) => t !== tag),
        }));
    };

    const formatDateInPHTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Asia/Manila',
        }).format(date);
    };

    const convertToLocalDatetime = (isoDateString: string): string => {
        const date = new Date(isoDateString);
        
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `<span class="math-inline">\{year\}\-</span>{month}-<span class="math-inline">\{day\}T</span>{hours}:${minutes}`;
    };
    const handleViewTickets = () => {
        if (event && event.id) { // check if event and venue_id exists.
            navigate(`/Supplier-Dashboard/tickets?eventId=${event.id}`);
        } else {
            console.error("Venue ID is missing or event data is not loaded.");
            alert("Cannot view tickets. Venue ID is missing.");
        }
    };
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-700">
                Event not found.
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold font-bonanova mb-6 text-gray-800">Edit Event</h1>
            <div className={`m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia ${isEditing ? 'border-2 border-indigo-300' : ''}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-[16px] font-semibold tracking-wider text-gray-800 font-sofia">Edit Event Information</h1>
                    {isEditing ? (
                        <div className="flex space-x-4">
                            <button type="button" onClick={handleSaveChanges} className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-2xl">Cancel</button>
                        </div>
                    ) : (
                        <div>
                        <button type="button" onClick={() => setIsEditing(true)} className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-full flex items-center">
                            <LuPencil className="mr-2" />
                            Edit
                        </button>
                            <button type="button" onClick={handleViewTickets} className="text-white bg-purple-500 hover:bg-purple-600 px-5 py-3 rounded-full flex items-center">
                            View Tickets
                        </button>
                        </div>
                    )}
                </div>
                <div className={`m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia ${isEditing ? 'border-2 border-indigo-300' : ''}`}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div className='col-span-2'>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                    Event Image
                                </label>
                                {isEditing && (
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        value={event.cover_image || ''}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                )}
                                {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 max-h-40" />}
                                {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}
                            </div>
                            <div>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                {isEditing ? (
                                    <select
                                        id="status"
                                        name="status"
                                        value={event.status || ''}
                                        onChange={handleInputChange}
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="successful">Successful</option>
                                        <option value="canceled">Canceled</option>
                                        {/* Add more options if needed */}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        id="status"
                                        name="status"
                                        value={event.status || ''}
                                        readOnly
                                        className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    />
                                )}
                            </div>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={event.name || ''}
                                    onChange={handleInputChange}
                                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Event Name"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
                                    Event Date
                                </label>
                                {!isEditing ? (
                                    <input
                                        type="text"
                                        id="date"
                                        name="date"
                                        value={event?.date ? formatDateInPHTime(event.date) : ''}
                                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Event Date"
                                        readOnly
                                    />
                    
                                 ) : (
                                    <input
                                        type="datetime-local"
                                        id="date"
                                        name="date"
                                        value={event?.date ? convertToLocalDatetime(event.date) : ''}
                                        onChange={handleInputChange}
                                        className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                    
                                )}
                            </div>
                            <div>
                                <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={event.location || ''}
                                    onChange={handleInputChange}
                                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Event Location"
                                    required
                                    disabled={!isEditing}
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
                                    value={event.capacity || ''}
                                    onChange={handleInputChange}
                                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Event Capacity"
                                    required
                                    disabled={!isEditing}
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
                                    value={event.category || ''}
                                    onChange={handleInputChange}
                                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Event Category"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="ticket_price" className="block mb-2 text-sm font-medium text-gray-700">
                                    Ticket Price
                                </label>
                                <input
                                    type="number"
                                    id="ticket_price"
                                    name="ticket_price"
                                    value={event.ticket_price || ''}
                                    onChange={handleInputChange}
                                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Event Ticket Price"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>                               
                                 <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={event.description || ''}
                                    onChange={handleInputChange}
                                    className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Event Description"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="mb-6">
                        <h3 className="block mb-2 text-sm font-medium text-gray-700">Tags</h3>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a tag"
                                    className="bg-transparent border-b-2 border-white text-slate-50"
                                />
                                <button
                                    onClick={handleAddTag}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Add
                                </button>
                            </div>
                        ) : null}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(event.tags || []).map((tag: string, index: number) => (
                                <span
                                    key={index}
                                   className="inline-block my-4 shrink-0 rounded-full border px-4 border-gray-300/10 bg-gray-400/20 dark:border-gray-300/10 dark:bg-gray-400/20"
                                >#
                                    {tag}
                                    {isEditing && (
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-2 text-blue-800 hover:text-blue-900"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                        </div> 
                    </form>
                    </div>
                </div>
            </div>
     
    );
};
export default UpdateEvent;