import { useEffect } from 'react';
import supabase from '../api/supabaseClient';

export default function ConfirmSuccess() {
  useEffect(() => {
    const handleAuth = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
        window.location.href = '/confirm-success';
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#101F36] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Confirmation Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Your email has been verified. You can now sign in to your account.
        </p>
        <button
          onClick={() => window.location.href = '/auth'}
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}