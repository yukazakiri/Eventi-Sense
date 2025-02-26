import supabase from '../supabaseClient';

// Fetch event details by ID
export const fetchEventDetails = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Update event details
export const updateEvent = async (id: string, updatedEvent: any) => {
  const { error } = await supabase
    .from('events')
    .update(updatedEvent)
    .eq('id', id);

  if (error) throw error;
};

// Upload file to Supabase Storage
export const uploadFile = async (file: File, userId: string): Promise<string | undefined> => {
  const fileName = `eventsPhoto/${userId}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('events')
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('events')
    .getPublicUrl(data.path);

  return publicUrl;
};