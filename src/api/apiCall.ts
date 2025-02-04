import axios from 'axios';
import { ApiResponse, RegisterData, LoginData, UserAuth, UserAuthProfile  } from '../types/types.ts'; // Adjust the import path


const API_BASE_URL = 'http://localhost:5000'; // Adjust to your backend URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Register a new user
 * @param {RegisterData} data - User registration data (email, password, name)
 * @returns {Promise<ApiResponse>} - Response from the server
 */
export const register = async (data: RegisterData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/auth/register', data);
    return response.data; // Return the response data (e.g., success message or user data)
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      return { error: error.response.data.message || 'Registration failed' };
    } else if (error.request) {
      // The request was made but no response was received
      return { error: 'No response from the server' };
    } else {
      // Something happened in setting up the request
      return { error: 'An error occurred. Please try again.' };
    }
  }
};

/**
 * Fetch all registered users
 * @returns {Promise<ApiResponse>} - Response containing the list of users
 */
export const fetchAllUsers = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/auth/profiles');
    console.log('API Response:', response.data); // Debug the API response

    // Check if the response contains the `profiles` array
    if (response.data && Array.isArray(response.data.profiles)) {
      // Map through the profiles and transform them into the `User` type
      const usersWithAvatar = response.data.profiles.map((user: any) => ({
        id: user.id,
        full_name: user.full_name || null,
        username: user.username || null,
        role: user.role || 'regular_user', // Default role if not provided
        email: user.email || null,
        avatar_url: user.avatar_url || null,
        website: user.website || null,
        updated_at: user.updated_at || null,
      }));

      return { users: usersWithAvatar }; // Return the list of users
    } else {
      // If the `profiles` array is missing, return an error
      return { error: 'Invalid response format: profiles array not found' };
    }
  } catch (error: any) {
    console.error('Error fetching users:', error); // Debug the error

    if (error.response) {
      // The request was made and the server responded with a status code
      return { error: error.response.data.message || 'Failed to fetch users' };
    } else if (error.request) {
      // The request was made but no response was received
      return { error: 'No response from the server' };
    } else {
      // Something happened in setting up the request
      return { error: 'An error occurred. Please try again.' };
    }
  }
};
/**
 * Log in an existing user
 * @param {LoginData} data - User login data (email, password)
 * @returns {Promise<ApiResponse>} - Response from the server
 */
export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/api/auth/login`, data);
    console.log('Login response:', response.data); // Debugging

    const token = response.data.token;
    if (token) {
      localStorage.setItem('authToken', token); // Store the token in localStorage
      console.log('Token stored in localStorage:', token); // Debugging
    }

    return {
      message: response.data.message,
      user: {
        id: response.data.user.id,
        role: response.data.user.role,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
      },
      token: token,
    };
  } catch (error: any) {
    if (error.response) {
      return { error: error.response.data.message || 'Login failed.' };
    } else if (error.request) {
      return { error: 'No response from the server. Please check your connection.' };
    } else {
      return { error: 'An error occurred. Please try again.' };
    }
  }
};

export const getUserRole = async (userId: string): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/user-role/${userId}`);
    return { role: response.data.role }; // Return the user's role
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      return { error: error.response.data.message || 'Failed to fetch user role' };
    } else if (error.request) {
      // The request was made but no response was received
      return { error: 'No response from the server' };
    } else {
      // Something happened in setting up the request
      return { error: 'An error occurred. Please try again.' };
    }
  }
};
// Define the UserAuth interface


// Example API call to fetch the users


export const getAllAuthusers = async (): Promise<UserAuth[]> => {
try {
  const response = await api.get('/api/auth/get-users');
  const users: UserAuth[] = response.data.result;
  return users;
} catch (error) {
  console.error('Error fetching users:', error);
  throw error;
}
};

export const getUserById = async (userId: string): Promise<UserAuth> => {
  console.log('Fetching user details for ID:', userId);
  try {
    
    const response = await api.post('/api/auth/get-userById', { userId });
    console.log('User details:', response.data.user);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }


};
export const assignRoleToUser = async (userId: string, role: string): Promise<any> => { // Adjust return type to any
  try {
    const response = await api.post('/api/auth/assign-role', { userId, role });
    console.log('API Response:', response.data); // Ensure response data is logged
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  console.log('Deleting user with ID:', userId);
  try {
    const response = await api.delete(`/api/auth/delete-user/${userId}`);
    return response.data.success;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
// apiCall.ts
export const updateUser = async (userId: string, profileData: UserAuthProfile, token: string): Promise<UserAuth> => {
  try {
    const response = await api.post(
      '/api/auth/update-user',
      {
        userId,
        profileData: {
          ...profileData,
          username: profileData.username || null,
          full_name: profileData.full_name || null,
          avatar_url: profileData.avatar_url || null,
          website: profileData.website || null,
          email: profileData.email || null,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token here
        },
      }
    );

    if (!response.data.user) {
      throw new Error('No user data returned from the server');
    }

    return response.data.user;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'Failed to update user';
    throw new Error(errorMessage);
  }
};

// Usage example
