import  supabase  from '../api/supabaseClient';
export interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  quantity: number;
  status: string;
  purchase_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
    id?: string;
    name: string;
    description: string;
    date: string; // ISO string
    location: string;
    organizer_id: string; // Profile ID of the organizer
    organizer_type?: string; // Automatically set by trigger
    category?: string;
    image_url?: string;
    ticket_price?: number;
    capacity?: number;
    status?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
}
  
  // Function to create the `events` table and trigger
 export async function createEventsTable() {
    try {
      // Create the `events` table
      const { data: createTableData, error: createTableError } = await supabase
        .rpc('create_events_table');
  
      if (createTableError) {
        throw new Error(`Error creating events table: ${createTableError.message}`);
      }
  
      console.log('Events table created successfully:', createTableData);
  
      // Create the trigger to set organizer_type
      const { data: createTriggerData, error: createTriggerError } = await supabase
        .rpc('create_organizer_type_trigger');
  
      if (createTriggerError) {
        throw new Error(`Error creating trigger: ${createTriggerError.message}`);
      }
  
      console.log('Trigger created successfully:', createTriggerData);
    } catch (error) {
      console.error('Error in createEventsTable:', error);
    }
  }
  
  // Function to insert a new event
  export const createEvent = async (event: Event): Promise<Event | null> => {
    try {
        const { data, error } = await supabase
            .from('events')
            .insert([event])
            .select('*')
            .single();

        console.log('Supabase Response - Data:', data);
        console.log('Supabase Response - Error:', error);

        if (error) {
            console.error('Error creating event:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error creating event:', error);
        return null;
    }
};
  // Function to fetch all events with organizer details
 export async function fetchEvents() {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles (first_name, last_name, role)
        `);
  
      if (error) {
        throw new Error(`Error fetching events: ${error.message}`);
      }
  
      console.log('Events with organizer details:', events);
      return events;
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      return null;
    }
  }
  