const Dashboard: React.FC = () => {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-semibold text-gray-800">Dashboard</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
                    Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
                    Settings
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-2 text-gray-700 hover:bg-gray-100 rounded">
                    Messages
                  </a>
                </li>
              </ul>
            </div>
          </aside>
  
          {/* Content Area */}
          <main className="flex-1 p-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-semibold text-gray-800">Welcome to Your Regular Dashboard</h1>
              <p className="mt-2 text-gray-600">This is a simple dashboard layout using TSX and Tailwind CSS.</p>
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default Dashboard;