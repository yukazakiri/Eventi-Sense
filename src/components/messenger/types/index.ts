// src/types/index.ts
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    online?: boolean;
    role?: string;
    last_online?: string;
  }
  
  export interface Message {
    id: number;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    sender_name?: string;
    sender_avatar?: string;
    receiver_name?: string;
    receiver_avatar?: string;
    read?: boolean;
  }
  
  export interface MessageToSend {
    sender_id: string;
    receiver_id: string;
    content: string;
  }