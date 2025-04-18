import { useEffect, useState } from 'react';
import { fetchEventPlanner, EventPlannerFormData } from '../../api/utiilty/eventplanner';
import { fetchTicketStats, TicketStats } from '../../api/utiilty/ticketsData';
import { getBudgetStats, BudgetStats } from '../../components/Budget/budgetService';
import supabase from '../../api/supabaseClient';
import { MoonLoader } from "react-spinners";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { 
  Building2,  
  Users, 
  PieChart,
  DollarSign,
  Wallet,
  CalendarPlus,

} from 'lucide-react';

// Add this to your imports at the top
import EventsTable from './EventsTable';



ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const [user, setUser] = useState<any>(null);
  const [eventPlanner, setEventPlanner] = useState<EventPlannerFormData | null>(null);
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    eventCount: 0,
    ticketCount: 0,
    completedOrdersCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [budgetStats, setBudgetStats] = useState<BudgetStats>({
    totalBudgets: 0,
    totalBudgetAmount: 0,
    totalExpenses: 0
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode on mount and when theme changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Check initial state
    checkDarkMode();
    
    // Set up observer to detect theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (currentUser) {
          setUser(currentUser);
          const [plannerData, ticketData, budgetData] = await Promise.all([
            fetchEventPlanner(currentUser.id),
            fetchTicketStats(currentUser.id),
            getBudgetStats(currentUser.id)
          ]);
          
          setEventPlanner(plannerData);
          setTicketStats(ticketData);
          setBudgetStats(budgetData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const budgetChartData = {
    labels: ['Total Budget', 'Total Expenses'],
    datasets: [
      {
        data: [budgetStats.totalBudgetAmount, budgetStats.totalExpenses],
        backgroundColor: [
          'rgba(14, 165, 233, 0.7)', // sky-500
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(14, 165, 233, 1)', // sky-500
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          font: {
            size: 12,
          },
          padding: 5, // Add padding to push legend down and give pie more space
        },
      },
 
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#1f2937',
        bodyColor: isDarkMode ? '#e5e7eb' : '#1f2937',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `$${(value as number).toLocaleString()}`;
          },
        },
        
      },
      
    },
  };
  
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-950 scrollbar-hide">
        <div className="flex justify-center items-center h-screen">
          <MoonLoader
            color={isDarkMode ? "#ffffff" : "#1f2937"}
            size={60}
            speedMultiplier={1}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-lg text-gray-800 dark:text-gray-200">Please log in to view your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 dark:bg-gray-950">
      <div className="">
    
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 font-sofia">
          {/* Welcome Card */}
               <div className="md:col-span-2 lg:col-span-4 md:row-span-3">
            <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 border-[1px] border-gray-200 shadow-lg transition-all hover:shadow-xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className='bg-sky-400/20 rounded-lg shadow-sky-500/20 border-sky-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <Building2 className="text-2xl text-sky-500  m-4" />
              </div>
              </div>
              <div className="flex flex-col items-left justify-center flex-grow">
              <h3 className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 mb-2 ">Welcome</h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-sky-400 capitalize font-bonanova mt-2">
                {eventPlanner?.company_name || user?.email}
              </p>
              </div>
            </div>
          </div>
          
          {/* Events Created Card */}
        
          {/* Events Created Card */}
          <div className="md:col-span-1 lg:col-span-2 ">
            <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 border-[1px] border-gray-200 shadow-lg transition-all hover:shadow-xl h-full flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className='bg-indigo-400/20 rounded-lg shadow-indigo-500/20 border-indigo-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <CalendarPlus className="text-2xl text-indigo-500  m-4" />
              </div>
              </div>
              <div className="flex flex-col items-left justify-center flex-grow">
              <h3 className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 mb-2">Total Events </h3>
                <p className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-300">{ticketStats.eventCount}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-2 ">
            <div className="p-4 md:p-6 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 border-[1px] border-gray-200 shadow-lg transition-all hover:shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-2">
                <div className='bg-green-400/20 rounded-lg shadow-green-500/20 border-green-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <Users className="text-2xl text-green-500  m-4" />
              </div>
              </div>
         
              <div className="flex flex-col items-left justify-center flex-grow">
              <h3 className="text-lg font-medium tracking-wide text-gray-600 dark:text-gray-300 mb-2">Total Attendees</h3>
              <p className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-300">{ticketStats.ticketCount}</p>
              </div>
            </div>
          </div>
                    {/* Add the EventsTable component */}
        <div className="md:col-span-1 lg:col-span-7">
          {user && <EventsTable userId={user.id} />}
        </div>
     
          
          {/* Budget Overview */}
          <div className="md:col-span-2 lg:col-span-3 md:row-span-4 md:col-start-3 lg:col-start-5 md:row-start-1">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border-[1px] border-gray-200 rounded-xl shadow-lg p-4 md:p-6 h-full flex flex-col">
      
              <div className="flex items-center gap-3 mb-2">
                <div className='bg-pink-400/20 rounded-lg shadow-pink-500/20 border-pink-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <PieChart className="text-2xl text-pink-500  m-4" />
              </div>
              <h3 className="text-lg md:text-xl font-medium tracking-wide text-gray-800 dark:text-gray-200">Budget Overview</h3>
              </div>
             
            
          
              
              <div className="h-64 flex items-center justify-center my-2">
  <div className="w-full max-w-2xl h-full"> {/* Increase max-width and allow full height */}
    <Pie data={budgetChartData} options={chartOptions} />
  </div>
</div>

              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="p-3 md:p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Budget</p>
                  </div>
                  <p className="text-base md:text-lg font-medium tracking-wide text-sky-600 dark:text-sky-400">
                    ${budgetStats.totalBudgetAmount.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 md:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Wallet className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Expenses</p>
                  </div>
                  <p className="text-base md:text-lg font-medium tracking-wide text-red-600 dark:text-red-400">
                    ${budgetStats.totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
    
        </div>
        
    
      </div>
    </div>
  );
}

export default Home;