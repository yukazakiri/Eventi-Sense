import React, { useEffect, useState } from 'react'
import supabase from '../../api/supabaseClient'
import { EventPlanners } from '../../types/eventPlanner'

function EventPlanner() {
  const [eventPlanners, setEventPlanners] = useState<EventPlanners[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlanner, setSelectedPlanner] = useState<EventPlanners | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchEventPlanners()
  }, [])

  const fetchEventPlanners = async () => {
    try {
      const { data, error } = await supabase
        .from('eventplanners')
        .select('*')

      if (error) throw error
      setEventPlanners(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event planner?')) {
      try {
        const { error } = await supabase
          .from('event_planners')
          .delete()
          .eq('planner_id', id)

        if (error) throw error
        fetchEventPlanners()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event planner')
      }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
  
  if (error) return (
    <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 m-4" role="alert">
      <p>Error: {error}</p>
    </div>
  )

  return (
    <div className="p-8  min-h-screen font-sofia">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Event Planners Directory</h1>
          <div className="px-6 py-3 rounded-xl shadow-lg">
            <span className="text-gray-700 font-semibold text-lg dark:text-white">
              Total Event Planners:{' '}
              <span className="text-2xl font-bold bg-sky-500/40 rounded-full py-2 px-4 text-sky-400 ">{eventPlanners.length}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {eventPlanners.map((planner) => (
                <tr key={planner.planner_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={planner.avatar_url || 'https://via.placeholder.com/40'} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{planner.company_name}</div>
<div className="text-sm text-gray-500 dark:text-gray-300">{planner.specialization?.substring(0, 38)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{planner.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {planner.city}, {planner.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      {planner.experience_years} years
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPlanner(planner)
                        setIsModalOpen(true)
                      }}
                      className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(planner.planner_id)}
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal */}
      {isModalOpen && selectedPlanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPlanner.company_name}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <img
                  src={selectedPlanner.avatar_url || 'https://via.placeholder.com/400x200'}
                  alt={selectedPlanner.company_name || ''}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</p>
                    <p className="text-gray-900 dark:text-white">{selectedPlanner.phone}</p>
                    <p className="text-gray-900 dark:text-white">{selectedPlanner.website}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedPlanner.address}<br />
                      {selectedPlanner.city}, {selectedPlanner.state} {selectedPlanner.zip_code}<br />
                      {selectedPlanner.country}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">About</p>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedPlanner.bio}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Information</p>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Specialization</p>
                      <p className="text-gray-900 dark:text-white">{selectedPlanner.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                      <p className="text-gray-900 dark:text-white">{selectedPlanner.experience_years} years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventPlanner