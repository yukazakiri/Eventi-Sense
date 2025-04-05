import React from 'react';
import PlatformStatistics from './UserManagement/platformStatistics';

const Home: React.FC = () => {
  return (
    <div className="p-6  min-h-screen">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening with your platform.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <PlatformStatistics />
        </div>
      </div>
    </div>
  );
};

export default Home;