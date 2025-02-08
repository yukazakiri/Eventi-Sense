import { useState, useEffect, ChangeEvent } from 'react';
import { VenueImage } from '../../../../../api/apiVenueGallery';
import { getVenueImages, addVenueImage, deleteVenueImage } from '../../../../../api/apiVenueGallery';
import { useParams } from 'react-router-dom';
import Modal from '../../../../../assets/modal/modal'; // Import the Modal component
import { HomeIcon } from '@heroicons/react/20/solid';
import Breadcrumbs from '../../../../../components/BreadCrumbs/breadCrumbs';

const VenueGallery: React.FC = () => {
    const [images, setImages] = useState<VenueImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { venueId } = useParams<{ venueId: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalType, setModalType] = useState<"success" | "error" | "confirmation">("success"); // Include confirmation type
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);


  useEffect(() => {
    if (venueId) {
      loadImages();
    }
  }, [venueId]);
  
const breadcrumbItems = [
    { label: 'Home', href: '/Venue-Manager-Dashboard/Home' , icon: <HomeIcon className="h-4 w-4 mr-1" /> },
    { label: 'Venues', href: '/Venue-Manager-Dashboard/Venue-List' },
    { 
      label:  'Venue Details', // Dynamic label
      href: `/Venue-Manager-Dashboard/VenueDetails/${venueId}`, // Dynamic href
    },
    { label: 'Add Availability', href: '' }
  ];

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
        showModal("Success", "Image uploaded successfully.", "success"); // Use showModal
      } else {
        showModal("Error", "Venue ID is missing. Cannot upload.", "error"); // Use showModal
      }
    } catch (err) {
      console.error('Upload failed:', err);
      showModal("Error", "Upload failed. Please check the file and try again.", "error"); // Use showModal
    } finally {
      setUploading(false);
      if (e.target.files) {
        e.target.value = '';
      }
    }
  };

  const handleDelete = (imageId: string) => {
    setImageToDelete(imageId);
    showModal("Confirm Delete", "Are you sure you want to delete this image?", "confirmation"); // Confirmation modal
  };

  const confirmDelete = async () => {
    if (imageToDelete) {
      try {
        await deleteVenueImage(imageToDelete);
        setImages(prev => prev.filter(img => img.id !== imageToDelete));
        showModal("Success", "Image deleted successfully.", "success"); // Use showModal
      } catch (err) {
        console.error('Delete failed:', err);
        showModal("Error", "Delete failed. Please try again later.", "error"); // Use showModal
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
  return (
    <div className="p-4">
           <div className='flex items-center'>
                <Breadcrumbs items={breadcrumbItems} />
           </div>
      <div className='my-[2rem] max-w-56 '>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          accept="image/*"
          className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-100 file:text-indigo-600
          hover:file:bg-indigo-300"
        />
      </div>

      {uploading && <p className="text-gray-500">Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}

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