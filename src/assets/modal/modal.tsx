import React, { useContext } from "react";
import { successMessages, errorMessages, confirmationMessages, MessageObject } from "./message";
import { CgDanger } from "react-icons/cg";
// Theme context
const ThemeContext = React.createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
}>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

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
  messageKey?: keyof MessageObject;
}

export const Modal: React.FC<ModalProps> = ({
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
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  let message = description || "";

  // Type-safe message lookup:
  if (messageKey) {
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
        message = confirmationMessages[messageKey as keyof typeof confirmationMessages] || message;
        confirmText = confirmText || "Yes";
        cancelText = cancelText || "No";
        break;
      default: // Includes "info" and "warning"
        confirmText = confirmText || "OK";
    }
  } else if (type !== "confirmation") {
    confirmText = confirmText || "OK";
  }

  const modalVariants = {
    light: {
      success: {
        headerBg: "bg-green-500/70",
        headerText: "text-white",
        button: "bg-green-500 text-white hover:bg-green-600",
        iconColor: "#10B981"
      },
      error: {
        headerBg: "bg-red-500/70",
        headerText: "text-white",
        button: "bg-red-500 text-white hover:bg-red-600",
        iconColor: "#EF4444"
      },
      info: {
        headerBg: "bg-blue-500/70",
        headerText: "text-white",
        button: "bg-blue-500 text-white hover:bg-blue-600",
        iconColor: "#3B82F6"
      },
      warning: {
        headerBg: "bg-yellow-500/70",
        headerText: "text-gray-800",
        button: "bg-yellow-500 text-gray-800 hover:bg-yellow-600",
        iconColor: "#F59E0B"
      },
      confirmation: {
        headerBg: "bg-rose-700/70",
        headerText: "text-white",
        button: "bg-rose-700 text-white hover:bg-rose-600",
        iconColor: "#8B5CF6"
      },
      modalBg: "bg-white",
      modalText: "text-gray-800",
      cancelButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
      shadow: "shadow-lg",
      overlay: "bg-black bg-opacity-50"
    },
    dark: {
      success: {
        headerBg: "bg-green-600/70",
        headerText: "text-gray-100",
        button: "bg-green-600 text-gray-100 hover:bg-green-700",
        iconColor: "#10B981"
      },
      error: {
        headerBg: "bg-red-600/70",
        headerText: "text-gray-100",
        button: "bg-red-600 text-gray-100 hover:bg-red-700",
        iconColor: "#EF4444"
      },
      info: {
        headerBg: "bg-blue-600/70",
        headerText: "text-gray-100",
        button: "bg-blue-600 text-gray-100 hover:bg-blue-700",
        iconColor: "#3B82F6"
      },
      warning: {
        headerBg: "bg-yellow-600/70",
        headerText: "text-gray-100",
        button: "bg-yellow-600 text-gray-100 hover:bg-yellow-700",
        iconColor: "#F59E0B"
      },
      confirmation: {
        headerBg: "bg-purple-600/70",
        headerText: "text-gray-100",
        button: "bg-purple-600 text-gray-100 hover:bg-purple-700",
        iconColor: "#8B5CF6"
      },
      modalBg: "bg-gray-800",
      modalText: "text-gray-100",
      cancelButton: "bg-gray-700 text-gray-100 hover:bg-gray-600",
      shadow: "shadow-2xl",
      overlay: "bg-black bg-opacity-70"
    }
  };

  const theme = isDarkMode ? modalVariants.dark : modalVariants.light;
  const typeStyles = theme[type];

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case "error":
        return (
          <CgDanger className="w-6 h-6" />
        );
      case "warning":
        return (
          <CgDanger className="w-6 h-6" />
        );
      case "info":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case "confirmation":
        return (
          <CgDanger className="w-6 h-6" />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 ${theme.overlay} flex justify-center items-center z-50 transition-all duration-300 ease-in-out`}>
      <div 
        className={`relative backdrop-blur-sm border text-gray-800 dark:text-white bg-white dark:bg-gray-900 rounded-xl overflow-hidden w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 hover:scale-100`}
        style={{ 
          animation: 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isDarkMode 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="absolute right-2 top-2">
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full flex justify-end items-end hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 transform transition-transform hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Header */}

        <div className={`px-6 py-4 flex flex-col items-center`}>
          <div className="flex flex-col items-center space-x-3">
            <span className={`rounded-full p-2 ${typeStyles.headerText} ${typeStyles.headerBg}`}>
              {getIcon()}
            </span>
            <h3 className="text-xl font-sofia tracking-widest mt-2">{title}</h3>
          </div>
          <div className="flex justify-center items-center mt-4">
            {message && (
              <p className="text-gray-600 dark:text-gray-300 leading-6 text-base text-center">
                {message}
              </p>
            )}
            {children && <div className="text-gray-800 dark:text-gray-200">{children}</div>}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 bg-white/95 dark:bg-gray-900/95 space-y-4">
          {/* Actions */}
          <div className={`flex justify-center gap-3 mt-6 ${type === "confirmation" ? "justify-between" : "justify-center"}`}>
            {type === "confirmation" && (
              <button
                onClick={onClose}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200
                  ${theme.cancelButton} 
                  hover:opacity-90 focus:ring-2 focus:ring-blue-500/50
                  border border-gray-200 dark:border-gray-700 w-full`}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm || onClose}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200
                ${typeStyles.button}
                hover:shadow-md focus:ring-2 focus:ring-blue-500/50 w-full
                ${isDarkMode ? 'shadow-blue-900/30' : 'shadow-blue-500/20'}`}
              style={{
                boxShadow: `${isDarkMode ? '0 3px 12px -1px rgba(0, 0, 0, 0.3)' : '0 3px 12px -1px rgba(59, 130, 246, 0.3)'}`
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};