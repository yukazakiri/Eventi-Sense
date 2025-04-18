import supabase from '../supabaseClient';

export interface TicketStats {
  eventCount: number;
  ticketCount: number;
  completedOrdersCount: number;
}

export const fetchTicketStats = async (userId: string): Promise<TicketStats> => {
  try {
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id')
      .eq('organizer_id', userId);
      
    if (eventsError) throw eventsError;
    
    const eventCount = events?.length || 0;
    let ticketCount = 0;
    let completedOrdersCount = 0;

    if (events && events.length > 0) {
      const eventIds = events.map(event => event.id);
      
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, quantity')
        .in('event_id', eventIds);
        
      if (!ticketsError && tickets) {
        ticketCount = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0);
        const ticketIds = tickets.map(ticket => ticket.id);
        
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id')
          .in('ticket_id', ticketIds)
          .eq('payment_status', 'completed');

        if (!ordersError && orders) {
          completedOrdersCount = orders.length;
        }
      }
    }

    return {
      eventCount,
      ticketCount,
      completedOrdersCount
    };
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    return {
      eventCount: 0,
      ticketCount: 0,
      completedOrdersCount: 0
    };
  }
};