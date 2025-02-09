import React, { useEffect, useState } from 'react';
import supabase from '../../api/supabaseClient';

const ImageUploader: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch authenticated user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }

      if (user) {
        setUser(user);
        fetchUserData(user.id);
      }
    };

    getUser();
  }, []);

  // Fetch user data from the database
  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('company_profiles') // Replace with your table name
      .select('company_logo_url')
      .eq('id', userId)
      .single();

      console.log

    if (error) {
      console.error('Error fetching user data:', error.message);
      return;
    }

    setImageUrl(data?.company_logo_url ?? null);
  };

  // Handle image upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);

    const filePath = `logos/${user.id}_${Date.now()}_${file.name}`; // Unique filename

    // Upload to Supabase Storage
    const {  error } = await supabase.storage
      .from('company_logos') // Ensure correct bucket name is used here
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Upload failed:', error.message);
      setLoading(false);
      return;
    }

    // Get public URL of uploaded image from the correct bucket
    const { data: publicUrlData } = await supabase.storage
      .from('company_logos') // Ensure correct bucket name is used here
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      console.error('Error getting public URL');
      setLoading(false);
      return;
    }

    const publicUrl = publicUrlData.publicUrl;

    console.log('Public URL:', publicUrl); // Log the public URL to check if it's correct

    // Update database with new logo URL
    const { error: updateError } = await supabase
      .from('company_profiles') // Replace with your table name
      .update({ company_logo_url: publicUrl })
      .eq('id', user.id);

    
    if (updateError) {
      console.error('Database update failed:', updateError.message);
      setLoading(false);
      return;
    }

    // Update UI with the new image URL
    setImageUrl(publicUrl);
    setLoading(false);
  };

  return (
    <div>
      <h2>Upload Company Logo</h2>
      {user ? (
        <>
          <input type="file" accept="image/*" onChange={handleFileUpload} disabled={loading} />
          {loading && <p>Uploading...</p>}
          {imageUrl && <img src={imageUrl} alt="Company Logo" style={{ width: 150, marginTop: 10 }} />}
        </>
      ) : (
        <p>Please log in to upload an image.</p>
      )}
    </div>
  );
};

export default ImageUploader;
