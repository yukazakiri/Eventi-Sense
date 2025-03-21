import { useState, useEffect } from 'react';
import supabase from '../../../api/supabaseClient';
import { Skeleton, ErrorMessage } from './Skeleton';

type BookingType = 'venue' | 'supplier';
type Booking = {
  id: string;
  [key: string]: any;
  start_date: string;
  end_date: string;
  status: string;
  service: string;
  name: string;
  message?: string;
};

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface CombinedBookingsProps {
  userId: string;
}

function CombinedBookings({ userId }: CombinedBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingType, setBookingType] = useState<BookingType>('venue');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const itemsPerPage = 8;

  const tableConfig = {
    venue: {
      tableName: 'bookings',
      idLabel: 'Venue ID',
      idKey: 'venue_id',
      title: 'Venue '
    },
    supplier: {
      tableName: 'supplier_bookings',
      idLabel: 'Supplier ID',
      idKey: 'supplier_id',
      title: 'Supplier '
    }
  };

  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    await fetchBookings();
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from(tableConfig[bookingType].tableName)
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      setCurrentPage(1);
      fetchBookings();
    }
  }, [userId, bookingType]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = bookings
    .filter(item => filterStatus === 'all' ? true : item.status === filterStatus)
    .sort((a, b) => {
      if (!sortConfig) return 0;
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 font-sofia">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {tableConfig[bookingType].title}
          </h3>
          <div className="flex border gap-2 rounded-lg p-1 bg-gray-50 dark:bg-gray-700">
            {(['venue', 'supplier'] as BookingType[]).map((type) => (
              <button
                key={type}
                onClick={() => setBookingType(type)}
                className={`px-4 py-2 rounded-md text-sm ${
                  bookingType === type 
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Statuses</option>
            {Object.keys(statusColors).map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Skeleton rows={5} columns={7} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 text-sm">
                <tr>
                  {['id', tableConfig[bookingType].idKey, 'start_date', 'end_date', 'status', 'service', 'name'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort(header)}
                    >
                      {header.replace('_', ' ')}
                      {sortConfig?.key === header && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{booking.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {booking[tableConfig[bookingType].idKey]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(booking.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(booking.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${statusColors[booking.status]} px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{booking.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{booking.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No bookings found matching your criteria
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredData.length / itemsPerPage)))}
              disabled={currentPage * itemsPerPage >= filteredData.length}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CombinedBookings;