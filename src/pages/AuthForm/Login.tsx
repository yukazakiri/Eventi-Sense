// Login.tsx (your React component)
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { login } from '../../api/authapi'; // Adjust path as needed

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage('');

  try {
    const result = await login(formData);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    // Handle successful login
    if (result.token && result.profile) {
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userId', result.profile.id);
      localStorage.setItem('userRole', result.profile.role);
      setRedirect(true);
    } else {
      setMessage("Login successful, but missing user data. Please contact support.");
    }
  } finally {
    setIsLoading(false);
  }
};

  const userRole = localStorage.getItem('userRole');
  if (redirect && userRole) {
    const redirectTo = userRole === 'admin' ? "/admin-dashboard" :
                     userRole === 'venue_manager' ? "/venue-manager-dashboard" :
                     userRole === 'supplier' ? "/venue-manager-dashboard" :
                     "/dashboard";
    return <Navigate to={redirectTo} />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default Login;