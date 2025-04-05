

import { useEffect, useState } from 'react';
import { fetchEventPlanner, EventPlannerFormData } from '../../api/utiilty/eventplanner';
import supabase from '../../api/supabaseClient';
import { Event, Ticket } from '../../types/tickets';

function Home() {
  const [user, setUser] = useState<any>(null);
  const [eventPlanner, setEventPlanner] = useState<EventPlannerFormData | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Fetch event planner details
          const plannerData = await fetchEventPlanner(currentUser.id);
          setEventPlanner(plannerData);
          
          // First fetch all events created by this organizer
          const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('id')
            .eq('organizer_id', currentUser.id);
            
          if (eventsError) throw eventsError;
          
          setEventCount(events?.length || 0);
          
          // If there are events, fetch tickets and orders
          if (events && events.length > 0) {
            const eventIds = events.map(event => event.id);
            
            // Fetch tickets for these events
            const { data: tickets, error: ticketsError } = await supabase
              .from('tickets')
              .select('id, quantity')
              .in('event_id', eventIds);
              
            if (!ticketsError && tickets) {
              // Calculate total tickets
              const totalTickets = tickets.reduce((sum, ticket) => sum + (ticket.quantity || 0), 0);
              setTicketCount(totalTickets);

              // Get ticket IDs to fetch orders
              const ticketIds = tickets.map(ticket => ticket.id);
              
              // Fetch completed orders for these tickets
              const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .in('ticket_id', ticketIds)
                .eq('payment_status', 'completed');

              if (!ordersError && orders) {
                setCompletedOrdersCount(orders.length);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Event Planner Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Welcome</h3>
          <p>{eventPlanner?.company_name || user?.email}</p>
        </div>
        
        <div className="stat-card">
          <h3>Events Created</h3>
          <p className="stat-number">{eventCount}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p className="stat-number">{ticketCount}</p>
        </div>

        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p className="stat-number">{completedOrdersCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Home