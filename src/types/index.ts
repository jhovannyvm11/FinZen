// Common types for the application

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  date: string;
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
