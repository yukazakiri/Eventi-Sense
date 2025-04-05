import React, { useState, useEffect } from 'react';
import { fetchAllVenues, deleteVenue } from '../../../api/Venue/venueapi';
import { MoonLoader } from 'react-spinners';
import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiMail, FiUser,  FiGlobe, FiDollarSign, FiTag, FiCheckSquare, FiEye, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Venue, CompanyProfile } from '../../../types/venue';

interface VenueWithCompany extends Venue {
  company_info?: CompanyProfile;
  venue_types: Array<{ id: string; name: string }>;
  venue_accessibilities: Array<{ id: string; name: string }>;
  venue_pricing_models: Array<{ id: string; name: string }>;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sofia">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto text-gray-800 dark:text-gray-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new interface for the confirmation modal
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sofia">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <FiTrash2 className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-center">{message}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function VenuesList() {
  const [venues, setVenues] = useState<VenueWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueWithCompany | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<string | null>(null);
  const [companyFilter, setCompanyFilter] = useState('');
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const venuesData = await fetchAllVenues();
        setVenues(venuesData);
        
        // Extract unique company names
        const uniqueCompanies = Array.from(new Set(
          venuesData
            .map(venue => venue.company_info?.company_name)
            .filter(name => name) // Remove undefined/null values
        ));
        setAvailableCompanies(uniqueCompanies as string[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  const handleDeleteClick = (venueId: string) => {
    setVenueToDelete(venueId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    if (!venueToDelete) return;

    try {
      await deleteVenue(venueToDelete);
      setVenues(venues.filter(venue => venue.id !== venueToDelete));
      setShowDeleteConfirmation(false);
      setVenueToDelete(null);
      setSelectedVenue(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <MoonLoader color="#3B82F6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center bg-white dark:bg-gray-900">
        Error: {error}
      </div>
    );
  }

  // Add function to calculate venue statistics
  const getVenueStats = () => {
    const stats = {
      total: venues.length,
      byCompany: {} as Record<string, number>
    };

    venues.forEach(venue => {
      const companyName = venue.company_info?.company_name || 'Unassigned';
      stats.byCompany[companyName] = (stats.byCompany[companyName] || 0) + 1;
    });

    return stats;
  };

  const venueStats = getVenueStats();
  const filteredVenues = venues.filter(venue => 
    venue.company_info?.company_name?.toLowerCase().includes(companyFilter.toLowerCase())
  );

  return (
    <div className="px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Venues Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and overview your venues</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Total Venues: {venueStats.total}
          </p>
        </div>
      </div>

      {/* Company Filter and Stats */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Companies</option>
            {availableCompanies.map((company) => (
              <option key={company} value={company}>
                {company} ({venueStats.byCompany[company] || 0})
              </option>
            ))}
          </select>
          
          {/* Company Statistics */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(venueStats.byCompany).map(([company, count]) => (
              <div 
                key={company}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
              >
                {company}: {count}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div 
            key={venue.id} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          >
            {/* Venue Card Content */}
            <div className="relative h-48 group">
              <img
                src={venue.cover_image_url || venue.cover_photo || '/default-venue.jpg'}
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Link
                  to={`/admin/venues/edit/${venue.id}`}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <FiEdit2 className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                </Link>
                <button
                  onClick={() => setSelectedVenue(venue)}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                >
                  <FiEye className="text-gray-600 dark:text-gray-300 w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{venue.name}</h3>
              {venue.company_info && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 mb-3">
                  <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>{venue.company_info.company_name}</span>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FiMapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>{venue.address_city}, {venue.address_state}</span>
                </div>
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <FiDollarSign className="w-5 h-5" />
                  <span className="font-medium">{venue.price}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span>Capacity: {venue.capacity} guests</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Venue Details Modal */}
      {selectedVenue && (
        <Modal
          isOpen={!!selectedVenue}
          onClose={() => setSelectedVenue(null)}
          title={selectedVenue.name}
        >
          <div className="space-y-6">
            {/* Modal Content */}
            <div className="relative h-64">
              <img
                src={selectedVenue.cover_image_url || selectedVenue.cover_photo || '/default-venue.jpg'}
                alt={selectedVenue.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Venue Details Column */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Venue Details</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-500 dark:text-gray-400" />
                    <span>{`${selectedVenue.address_street}, ${selectedVenue.address_city}, ${selectedVenue.address_state} ${selectedVenue.address_zip}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-500 dark:text-gray-400" />
                    <span>{selectedVenue.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-gray-500 dark:text-gray-400" />
                    <span>{selectedVenue.email}</span>
                  </div>
                  {selectedVenue.website && (
                    <div className="flex items-center gap-2">
                      <FiGlobe className="text-gray-500 dark:text-gray-400" />
                      <a href={selectedVenue.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-green-600 dark:text-green-400" />
                    <span>{selectedVenue.price}</span>
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span> {selectedVenue.capacity} guests
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Venue Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.venue_types.map(type => (
                      <span key={type.id} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Info Column */}
              <div className="space-y-4">
                {selectedVenue.company_info && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Company Information</h3>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <div>{selectedVenue.company_info.company_name}</div>
                      <div>{selectedVenue.company_info.company_address}</div>
                      <div>{selectedVenue.company_info.company_phone}</div>
                      <div>{selectedVenue.company_info.company_email}</div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Accessibility Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.venue_accessibilities.map(access => (
                      <span key={access.id} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                        <FiCheckSquare className="inline mr-1" />
                        {access.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Pricing Models</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.venue_pricing_models.map(model => (
                      <span key={model.id} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                        <FiTag className="inline mr-1" />
                        {model.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleDeleteClick(selectedVenue.id)}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                Delete Venue
              </button>
              <button
                onClick={() => setSelectedVenue(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
          setVenueToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Venue"
        message="Are you sure you want to delete this venue? This action cannot be undone and will permanently remove the venue from the system."
      />
    </div>
  );
}

export default VenuesList;