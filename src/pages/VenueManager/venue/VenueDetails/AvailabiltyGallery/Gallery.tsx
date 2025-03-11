import { useState, useEffect, ChangeEvent } from 'react';
import { VenueImage } from '../../../../../api/apiVenueGallery';
import { getVenueImages, addVenueImage, deleteVenueImage } from '../../../../../api/apiVenueGallery';
import { useParams } from 'react-router-dom';
import Modal from '../../../../../assets/modal/modal';
import { PhotoIcon,  ArrowUpTrayIcon } from '@heroicons/react/20/solid';


const VenueGallery: React.FC = () => {
    const [images, setImages] = useState<VenueImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { venueId } = useParams<{ venueId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "confirmation">("success");
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (venueId) {
      loadImages();
    }
  }, [venueId]);
  

  const loadImages = async () => {
    if (!venueId) {
      console.error("venueId is undefined");
      return;
    }
    try {
      const gallery = await getVenueImages(venueId);
      setImages(gallery);
      setError(null);
    } catch (err) {
      console.error("Error loading images:", err);
      setError("Failed to load images. Please try again later.");
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      if (venueId) {
        await addVenueImage(venueId, file);
        await loadImages();
        showModal("Success", "Image uploaded successfully.", "success");
      } else {
        showModal("Error", "Venue ID is missing. Cannot upload.", "error");
      }
    } catch (err) {
      console.error('Upload failed:', err);
      showModal("Error", "Upload failed. Please check the file and try again.", "error");
    } finally {
      setUploading(false);
      if (e.target.files) {
        e.target.value = '';
      }
    }
  };

  const handleDelete = (imageId: string) => {
    setImageToDelete(imageId);
    showModal("Confirm Delete", "Are you sure you want to delete this image?", "confirmation");
  };

  const confirmDelete = async () => {
    if (imageToDelete) {
      try {
        await deleteVenueImage(imageToDelete);
        setImages(prev => prev.filter(img => img.id !== imageToDelete));
        showModal("Success", "Image deleted successfully.", "success");
      } catch (err) {
        console.error('Delete failed:', err);
        showModal("Error", "Delete failed. Please try again later.", "error");
      } finally {
        setImageToDelete(null);
      }
    }
  };

  const showModal = (title: string, description: string, type: "success" | "error" | "confirmation") => {
    setModalTitle(title);
    setModalDescription(description);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploading(true);
      
      try {
        if (venueId) {
          await addVenueImage(venueId, files[0]);
          await loadImages();
          showModal("Success", "Image uploaded successfully.", "success");
        } else {
          showModal("Error", "Venue ID is missing. Cannot upload.", "error");
        }
      } catch (err) {
        console.error('Upload failed:', err);
        showModal("Error", "Upload failed. Please check the file and try again.", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="bg-white sm:p-6 md:p-[2rem] border-[1px] border-gray-300 rounded-3xl dark:bg-gray-900 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">


      <div className="bg-white rounded-lg shadow-md p-6 mb-8 dark:bg-gray-900">
        <h1 className="text-2xl font-bold font-bonanova text-gray-800 dark:text-white mb-6 flex items-center">
        <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-xl mr-4">
          <PhotoIcon className="h-6 w-6  text-sky-600 dark:text-sky-500" />
          </div>  
          Venue Gallery

        </h1>

        <p className="text-gray-600 dark:text-white mb-6">
          Upload high-quality images to showcase your venue.
        </p>

        <div 
          className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900' : 'border-gray-300 dark:border-gray-700'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <ArrowUpTrayIcon className="h-12 w-12 text-sky-500 dark:text-white mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Upload Venue Images</h3>
            <p className="text-sm text-gray-500 dark:text-white mb-4">Drag and drop an image here, or click the button below</p>
            
            <label className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white dark:text-white bg-sky-600 hover:bg-sky-700 cursor-pointer transition-colors duration-200">
              <input
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                accept="image/*"
                className="sr-only"
              />
              Select Image
            </label>
          </div>
        </div>

        {uploading && (
          <div className="bg-blue-50 text-blue-700 p-4 rouned-md mb-6 flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600 dark:text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading your image...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 dark:bg-red-900 dark:text-red-500">
            {error}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Gallery Images ({images.length})</h2>
          <div className="masonry columns-2 md:columns-4">
        {images.length > 0 ? (
          images.map(image => (
            <div key={image.id} className="relative group break-inside-avoid mb-8">
              <img
                className="w-full rounded-lg"
                src={image.image_url}
                alt="Venue gallery"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No images yet.</p>
        )}
      </div>
         
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        description={modalDescription}
        onClose={closeModal}
        type={modalType} // Pass the type to the Modal
        confirmText={modalType === "confirmation" ? "Yes" : "OK"} // Conditional confirm text
        cancelText={modalType === "confirmation" ? "No" : "Close"} // Conditional cancel text
        onConfirm={modalType === "confirmation" ? confirmDelete : closeModal} // Conditional onConfirm
      >
        {modalType === "error" && imageToDelete && (
          <div className="mt-4">
            <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
              Yes, Delete
            </button>
            <button onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default VenueGallery;