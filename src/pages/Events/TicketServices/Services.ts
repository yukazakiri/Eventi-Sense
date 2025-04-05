// services/ticketService.ts
import supabase from '../../../api/supabaseClient';
import { Event, Ticket } from '../../../types/event';
import { Profile } from '../../../types/types';

interface Order {
  id: string;
  ticket_id: string;
  amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

interface FetchTicketsParams {
  viewMode: 'organizer' | 'attendee';
}

interface FetchTicketsResult {
  tickets: Ticket[];
  events: { [eventId: string]: Event };
  profiles: { [userId: string]: Profile };
  orders: { [ticketId: string]: Order };
}

export const fetchTickets = async ({ viewMode }: FetchTicketsParams): Promise<FetchTicketsResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    if (viewMode === 'organizer') {
      return await fetchOrganizerTickets(user.id);
    } else {
      return await fetchAttendeeTickets(user.id);
    }
  } catch (error) {
    console.error('Error in fetchTickets:', error);
    throw error;
  }
};

const fetchOrganizerTickets = async (userId: string): Promise<FetchTicketsResult> => {
  // Get events created by the user
  const { data: userEvents, error: eventsError } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', userId);

  if (eventsError) throw eventsError;

  if (!userEvents?.length) {
    return {
      tickets: [],
      events: {},
      profiles: {},
      orders: {}
    };
  }

  // Get tickets for those events
  const { data: ticketsData, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .in('event_id', userEvents.map((event: { id: string }) => event.id))
    .order('created_at', { ascending: false });

  if (ticketsError) throw ticketsError;

  return await fetchRelatedData(ticketsData);
};

const fetchAttendeeTickets = async (userId: string): Promise<FetchTicketsResult> => {
  // Get user's tickets with related data
  const { data: ticketsData, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ticketsError) throw ticketsError;

  return await fetchRelatedData(ticketsData);
};

const fetchRelatedData = async (ticketsData: Ticket[]): Promise<FetchTicketsResult> => {
  // Fetch related data
  const eventIds = ticketsData.map(ticket => ticket.event_id);
  const userIds = ticketsData.map(ticket => ticket.user_id);
  const ticketIds = ticketsData.map(ticket => ticket.id);

  // Fetch orders
  const ordersMap = await fetchOrders(ticketIds);

  // Fetch events and profiles in parallel
  const [eventsData, profilesData] = await Promise.all([
    fetchEvents(eventIds),
    fetchProfiles(userIds)
  ]);

  // Process the data
  const eventsMap: { [key: string]: Event } = {};
  eventsData.forEach(event => {
    if (event && event.id) {
      eventsMap[event.id] = event;
    }
  });

   const profilesMap: { [key: string]: Profile } = {};
  profilesData.forEach(profile => {
    profilesMap[profile.id] = profile;
  });

  return {
    tickets: ticketsData,
    events: eventsMap,
    profiles: profilesMap,
    orders: ordersMap
  };
};

export const fetchOrders = async (ticketIds: string[]): Promise<{ [key: string]: Order }> => {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .in('ticket_id', ticketIds);

  if (ordersError) throw ordersError;

  const ordersMap: { [key: string]: Order } = {};
  if (ordersData) {
    ordersData.forEach((order: Order) => {
      ordersMap[order.ticket_id] = order;
    });
  }

  return ordersMap;
};

export const fetchEvents = async (eventIds: string[]): Promise<Event[]> => {
  const { data: eventsData, error: eventsFetchError } = await supabase
    .from('events')
    .select('*')
    .in('id', eventIds);

  if (eventsFetchError) throw eventsFetchError;
  return eventsData || [];
};

export const fetchProfiles = async (userIds: string[]): Promise<Profile[]> => {
  const { data: profilesData, error: profilesFetchError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (profilesFetchError) throw profilesFetchError;
  return profilesData || [];
};

export const updateTicketStatus = async (ticketId: string, newStatus: string) => {
  const { error } = await supabase
    .from('tickets')
    .update({ status: newStatus })
    .eq('id', ticketId);

  if (error) throw error;
};

export const deleteTicket = async (ticketId: string) => {
  const { error } = await supabase
    .from('tickets')
    .delete()
    .eq('id', ticketId);

  if (error) throw error;
};