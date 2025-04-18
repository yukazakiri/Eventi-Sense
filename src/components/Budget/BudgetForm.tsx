import React, { useState, useEffect } from 'react';
import { CreateBudgetParams, Budget, UpdateBudgetParams } from './types';
import { createBudget, updateBudget } from './budgetService';
import supabase from '../../api/supabaseClient';
import { BiMoney } from 'react-icons/bi';
import { MdEventNote } from 'react-icons/md';
import toast from 'react-hot-toast';
import { getCurrentUser, fetchProfile } from '../../api/utiilty/profiles';

interface BudgetFormProps {
  budgetId?: string;
  initialData?: Budget;
  onSuccess: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budgetId, initialData, onSuccess }) => {
  const [formData, setFormData] = useState<CreateBudgetParams>({
    event_id: '',
    profile_id: '',
    total_budget: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [fetchingEvents, setFetchingEvents] = useState(true);

  // Fetch user's events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          toast.error('Please sign in to continue');
          return;
        }

        const profile = await fetchProfile(user.id);
        if (!profile) {
          toast.error('Profile not found');
          return;
        }

        const { data, error } = await supabase
          .from('events')
          .select('id, name, description')
          .eq('organizer_id', user.id)
          .eq('organizer_type', profile.role);

        if (error) throw error;
        setUserEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setFetchingEvents(false);
      }
    };

    fetchUserEvents();
  }, []);

  // For editing mode, initialize with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        event_id: initialData.event_id || '',
        total_budget: initialData.total_budget,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number'
        ? value === '' ? 0 : parseFloat(value)
        : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();
  
      if (authError || !user) {
        toast.error('Please sign in to continue');
        throw new Error('User not authenticated');
      }
  
      const cleanedData: CreateBudgetParams = {
        ...formData,
        event_id: formData.event_id === '' ? undefined : formData.event_id,
        profile_id: user.id, // Use the logged-in user's ID
      };
  
      if (budgetId) {
        await updateBudget(budgetId, cleanedData as UpdateBudgetParams);
        toast.success('Budget updated successfully');
      } else {
        await createBudget(cleanedData);
        toast.success('Budget created successfully');
      }
  
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save budget';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl dark:bg-red-900/50 dark:border-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Select Event (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdEventNote className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          {fetchingEvents ? (
            <div className="w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-5 rounded"></div>
            </div>
          ) : (
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
            >
              <option value="">Select an event</option>
              {userEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {userEvents.length === 0 && !fetchingEvents && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            No events found. Please create an event first.
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Total Budget *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <BiMoney className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="number"
            name="total_budget"
            value={formData.total_budget || ''}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full pl-10 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl 
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400
                     placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="₱0.00"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl
                     transition-colors duration-200 ease-in-out
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                     dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-offset-gray-900
                     flex items-center justify-center min-w-[120px]
                     ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Saving...
            </span>
          ) : (
            <span>{budgetId ? 'Update Budget' : 'Create Budget'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;