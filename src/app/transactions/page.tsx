"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import {
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Transaction, TransactionFilters as TFilters, PaginationOptions } from '@/types';
import { TransactionInsert } from '@/lib/supabase';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from '@/contexts/LanguageContext';
import TransactionFilters from '@/components/features/TransactionFilters';
import TransactionsTable from '@/components/features/TransactionsTable';
import TransactionForm from '@/components/forms/TransactionForm';
import ExportTransactions from '@/components/features/ExportTransactions';
import TransactionStats from '@/components/features/TransactionStats';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { 
    transactions, 
    loading, 
    error, 
    fetchTransactions, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  const { categories } = useCategories();
  
  // Modal states
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isStatsOpen, onOpen: onStatsOpen, onClose: onStatsClose } = useDisclosure();
  
  // Component states
  const [filters, setFilters] = useState<TFilters>({
    type: 'all',
    status: 'all',
  });
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter and paginate transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        (t.category && t.category.toLowerCase().includes(searchLower))
      );
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo!));
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(t => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(t => t.amount <= filters.maxAmount!);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filtered;
  }, [transactions, filters]);

  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, pagination.page, pagination.limit]);

  // Update pagination total when filtered transactions change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredTransactions.length,
      page: 1, // Reset to first page when filters change
    }));
  }, [filteredTransactions.length]);

  // Handlers
  const handleFiltersChange = (newFilters: TFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
    });
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    onFormOpen();
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    onFormOpen();
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      // Refresh transactions after deletion
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleFormSubmit = async (transactionData: TransactionInsert) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        // Create new transaction
        await createTransaction(transactionData);
      }
      
      // Refresh transactions and close form
      await fetchTransactions();
      onFormClose();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handlePaginationChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

  const handleExport = (options: unknown) => {
    console.log('Exporting with options:', options);
    // Export functionality is handled by the ExportTransactions component
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label={t('loadingTransactions')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-danger">{t('errorLoadingTransactions')}</p>
            <Button 
              color="primary" 
              onPress={() => fetchTransactions()}
              className="mt-4"
            >
              {t('retry')}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('transactionManagement')}</h1>
          <p className="text-default-500 mt-1">
            {t('manageViewFilterTransactions')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            color="default"
            variant="flat"
            startContent={<ChartBarIcon className="h-4 w-4" />}
            onPress={onStatsOpen}
          >
            {t('statistics')}
          </Button>
          
          <Button
            color="default"
            variant="flat"
            startContent={<FunnelIcon className="h-4 w-4" />}
            onPress={() => setShowFilters(!showFilters)}
          >
            {t('filters')}
          </Button>
          
          <ExportTransactions 
            transactions={filteredTransactions}
            filters={filters}
            onExport={handleExport}
          />
          
          <Button
            color="primary"
            startContent={<PlusIcon className="h-4 w-4" />}
            onPress={handleCreateTransaction}
          >
            {t('addTransaction')}
          </Button>
        </div>
      </div>

      {/* Statistics Panel Modal */}
      {isStatsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{t('transactionStatistics')}</h2>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={onStatsClose}
                >
                  ×
                </Button>
              </div>
              <TransactionStats 
                transactions={filteredTransactions}
                period={statsPeriod}
                onPeriodChange={setStatsPeriod}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('filters.titleTransactions')}</h3>
          </CardHeader>
          <CardBody>
            <TransactionFilters
              filters={filters}
              categories={categories}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </CardBody>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">{t('totalTransactions')}</p>
            <p className="text-2xl font-bold">{filteredTransactions.length}</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">{t('totalIncome')}</p>
            <p className="text-2xl font-bold text-success-600">
              ${filteredTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">{t('totalExpenses')}</p>
            <p className="text-2xl font-bold text-danger-600">
              ${filteredTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">{t('balance')}</p>
            <p className={`text-2xl font-bold ${
              filteredTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0) -
              filteredTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0) >= 0
                ? 'text-success-600' : 'text-danger-600'
            }`}>
              ${(
                filteredTransactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0) -
                filteredTransactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
              ).toLocaleString()}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">{t('transactions')}</h3>
            <div className="text-sm text-default-500">
              {t('showing')} {Math.min((pagination.page - 1) * pagination.limit + 1, filteredTransactions.length)}-
              {Math.min(pagination.page * pagination.limit, filteredTransactions.length)} {t('of')} {filteredTransactions.length}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-0">
          <TransactionsTable
            transactions={paginatedTransactions}
            categories={categories}
            loading={loading}
            pagination={pagination}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onPageChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardBody>
      </Card>

      {/* Transaction Form Modal */}
      <TransactionForm
            isOpen={isFormOpen}
            onClose={onFormClose}
            transaction={editingTransaction}
            onSubmit={handleFormSubmit}
            mode={editingTransaction ? 'edit' : 'create'}
          />
    </div>
  );
}