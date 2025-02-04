import React from 'react';

const Home: React.FC = () => {
  // Dummy data for demonstration
  const postedEvents = [
    { id: 1, name: 'New Year Gala', date: '2023-12-31', location: 'Hotel Grand', status: 'Active', ticketsSold: 150 },
    { id: 2, name: 'Business Networking Night', date: '2024-01-15', location: 'Business Center', status: 'Draft', ticketsSold: 0 },
    { id: 3, name: 'Summer Music Festival', date: '2024-06-20', location: 'Beach Resort', status: 'Completed', ticketsSold: 500 },
  ];

  const quickStats = {
    totalEvents: 3,
    activeEvents: 1,
    draftEvents: 1,
    completedEvents: 1,
    totalTicketsSold: 650,
    totalRevenue: '$32,500',
  };

  const recentActivities = [
    { id: 1, activity: 'New Year Gala ticket sales started', timestamp: '2 hours ago' },
    { id: 2, activity: 'Draft created for Business Networking Night', timestamp: '1 day ago' },
    { id: 3, activity: 'Summer Music Festival completed successfully', timestamp: '1 week ago' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Event Manager Dashboard</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Events</h3>
          <p className="text-2xl">{quickStats.totalEvents}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Active Events</h3>
          <p className="text-2xl">{quickStats.activeEvents}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Draft Events</h3>
          <p className="text-2xl">{quickStats.draftEvents}</p>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Completed Events</h3>
          <p className="text-2xl">{quickStats.completedEvents}</p>
        </div>
        <div className="bg-teal-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Tickets Sold</h3>
          <p className="text-2xl">{quickStats.totalTicketsSold}</p>
        </div>
        <div className="bg-indigo-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl">{quickStats.totalRevenue}</p>
        </div>
      </div>

      {/* Posted Events */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4">Posted Events</h3>
        <ul className="space-y-3">
          {postedEvents.map((event) => (
            <li key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{event.name}</p>
                <p className="text-sm text-gray-600">
                  {event.date} | {event.location} | {event.status} | Tickets Sold: {event.ticketsSold}
                </p>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Manage Event
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
        <ul className="space-y-3">
          {recentActivities.map((activity) => (
            <li key={activity.id} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-800">{activity.activity}</p>
              <p className="text-sm text-gray-600">{activity.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;