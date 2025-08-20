// Common types for the application

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category?: string;
  method: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  account?: string;
}

export interface StatsCardProps {
  title: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
  variant: 'balance' | 'income' | 'expense';
}

export interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'income' | 'expense' | 'transfer' | 'goal';
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export type Theme = 'light' | 'dark';

export type Period = 'this-week' | 'this-month' | 'this-year' | 'last-month' | 'last-year';

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: 'income' | 'expense' | 'transfer' | 'all';
  status?: 'pending' | 'completed' | 'cancelled' | 'all';
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  averageTransaction: number;
  pendingTransactions: number;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  includeFilters: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}
