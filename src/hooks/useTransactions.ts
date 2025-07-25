import { useState, useEffect } from 'react';
import { supabase, Transaction, TransactionInsert } from '@/lib/supabase';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las transacciones
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  // Obtener las últimas transacciones (limitadas)
  const fetchRecentTransactions = async (limit: number = 10) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching recent transactions');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva transacción
  const createTransaction = async (transaction: TransactionInsert) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;
      
      // Actualizar la lista local
      setTransactions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating transaction');
      throw err;
    }
  };

  // Actualizar transacción
  const updateTransaction = async (id: string, updates: Partial<TransactionInsert>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Actualizar la lista local
      setTransactions(prev => 
        prev.map(t => t.id === id ? data : t)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating transaction');
      throw err;
    }
  };

  // Eliminar transacción
  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Actualizar la lista local
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting transaction');
      throw err;
    }
  };

  // Obtener estadísticas
  const getStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    
    const balance = income - expenses;
    
    return { income, expenses, balance };
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchRecentTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getStats,
    refetch: fetchRecentTransactions
  };
};