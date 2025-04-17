

import { useEffect, useState } from 'react';
import { fetchEventPlanner, EventPlannerFormData } from '../../api/utiilty/eventplanner';
import supabase from '../../api/supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Add new state for view type
function Home() {
  const [user, setUser] = useState<any>(null);
  const [eventPlanner, setEventPlanner] = useState<EventPlannerFormData | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'month' | 'week'>('month');
  const [revenueData, setRevenueData] = useState<{ labels: string[], data: number[] }>({
    labels: [],
    data: []
  });

  // Move isDarkMode state to the top with other state declarations
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  // Keep all useEffect hooks together
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
              
              // Fetch completed orders with amount for revenue calculation
              const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('created_at, amount')
                .in('ticket_id', ticketIds)
                .eq('payment_status', 'completed')
                .order('created_at');
  
              if (!ordersError && orders) {
                setCompletedOrdersCount(orders.length);
  
                // Process orders for revenue chart based on view type
                const revenueByPeriod: { [key: string]: number } = {};
                
                orders.forEach(order => {
                  const date = new Date(order.created_at);
                  let periodKey;
                  
                  if (viewType === 'month') {
                    periodKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                  } else {
                    // Get week number and year
                    const weekNumber = getWeekNumber(date);
                    periodKey = `Week ${weekNumber}, ${date.getFullYear()}`;
                  }
                  
                  revenueByPeriod[periodKey] = (revenueByPeriod[periodKey] || 0) + (order.amount || 0);
                });

                setRevenueData({
                  labels: Object.keys(revenueByPeriod),
                  data: Object.values(revenueByPeriod)
                });
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
  }, [viewType]); // Add viewType to dependency array

  // Add helper function for week calculation
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    return <div>Please log in to view your dashboard</div>;
  }

  // Remove isDarkMode state and effect
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#000',
        }
      },
      title: {
        display: true,
        text: `${viewType === 'month' ? 'Monthly' : 'Weekly'} Revenue`,
        color: isDarkMode ? '#fff' : '#000',
      },
    },
    scales: {
      y: {
        ticks: { color: isDarkMode ? '#fff' : '#000' },
        grid: { color: isDarkMode ? '#374151' : '#e5e7eb' },
      },
      x: {
        ticks: { color: isDarkMode ? '#fff' : '#000' },
        grid: { color: isDarkMode ? '#374151' : '#e5e7eb' },
      },
    },
  };

  const chartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="min-h-screen p-6 ">
      <div className="">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Planner Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Welcome</h3>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {eventPlanner?.company_name || user?.email}
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Events Created</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{eventCount}</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Total Tickets</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{ticketCount}</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all hover:shadow-xl">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Completed Orders</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{completedOrdersCount}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setViewType('month')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewType === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Monthly View
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewType === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Weekly View
            </button>
          </div>
          
          <div className="h-[400px]">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;