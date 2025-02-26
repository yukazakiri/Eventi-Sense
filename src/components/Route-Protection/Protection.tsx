import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';

interface ProtectionProps {
  requiredRole: string;
  children: React.ReactNode; // Add the children prop here
}

const Protection = ({ requiredRole, children }: ProtectionProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation(); // To preserve the location for redirect

  // Check if user is authenticated
  const checkAuth = async () => {
    console.log("Checking authentication...");
    const { data: session, error } = await supabase.auth.getSession();


    if (error) {
      console.error("Error fetching session:", error);
      setIsAuthenticated(false);
      setLoading(false); // Ensure loading is set to false on error
      return;
    }

    if (session?.session && session.session.user) {
      setIsAuthenticated(true);
      fetchUserRole(session.session.user.id); // Fetch the user's role after authentication
    } else {
      setIsAuthenticated(false);
      setLoading(false); // Ensure loading is set to false when there's no session
    }
  };

  // Fetch user role from the database
  const fetchUserRole = async (userId: string) => {

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
        setLoading(false); // Ensure loading is set to false on error
        return;
      }

      setUserRole(data?.role || null);
      setLoading(false); // Set loading to false once the role is fetched
    } catch (err) {

      setUserRole(null);
      setLoading(false); // Ensure loading is set to false on error
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth state changes (login/logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {


      if (session && session.user) {
        checkAuth();
      } else {
        setIsAuthenticated(false);
        setLoading(false); // Set loading to false when session is null
      }
    });

    return () => {
      // Ensure the subscription is properly unsubscribed
      if (subscription && subscription.subscription) {
        subscription.subscription.unsubscribe();
      }
    };
  }, []);

  // While authentication state and user role are being loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If the user does not have the required role, redirect to unauthorized page
  if (userRole !== requiredRole) {

    return <Navigate to="/unauthorized" />;
  }

  // If everything is good, render the children (protected content)
  return <>{children}</>;
};

export default Protection;
