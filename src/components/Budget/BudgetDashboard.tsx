// components/BudgetDashboard.tsx
import React, { useEffect, useState } from 'react';
import { BudgetSummary } from './types';
import { getBudgetSummaries, deleteBudget } from './budgetService';
import BudgetForm from './BudgetForm';
import BudgetDetail from './BudgetDetail';
import { FaWallet, FaTrash, FaEye } from 'react-icons/fa';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { MdEventNote } from 'react-icons/md';
import { Modal } from '../../assets/modal/modal';
import { HandCoins, PiggyBank } from 'lucide-react';

const BudgetDashboard: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  // Add new state for total calculations
  const [totalStats, setTotalStats] = useState({
    totalBudgets: 0,
    totalAllocated: 0,
    totalSpent: 0
  });

  // Update the fetchBudgets function to calculate totals
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const data = await getBudgetSummaries();
      setBudgets(data);
      
      // Calculate totals
      const stats = data.reduce((acc, budget) => ({
        totalBudgets: acc.totalBudgets + 1,
        totalAllocated: acc.totalAllocated + budget.total_budget,
        totalSpent: acc.totalSpent + budget.total_spent
      }), { totalBudgets: 0, totalAllocated: 0, totalSpent: 0 });
      
      setTotalStats(stats);
      setError(null);
    } catch (err) {
      setError('Failed to load budgets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  // Update handleDeleteBudget
  const handleDeleteBudget = async (id: string) => {
    setBudgetToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (budgetToDelete) {
      try {
        await deleteBudget(budgetToDelete);
        await fetchBudgets();
        if (selectedBudgetId === budgetToDelete) {
          setSelectedBudgetId(null);
        }
      } catch (err) {
        setError('Failed to delete budget');
        console.error(err);
      } finally {
        setIsDeleteModalOpen(false);
        setBudgetToDelete(null);
      }
    }
  };

  const handleBudgetCreated = () => {
    setShowCreateForm(false);
    fetchBudgets();
  };

  if (selectedBudgetId) {
    return (
      <div className=" p-4">
        <button 
          onClick={() => setSelectedBudgetId(null)}
          className="mb-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white  text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back to Budgets
        </button>
        <BudgetDetail 
          budgetId={selectedBudgetId} 
          onBudgetUpdated={fetchBudgets}
        />
      </div>
    );
  }

  return (
    <div className=" p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaWallet className="text-3xl mr-3 text-sky-500 dark:text-sky-400" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Budget Tracker</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-4 rounded-2xl dark:bg-sky-600 dark:hover:bg-sky-700 flex items-center transition-colors"
        >
          <BsFileEarmarkPlus className="mr-2" />
          {showCreateForm ? 'Cancel' : 'Create New Budget'}
        </button>
      </div>

      {/* Add Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-sofia">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 mb-2">
                <div className='bg-sky-400/20 rounded-lg shadow-sky-500/20 border-sky-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <MdEventNote className="text-2xl text-sky-500  m-4" />
              </div>
              </div>
         
            <h3 className="text-gray-700 dark:text-gray-300">Total Budgets</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-2">{totalStats.totalBudgets}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 mb-2">
                <div className='bg-green-400/20 rounded-lg shadow-green-500/20 border-green-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <PiggyBank className="text-2xl text-green-500  m-4" />
              </div>
              </div>
         
              <h3 className="text-gray-700 dark:text-gray-300">Total Allocated</h3>
          </div>
     
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">₱{totalStats.totalAllocated.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 mb-2">
                <div className='bg-red-400/20 rounded-lg shadow-red-500/20 border-red-300/10 inline-block my-4 shrink-0  border shadow-lg'>
                  <HandCoins className="text-2xl text-red-500  m-4" />
              </div>
              </div>
         
              <h3 className="text-gray-700 dark:text-gray-300">Total Spent</h3>
          </div>
        
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">₱{totalStats.totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900/50 dark:border-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="mb-6 p-4 bg-white border border-gray-300 rounded-2xl dark:bg-gray-900 dark:border-gray-700 font-sofia">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Create New Budget</h2>
          <BudgetForm onSuccess={handleBudgetCreated} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading budgets...</div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8 bg-white border border-gray-300 rounded-2xl dark:bg-gray-900 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No budgets found. Create your first budget to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-300 dark:border-gray-800 shadow-sm font-sofia">
          <table className="min-w-full bg-white dark:bg-gray-900">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Event</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Creator</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Total Budget</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Spent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Remaining</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.budget_id} className="border-b border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{budget.event_name || 'No Event'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{budget.creator_name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">₱{budget.total_budget.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">₱{budget.total_spent.toLocaleString()}</td>
                  <td className={`px-6 py-4 text-sm ${
                    budget.remaining_budget < 0 
                      ? 'text-red-500 dark:text-red-400 font-bold' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    ₱{budget.remaining_budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(budget.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  {/* Add Modal */}
                  <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                      setIsDeleteModalOpen(false);
                      setBudgetToDelete(null);
                    }}
                    title="Delete Budget"
                    description="Are you sure you want to delete this budget? This action cannot be undone."
                    type="confirmation"
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={confirmDelete}
                  />
                  {/* Update the delete button in the table */}
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedBudgetId(budget.budget_id)}
                        className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg text-sm dark:bg-sky-600 dark:hover:bg-sky-700 transition-colors"
                      >
                        <FaEye className="mr-1.5" /> 
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteBudget(budget.budget_id)}
                        className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="mr-1.5" /> 
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;