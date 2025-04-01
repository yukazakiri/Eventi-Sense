export interface ProfileData {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;

    id: string;
    created_at: string;
    updated_at: string;

  }
  
  export interface ModalData {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error';
  }
  