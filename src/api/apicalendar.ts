import  supabase  from './supabaseClient';



// Function to add venue availability
export async function addVenueAvailability(
    venueId: string,
    startTime: string, // ISO 8601 format: 'YYYY-MM-DDTHH:mm:ss.sssZ' (UTC)
    endTime: string   // ISO 8601 format: 'YYYY-MM-DDTHH:mm:ss.sssZ' (UTC)
) {
    try {
        const { data, error } = await supabase
            .from("venue_availability")
            .insert([
                {
                    venue_id: venueId,
                    available_start: startTime,
                    available_end: endTime,
                },
            ])
            .select();

        if (error) {
            console.error("Supabase Error adding availability:", error);  // Log the full error object
            throw error; // Re-throw the error to be caught by the calling function
        }

        console.log("Availability added:", data);
        return data;

    } catch (error) {
        console.error("Error in addVenueAvailability:", error); // Catch and log any errors
        throw error; // Re-throw the error to be handled in the component
    }
}
export async function deleteVenueAvailability(availabilityId: number) { // Takes the ID as a number
    try {
        const { error } = await supabase
            .from("venue_availability")
            .delete()
            .eq("id", availabilityId);

        if (error) {
            console.error("Supabase Error deleting availability:", error);
            throw error;
        }

        console.log("Availability deleted:", availabilityId);
        return; // Or return some data if you need to
    } catch (error) {
        console.error("Error in deleteVenueAvailability:", error);
        throw error;
    }
}