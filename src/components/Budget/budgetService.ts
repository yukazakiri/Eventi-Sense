// api/budgetService.ts

import { 
  Budget, 
  BudgetSummary, 
  CreateBudgetParams, 
  UpdateBudgetParams,
  Expense,
  CreateExpenseParams,
  UpdateExpenseParams
} from './types';

import supabase from '../../api/supabaseClient';

// Budget CRUD operations
export const getBudgetSummaries = async (): Promise<BudgetSummary[]> => {
  const { data, error } = await supabase
    .rpc('get_budget_summaries')
   

  if (error) throw error;
  return data || [];
};

export const getBudgetById = async (id: string): Promise<Budget | null> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createBudget = async (budget: CreateBudgetParams): Promise<Budget> => {
  const { data, error } = await supabase
    .from('budgets')
    .insert(budget)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBudget = async (id: string, updates: UpdateBudgetParams): Promise<Budget> => {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Expense CRUD operations
export const getExpensesByBudgetId = async (budgetId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('budget_id', budgetId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createExpense = async (expense: CreateExpenseParams): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExpense = async (id: string, updates: UpdateExpenseParams): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};


export interface BudgetStats {
  totalBudgets: number;
  totalBudgetAmount: number;
  totalExpenses: number;
}

export const getBudgetStats = async (userId: string): Promise<BudgetStats> => {
  try {
    // Get all budgets for user
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('id, total_budget')
      .eq('profile_id', userId);

    if (budgetError) throw budgetError;

    const totalBudgets = budgets?.length || 0;
    const totalBudgetAmount = budgets?.reduce((sum, budget) => sum + (budget.total_budget || 0), 0) || 0;

    // Get all expenses for these budgets
    const budgetIds = budgets?.map(budget => budget.id) || [];
    const { data: expenses, error: expenseError } = await supabase
      .from('expenses')
      .select('amount')
      .in('budget_id', budgetIds);

    if (expenseError) throw expenseError;

    const totalExpenses = expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;

    return {
      totalBudgets,
      totalBudgetAmount,
      totalExpenses
    };
  } catch (error) {
    console.error('Error fetching budget stats:', error);
    return {
      totalBudgets: 0,
      totalBudgetAmount: 0,
      totalExpenses: 0
    };
  }
};