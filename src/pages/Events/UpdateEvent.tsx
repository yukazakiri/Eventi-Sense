import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventDetails, updateEvent, uploadFile } from '../../api/utiilty/events';
import { fetchProfile } from '../../api/utiilty/profiles';
import { LuPencil } from 'react-icons/lu';
import { FaRegEye } from 'react-icons/fa';
import Breadcrumbs from '../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import supabase from '../../api/supabaseClient';

const UpdateEvent: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, _setUploading] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const profile = await fetchProfile(user.id);
      setUserRole(profile?.role || null);
      setLoading(false);
    };
    fetchUserRole();
  }, []);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        const eventData = await fetchEventDetails(id);
        setEvent(eventData);
        setPreviewUrl(eventData.image_url);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(event?.image_url || null);
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    try {
      let imageUrl = event.image_url;
      if (file) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');
        imageUrl = await uploadFile(file, user.id);
      }

      const updatedEvent = { ...event, image_url: imageUrl };
      await updateEvent(id!, updatedEvent);
      alert('Event updated successfully!');
      setIsEditing(false);
      setEvent(updatedEvent);
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event. Please try again.');
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvent((prevEvent: any) => ({ ...prevEvent, [name]: value }));
  };

  // Handle tags
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleClick = () => {
    navigate(`/events/${id}`);
  };

  // Define breadcrumb items based on the user's role
 const breadcrumbItems = userRole === 'supplier'
        ? [
            { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
            { label: 'EventList', href: '/Supplier-Dashboard/EventList' },
            { label: 'Update Event', href: '' }
        ]   
        : userRole === 'venue_manager'
        ? [
            { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
            { label: 'EventList', href: '/Venue-Manager-Dashboard/EventList' },
            { label: 'Update Event', href: '' }
        ]
        : userRole === 'event_planner'
        ? [
            { label: 'Home', href: '/Event-Planner-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
            { label: 'EventList', href: '/Venue-Manager-Dashboard/EventList' },
            { label: 'Update Event', href: '' }
     
        ]
        : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
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
    <div className="  dark:text-white md:m-10 m-4  font-sofia">
      <div className='flex justify-between mx-6'>
      <h1 className="text-3xl font-bold font-bonanova  mt-6">Edit Event</h1>
      <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div className={`m-4 bg-white dark:bg-gray-800 p-6 border border-gray-300 dark:border-gray-700 rounded-2xl ${isEditing ? 'border-2 border-sky-300' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-lg ">Edit Event Information</h1>
          {isEditing ? (
            <div className="flex space-x-4">
              <button type="button" onClick={handleSaveChanges} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-full">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsEditing(true)} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full flex items-center">
                <LuPencil className="mr-2" />
                Edit
              </button>
              <button type="button" onClick={handleClick} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full flex items-center">
                <FaRegEye className="mr-2" />
                View Event 
              </button>
            </div>
          )}
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div className="col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Image
              </label>
              {isEditing && (
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              )}
              {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 rounded-lg" />}
              {uploading && <p className="text-sm text-gray-500 dark:text-gray-400">Uploading image...</p>}
            </div>
            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              {isEditing ? (
                <select
                  id="status"
                  name="status"
                  value={event.status || ''}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="successful">Successful</option>
                  <option value="canceled">Canceled</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={event.status || ''}
                  readOnly
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                />
              )}
            </div>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={event.name || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                placeholder="Event Name"
                required
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Date
              </label>
              {!isEditing ? (
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={event?.date ? formatDateInPHTime(event.date) : ''}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
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
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                  required
                />
              )}
            </div>
            <div>
              <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={event.location || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                placeholder="Event Location"
                required
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={event.capacity || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                placeholder="Event Capacity"
                required
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={event.category || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                placeholder="Event Category"
                required
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="ticket_price" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Ticket Price
              </label>
              <input
                type="number"
                id="ticket_price"
                name="ticket_price"
                value={event.ticket_price || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                placeholder="Event Ticket Price"
                required
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={event.description || ''}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                placeholder="Event Description"
                required
                disabled={!isEditing}
              />
            </div>
            <div className="mb-6">
              <h3 className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tags</h3>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
                  />
                  <button
                    onClick={handleAddTag}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 mt-2">
                {(event.tags || []).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block my-4 shrink-0 rounded-full border px-4 border-gray-300 dark:border-gray-600 bg-gray-400/20 dark:bg-gray-700 text-gray-700 dark:text-white"
                  >
                    #{tag}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-sky-800 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-400"
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
  );
};

export default UpdateEvent;