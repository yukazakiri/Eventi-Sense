// paymentTypes.ts
  export interface Event {
    id: string;
    name: string;
    description: string;
    date: string; // Or Date if you want to use Date objects
    location: string;
    organizer_id: string;
    organizer_type: string;
    category: string;
    image_url: string;
    ticket_price: number; // Or string if you want to handle currency symbols
    capacity: number;
    status: string;
    created_at: string; // Or Date if you want to use Date objects
    updated_at: string; // Or Date if you want to use Date objects
    tags: string; // or string[] if you want to store a list of tags
    check_in_time: string | null;
  }
  
  
  export interface Ticket {
    id: string;
    event_id: string;
    quantity: number;
    status: string;
    purchase_date?: string;
  }
  
  export interface Order {
    id: string;
    ticket_id: string;
    amount: number;
    payment_status: string;
    payment_date: string | null;
  }
  
  export interface CardDetails {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }