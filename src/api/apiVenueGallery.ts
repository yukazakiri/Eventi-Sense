import  supabase  from './supabaseClient';

export interface VenueImage {
    id: string;
    venue_id: string;
    image_url: string;
    created_at: string;
  }

// Get all images for a venue
export async function getVenueImages(venueId: string): Promise<VenueImage[]> {
    const { data, error } = await supabase
      .from('venue_images')
      .select('*')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false });
  
    if (error) throw error;
    return data;
  }
  
  // Add an image to venue gallery
  export async function addVenueImage(
    venueId: string,
    imageFile: File
  ): Promise<VenueImage> {
    // Upload image to storage
    const filePath = `venue_gallery/${venueId}/${Date.now()}_${imageFile.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
    .from('venue_images')
    .upload(filePath, imageFile);
  
  console.log('File uploaded:', uploadData);
  
    if (uploadError) throw uploadError;
  
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('venue_images')
      .getPublicUrl(filePath);
  
    // Add to database
    const { data, error } = await supabase
      .from('venue_images')
      .insert({ venue_id: venueId, image_url: urlData.publicUrl })
      .single();
  
    if (error) throw error;
    return data;
  }
  
  // Delete an image from gallery
 export async function deleteVenueImage(imageId: string): Promise<void> {
    // First get the image record
    const { data: imageData, error: fetchError } = await supabase
      .from('venue_images')
      .select('*')
      .eq('id', imageId)
      .single();
  
    if (fetchError) throw fetchError;
  
    // Delete from storage
    const filePath = imageData.image_url.split('/').pop();
    const { error: storageError } = await supabase.storage
      .from('venue_images')
      .remove([filePath]);
  
    if (storageError) throw storageError;
  
    // Delete from database
    const { error } = await supabase
      .from('venue_images')
      .delete()
      .eq('id', imageId);
  
    if (error) throw error;
  }