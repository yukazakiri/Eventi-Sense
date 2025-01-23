import React from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../api/supabaseClient'; // Adjust the import path

const ProtectedRoute: React.FC<{ children: React.ReactNode, requiredRole: string }> = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserRole(user?.user_metadata?.role);
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
  }
  
  return children; // Render the requested component if the user has the required role
};

export default ProtectedRoute;