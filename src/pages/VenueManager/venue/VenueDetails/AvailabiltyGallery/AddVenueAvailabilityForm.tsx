import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { addVenueAvailability } from '../../../../../api/apicalendar';
import "react-datepicker/dist/react-datepicker.css";
import supabase from '../../../../../api/supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CustomModal from '../../../../../assets/modal/customcalendar';
import Breadcrumbs from '../../../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';


const maxTime = new Date();
maxTime.setHours(23, 59, 59);

interface AvailabilityEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

const AddVenueAvailabilityForm: React.FC = () => {
  const { venueId } = useParams();
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [calendarEvents, setCalendarEvents] = useState<AvailabilityEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [modalStartDateTime, setModalStartDateTime] = useState<Date | null>(null);
  const [modalEndDateTime, setModalEndDateTime] = useState<Date | null>(null);


const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home' , icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Venues', href: '/Venue-Manager-Dashboard/Venue-List' },
  { 
    label:  'Venue Details', // Dynamic label
    href: `/Venue-Manager-Dashboard/VenueDetails/${venueId}`, // Dynamic href
  },
  { label: 'Add Availability', href: '' }
];


  useEffect(() => {
    if (venueId) {
      fetchAvailabilities();
    }
  }, [venueId]);

  const fetchAvailabilities = async () => {
    try {
      const { data, error } = await supabase
        .from("venue_availability")
        .select("*")
        .eq("venue_id", venueId);

      if (error) {
        throw new Error(`Error fetching availabilities: ${error.message}`);
      }

      const events = data?.map((availability: any): AvailabilityEvent => ({
        id: availability.id,
        title: 'Not_Available',
        start: availability.available_start,
        end: availability.available_end,
      })) || [];

      setCalendarEvents(events);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAvailability = async (start: Date, end: Date) => {
    setError('');
    setSuccessMessage('');

    if (!venueId) {
      setError('Venue ID is missing');
      return;
    }

    try {
      const startTimeISO = start.toISOString();
      const endTimeISO = end.toISOString();

      await addVenueAvailability(venueId, startTimeISO, endTimeISO);
      setSuccessMessage('Availability added successfully!');
      fetchAvailabilities();
      closeModal();
    } catch (err) {
      console.error("Error in handleCreateAvailability:", err);
      setError(err instanceof Error ? err.message : 'Failed to add availability');
    }
  };

  const handleDeleteAvailability = async (id: string | undefined = undefined) => {
    const eventId = id || (selectedEvent && selectedEvent.id);
    if (!eventId) {
      setError("No availability selected to delete.");
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("venue_availability")
        .delete()
        .eq("id", eventId);

      if (deleteError) {
        throw new Error(`Error deleting availability: ${deleteError.message}`);
      }

      setSuccessMessage("Availability deleted successfully!");
      setSelectedEvent(null);
      fetchAvailabilities();
      closeModal();
    } catch (err) {
      console.error("Error in handleDeleteAvailability:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete availability');
    }
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.date);
    setModalStartDateTime(info.date);
    setModalEndDateTime(info.date);

    const clickedEvents = calendarEvents.filter(event => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const clickedStart = info.date; // Start of the clicked day
        const clickedEnd = new Date(info.date); // End of the clicked day
        clickedEnd.setDate(info.date.getDate() + 1); // Set it to the next day for proper comparison

        return eventStart < clickedEnd && eventEnd > clickedStart; // Check for overlap
    });

    if (clickedEvents.length > 0) {
        const eventTimes = clickedEvents.map(event => `${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`).join("<br/>");
        setModalContent(`Unavailable Times:<br/>${eventTimes}`); // Changed to "Unavailable Times"
    } else {
        setModalContent("No unavailability set for this day."); // Keep this message
    }
    openModal();
};

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setSelectedDate(new Date(info.event.start));
    setModalStartDateTime(new Date(info.event.start));
    setModalEndDateTime(new Date(info.event.end));
    setModalContent(`Available Time: ${new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(info.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    openModal();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setError('');
    setSuccessMessage('');
    setModalStartDateTime(null);
    setModalEndDateTime(null);
  };


  

  return (
    <div className='container mx-auto p-4 my-[2rem] font-sofia'>
       <div className='flex items-center'>
                    <Breadcrumbs items={breadcrumbItems} />
                    </div>
      <div>
        {selectedDate && (
          <p className="mb-4">Selected date: {selectedDate.toDateString()}</p>
        )}
      </div>
  
      <h2 className="text-2xl font-bold mb-4">Existing Availabilities</h2>
      <div className="border rounded mb-8 overflow-hidden bg-white p-4 shadow-lg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventColor="#043677"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height={600}
        />
        {selectedEvent && (
          <div className="mt-4">
            <button
              onClick={() => handleDeleteAvailability(selectedEvent.id)}
              className="bg-red-500 hover:bg-red-700 text-black z-50 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Availability
            </button>
          </div>
        )}
      </div>
  
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Availability Details"
        onDelete={handleDeleteAvailability}
        onCreate={handleCreateAvailability}
        selectedEvent={selectedEvent}
        selectedDate={selectedDate}
        startDateTime={modalStartDateTime}
        endDateTime={modalEndDateTime}
        setStartDateTime={setModalStartDateTime}
        setEndDateTime={setModalEndDateTime}
        error={error}
        setError={setError}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      >
        <div dangerouslySetInnerHTML={{ __html: modalContent }} />
        <div className="mb-2 my-[4rem]">
          <label className="block text-gray-700 font-bold mb-2">Start Date & Time:</label>
          <DatePicker
            selected={modalStartDateTime}
            onChange={(date: Date | null) => setModalStartDateTime(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={selectedDate || new Date()}
            calendarClassName="font-sofia"
            dayClassName={() => " hover:bg-gray-200"}
            weekDayClassName={() => "text-gray-700"}
            monthClassName={() => "text-red-700 z-50 font-bold"}
            yearClassName={() => "text-gray-700 z-50"}
            className="border rounded w-full py-2 px-3 z-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">End Date & Time:</label>
          <DatePicker
            selected={modalEndDateTime}
            onChange={(date: Date | null) => setModalEndDateTime(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={modalStartDateTime || selectedDate || new Date()}
            minTime={modalStartDateTime || new Date()}
            maxTime={maxTime}
            className="border rounded w-full py-2 z-50 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default AddVenueAvailabilityForm;