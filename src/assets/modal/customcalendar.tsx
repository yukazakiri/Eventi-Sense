import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onDelete?: (id: any) => void;
  onCreate?: (start: Date, end: Date) => void;
  selectedEvent: any | null;
  selectedDate: Date | null;
  startDateTime: Date | null;
  endDateTime: Date | null;
  setStartDateTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDateTime: React.Dispatch<React.SetStateAction<Date | null>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onDelete,
  onCreate,
  selectedEvent,
  startDateTime,
  endDateTime,
  setError,
  setSuccessMessage,
}) => {
  if (!isOpen) return null;

  const handleCreate = () => {
    setError('');
    setSuccessMessage('');

    if (!startDateTime || !endDateTime) {
      setError('Please select both start and end times');
      return;
    }

    if (endDateTime <= startDateTime) {
      setError('End time must be after start time');
      return;
    }
    onCreate && onCreate(startDateTime, endDateTime);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:h-auto"> {/* Increased max-width and max-height */}
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                {title}
              </h3>
              <div className="mt-2 text-sm text-gray-500">{children}</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Close
          </button>
          {selectedEvent && onDelete && (
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => selectedEvent && onDelete(selectedEvent.id)}
            >
              Delete
            </button>
          )}
          {!selectedEvent && onCreate && (
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCreate}
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;