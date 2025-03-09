import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../../api/supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CustomModal from '../../../assets/modal/customcalendar';
import CreateEventModal from '../../../assets/modal/CreateEventModal';

interface AvailabilityEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    color?: string;
    backgroundColor?: string;
}

interface CalendarProps {
    eventPlannerId: string;
}

const   AddEventPlannerAvailabilityForm: React.FC<CalendarProps> = ({ eventPlannerId }) => {
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AvailabilityEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
      start: null as Date | null,
      end: null as Date | null,
      title: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const calendarRef = useRef<FullCalendar>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStart, setEditedStart] = useState<Date | null>(null);
  const [editedEnd, setEditedEnd] = useState<Date | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
      if (eventPlannerId) {
          fetchEvents();
      }
  }, [eventPlannerId]);

  const fetchEvents = async () => {
      setIsCreating(false);
      try {
          const { data, error } = await supabase
              .from("event_planner_availability")
              .select("*")
              .eq("event_planner_id", eventPlannerId);

          if (error) throw error;
          console.log("Fetched events:", data);

          const eventsForCalendar = data.map((event: any): AvailabilityEvent => ({
              id: event.id,
              title: event.title || 'Available',
              start: event.available_start,
              end: event.available_end,
              backgroundColor: event.color || '#CDB0E8',
          }));
          setEvents(eventsForCalendar);
      } catch (error) {
          console.error("Error fetching events:", error);
          setError("Failed to fetch events. Please try again.");
      }
  };

  const handleEventClick = (info: any) => {
      const clickedEventId = info.event.id;
      const originalEvent = events.find(event => event.id === clickedEventId);

      if (originalEvent) {
          setSelectedEvent(originalEvent);
          setEditedStart(new Date(originalEvent.start));
          setEditedEnd(new Date(originalEvent.end));
          setSelectedColor(originalEvent.color || '#E2D6FF');
          setIsModalOpen(true);
      }
  };

  const handleDateClick = (info: any) => {
      setSelectedDate(info.date);
      setIsEditing(false);

      const clickedEvents = events.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          const clickedStart = info.date;
          const clickedEnd = new Date(info.date);
          clickedEnd.setDate(info.date.getDate() + 1);

          return eventStart < clickedEnd && eventEnd > clickedStart;
      });

      let availableTimes = "No availability set for this day.";
      if (clickedEvents.length > 0) {
          availableTimes = clickedEvents
              .map((event) => {
                  const startTime = new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                  });
                  const endTime = new Date(event.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                  });
                  return `${startTime} - ${endTime}`;
              })
              .join("<br/>");
          availableTimes = `Available Times:<br/>${availableTimes}`;
      }

      setModalContent(availableTimes);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSelectedEvent(null);
      setSelectedDate(null);
      setError('');
      setSuccessMessage('');
  };

  const handleCreateClick = () => {
      setIsCreating(true);
      setNewAvailability({ start: selectedDate, end: null, title: '' });
      setSelectedColor('#E2D6FF');
      setError('');
      setSuccessMessage('');
  };

  const handleNewAvailabilityChange = (field: string, value: string | Date | null) => {
      if (field === 'color') {
          setSelectedColor(value as string);
      } else {
          setNewAvailability(prev => ({ ...prev, [field]: value }));
      }
  };

  const handleSaveAvailability = async () => {
      setError('');
      setSuccessMessage('');

      if (!newAvailability.start || !newAvailability.end) {
          setError("Please select start and end times.");
          return;
      }
      if (newAvailability.end <= newAvailability.start) {
          setError('End time must be after start time');
          return;
      }

      try {
          const { error } = await supabase
              .from("event_planner_availability")
              .insert([{
                  event_planner_id: eventPlannerId,
                  available_start: newAvailability.start.toISOString(),
                  available_end: newAvailability.end.toISOString(),
                  title: newAvailability.title || 'Available',
                  color: selectedColor,
              }]);

          if (error) throw error;

          fetchEvents();
          closeModal();
          setIsCreating(false);
          setNewAvailability({ start: null, end: null, title: '' });
          setSuccessMessage("Availability saved successfully!");
      } catch (error) {
          console.error("Error saving availability:", error);
          setError("Error saving availability. Please try again.");
      }
  };

  const handleCancelCreate = () => {
      setIsCreating(false);
      setNewAvailability({ start: null, end: null, title: '' });
      setError('');
      setSuccessMessage('');
  };

  const handleDeleteEvent = async () => {
      if (!selectedEvent) return;
      
      try {
          const { error } = await supabase
              .from("event_planner_availability")
              .delete()
              .eq("id", selectedEvent.id);
              
          if (error) throw error;
          
          fetchEvents();
          closeModal();
          setSuccessMessage("Availability deleted successfully!");
      } catch (error) {
          console.error("Error deleting availability:", error);
          setError("Error deleting availability. Please try again.");
      }
  };

  const handleUpdateEvent = async () => {
      if (!selectedEvent || !editedStart || !editedEnd) return;
      
      if (editedEnd <= editedStart) {
          setError('End time must be after start time');
          return;
      }
      
      try {
          const { error } = await supabase
              .from("event_planner_availability")
              .update({
                  available_start: editedStart.toISOString(),
                  available_end: editedEnd.toISOString(),
                  color: selectedColor
              })
              .eq("id", selectedEvent.id);
              
          if (error) throw error;
          
          fetchEvents();
          closeModal();
          setIsEditing(false);
          setSuccessMessage("Availability updated successfully!");
      } catch (error) {
          console.error("Error updating availability:", error);
          setError("Error updating availability. Please try again.");
      }
  };

  return (
      <div className="py-4 font-sofia bg-white p-8 rounded-3xl border-[1px] border-gray-300 dark:bg-gray-900 dark:border-gray-700">
        <div className='flex justify-between'>
          <div className='text-gray-500 dark:text-gray-400 my-4 ml-4'>
            <div className='flex gap-2 mb-2'> <p style={{backgroundColor: '#E2D6FF'}} className='w-4 h-4 rounded'></p>
              <h2 className='flex justify-center'>
                <span className='text-indigo-500 dark:text-indigo-400'>Scheduled: </span> 
                <span className="dark:text-gray-300">This indicates an event or task that is planned for a future date and time.</span>
              </h2>
            </div>
            <div className='flex gap-2 mb-2'> <p style={{backgroundColor: '#FCD9D9'}} className='w-4 h-4 rounded'></p>
              <h2 className='flex justify-center'>
                <span className='text-red-500 dark:text-red-400'>Cancelled: </span>
                <span className="dark:text-gray-300">This indicates that an event or task has been canceled or postponed.</span>
              </h2>
            </div>
            <div className='flex gap-2 mb-2'> <p style={{backgroundColor: '#D6FFE7'}} className='w-4 h-4 rounded'></p>
              <h2 className='flex justify-center'>
              <span className='text-green-500 dark:text-green-400'>Completed: </span>
              <span className="dark:text-gray-300">This indicates that an event or task has been completed.</span>
              </h2>
            </div>
            <div className='flex gap-2 mb-2'> <p style={{backgroundColor: '#FFE9D6'}} className='w-4 h-4 rounded'></p>
              <h2 className='flex justify-center'>
                <span className='text-orange-500 dark:text-orange-400'>On Progress: </span>
                <span className="dark:text-gray-300">This indicates that an event or task is currently in progress.</span>
              </h2>
            </div>
          </div>
          {/* Add Event Button */}
          <button
            onClick={handleCreateClick}
            className="h-16 bg-sky-500 hover:bg-sky-600 text-white py-4 px-4 rounded-2xl dark:bg-sky-500 dark:hover:bg-sky-600 dark:text-white"
          >
            Add Availability+
          </button>
        </div>

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isCreating}
          onClose={handleCancelCreate}
          newAvailability={newAvailability}
          onSave={handleSaveAvailability}
          onCancel={handleCancelCreate}
          onFieldChange={handleNewAvailabilityChange}
          error={error}
        />

        {/* Calendar and other components */}
        <div className="border rounded-3xl mb-8 overflow-hidden bg-white p-8 shadow-lg dark:bg-gray-950 dark:border-gray-700">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={(arg) => (
              <div
                className="fc-event-content flex flex-col py-4 xl:flex-row items-center justify-start md:justify-between md:space-x-4 rounded-lg px-4 w-full"
                style={{ backgroundColor: arg.event.backgroundColor, color: arg.event.textColor }}
              >
                <div
                  className="fc-daygrid-event-line w-2 h-2 rounded-full mb-2 md:mb-0 py-4"
                  style={{ backgroundColor: arg.event.backgroundColor, filter: 'brightness(0.8)' }}
                ></div>
                <div className="flex flex-col xl:flex-row items-center justify-start md:justify-between md:space-x-4 w-full">
                  <div className="fc-event-time text-center md:text-left mb-2 md:mb-0 dark:text-gray-800 font-thin">
                    {arg.event.title}
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Custom Modal for Event Details */}
        <CustomModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Availability Details"
          selectedEvent={selectedEvent}
          selectedDate={selectedDate}
          error={error}
          setError={setError}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          modalContent={modalContent}
          onDelete={handleDeleteEvent}
          onUpdate={handleUpdateEvent}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedStart={editedStart}
          editedEnd={editedEnd}
          setEditedStart={setEditedStart}
          setEditedEnd={setEditedEnd}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>
  );
};

export default AddEventPlannerAvailabilityForm;