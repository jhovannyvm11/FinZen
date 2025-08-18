"use client";

import { useState, useEffect } from "react";
import StatsCard from "../ui/StatsCard";
import PeriodSelector from "../ui/PeriodSelector";
import ActionCard, {
  IncomeIcon,
  ExpenseIcon,
  TransferIcon,
} from "../ui/ActionCard";
import ExpensesByCategory from "../features/ExpensesByCategory";
import TransactionsHistory from "../features/TransactionsHistory";
import AddTransactionModal from "../forms/AddTransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/utils/currency";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense" | "transfer">(
    "expense"
  );
  const { loading, transactions, fetchTransactions } = useTransactions();
  const { t } = useTranslation();

  // Fetch all transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (selectedPeriod) {
      case "this-month":
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        });

      case "last-month":
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear =
          currentMonth === 0 ? currentYear - 1 : currentYear;
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === lastMonth &&
            transactionDate.getFullYear() === lastMonthYear
          );
        });

      case "this-year":
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate.getFullYear() === currentYear;
        });

      case "last-12-months":
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate >= twelveMonthsAgo;
        });

      default:
        return transactions;
    }
  };

  const refreshData = async () => {
    await fetchTransactions();
    getFilteredTransactions();
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate stats based on filtered transactions
  const getFilteredStats = () => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  };

  const stats = getFilteredStats();

  // Get previous period transactions for comparison
  const getPreviousPeriodTransactions = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (selectedPeriod) {
      case "this-month":
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === prevMonth &&
            transactionDate.getFullYear() === prevYear
          );
        });

      case "last-month":
        const twoMonthsAgo =
          currentMonth <= 1 ? (currentMonth === 0 ? 10 : 11) : currentMonth - 2;
        const twoMonthsAgoYear =
          currentMonth <= 1 ? currentYear - 1 : currentYear;
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate.getMonth() === twoMonthsAgo &&
            transactionDate.getFullYear() === twoMonthsAgoYear
          );
        });

      case "this-year":
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return transactionDate.getFullYear() === currentYear - 1;
        });

      case "last-12-months":
        const twentyFourMonthsAgo = new Date();
        twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        return transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          return (
            transactionDate >= twentyFourMonthsAgo &&
            transactionDate < twelveMonthsAgo
          );
        });

      default:
        return [];
    }
  };

  // Calculate dynamic percentages based on current vs previous period
  const calculatePercentages = () => {
    const currentTransactions = filteredTransactions;
    const previousTransactions = getPreviousPeriodTransactions();

    // Calculate current period stats
    const currentIncome = currentTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const currentExpenses = Math.abs(
      currentTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)
    );
    const currentBalance = currentIncome - currentExpenses;

    // Calculate previous period stats
    const prevIncome = previousTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const prevExpenses = Math.abs(
      previousTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)
    );
    const prevBalance = prevIncome - prevExpenses;

    // Calculate percentages
    const calculatePercentageChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? "+100.0%" : "0.0%";
      }
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
    };

    return {
      balancePercentage: calculatePercentageChange(currentBalance, prevBalance),
      incomePercentage: calculatePercentageChange(currentIncome, prevIncome),
      expensePercentage: calculatePercentageChange(
        currentExpenses,
        prevExpenses
      ),
    };
  };

  const percentages = calculatePercentages();

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    console.log("Period changed to:", period);
    // The stats and percentages will automatically update due to the dependency on selectedPeriod
  };

  const handleAddIncome = () => {
    setModalType("income");
    setIsModalOpen(true);
  };

  const handleAddExpense = () => {
    setModalType("expense");
    setIsModalOpen(true);
  };

  const handleTransfer = () => {
    setModalType("transfer");
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("dashboard.greeting")}
            </h1>
          </div>
          <PeriodSelector onPeriodChange={handlePeriodChange} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title={t("dashboard.balance")}
          amount={formatCurrency(stats.balance)}
          percentage={percentages.balancePercentage}
          isPositive={percentages.balancePercentage.startsWith("+")}
          variant="balance"
        />
        <StatsCard
          title={t("dashboard.income")}
          amount={formatCurrency(stats.income)}
          percentage={percentages.incomePercentage}
          isPositive={percentages.incomePercentage.startsWith("+")}
          variant="income"
        />
        <StatsCard
          title={t("dashboard.expenses")}
          amount={formatCurrency(Math.abs(stats.expenses))}
          percentage={percentages.expensePercentage}
          isPositive={!percentages.expensePercentage.startsWith("+")}
          variant="expense"
        />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title={t("dashboard.addIncome")}
          description={t("dashboard.addIncomeDescription")}
          icon={<IncomeIcon />}
          onClick={handleAddIncome}
          variant="income"
        />
        <ActionCard
          title={t("dashboard.addExpense")}
          description={t("dashboard.addExpenseDescription")}
          icon={<ExpenseIcon />}
          onClick={handleAddExpense}
          variant="expense"
        />
        <ActionCard
          title={t("dashboard.transfer")}
          description={t("dashboard.transferDescription")}
          icon={<TransferIcon />}
          onClick={handleTransfer}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expenses by Category */}
        <div>
          <ExpensesByCategory transactions={filteredTransactions} />
        </div>
        {/* Transactions History */}
        <div className="col-span-2">
          <TransactionsHistory
            transactions={filteredTransactions}
            loading={loading}
            onDelete={() => refreshData()}
            onEdit={() => refreshData()}
          />
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
}
