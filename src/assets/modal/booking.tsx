import React from 'react';

interface ModalProps {
  title: string;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, visible, onOk, onCancel, children }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="mb-4">
          {children}
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 mr-2 bg-gray-200 hover:bg-gray-300 rounded" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded" onClick={onOk}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;