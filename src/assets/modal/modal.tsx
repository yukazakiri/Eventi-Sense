import React from "react";
import { successMessages, errorMessages, confirmationMessages, MessageObject } from "./message";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  type?: "success" | "error" | "info" | "warning" | "confirmation";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  messageKey?: keyof MessageObject; // Key change here
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  children,
  onClose,
  type = "info",
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  messageKey,
}) => {
  if (!isOpen) return null;

  let message = description || "";

  // Type-safe message lookup:
  if (messageKey) { // Check if messageKey exists
    switch (type) {
      case "success":
        message = successMessages[messageKey as keyof typeof successMessages] || message;
        confirmText = confirmText || "OK";
        break;
      case "error":
        message = errorMessages[messageKey as keyof typeof errorMessages] || message;
        confirmText = confirmText || "OK";
        break;
      case "confirmation":
        message =  confirmationMessages[messageKey as keyof typeof  confirmationMessages] || message;
        confirmText = confirmText || "Yes";
        cancelText = cancelText || "No";
        break;
      default: // Includes "info" and "warning"
        confirmText = confirmText || "OK";
    }
  } else if (type !== "confirmation") {
    confirmText = confirmText || "OK";
  }

  const modalStyles = {
    success: {
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    error: {
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    info: {
      bgColor: "bg-green-500",
      textColor: "text-white",
    },
    warning: {
      bgColor: "bg-yellow-500",
      textColor: "text-gray-800",
    },
    confirmation: {
      bgColor: "bg-red-500", // or some other color
      textColor: "text-white",
    },
  };

  const { bgColor, textColor } = modalStyles[type] || modalStyles.info;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <div
          className={`text-xl font-semibold mb-4 ${textColor} ${bgColor} p-4 rounded-t flex items-center justify-between`}
        >
          <span>{title}</span>
          <button onClick={onClose} className="text-white hover:opacity-75">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4 p-4">{message} {children}</div>
        <div className="flex justify-end">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`${bgColor} ${textColor} py-2 px-4 rounded hover:opacity-90 mr-2`}
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:opacity-90"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;