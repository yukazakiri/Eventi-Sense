import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || ''; // Use import.meta.env for Vite
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || ''; // Use import.meta.env for Vite

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;