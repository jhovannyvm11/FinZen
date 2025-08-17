import { useState, useEffect } from 'react';
import { supabase, Category, CategoryInsert } from '@/lib/supabase';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories by type
  const fetchCategoriesByType = async (type: 'income' | 'expense' | 'both') => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`type.eq.${type},type.eq.both`)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const createCategory = async (categoryData: CategoryInsert): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      // Refresh categories list
      await fetchCategories();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating category');
      return null;
    }
  };

  // Update category
  const updateCategory = async (id: string, updates: Partial<CategoryInsert>): Promise<Category | null> => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Refresh categories list
      await fetchCategories();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating category');
      return null;
    }
  };

  // Delete category
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh categories list
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting category');
      return false;
    }
  };

  // Get category by name
  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
  };

  // Get category by id
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };

  // Get categories for expenses only
  const getExpenseCategories = (): Category[] => {
    return categories.filter(cat => cat.type === 'expense' || cat.type === 'both');
  };

  // Get categories for income only
  const getIncomeCategories = (): Category[] => {
    return categories.filter(cat => cat.type === 'income' || cat.type === 'both');
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoriesByType,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryByName,
    getCategoryById,
    getExpenseCategories,
    getIncomeCategories,
  };
};