"use client";

import React, { useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Progress,
  Select,
  SelectItem,
  Button,
} from '@heroui/react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Transaction, TransactionStats as StatsType } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';

interface TransactionStatsProps {
  transactions: Transaction[];
  period?: 'week' | 'month' | 'quarter' | 'year';
  onPeriodChange?: (period: 'week' | 'month' | 'quarter' | 'year') => void;
}

interface ChartData {
  name: string;
  income: number;
  expense: number;
  net: number;
  date: string;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

export default function TransactionStats({
  transactions,
  period = 'month',
  onPeriodChange,
}: TransactionStatsProps) {
  const { t } = useTranslation();

  // Calculate basic stats
  const stats = useMemo((): StatsType => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    const totalTransactions = transactions.length;
    
    const avgTransaction = totalTransactions > 0 ? 
      transactions.reduce((sum, t) => sum + t.amount, 0) / totalTransactions : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      transactionCount: totalTransactions,
      averageTransaction: avgTransaction,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    };
  }, [transactions]);

  // Generate chart data based on period
  const chartData = useMemo((): ChartData[] => {
    const now = new Date();
    const data: ChartData[] = [];
    
    const periods: Date[] = [];
    let formatString = '';
    
    switch (period) {
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push(date);
        }
        formatString = 'MMM dd';
        break;
      case 'month':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push(date);
        }
        formatString = 'MMM dd';
        break;
      case 'quarter':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          periods.push(date);
        }
        formatString = 'MMM yyyy';
        break;
      case 'year':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          periods.push(date);
        }
        formatString = 'MMM yyyy';
        break;
    }

    periods.forEach(periodDate => {
      const periodTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        if (period === 'week' || period === 'month') {
          return transactionDate.toDateString() === periodDate.toDateString();
        } else {
          return transactionDate.getMonth() === periodDate.getMonth() &&
                 transactionDate.getFullYear() === periodDate.getFullYear();
        }
      });

      const income = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        name: periodDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: period === 'week' || period === 'month' ? 'numeric' : undefined,
          year: period === 'quarter' || period === 'year' ? 'numeric' : undefined
        }),
        income,
        expense,
        net: income - expense,
        date: periodDate.toISOString(),
      });
    });

    return data;
  }, [transactions, period]);

  // Category breakdown for expenses
  const categoryData = useMemo((): CategoryData[] => {
    const categoryTotals = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense' && t.category)
      .forEach(t => {
        const current = categoryTotals.get(t.category!) || 0;
        categoryTotals.set(t.category!, current + t.amount);
      });

    return Array.from(categoryTotals.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'success';
    if (balance < 0) return 'danger';
    return 'default';
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return <ArrowTrendingUpIcon className="h-5 w-5" />;
    if (balance < 0) return <ArrowTrendingDownIcon className="h-5 w-5" />;
    return <BanknotesIcon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('transactionStats')}</h2>
        <Select
          label={t('period')}
          placeholder={t('selectPeriod')}
          selectedKeys={[period]}
          onSelectionChange={(keys) => {
            const selectedPeriod = Array.from(keys)[0] as 'week' | 'month' | 'quarter' | 'year';
            onPeriodChange?.(selectedPeriod);
          }}
          className="w-48"
        >
          <SelectItem key="week">{t('lastWeek')}</SelectItem>
          <SelectItem key="month">{t('lastMonth')}</SelectItem>
          <SelectItem key="quarter">{t('lastQuarter')}</SelectItem>
          <SelectItem key="year">{t('lastYear')}</SelectItem>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-3 bg-success-100 rounded-full">
              <ArrowTrendingUpIcon className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-default-500">{t('totalIncome')}</p>
              <p className="text-2xl font-bold text-success-600">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-3 bg-danger-100 rounded-full">
              <ArrowTrendingDownIcon className="h-6 w-6 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-default-500">{t('totalExpenses')}</p>
              <p className="text-2xl font-bold text-danger-600">
                {formatCurrency(stats.totalExpenses)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className={`p-3 rounded-full ${
              stats.balance > 0 ? 'bg-success-100' : 
              stats.balance < 0 ? 'bg-danger-100' : 'bg-default-100'
            }`}>
              {getBalanceIcon(stats.balance)}
            </div>
            <div>
              <p className="text-sm text-default-500">{t('balance')}</p>
              <p className={`text-2xl font-bold ${
                stats.balance > 0 ? 'text-success-600' : 
                stats.balance < 0 ? 'text-danger-600' : 'text-default-600'
              }`}>
                {formatCurrency(stats.balance)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-default-500">{t('transactions')}</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.transactionCount}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('incomeVsExpenses')}</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="income" fill="#22c55e" name={t('income')} />
                <Bar dataKey="expense" fill="#ef4444" name={t('expenses')} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Net Flow Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('netCashFlow')}</h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#000' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name={t('netFlow')}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Category Breakdown and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('expensesByCategory')}</h3>
          </CardHeader>
          <CardBody>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <Divider className="my-4" />
                <div className="space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-default-500 py-8">
                {t('noExpenseData')}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('quickInsights')}</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {/* Savings Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{t('savingsRate')}</span>
                  <span className="text-sm font-bold">
                    {stats.totalIncome > 0 
                      ? `${((stats.balance / stats.totalIncome) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <Progress 
                  value={stats.totalIncome > 0 ? (stats.balance / stats.totalIncome) * 100 : 0}
                  color={stats.balance > 0 ? 'success' : 'danger'}
                  className="max-w-full"
                />
              </div>

              {/* Average Transaction */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-500">{t('avgTransaction')}</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(stats.averageTransaction)}
                </span>
              </div>

              {/* Largest Expense Category */}
              {categoryData.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-default-500">{t('topExpenseCategory')}</span>
                  <Chip size="sm" color="danger" variant="flat">
                    {categoryData[0].name}
                  </Chip>
                </div>
              )}

              {/* Transaction Frequency */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-default-500">{t('transactionFrequency')}</span>
                <span className="text-sm font-semibold">
                  {period === 'week' ? `${(stats.transactionCount / 7).toFixed(1)}/day` :
                   period === 'month' ? `${(stats.transactionCount / 30).toFixed(1)}/day` :
                   period === 'quarter' ? `${(stats.transactionCount / 90).toFixed(1)}/day` :
                   `${(stats.transactionCount / 365).toFixed(1)}/day`}
                </span>
              </div>

              {/* Balance Status */}
              <div className="pt-4">
                <Chip 
                  color={getBalanceColor(stats.balance)}
                  variant="flat"
                  startContent={getBalanceIcon(stats.balance)}
                  className="w-full justify-center"
                >
                  {stats.balance > 0 ? t('positiveBalance') :
                   stats.balance < 0 ? t('negativeBalance') :
                   t('breakEven')}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}