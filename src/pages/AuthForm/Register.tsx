import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role after successful sign-in
  useEffect(() => {
    if (redirect && userRole) {
      // Redirect logic is handled in the return statement
    }
  }, [redirect, userRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      // Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
  
      // Fetch the user's role from the public.profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
  
      if (profileError) throw profileError;
  
      console.log('Profile Data:', profileData); // Debugging
      console.log('Profile Error:', profileError); // Debugging
  
      // Set the user role and trigger redirect
      setUserRole(profileData.role);
      setRedirect(true);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const signUpData = {
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      };
      const { data, error } = await supabase.auth.signUp(signUpData);
      if (error) throw error;

      console.log('User signed up:', data.user);
      setMessage('Check your email for the confirmation link.');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect logic
  if (redirect && userRole) {
    const redirectTo =
      userRole === 'admin'
        ? '/admin-dashboard'
        : '/';
    return <Navigate to={redirectTo} />;
  }

  return (
    <>
      {isSignUp ? (
        // Sign-Up Form
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <form onSubmit={handleSignUp} className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.firstName}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.lastName}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
            {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-500 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      ) : (
        // Sign-In Form
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <form onSubmit={handleSignIn} className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>
            {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            <p className="text-center mt-4 text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      )}
    </>
  );
}