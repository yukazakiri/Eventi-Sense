// components/BudgetDetail.tsx
import React, { useEffect, useState } from 'react';
import { Budget, Expense } from './types';
import { getBudgetById, getExpensesByBudgetId, deleteExpense } from './budgetService';
import BudgetForm from './BudgetForm';
import ExpenseForm from './ExpenseForm';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Modal } from '../../assets/modal/modal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface BudgetDetailProps {
  budgetId: string;
  onBudgetUpdated: () => void;
}

const BudgetDetail: React.FC<BudgetDetailProps> = ({ budgetId, onBudgetUpdated }) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [summary, setSummary] = useState<{ spent: number; remaining: number }>({
    spent: 0,
    remaining: 0,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: any[];
  }>({
    labels: [],
    datasets: [],
  });

  // Update fetchBudgetData to include chart data preparation
  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const budgetData = await getBudgetById(budgetId);
      const expensesData = await getExpensesByBudgetId(budgetId);
      
      if (budgetData) {
        setBudget(budgetData);
        setExpenses(expensesData);
        
        // Calculate summary
        const totalSpent = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
        setSummary({
          spent: totalSpent,
          remaining: budgetData.total_budget - totalSpent,
        });

        // Prepare chart data
        const expensesByCategory = expensesData.reduce((acc: { [key: string]: number }, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

        const colors = [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'
        ];

        setChartData({
          labels: Object.keys(expensesByCategory),
          datasets: [{
            data: Object.values(expensesByCategory),
            backgroundColor: colors.slice(0, Object.keys(expensesByCategory).length),
            borderColor: 'transparent',
            borderWidth: 1,
          }],
        });
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load budget details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [budgetId]);

  const handleDeleteExpense = async (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete);
        await fetchBudgetData();
        onBudgetUpdated();
        toast.success('Expense deleted successfully!', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '10px',
          },
        });
      } catch (err) {
        setError('Failed to delete expense');
        toast.error('Failed to delete expense', {
          duration: 3000,
          position: 'top-right',
        });
        console.error(err);
      } finally {
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
      }
    }
  };

  const handleBudgetUpdated = () => {
    setShowEditForm(false);
    fetchBudgetData();
    onBudgetUpdated();
  };

  const handleExpenseAdded = () => {
    setShowAddExpenseForm(false);
    fetchBudgetData();
    onBudgetUpdated();
    toast.success('Expense added successfully!', {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '10px',
      },
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading budget details...</div>;
  }

  if (error || !budget) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error || 'Budget not found'}
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sofia">
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Budget Details</h2>
          <button
            onClick={() => setShowEditForm(!showEditForm)}
            className="inline-flex items-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl
                     transition-colors duration-200 font-medium dark:bg-sky-600 dark:hover:bg-sky-700"
          >
            <FaEdit className="mr-2" />
            {showEditForm ? 'Cancel Edit' : 'Edit Budget'}
          </button>
        </div>

        {showEditForm ? (
          <BudgetForm
            budgetId={budgetId}
            initialData={budget}
            onSuccess={handleBudgetUpdated}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-sky-800/20 p-6  border-sky-200 dark:border-sky-700  bg-sky-400/20 rounded-lg
             shadow-sky-500/20 border-sky-300/10 inline-block my-4 shrink-0  border shadow-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budget</div>
              <div className="text-2xl font-bold text-sky-900 dark:text-sky-100 mt-2">₱{budget.total_budget.toLocaleString()}</div>
            </div>
            <div className="bg-white dark:bg-rose-800/20 p-6  border-rose-200 dark:border-rose-800  bg-rose-400/20 rounded-lg
             shadow-rose-500/20 border-rose-300/10 inline-block my-4 shrink-0  border shadow-lg">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">₱{summary.spent.toLocaleString()}</div>
            </div>
            <div className={`p-6 rounded-xl border shadow-lg ${
              summary.remaining < 0 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-red-500/20 inline-block my-4 shrink-0  border shadow-lg' 
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-green-500/20 inline-block my-4 shrink-0  border shadow-lg'
            }`}>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</div>
              <div className={`text-2xl font-bold mt-2 ${
                summary.remaining < 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                ₱{summary.remaining.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Distribution Chart */}
        {expenses.length > 0 && (
          <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Expense Distribution</h2>
            <div className="flex justify-center items-center h-[150px]">
              <div className="w-full max-w-md">
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          color: budget?.total_budget ? '#6B7280' : '#9CA3AF',
                          font: { size: 12 },
                          padding: 20,
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const value = context.raw as number;
                            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `₱${value.toLocaleString()} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Budget Overview Chart */}
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Budget Overview</h2>
          <div className="flex justify-center items-center h-[150px] py-4">
            <div className="w-full max-w-md">
              <Pie
                data={{
                  labels: ['Total Spent', 'Remaining Budget'],
                  datasets: [{
                    data: [summary.spent, Math.max(0, summary.remaining)],
                    backgroundColor: [
                      '#eb1515', // red for spent
                      '#2c8ded', // green for remaining
                    ],
                    borderColor: 'transparent',
                    borderWidth: 1,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: budget?.total_budget ? '#6B7280' : '#9CA3AF',
                        font: { size: 12 },
                        padding: 20,
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          const total = budget?.total_budget || 0;
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `₱${value.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Expenses</h2>
          <button
            onClick={() => setShowAddExpenseForm(!showAddExpenseForm)}
            className="inline-flex items-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl
                     transition-colors duration-200 font-medium dark:bg-sky-600 dark:hover:bg-sky-700"
          >
            <FaPlus className="mr-2" />
            {showAddExpenseForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        {showAddExpenseForm && (
          <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <ExpenseForm
              budgetId={budgetId}
              onSuccess={handleExpenseAdded}
            />
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{expense.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{expense.item_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">₱{expense.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{expense.note || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {new Date(expense.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="inline-flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg
                                 transition-colors duration-200 text-sm font-medium dark:bg-red-600 dark:hover:bg-red-700"
                      >
                        <FaTrash className="mr-1.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        type="confirmation"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default BudgetDetail;