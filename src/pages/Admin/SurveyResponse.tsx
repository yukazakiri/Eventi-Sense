import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import supabase from '../../api/supabaseClient';

// Update the interface to include email
interface SurveyData {
    id: string;
    user_id: string;
    email: string;
    usability: number;
    responsiveness_performance: number;
    functionality: number;
    reliability: number;
    user_satisfaction: number;
    comment: string | null;
    last_name: string;
    first_name: string;
    profiles?: {
      email: string;
      last_name: string;
      first_name: string;
    };
  }
function SurveyResponse() {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  async function fetchSurveyData() {
    try {
      const { data: surveyData, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (surveyError) throw surveyError;
  
      const userIds = surveyData?.map(response => response.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);
  
      if (profilesError) throw profilesError;
  
      const transformedData = surveyData?.map(survey => {
        const profile = profilesData?.find(profile => profile.id === survey.user_id);
        return {
          ...survey,
          email: profile?.email || 'N/A',
          first_name: profile?.first_name || 'N/A',
          last_name: profile?.last_name || 'N/A'
        };
      }) || [];
  
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
    
    const metrics = ['usability', 'responsiveness_performance', 'functionality', 'reliability', 'user_satisfaction'];
    return metrics.map(metric => ({
      name: metric.replace('_', ' ').toUpperCase(),
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
  const handleDownloadCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Usability', 'Performance', 'Functionality', 'Reliability', 'Satisfaction', 'Comment'];
    
    const rows = surveyData.map(item => [
      item.first_name,
      item.last_name,
      item.email,
      item.usability,
      item.responsiveness_performance,
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
  

  // Add this pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = surveyData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(surveyData.length / itemsPerPage);

  if (loading) return <div className="p-8 text-center">Loading survey data...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Survey Response Dashboard</h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Average Ratings Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Average Ratings by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calculateAverages()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfaction Distribution Pie Chart */}
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
                {calculateDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Updated Survey Responses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Survey Responses</h2>
        <div className="flex justify-end mb-4">
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
                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>*/}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Functionality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reliability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((response) => (
                <tr key={response.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${response.first_name} ${response.last_name}`}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {response.email}
                  </td>*/}
                  <td className="px-6 py-4">{response.usability}</td>
                  <td className="px-6 py-4">{response.responsiveness_performance}</td>
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