"use client";

import { useState } from "react";
import Header from "./Header";
import StatsCard from "./StatsCard";
import PeriodSelector from "./PeriodSelector";
import ActionCard, {
  IncomeIcon,
  ExpenseIcon,
  TransferIcon,
  GoalIcon,
} from "./ActionCard";
import ExpensesByCategory from "./ExpensesByCategory";
import TransactionsHistory from "./TransactionsHistory";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    console.log("Period changed to:", period);
  };

  const handleAddIncome = () => {
    console.log("Add income clicked");
  };

  const handleAddExpense = () => {
    console.log("Add expense clicked");
  };

  const handleTransfer = () => {
    console.log("Transfer clicked");
  };

  const handleCreateGoal = () => {
    console.log("Create goal clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hello, Mark!</h1>
            </div>
            <PeriodSelector onPeriodChange={handlePeriodChange} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Balance"
            amount="$5,502.45"
            percentage="12.5%"
            isPositive={true}
            variant="balance"
          />
          <StatsCard
            title="Incomes"
            amount="$9,450.00"
            percentage="27%"
            isPositive={true}
            variant="income"
          />
          <StatsCard
            title="Expenses"
            amount="$3,945.55"
            percentage="-15%"
            isPositive={false}
            variant="expense"
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard
            title="Add income"
            description="Create an income manually"
            icon={<IncomeIcon />}
            onClick={handleAddIncome}
            variant="income"
          />
          <ActionCard
            title="Add expense"
            description="Create an expense manually"
            icon={<ExpenseIcon />}
            onClick={handleAddExpense}
            variant="expense"
          />
          <ActionCard
            title="Transfer"
            description="Transfer between accounts"
            icon={<TransferIcon />}
            onClick={handleTransfer}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Expenses by Category */}
          <div>
            <ExpensesByCategory />
          </div>
          {/* Transactions History */}
          <div className="col-span-2">
            <TransactionsHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
