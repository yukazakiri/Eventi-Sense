import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Line
} from 'recharts';
import supabase from '../../api/supabaseClient';

// Update the interface to match the table structure
interface SurveyData {
  id: string;
  user_id: string;
  created_at: string;
  usability: number;
  responsiveness_performance: number;
  functionality: number;
  reliability: number;
  user_satisfaction: number;
  comment: string | null;
  data_security: number;
  // Add profile data that will be joined
  first_name?: string;
  last_name?: string;
  email?: string;
}

function SurveyResponse() {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState('all');
  const itemsPerPage = 50;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  async function fetchSurveyData() {
    try {
      // Fetch survey responses with profiles data
      const { data: surveyData, error: surveyError } = await supabase
        .from('survey_responses')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
  
      if (surveyError) throw surveyError;
  
      // Transform the data to include profile information
      const transformedData = surveyData?.map(survey => ({
        ...survey,
        first_name: survey.profiles?.first_name || 'N/A',
        last_name: survey.profiles?.last_name || 'N/A',
        email: survey.profiles?.email || 'N/A'
      })) || [];
  
      setSurveyData(transformedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSurveyData();
  }, []);

  // Calculate average ratings
  const calculateAverages = () => {
    if (!surveyData.length) return [];
    
    const metrics = ['usability', 'responsiveness_performance', 'data_security', 'functionality', 'reliability', 'user_satisfaction'];
    return metrics.map(metric => ({
      name: metric.replace('_', ' ').charAt(0).toUpperCase() + metric.replace('_', ' ').slice(1),
      average: Number(surveyData.reduce((acc: number, curr) => acc + (curr[metric as keyof SurveyData] as number || 0), 0) / (surveyData.length || 1)).toFixed(2)
    }));
  };

  // Calculate rating distribution
  const calculateDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    surveyData.forEach(response => {
      distribution[response.user_satisfaction as keyof typeof distribution]++;
    });
    return Object.entries(distribution).map(([rating, count]) => ({
      name: `${rating} Star`,
      value: count
    }));
  };

  // Calculate radar chart data for top 5 users (for demo)
  const calculateRadarData = () => {
    if (!surveyData.length) return [];
    
    const metrics = ['usability', 'responsiveness_performance', 'data_security', 'functionality', 'reliability', 'user_satisfaction'];
    
    // Get top 5 users by satisfaction for radar chart
    const topUsers = [...surveyData]
      .sort((a, b) => b.user_satisfaction - a.user_satisfaction)
      .slice(0, 5);
    
    return topUsers.map(user => {
      const data: any = { name: `${user.first_name} ${user.last_name}` };
      metrics.forEach(metric => {
        data[metric.replace('_', ' ')] = user[metric as keyof SurveyData];
      });
      return data;
    });
  };

  // Calculate trend data (simulated - could be replaced with real data)
  const calculateTrendData = () => {
    const categories = ['usability', 'responsiveness_performance', 'data_security', 'functionality', 'reliability', 'user_satisfaction'];
    const months = ['Feb', 'Mar', 'Apr']; // Changed to only show Feb-Apr
    
    return months.map((month) => {
      const data: any = { name: month };
      categories.forEach(category => {
        // Create simulated trend data based on actual averages
        const avg = surveyData.reduce((sum, item) => sum + (item[category as keyof SurveyData] as number), 0) / Math.max(1, surveyData.length);
        // Add some random variation to simulate changes over time
        data[category] = Math.max(1, Math.min(5, avg + (Math.random() - 0.5) * 1.5));
      });
      return data;
    });
  };
  
  const handleDownloadCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Usability', 'Performance', 'Data Security', 'Functionality', 'Reliability', 'Satisfaction', 'Comment'];
    
    const rows = surveyData.map(item => [
      item.first_name,
      item.last_name,
      item.email,
      item.usability,
      item.responsiveness_performance,
      item.data_security,
      item.functionality,
      item.reliability,
      item.user_satisfaction,
      `"${item.comment?.replace(/"/g, '""') || ''}"` // Escaping quotes
    ]);
  
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'survey_responses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate key metrics
  const calculateKeyMetrics = () => {
    if (!surveyData.length) return { avgSatisfaction: 0, totalResponses: 0, highestRated: '', lowestRated: '' };
    
    const averages = calculateAverages();
    const sortedByAvg = [...averages].sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
    
    return {
      avgSatisfaction: (surveyData.reduce((sum, item) => sum + item.user_satisfaction, 0) / surveyData.length).toFixed(1),
      totalResponses: surveyData.length,
      highestRated: sortedByAvg[0]?.name || '',
      lowestRated: sortedByAvg[sortedByAvg.length - 1]?.name || ''
    };
  };
// Add this to your processing functions
// Add this color array for the horizontal bar chart
const CATEGORY_COLORS = {
  'Usability': '#4CAF50',          // Green
  'Responsiveness performance': '#2196F3', // Blue
  'Data security': '#F44336',      // Red (new color for data security)
  'Functionality': '#FF9800',      // Orange
  'Reliability': '#9C27B0',        // Purple
  'User satisfaction': '#E91E63'   // Pink
};

// Modify the calculateCategoryComparison function to include color
const calculateCategoryComparison = () => {
  if (!surveyData.length) return [];
  
  const metrics = ['usability', 'responsiveness_performance', 'data_security', 'functionality', 'reliability', 'user_satisfaction'];
  return metrics.map(metric => {
    const name = metric.replace('_', ' ').charAt(0).toUpperCase() + metric.replace('_', ' ').slice(1);
    return {
      name,
      average: Number(surveyData.reduce((acc, curr) => acc + (curr[metric as keyof SurveyData] as number || 0), 0) / (surveyData.length || 1)).toFixed(2),
      fill: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || '#82ca9d' // Use defined color or fallback
    };
  });
};
// Add this to your processing functions
const calculateHistogram = () => {
  if (!surveyData.length) return [];
  
  // Create bins for user satisfaction scores
  const bins = [
    { bin: "1-2", range: [1, 2], count: 0 },
    { bin: "2-3", range: [2, 3], count: 0 },
    { bin: "3-4", range: [3, 4], count: 0 },
    { bin: "4-5", range: [4, 5], count: 0 },
    { bin: "5", range: [5, 5.1], count: 0 } // 5.1 to include exact 5s
  ];
  
  // Count scores in each bin
  surveyData.forEach(response => {
    const score = response.user_satisfaction;
    for (const bin of bins) {
      if (score >= bin.range[0] && score < bin.range[1]) {
        bin.count++;
        break;
      }
    }
  });
  
  return bins;
};
  // Add this pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = surveyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(surveyData.length / itemsPerPage);

  if (loading) return <div className="p-8 text-center">Loading survey data...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  const keyMetrics = calculateKeyMetrics();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Survey Response Dashboard</h1>
      
      {/* View Selection Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button 
          onClick={() => setCurrentView('all')}
          className={`px-4 py-2 rounded-md transition ${currentView === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          All Views
        </button>
        <button 
          onClick={() => setCurrentView('distribution')}
          className={`px-4 py-2 rounded-md transition ${currentView === 'distribution' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          Rating Distribution
        </button>
        <button 
          onClick={() => setCurrentView('radar')}
          className={`px-4 py-2 rounded-md transition ${currentView === 'radar' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          User Comparison
        </button>
        <button 
          onClick={() => setCurrentView('trends')}
          className={`px-4 py-2 rounded-md transition ${currentView === 'trends' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
        >
          Monthly Trends
        </button>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Average Ratings Bar Chart - Always visible */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Average Ratings by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateAverages()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
{/* Horizontal Bar Chart with unique colors and value labels below */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Category Comparison (Horizontal)</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart 
      layout="vertical" 
      data={calculateCategoryComparison()}
      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 5]} />
      <YAxis type="category" dataKey="name" />
      <Tooltip />
      <Legend />
      <Bar 
        dataKey="average" 
        name="Average Rating"
        radius={[0, 4, 4, 0]}
      >
        {
          calculateCategoryComparison().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))
        }
      </Bar>
    </BarChart>
  </ResponsiveContainer>
  
  {/* Add the category average values below the chart */}
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
    {calculateCategoryComparison().map((category, index) => (
      <div 
        key={`avg-${index}`} 
        className="text-center p-2 rounded-md" 
        style={{ backgroundColor: `${category.fill}15` }}
      >
        <div className="font-medium text-gray-700">{category.name}</div>
        <div 
          className="text-xl font-bold" 
          style={{ color: category.fill }}
        >
          {category.average}/5
        </div>
      </div>
    ))}
  </div>
