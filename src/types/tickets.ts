// Dashboard related types
export interface Ticket {
    id: string;
    event_id: string;
    user_id: string;
    quantity: number;
    status: 'reserved' | 'confirmed';
    purchase_date: string;
    created_at: string;
    updated_at: string;
    check_in_time?: string;
    check_in_status?: 'checked_in' | 'checked_in_late' | 'not_checked_in';
  }
  
  export interface Order {
    id: string;
    ticket_id: string;
    amount: string;
    payment_status: 'completed' | 'pending';
    payment_date: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Event {
    id: string;
    name: string;
    organizer_id: string;
  }
  
  export interface SummaryCard {
    title: string;
    value: number | string;
    description: string;
    icon: React.ReactNode;
    bgColor: string;
  }
  
  export interface RecentOrder {
    orderId: string;
    eventName: string;
    amount: string;
    status: string;
    date: string;
  }