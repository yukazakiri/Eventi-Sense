// types/api.ts
export interface Budget {
    id: string;
    event_id: string | null;
    profile_id: string | null;
    total_budget: number;
    created_at: string;
  }
  
  export interface Expense {
    id: string;
    budget_id: string;
    category: string;
    item_name: string;
    amount: number;
    note: string | null;
    created_at: string;
  }
  
  export interface BudgetSummary {
    budget_id: string;
    event_name: string | null;
    total_budget: number;
    total_spent: number;
    remaining_budget: number;
    created_at: string;
    creator_name: string | null;
  }
  
  export interface CreateBudgetParams {
    event_id?: string;
    profile_id?: string;
    total_budget: number;
  }
  
  export interface UpdateBudgetParams {
    total_budget?: number;
    event_id?: string | null;
  }
  
  export interface CreateExpenseParams {
    budget_id: string;
    category: string;
    item_name: string;
    amount: number;
    note?: string;
  }
  
  export interface UpdateExpenseParams {
    category?: string;
    item_name?: string;
    amount?: number;
    note?: string | null;
  }