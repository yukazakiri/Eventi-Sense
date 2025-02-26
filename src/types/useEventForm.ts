import { useState } from 'react';
import { Event } from '../types/event';
import supabase from '../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../types/event';

export const useEventForm = () => {
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
                tags: [],
            });
            setFile(null);
            setPreviewUrl(null);
            setTagInput('');

            navigate(`/events/${createdEvent.id}`);
        } else {
            alert('Failed to create event. Please check the console for details.');
        }
    };

    return {
        event,
        file,
        uploading,
        previewUrl,
        tagInput,
        handleInputChange,
        handleFileChange,
        handleTagInputChange,
        handleAddTag,
        handleRemoveTag,
        handleSubmit,
    };
};