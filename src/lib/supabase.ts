import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  created_at: string;
  updated_at: string;
}

export interface CategoryInsert {
  name: string;
  color: string;
  icon?: string;
  type?: 'income' | 'expense' | 'both';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  category?: string;
  method: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionInsert {
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  category?: string;
  method: string;
  date: string;
}