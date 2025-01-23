import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient'; // Adjust the import path

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      console.log('Supabase Response:', data); // Log the response
      console.log('Supabase Error:', error); // Log any errors
  

      if (error) {
        throw error;
      }

      // Check the user's role (assuming it's stored in user_metadata)
      const role = data.user?.user_metadata?.role || 'user';
      setUserRole(role);
      setRedirect(true);
    } catch (error: any) {
      setMessage(error.message || 'Login failed');
    }
  };

  if (redirect) {
    if (userRole === 'admin') {
      return <Navigate to="/admin-dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
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
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          Login
        </button>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default Login;