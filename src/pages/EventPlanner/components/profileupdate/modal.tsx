interface ModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error';
    onClose: () => void;
  }
const Modal: React.FC<ModalProps> = ({ isOpen, title, description, type, onClose }) => {
    if (!isOpen) return null;
    
    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const borderColor = type === 'success' ? 'border-green-300' : 'border-red-300';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className={`${bgColor} ${borderColor} border p-6 rounded-lg max-w-md w-full`}>
          <h3 className={`text-lg font-medium ${textColor}`}>{title}</h3>
          <p className={`mt-2 ${textColor}`}>{description}</p>
          <button 
            onClick={onClose}
            className={`mt-4 px-4 py-2 ${textColor} border ${borderColor} rounded-lg hover:bg-opacity-80`}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;