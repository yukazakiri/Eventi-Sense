import { useState, useEffect } from "react";
import EventPlannerinfo from "./Register";
import HomeDetails from "./HomeDetails";
import { getCurrentUser } from "../../api/utiilty/profiles";
import { fetchEventPlanner } from "../../api/utiilty/eventplanner";
import { MoonLoader } from "react-spinners";


interface EventPlannerProfile {
  id: string;
  // Add other profile fields as needed
  [key: string]: any;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<EventPlannerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasEventPlanner, setHasEventPlanner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      if (user) {
        try {
          const eventPlanner = await fetchEventPlanner(user.id);
          if (eventPlanner) {
            setProfileData(eventPlanner as EventPlannerProfile);
            setHasEventPlanner(true);
          } else {
            setHasEventPlanner(false);
          }
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError(err instanceof Error ? err.message : "An error occurred");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dark:bg-gray-950 scrollbar-hide">
      {hasEventPlanner && profileData ? (
       <HomeDetails/>
      ) : (
        <EventPlannerinfo />
      )}

 
    </div>
  );
}