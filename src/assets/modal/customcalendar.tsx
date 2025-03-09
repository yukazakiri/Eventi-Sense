import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LuCalendarCheck } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selectedEvent: any | null;
  selectedDate: Date | null;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  successMessage: string;
  modalContent: string;
  onDelete: (id: any) => void;
  onUpdate: () => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editedStart: Date | null;
  editedEnd: Date | null;
  setEditedStart: React.Dispatch<React.SetStateAction<Date | null>>;
  setEditedEnd: React.Dispatch<React.SetStateAction<Date | null>>;
  selectedColor: string; // Add this line
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>; // Add this line
}
const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  selectedEvent,
  selectedDate,
  error,
  successMessage,
  modalContent,
  onDelete,
  onUpdate,
  isEditing,
  setIsEditing,
  editedStart,
  editedEnd,
  setEditedStart,
  setEditedEnd,
  selectedColor, // Use the prop
  setSelectedColor, // Use the prop
}) => {
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStart(selectedEvent ? new Date(selectedEvent.start) : null);
    setEditedEnd(selectedEvent ? new Date(selectedEvent.end) : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full dark:bg-gray-900">
        <div className="bg-white rounded-2xl px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-gray-900">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-auto w-auto rounded-full bg-indigo-100">
              <LuCalendarCheck className='text-2xl m-4 text-indigo-500'/>
            </div>

            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center gap-2" id="modal-headline">
                {title}
                <div className="group relative">
                  <IoInformationCircleOutline className="text-gray-400 hover:text-gray-600 cursor-help" />
                  <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg -left-1/2 transform -translate-x-1/2 mt-1">
                    Here you can view and manage your event details
                  </div>
                </div>
              </h3>
              <div className="mt-2">
                {selectedDate && (
                  <p className="text-gray-700 mb-4 dark:text-white">
                    <span className="font-semibold">Selected Date:</span>{' '}
                    {selectedDate.toDateString()}
                  </p>
                )}
                {selectedEvent ? (
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Event Details</h4>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-white flex items-center gap-2">
                              Start Time
                              <div className="group relative">
                                <IoInformationCircleOutline className="text-gray-400 hover:text-gray-600 cursor-help" />
                                <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
                                  Select when your event begins
                                </div>
                              </div>
                            </label>
                            <DatePicker
                              selected={editedStart}
                              onChange={(date) => setEditedStart(date)}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              className="border rounded p-2 w-full dark:bg-gray-950 dark:text-white"
                              placeholderText="Select start date and time"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-white flex items-center gap-2">
                              End Time
                              <div className="group relative">
                                <IoInformationCircleOutline className="text-gray-400 hover:text-gray-600 cursor-help" />
                                <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
                                  Select when your event ends
                                </div>
                              </div>
                            </label>
                            <DatePicker
                              selected={editedEnd}
                              onChange={(date) => setEditedEnd(date)}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy h:mm aa"
                              className="border rounded p-2 w-full dark:bg-gray-950 dark:text-white"
                              placeholderText="Select end date and time"
                              minDate={editedStart || undefined}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 dark:text-white flex items-center gap-2">
                              Event Status
                              <div className="group relative">
                                <IoInformationCircleOutline className="text-gray-400 hover:text-gray-600 cursor-help" />
                                <div className="hidden group-hover:block absolute z-50 w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
                                  Choose a color to indicate your event's status
                                </div>
                              </div>
                            </label>
                            <select
                              value={selectedColor}
                              onChange={(e) => setSelectedColor(e.target.value)}
                              className="border rounded p-2 w-full dark:bg-gray-950 dark:text-white"
                            >
                              <option value="#E2D6FF">🟣 Scheduled</option>
                              <option value="#FCD9D9">🔴 Cancelled</option>
                              <option value="#D6FFE7">🟢 Completed</option>
                              <option value="#FFE9D6">🟡 In Progress</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current Event Details</h4>
                        <p className="text-gray-700 dark:text-white">
                          <span className="font-semibold">Start:</span>{' '}
                          {selectedEvent.start
                            ? new Date(selectedEvent.start).toLocaleString()
                            : 'Not set'}
                        </p>
                        <p className="text-gray-700 dark:text-white">
                          <span className="font-semibold">End:</span>{' '}
                          {selectedEvent.end
                            ? new Date(selectedEvent.end).toLocaleString()
                            : 'Not set'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="text-gray-700 dark:text-white"
                    dangerouslySetInnerHTML={{ __html: modalContent }}
                  />
                )}
                {error && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="flex items-center gap-2">
                      <span>⚠️</span> {error}
                    </p>
                  </div>
                )}
                {successMessage && (
                  <div className="mt-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                    <p className="flex items-center gap-2">
                      <span>✅</span> {successMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-xl dark:bg-gray-900">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500"
            onClick={onClose}
          >
            Close
          </button>
          {selectedEvent && (
            <>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:focus:ring-green-500"
                    onClick={onUpdate}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-500"
                    onClick={handleCancelEdit}
                  >
                    Cancel Editing
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-400 text-base font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-indigo-400 dark:text-white dark:hover:bg-indigo-500 dark:focus:ring-yellow-500"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Event
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-red-500 dark:text-white dark:hover:bg-red-600 dark:focus:ring-red-500"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                        onDelete(selectedEvent.id);
                      }
                    }}
                  >
                    Delete Event
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

