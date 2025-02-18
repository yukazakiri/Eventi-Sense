// CustomModal.tsx
import React from 'react';
import { MdOutlineClose } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  selectedEvent: any | null;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  successMessage: string;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  modalContent: string;

}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  error,

  successMessage,
  modalContent,

}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="static font-sofia inline-block align-bottom bg-white rounded-lg text-left overflow-hidden border-t-4 border-yellow-500 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:h-auto">
        <div className="bg-white px-4 py-3 sm:p-6">
          <div className="flex items-end justify-end">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-2 py-2 bg-gray-300 text-base font-medium text-white  hover:bg-gray-400  sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              <MdOutlineClose className="text-white " size={15} />
            </button>
          </div>
          <div className='my-4'>
          <div className="flex items-center mt-2">
            <div className="w-2 h-full bg-yellow-200 text-yellow-200 mr-2 px-4 rounded-md">s</div>
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
              {title}
            </h3>
          </div>
          <div className="mt-2 flex items-start">
          <CiClock2 className="text-gray-900 mr-4 " size={25} />
            <div dangerouslySetInnerHTML={{ __html: modalContent }} /> {/* Display modalContent */}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;