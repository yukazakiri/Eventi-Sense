// apiCall.ts (or your API file)
import axios from 'axios'; // Or your preferred HTTP client

const API_BASE_URL = 'http://localhost:5000'; // Adjust to your backend URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});


interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
  profile?: ProfileData;
  token?: string;
}

// apiCall.ts
export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/api/auth/login`, data);
    
    // Store token only if present
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return {
      message: response.data.message,
      user: response.data.user,
      profile: response.data.profile, // Add this if your backend returns profile data
      token: response.data.token
    };
  } catch (error: any) {
    // Handle different error types
    if (error.response) {
      // Backend returned error response (4xx/5xx)
      return { 
        error: error.response.data.error || 'Login failed. Please check your credentials.' 
      };
    } else if (error.request) {
      // Request was made but no response received
      return { error: 'Network error. Please check your internet connection.' };
    }
    // Other errors
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};