import supabase from './supabaseClient';

export interface supplierImage {
    id: string;
    supplier_id: string;
    image_url: string;
    created_at: string;
}

const STORAGE_BUCKET = 'suppliers'; // Replace with your actual Supabase storage bucket name

// Get all images for a supplier
export async function getsupplierImages(supplierId: string): Promise<supplierImage[]> {
    try {
        const { data, error } = await supabase
            .from('supplier_images')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching supplier images:", error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error("An unexpected error occurred while fetching supplier images:", error);
        throw error;
    }
}

// Add an image to supplier gallery
export async function addsupplierImage(
  supplierId: string,
  imageFile: File
): Promise<supplierImage> {
  try {
      const filePath = `gallery/${supplierId}/${Date.now()}_${imageFile.name}`;

      const {  error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, imageFile);

      if (uploadError) {
          console.error("Error uploading image:", uploadError);
          throw uploadError;
      }

      const urlResponse = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

      if(!urlResponse.data || !urlResponse.data.publicUrl){
        console.error("Error getting Public URL:", urlResponse);
        throw urlResponse;
      }

      const { data, error } = await supabase
          .from('supplier_images')
          .insert({ supplier_id: supplierId, image_url: urlResponse.data.publicUrl })
          .single();

      if (error) {
          console.error("Error inserting image record:", error);
          throw error;
      }

      return data;
  } catch (error) {
      console.error("An unexpected error occurred during image upload:", error);
      throw error;
  }
}

// Delete an image from gallery
export async function deletesupplierImage(imageId: string): Promise<void> {
    try {
        const { data: imageData, error: fetchError } = await supabase
            .from('supplier_images')
            .select('*')
            .eq('id', imageId)
            .single();

        if (fetchError) {
            console.error("Error fetching image record for deletion:", fetchError);
            throw fetchError;
        }

        const filePath = imageData.image_url.replace(supabase.storage.from(STORAGE_BUCKET).getPublicUrl('').data.publicUrl, '');

        const { error: storageError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

        if (storageError) {
            console.error("Error deleting image from storage:", storageError);
            throw storageError;
        }

        const { error } = await supabase
            .from('supplier_images')
            .delete()
            .eq('id', imageId);

        if (error) {
            console.error("Error deleting image record:", error);
            throw error;
        }
    } catch (error) {
        console.error("An unexpected error occurred during image deletion:", error);
        throw error;
    }
}