import supabase from "../../../../api/supabaseClient";

export const fetchEventPlannerId = async (setIsLoading: (isLoading: boolean) => void, setEventPlannerId: (eventPlannerId: string) => void, setError: (error: string) => void) => {
    try {
        setIsLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
            throw new Error(userError.message);
        }

        if (!user) {
            throw new Error("No user found");
        }

        // Get event planner profile
        const { data: eventPlanner, error: plannerError } = await supabase
            .from('eventplanners')
            .select('profile_id')
            .eq('profile_id', user.id)
            .single();

        if (plannerError) {
            throw new Error(plannerError.message);
        }

        if (!eventPlanner?.profile_id) {
            throw new Error("No event planner profile found");
        }

        setEventPlannerId(eventPlanner.profile_id);
    } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching event planner:", err);
    } finally {
        setIsLoading(false);
    }
};