</div>
{/* Histogram */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Satisfaction Score Distribution</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={calculateHistogram()}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="bin" />
      <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
      <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
      <Legend />
      <Bar dataKey="count" fill="#ff7300" radius={[4, 4, 0, 0]} name="Response Count" />
    </BarChart>
  </ResponsiveContainer>
</div>
        {/* Conditional rendering based on selected view */}
        {(currentView === 'all' || currentView === 'distribution') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Satisfaction Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={calculateDistribution()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calculateDistribution().map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {(currentView === 'all' || currentView === 'radar') && surveyData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Top Users Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart outerRadius={90} data={calculateRadarData()[0]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="User Ratings" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {(currentView === 'all' || currentView === 'trends') && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Monthly Rating Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={calculateTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="usability" fill="#8884d8" />
                <Bar dataKey="data_security" fill="#F44336" />
                <Line type="monotone" dataKey="user_satisfaction" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Key Metrics Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sky-50 p-4 rounded-md">
              <p className="text-sm text-sky-700">Average Satisfaction</p>
              <p className="text-2xl font-bold text-sky-800">
                {keyMetrics.avgSatisfaction}/5
              </p>
            </div>
            <div>
            <div className="bg-purple-50 p-4 rounded-md mb-4">
              <p className="text-sm text-purple-700">Highest Rated</p>
              <p className="text-lg font-bold text-purple-800">
                {keyMetrics.highestRated}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-md">
              <p className="text-sm text-amber-700">Needs Improvement</p>
              <p className="text-lg font-bold text-amber-800">
                {keyMetrics.lowestRated}
              </p>
            </div></div>
          </div>
        </div>
      </div>

      {/* Updated Survey Responses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Survey Responses</h2>
          <button
            onClick={handleDownloadCSV}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Download CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Security</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Functionality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reliability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((response) => (
                <tr key={response.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${response.first_name} ${response.last_name}`}
                  </td>
                  <td className="px-6 py-4">{response.usability}</td>
                  <td className="px-6 py-4">{response.responsiveness_performance}</td>
                  <td className="px-6 py-4">{response.data_security}</td>
                  <td className="px-6 py-4">{response.functionality}</td>
                  <td className="px-6 py-4">{response.reliability}</td>
                  <td className="px-6 py-4">{response.user_satisfaction}</td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate">{response.comment || '-'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <div className="px-6 py-4 flex items-center justify-between border-t">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>
                  {' '}-{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, surveyData.length)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{surveyData.length}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium
                        ${number === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } border`}
                    >
                      {number}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyResponse;