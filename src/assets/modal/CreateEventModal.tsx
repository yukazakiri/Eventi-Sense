import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  newAvailability: {
    start: Date | null;
    end: Date | null;
    title: string;
  };
  onSave: () => void;
  onCancel: () => void;
  onFieldChange: (field: string, value: Date | string | null) => void;
  error: string;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  newAvailability,
  onSave,
  onCancel,
  onFieldChange,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Create New Event
          </h3>
          <div className="h-1 w-20 bg-indigo-500 rounded"></div>
        </div>

        <div className="space-y-6">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={newAvailability.start}
                onChange={(date) => onFieldChange('start', date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                placeholderText="Select a start date and time"
                id="start-date"
                aria-describedby="start-date-help"
                isClearable
                clearButtonClassName="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              />
              {!newAvailability.start && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="start-date-help">
                  Please select a valid start date and time.
                </p>
              )}
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={newAvailability.end}
                onChange={(date) => onFieldChange('end', date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-auto px-4 py-2.5 bg-gray-50 border border-gray-300  text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                placeholderText="Select an end date and time"
                id="end-date"
                aria-describedby="end-date-help"
                isClearable
                clearButtonClassName="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 "
                minDate={newAvailability.start || undefined}
              />
              {!newAvailability.end && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="end-date-help">
                  Please select a valid end date and time.
                </p>
              )}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Title
            </label>
            <textarea
              value={newAvailability.title}
              onChange={(e) => onFieldChange('title', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
              rows={3}
              placeholder="Enter event description"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onSave}
              className="flex-1 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Save Event
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;