import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { MoonLoader } from "react-spinners";


interface ProtectionProps {
    requiredRole: string;
    children: React.ReactNode;
}

const Protection = ({ requiredRole, children }: ProtectionProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true; // Track component mount status
        let authSubscription: { subscription?: { unsubscribe: () => void } } = {};

        const checkAuth = async (session: Session) => {
            console.log("Checking authentication...");
            console.log("Protection useEffect running, location:", location.pathname); // Add this line
            if (!isMounted) return; // Don't proceed if component is unmounted
            
            if (session && session.user) {
                if (isMounted) setIsAuthenticated(true);
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching user role:', error);
                        if (isMounted) setUserRole(null);
                    } else {
                        if (isMounted) setUserRole(data?.role || null);
                    }
                } catch (err) {
                    console.error('Error fetching user role:', err);
                    if (isMounted) setUserRole(null);
                }
            } else {
                if (isMounted) {
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            }
            if (isMounted) setLoading(false);
        };

        const handleAuthStateChange = (_event: any, session: any) => {
            if (!isMounted) return;
            
            if (location.pathname === '/' || location.pathname === '/logout') {
                setIsAuthenticated(session && session.user);
                setUserRole(null);
                setLoading(false);
            } else {
                checkAuth(session);
            }
        };

        // Set up auth state change subscription
        const setupSubscription = async () => {
            const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);
            if (isMounted) {
                authSubscription = data;
            }
            
            // Initial check
            const { data: sessionData } = await supabase.auth.getSession();
            if (isMounted) {
                handleAuthStateChange(null, sessionData.session);
            }
        };
        
        setupSubscription();

        // Cleanup function
        return () => {
          console.log("Protection useEffect cleanup");
            isMounted = false;
            if (authSubscription && authSubscription.subscription) {
                authSubscription.subscription.unsubscribe();
            }
        };
    }, [location.pathname, requiredRole]);

    if (loading) {
        return (
            <div className="dark:bg-gray-950 scrollbar-hide">
                <div className="flex justify-center items-center h-screen">
                    <MoonLoader
                        color="#ffffff"
                        size={60}
                        speedMultiplier={1}
                    />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/register" state={{ from: location }} />;
    }

    if (userRole !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
};

export default Protection;