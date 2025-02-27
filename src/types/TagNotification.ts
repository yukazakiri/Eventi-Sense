export interface TagNotification {
  id: string;
  event_id: string;
  tagged_entity_id: string;
  tagged_entity_type: 'venue' | 'supplier';
  is_confirmed: boolean;
  created_at: string;
  event: {
    name: string;
    date: string;
  };
}

export interface SuccessModal {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export interface EditModal {
  show: boolean;
  notification: TagNotification | null;
}

export interface DeleteModal {
  show: boolean;
  notificationId: string | null;
}

export interface TagNotificationsProps {
  onNotificationCountChange?: (count: number) => void;
  limit?: number;
  showAll?: boolean;
  showDetailed?: boolean;
  filterStatus?: 'all' | 'pending' | 'accepted' | 'rejected';
} 