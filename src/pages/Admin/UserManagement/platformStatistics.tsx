import { useEffect, useState } from 'react';
import { fetchAllProfiles } from '../../../api/utiilty/profiles';
import { FiUsers } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { MdEventSeat, MdStorefront, MdSupervisorAccount, MdPeople } from 'react-icons/md';

const PlatformStatistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    rolesDistribution: {} as Record<string, number>,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const profiles = await fetchAllProfiles();
        
        const rolesCount = profiles.reduce((acc, profile) => {
          acc[profile.role] = (acc[profile.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setStats({
          totalUsers: profiles.length,
          rolesDistribution: rolesCount,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error loading statistics:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load platform statistics'
        }));
      }
    };

    loadStatistics();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'venue_manager':
        return <MdEventSeat className="w-12 h-12 opacity-80" />;
      case 'supplier':
        return <MdStorefront className="w-12 h-12 opacity-80" />;
      case 'event_planner':
        return <MdSupervisorAccount className="w-12 h-12 opacity-80" />;
      case 'user':
        return <MdPeople className="w-12 h-12 opacity-80" />;
      default:
        return <FiUsers className="w-12 h-12 opacity-80" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'venue_manager':
        return 'from-purple-500 to-purple-600';
      case 'supplier':
        return 'from-emerald-500 to-emerald-600';
      case 'event_planner':
        return 'from-blue-500 to-blue-600';
      case 'user':
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (stats.loading) return (
    <div className="flex items-center justify-center h-64">
      <BiLoaderAlt className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  if (stats.error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
      <strong>Error:</strong> {stats.error}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Total Users Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg transform transition-all duration-200 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Total Users</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            </div>
            <FiUsers className="w-12 h-12 text-indigo-200 opacity-80" />
          </div>
        </div>

        {/* Role Distribution Cards */}
        {Object.entries(stats.rolesDistribution).map(([role, count]) => (
          <div
            key={role}
            className={`bg-gradient-to-br ${getRoleColor(role)} rounded-xl p-6 text-white shadow-lg transform transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 capitalize">
                  {role.replace('_', ' ')}
                </p>
                <h3 className="text-3xl font-bold mt-2">{count}</h3>
                <p className="text-sm mt-2 text-gray-200">
                  {((count / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="text-gray-200">
                {getRoleIcon(role)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformStatistics;