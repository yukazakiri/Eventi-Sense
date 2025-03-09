import supabase from "../../../../api/supabaseClient";




export interface EventPlannerImage {
    id: string;
    event_planner_id: string;
    image_url: string;
    created_at: string;
}

// Get all images for an event planner
export const getEventPlannerImages = async (eventPlannerId: string): Promise<EventPlannerImage[]> => {
    try {
        const { data, error } = await supabase
            .from('event_planner_images')
            .select('*')
            .eq('event_planner_id', eventPlannerId)
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        return data || [];
    } catch (error) {
        console.error("Error fetching event planner images:", error);
        throw error;
    }
};

// Add a new image to an event planner's gallery
export const addEventPlannerImage = async (eventPlannerId: string, file: File): Promise<EventPlannerImage> => {
    try {
        // 1. Upload the file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${eventPlannerId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;
        
        const { error: uploadError } = await supabase
            .storage
            .from('event_planner')
            .upload(filePath, file);
        
        if (uploadError) {
            throw uploadError;
        }
        
        // 2. Get the public URL for the uploaded file
        const { data: publicUrlData } = supabase
            .storage
            .from('event_planner')
            .getPublicUrl(filePath);
        
        const imageUrl = publicUrlData.publicUrl;
        
        // 3. Add record to the event_planner_images table
        const { data, error: insertError } = await supabase
            .from('event_planner_images')
            .insert({
                event_planner_id: eventPlannerId,
                image_url: imageUrl
            })
            .select()
            .single();
        
        if (insertError) {
            throw insertError;
        }
        
        return data;
    } catch (error) {
        console.error("Error uploading event planner image:", error);
        throw error;
    }
};

// Delete an image from an event planner's gallery
export const deleteEventPlannerImage = async (imageId: string): Promise<void> => {
    try {
        // 1. Get the image record to get the URL
        const { data: imageData, error: fetchError } = await supabase
            .from('event_planner_images')
            .select('image_url')
            .eq('id', imageId)
            .single();
        
        if (fetchError) {
            throw fetchError;
        }
        
        // 2. Delete the record from the database
        const { error: deleteError } = await supabase
            .from('event_planner_images')
            .delete()
            .eq('id', imageId);
        
        if (deleteError) {
            throw deleteError;
        }
        
        // 3. Delete the file from storage if needed
        // This is optional but recommended to avoid orphaned files
        if (imageData?.image_url) {
            // Extract the path from the URL
            const url = new URL(imageData.image_url);
            const pathMatch = url.pathname.match(/\/event_planner\/(.+)/);
            
            if (pathMatch && pathMatch[1]) {
                const storagePath = pathMatch[1];
                
                const { error: storageDeleteError } = await supabase
                    .storage
                    .from('event_planner')
                    .remove([storagePath]);
                
                if (storageDeleteError) {
                    console.error("Error deleting file from storage:", storageDeleteError);
                    // We continue even if storage deletion fails
                }
            }
        }
    } catch (error) {
        console.error("Error deleting event planner image:", error);
        throw error;
    }
};