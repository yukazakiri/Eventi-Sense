// tickets.ts (or similar file name, e.g., supabaseTickets.ts)

import supabase from '../../api/supabaseClient'; // Adjust the import path as needed

// Define types for your ticket data (replace with your actual types)
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'in_progress';
  created_at: string;
  // ... other ticket properties
}

export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets') // Replace 'tickets' with your table name
    .select('*');

  if (error) {
    console.error('Error fetching tickets:', error);
    throw error; // Rethrow the error for handling in the component
  }

  return data || [];
}

export async function fetchTicketById(id: number): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching ticket with ID ${id}:`, error);
    throw error;
  }

  return data;
}

export async function createTicket(ticketData: Omit<Ticket, 'id' | 'created_at'>): Promise<Ticket | null> {
    const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();

    if (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }

    return data;
}

export async function updateTicket(id: number, ticketData: Partial<Ticket>): Promise<Ticket | null> {
    const { data, error } = await supabase
        .from('tickets')
        .update(ticketData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error updating ticket with ID ${id}:`, error);
        throw error;
    }

    return data;
}

export async function deleteTicket(id: number): Promise<void> {
    const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(`Error deleting ticket with ID ${id}:`, error);
        throw error;
    }
}