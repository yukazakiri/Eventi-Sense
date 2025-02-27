import { useState } from 'react';
import TagNotifications from '../../components/TagNotifications/TagNotifications';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const AllNotifications = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="max-w-4xl  py-8 px-4 ">
      <div className="  mb-6">
        <h1 className="text-2xl mb-2 font-semibold text-gray-900 dark:text-gray-100">
          All Notifications
        </h1>
        
        {/* Filter Dropdown */}
        <div className="relative  ">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiFilter className="w-4 h-4" />
            Filter
            <FiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 ">
              <div className="py-1">
                {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status as any);
                      setShowFilters(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filterStatus === status
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <TagNotifications 
        showAll 
        showDetailed
        filterStatus={filterStatus}
      />
    </div>
  );
};

export default AllNotifications; 