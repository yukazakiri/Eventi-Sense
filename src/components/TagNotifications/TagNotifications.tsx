import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { confirmTag, untagEntity } from '../../types/tagging';
import { IoClose } from 'react-icons/io5';
import { FiCalendar, FiClock, FiTag, FiCheck, FiX } from 'react-icons/fi';
import SuccessModal from '../Notifications/components/SuccessModal';
import ConfirmationModal from '../Notifications/components/ConfirmationModal';
import NotificationCardSimple from '../Notifications/components/NotificationCardSimple';
import NotificationCardDetailed from '../Notifications/components/NotificationCardDetailed';
import { TagNotification, SuccessModal as TagSuccessModal, EditModal as TagEditModal, DeleteModal as TagDeleteModal, TagNotificationsProps } from '../../types/TagNotification';

const TagNotifications: React.FC<TagNotificationsProps> = ({ 
  onNotificationCountChange,
  limit,
  showAll = false,
  showDetailed = false,
  filterStatus
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<TagNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<TagSuccessModal>({
    show: false,
    message: '',
    type: 'success'
  });
  const [editModal, setEditModal] = useState<TagEditModal>({
    show: false,
    notification: null
  });
  const [deleteModal, setDeleteModal] = useState<TagDeleteModal>({
    show: false,
    notificationId: null
  });

  // Update notification count whenever notifications change
  useEffect(() => {
    const unconfirmedCount = notifications.filter(n => !n.is_confirmed).length;
    onNotificationCountChange?.(unconfirmedCount);
  }, [notifications, onNotificationCountChange]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          setLoading(false);
          return;
        }

        // Get user's profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setLoading(false);
          return;
        }

        if (profile?.role === 'venue_manager') {
          const { data: managedVenues, error: venuesError } = await supabase
            .from('venues')
            .select('id')
            .eq('company_id', profile.id);  
            
          if (venuesError) {
            console.error('Error fetching venues:', venuesError);
            setLoading(false);
            return;
          }
          
          if (managedVenues && managedVenues.length > 0) {
            const venueIds = managedVenues.map(venue => venue.id);
            
            const { data: venueTags, error: tagsError } = await supabase
              .from('event_tags')
              .select(`
                *,
                event:events (
                  name,
                  date
                )
              `)
              .eq('tagged_entity_type', 'venue')
              .in('tagged_entity_id', venueIds)
              .order('created_at', { ascending: false });
              
            if (tagsError) {
              console.error('Error fetching venue tags:', tagsError);
            } else {
              setNotifications(venueTags || []);
            }
          }
        } else if (profile?.role === 'supplier') {
          const { data: supplierData, error: supplierError } = await supabase
            .from('supplier')
            .select('id')
            .eq('company_id', user.id)
            .single();
            
          if (supplierError) {
            console.error('Error fetching supplier:', supplierError);
            setLoading(false);
            return;
          }
          
          if (supplierData) {
            const { data: supplierTags, error: tagsError } = await supabase
              .from('event_tags')
              .select(`
                *,
                event:events (
                  name,
                  date
                )
              `)
              .eq('tagged_entity_type', 'supplier')
              .eq('tagged_entity_id', supplierData.id)
              .eq('is_confirmed', false)
              .order('created_at', { ascending: false });
              
            if (tagsError) {
              console.error('Error fetching supplier tags:', tagsError);
            } else {
              setNotifications(supplierTags || []);
            }
          }
        }
        
        setLoading(false);
        
        // Set up real-time subscription
        const channel = supabase.channel('event_tags_changes');
        
        channel
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'event_tags'
            }, 
            () => {
              fetchNotifications();
            }
          )
          .subscribe();
          
        return () => {
          channel.unsubscribe();
        };
        
      } catch (error) {
        console.error('Unexpected error in fetchNotifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (tagId: string) => {
    try {
      await confirmTag(tagId);
      setNotifications(prev => {
        const updated = prev.map(notif => 
          notif.id === tagId 
            ? { ...notif, is_confirmed: true } 
            : notif
        );
        // Update notification count after accepting
        const unconfirmedCount = updated.filter(n => !n.is_confirmed).length;
        onNotificationCountChange?.(unconfirmedCount);
        return updated;
      });
      setModal({
        show: true,
        message: 'Tag accepted successfully!',
        type: 'success'
      });
      setTimeout(() => {
        setModal(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      setModal({
        show: true,
        message: 'Failed to accept tag. Please try again.',
        type: 'error'
      });
      console.error('Error accepting tag:', error);
    }
  };

  const handleReject = async (tagId: string) => {
    try {
      await untagEntity(tagId);
      setNotifications(prev => {
        const updated = prev.filter(notif => notif.id !== tagId);
        // Update notification count after rejecting
        const unconfirmedCount = updated.filter(n => !n.is_confirmed).length;
        onNotificationCountChange?.(unconfirmedCount);
        return updated;
      });
      setModal({
        show: true,
        message: 'Tag rejected successfully!',
        type: 'success'
      });
      setTimeout(() => {
        setModal(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      setModal({
        show: true,
        message: 'Failed to reject tag. Please try again.',
        type: 'error'
      });
      console.error('Error rejecting tag:', error);
    }
  };

  const handleNavigateToEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  // In your render method, limit the notifications if needed
  const displayedNotifications = limit && !showAll 
    ? notifications.slice(0, limit) 
    : notifications;

  // Add this function to handle opening the modal
  const handleOpenModal = (notification: TagNotification) => {
    setEditModal({
      show: true,
      notification
    });
  };

  // Add delete handler
  const handleDelete = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('event_tags')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setModal({
        show: true,
        message: 'Notification deleted successfully!',
        type: 'success'
      });
      setTimeout(() => {
        setModal(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setModal({
        show: true,
        message: 'Failed to delete notification',
        type: 'error'
      });
    } finally {
      setDeleteModal({ show: false, notificationId: null });
    }
  };

  return (
    <div className="w-full py-4 relative">
      {/* Success/Error Modal */}
      <SuccessModal 
        show={modal.show}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal(prev => ({ ...prev, show: false }))}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={deleteModal.show}
        title="Delete Notification"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        onConfirm={() => deleteModal.notificationId && handleDelete(deleteModal.notificationId)}
        onCancel={() => setDeleteModal({ show: false, notificationId: null })}
      />

      {/* Edit Modal */}
      {editModal.show && editModal.notification && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm" 
               onClick={() => setEditModal({ show: false, notification: null })} 
          />
          <div className="fixed inset-x-4 top-[50%] translate-y-[-50%] max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Event Details
              </h3>
              <button
                onClick={() => setEditModal({ show: false, notification: null })}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <IoClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>
          </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {editModal.notification.event.name}
                </h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    {new Date(editModal.notification.event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiClock className="w-4 h-4 mr-2" />
                    Created: {new Date(editModal.notification.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FiTag className="w-4 h-4 mr-2" />
                    Type: {editModal.notification.tagged_entity_type}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status: {editModal.notification.is_confirmed ? 'Accepted' : 'Pending'}
                  </span>
                  {!editModal.notification.is_confirmed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          handleAccept(editModal.notification!.id);
                          setEditModal({ show: false, notification: null });
                        }}
                        className="flex items-center px-3 py-1.5 bg-green-500 dark:bg-green-600 text-white text-sm rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                      >
                        <FiCheck className="w-4 h-4 mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          handleReject(editModal.notification!.id);
                          setEditModal({ show: false, notification: null });
                        }}
                        className="flex items-center px-3 py-1.5 bg-red-500 dark:bg-red-600 text-white text-sm rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                      >
                        <FiX className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    handleNavigateToEvent(editModal.notification!.event_id);
                    setEditModal({ show: false, notification: null });
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  View Event Details
                </button>
                <button
                  onClick={() => {
                    setDeleteModal({ 
                      show: true, 
                      notificationId: editModal.notification!.id 
                    });
                    setEditModal({ show: false, notification: null });
                  }}
                  className="px-4 py-2 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/30 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <h2 className="text-sm pl-2 text-gray-800 dark:text-gray-200 mb-4">Tag Notifications</h2>

      {loading ? (
        <div className="text-center text-gray-500 py-4">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No pending notifications
        </div>
      ) : (
        <div className="space-y-4">
          {displayedNotifications
            .filter(notification => {
              if (!filterStatus || filterStatus === 'all') return true;
              if (filterStatus === 'pending') return !notification.is_confirmed;
              if (filterStatus === 'accepted') return notification.is_confirmed;
              return false;
            })
            .map((notification) => (
              showDetailed ? (
                <NotificationCardDetailed
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleOpenModal(notification)}
                />
              ) : (
                <NotificationCardSimple
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleOpenModal(notification)}
                />
              )
            ))}
        </div>
      )}
    </div>
  );
};

export default TagNotifications;