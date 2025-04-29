export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  venue_id: string;
  amount: number;
  payment_type: 'downpayment' | 'full' | 'balance';
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
  payment_date: string;
  created_at?: string;
}

export interface Receipt {
  id: string;
  payment_id: string;
  receipt_number: string;
  issued_at: string;
  pdf_path: string;
}

export type PaymentMethod = 'credit_card' | 'gcash' | 'paypal';