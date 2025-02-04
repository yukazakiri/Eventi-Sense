import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
  onClose: () => void;
  type: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, description, onClose, type }) => {
  if (!isOpen) return null;

  const modalStyles = {
    success: {
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    error: {
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
  };

  const { bgColor, textColor } = modalStyles[type] || modalStyles.success;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`bg-white p-6 rounded shadow-lg w-full max-w-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${textColor} ${bgColor} p-4 rounded-t`}>
          {title}
        </h2>
        <p className="mb-4 p-4">{description}</p>
        <button
          onClick={onClose}
          className={`w-full ${bgColor} text-white py-2 rounded-b hover:opacity-90`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
