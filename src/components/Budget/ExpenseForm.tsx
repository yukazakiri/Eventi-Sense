// components/ExpenseForm.tsx
import React, { useState } from 'react';
import { CreateExpenseParams } from './types';
import { createExpense } from './budgetService';
import { FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ExpenseFormProps {
  budgetId: string;
  onSuccess: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ budgetId, onSuccess }) => {
  const [formData, setFormData] = useState<CreateExpenseParams>({
    budget_id: budgetId,
    category: '',
    item_name: '',
    amount: 0,
    note: '',
  });
  const [customCategory, setCustomCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common expense categories
  const categories = [
    'Food & Drinks',
    'Transportation',
    'Venue',
    'Decorations',
    'Entertainment',
    'Gifts',
    'Marketing',
    'Equipment',
    'Supplies',
    'Services',
    'Fees',
    'Other',
    'Custom Category...'
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'Custom Category...') {
      setCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setCustomCategory(false);
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let finalValue: string | number = value;
    if (type === 'number') {
      finalValue = value === '' ? 0 : parseFloat(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createExpense(formData);
      setFormData({
        budget_id: budgetId,
        category: '',
        item_name: '',
        amount: 0,
        note: '',
      });
      setCustomCategory(false); // Reset custom category mode after submission
      toast.success('Expense added successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '10px',
        },
      });
      onSuccess();
    } catch (err) {
      setError('Failed to add expense');
      toast.error('Failed to add expense', {
        duration: 3000,
        position: 'top-right',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const switchBackToCategories = () => {
    setCustomCategory(false);
    // If the user entered a custom category that matches one in our list, select it
    if (formData.category && categories.includes(formData.category)) {
      // Keep the category as is
    } else if (formData.category) {
      // If they entered a custom category that's not in our list, keep it but select "Custom Category..."
      // This way they don't lose their input when switching views
    } else {
      // If they didn't enter anything, reset to empty selection
      setFormData(prev => ({ ...prev, category: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category *
        </label>
        {!customCategory ? (
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleCategoryChange}
            required
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                     text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                       text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
              placeholder="Enter custom category"
            />
            <button
              type="button"
              onClick={switchBackToCategories}
              className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl
                      transition-colors duration-200 font-medium dark:bg-red-600 dark:hover:bg-red-700"
            >
              Back to category list
            </button>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Item Name *
        </label>
        <input
          type="text"
          name="item_name"
          value={formData.item_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                   text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
          placeholder="Enter item name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount *
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount || ''}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                   text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
          placeholder="Enter expense amount"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Note (Optional)
        </label>
        <textarea
          name="note"
          value={formData.note || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                   text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-colors"
          placeholder="Add any additional details"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl
                   transition-colors duration-200 font-medium dark:bg-sky-600 dark:hover:bg-sky-700
                   ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaSave className="mr-2" />
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;