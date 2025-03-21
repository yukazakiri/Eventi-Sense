import React from 'react';
import { Ticket } from '../../../../types/event';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSave: (ticketId: string, newStatus: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, ticket, onSave }) => {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 dark:bg-gray-950">
        <h2 className="text-xl font-bold mb-4">Update Ticket Status</h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSave(ticket.id, 'approved')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Approve Ticket
            </button>
            <button
              onClick={() => onSave(ticket.id, 'cancelled')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Cancel Ticket
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};