// VenueDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VenueInfoForm from './VenueDetails/VenueInfor';
import AddressForm from './VenueDetails/VenueAddress';
import ImageUploadForm from './VenueDetails/VenueCoverPage';
import AmenitiesForm from './VenueDetails/Amenities';
import { Venue } from '../../../types/venue';
import SocialMediaLinks from '../../VenueManager/Social/SocialLinks';
import Gallery from './VenueDetails/AvailabiltyGallery/Gallery';
import AvailabilityForm from './VenueDetails/AvailabiltyGallery/AddVenueAvailabilityForm';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/20/solid';
import {
  fetchVenue,
  fetchVenueAmenities,
  fetchAmenities,
  updateVenue,
  updateVenueAmenities,
  deleteVenue
} from '../../../api/Venue/venueapi';
import { Modal } from '../../../assets/modal/modal';
import { successMessages, errorMessages, confirmationMessages, MessageObject } from '../../../assets/modal/message';


const breadcrumbItems = [
  { label: 'Home', href: '/Venue-Manager-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'List', href: '/Venue-Manager-Dashboard/Venue-List' },
  { label: 'Details', href: '' },
];

interface Amenity {
  id: string;
  name: string;
}

interface VenueAmenity {
  venue_id: string;
  amenity_id: string;
  quantity: number | null;
  description: string | null;
}

const VenueDetailPage: React.FC = () => {
  const { venueId: venueIdFromParams = '' } = useParams<{ venueId: string }>();
  const [venueId, setVenueId] = useState<number | string | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [_venueAmenities, setVenueAmenities] = useState<VenueAmenity[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<VenueAmenity[]>([]);
  const [isEditingAmenities, setIsEditingAmenities] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning' | 'confirmation'>('info');
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [modalMessageKey, setModalMessageKey] = useState<keyof MessageObject | undefined>(undefined);

  useEffect(() => {
    setVenueId(venueIdFromParams);
  }, [venueIdFromParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (!venueId) return;

      try {
        setLoading(true);

        const [venueData, venueAmenitiesData, amenitiesData] = await Promise.all([
          fetchVenue(venueId),
          fetchVenueAmenities(venueId),
          fetchAmenities(),
        ]);

        setVenue(venueData);
        setVenueAmenities(venueAmenitiesData);
        setSelectedAmenities(venueAmenitiesData);
        setAmenities(amenitiesData);
      } catch (err: any) {
        console.error('Error in fetchData:', err);
        setError(err.message);
        showErrorModal('networkError');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [venueId]);

  // Modal helper functions
  const showSuccessModal = (messageKey: keyof typeof successMessages) => {
    setIsModalOpen(true);
    setModalTitle('Success');
    setModalType('success');
    setModalMessageKey(messageKey);
    setModalAction(() => closeModal);
  };

  const showErrorModal = (messageKey: keyof typeof errorMessages) => {
    setIsModalOpen(true);
    setModalTitle('Error');
    setModalType('error');
    setModalMessageKey(messageKey);
    setModalAction(() => closeModal);
  };

  const showConfirmationModal = (messageKey: keyof typeof confirmationMessages, onConfirm: () => void) => {
    setIsModalOpen(true);
    setModalTitle('Confirmation');
    setModalType('confirmation');
    setModalMessageKey(messageKey);
    setModalAction(() => onConfirm);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveVenue = async (updatedVenue: Venue) => {
    try {
      await updateVenue(updatedVenue);
      setVenue(updatedVenue);
      setIsEditingInfo(false);
      setIsEditingAddress(false);
      showSuccessModal('itemSaved');
    } catch (err: any) {
      console.error('Error updating venue:', err);
      setError(err?.message || 'An error occurred while updating.');
      showErrorModal('networkError');
    }
  };

  const handleSaveVenueAmenities = async (venue: Venue, updatedVenueAmenities: VenueAmenity[]) => {
    try {
      await updateVenueAmenities(venue, updatedVenueAmenities);
      setVenueAmenities(updatedVenueAmenities);
      setSelectedAmenities(updatedVenueAmenities);
      showSuccessModal('itemSaved');
    } catch (err: any) {
      console.error('Error updating venue amenities:', err);
      setError(err?.message || 'An error occurred while updating venue amenities.');
      showErrorModal('networkError');
    }
  };
  
  const openDeleteModal = () => {
    showConfirmationModal('deleteItem', handleDeleteVenue);
  };

  const handleDeleteVenue = async () => {
    try {
      if (venue && venue.id) {
        const venueIdString = String(venue.id);
        console.log('Venue ID to delete (string):', venueIdString);
        await deleteVenue(venueIdString);
        showSuccessModal('itemSaved');
        setTimeout(() => {
          navigate('/Venue-Manager-Dashboard/Venue-list');
        }, 1500); // Navigate after showing success message
      } else {
        setError('Venue ID is missing. Cannot delete.');
        showErrorModal('invalidInput');
      }
    } catch (err: any) {
      console.error('Error deleting venue:', err);
      setError(err?.message || 'An error occurred while deleting the venue.');
      showErrorModal('networkError');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error && !isModalOpen) {
    return <div>Error: {error}</div>;
  }

  if (!venue) {
    return <div>Venue not found.</div>;
  }

  const tabs = [
    { id: 'info', name: 'Venue Info' },
    { id: 'address & amenities', name: 'Address & Amenities' },
    { id: 'social', name: 'Social Media' },
    { id: 'cover photo', name: 'Cover Photo' },
    { id: 'gallery', name: 'Gallery' },
    { id: 'availability', name: 'Availability' },
    { id: 'setting', name: 'Settings' },
  ];

  return (
    <div className='lg:mx-16 md:mx-10 sm:mx-6 md:my-10'>
           <div className='flex justify-end mr-4'>
                      <Breadcrumbs items={breadcrumbItems} />
                  </div>
    <div className="flex flex-col gap-8  bg-white dark:bg-gray-900 pb-8">
      
      <div className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 transition-all duration-300">
        {/* Always render the gradient div, but hide it initially if there's a cover photo */}
        <div 
          className="w-full h-72 bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 rounded-t-2xl relative fallback-gradient"
          style={{display: venue.cover_image_url ? 'none' : 'block'}}
        />
        
        {/* Only render the image if there's a cover photo */}
        {venue.cover_image_url && (
          <img 
            src={venue.cover_image_url} 
            alt="Venue Cover" 
            className="w-full max-h-96 object-cover rounded-t-2xl" 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              // Find the gradient div by class name
              const gradientDiv = (e.target as HTMLElement).parentNode?.querySelector('.fallback-gradient');
              if (gradientDiv) {
                (gradientDiv as HTMLElement).style.display = 'block';
              }
            }}
          />
        )}

</div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        type={modalType}
        messageKey={modalMessageKey}
        onConfirm={modalAction}
      />
      
      <div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-sofia text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="lg:my-10 lg:mx-10 ">
          {activeTab === 'info' && (
            <VenueInfoForm
              venue={venue}
              isEditing={isEditingInfo}
              setIsEditing={setIsEditingInfo}
            />
          )}
          {activeTab === 'address & amenities' && (
            <div className='grid md:grid-cols-2 gap-4 mt-4'>  
              <div className='w-full col-start-1'>
                <AddressForm
                  venue={venue}
                  onSave={handleSaveVenue}
                  isEditing={isEditingAddress}
                  setIsEditing={setIsEditingAddress}
                />
              </div>
              <div className='w-full'>
                <AmenitiesForm
                  venue={venue}
                  amenities={amenities}
                  selectedAmenities={selectedAmenities}
                  onSave={handleSaveVenueAmenities}
                  isEditing={isEditingAmenities}
                  setIsEditing={setIsEditingAmenities}
                /> 
              </div>
            </div>
          )}
          
          {activeTab === 'social' && (
            <SocialMediaLinks venues_id={venue.id.toString()} isEditing={isEditing} setIsEditing={setIsEditing}/>
          )}
          {activeTab === 'cover photo' && (
            <ImageUploadForm venueId={venue.id.toString()} isEditing={isEditingImage} setIsEditingImage={setIsEditingImage} />
          )}
          {activeTab === 'gallery' && (
            <Gallery />
          )}
          {activeTab === 'availability' && (
            <AvailabilityForm />
          )}
             {activeTab === 'setting' && (
  <div className="space-y-8 divide-y divide-gray-200 dark:divide-gray-700 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    {/* Privacy Settings */}
    <div className="space-y-4 pb-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Privacy Settings</h3>

   

    {/* Danger Zone */}
    <div className="space-y-4 pt-8">
      <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
      <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-medium text-red-800 dark:text-red-200">Delete this Venue</h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              This will permanently delete all venue data and cannot be undone.
            </p>
          </div>
          <button
            onClick={openDeleteModal}
            className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
          >
            Delete Venue
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
)}
        </div>
      </div>
    </div>
    </div>
  );
};

export default VenueDetailPage;