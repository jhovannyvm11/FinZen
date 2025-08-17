"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Transaction } from "@/lib/supabase";
import { formatCurrency } from "@/utils/currency";
import { useCategories } from "@/hooks/useCategories";
import { useTranslation } from "@/contexts/LanguageContext";
import ReusablePieChart, { PieChartData } from "@/components/ui/PieChart";
import StatisticsLegend, { LegendItem } from "@/components/ui/StatisticsLegend";

// Icon components for different categories
const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 2L14 8M3.33 8V14M12.67 8V14M6 8.67V14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 3.33H14V12.67H2V3.33ZM2 6.67H14M4.67 10H4.68M7.33 10H8.67"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TransportationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.33 10H5.33M10 10H12.67M8 4V7.33M2 4H14V11.33H2V4ZM6 11.33H10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GroceriesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3.33 4.67H12.67M8 2V7.33M6.67 7H9.33M8 2H10.67V4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShoppingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4.67 2.67H11.33V6.67M2 6.67H14V13.33H2V6.67ZM6.67 8.67H9.33"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const categoryColors: { [key: string]: string } = {
  Food: "#17B26A",
  Entertainment: "#F04438",
  Transportation: "#0BA5EC",
  Shopping: "#4E5BA6",
  Bills: "#9E77ED",
  Health: "#F79009",
  Education: "#6172F3",
  Travel: "#DD2590",
  Other: "#667085",
};

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("food") || lowerCategory.includes("grocery"))
    return <GroceriesIcon />;
  if (lowerCategory.includes("entertainment")) return <CreditCardIcon />;
  if (lowerCategory.includes("transport")) return <TransportationIcon />;
  if (lowerCategory.includes("shopping")) return <ShoppingIcon />;
  if (lowerCategory.includes("house") || lowerCategory.includes("bill"))
    return <HouseIcon />;
  return <ShoppingIcon />; // Default icon
};

interface ExpensesByCategoryProps {
  transactions?: Transaction[];
}

const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = ({
  transactions = [],
}) => {
  const {
    categories,
    loading: categoriesLoading,
    getCategoryById,
  } = useCategories();
  const { t } = useTranslation();

  // Calculate expenses by category from transactions
  const calculateCategoryData = (): {
    chartData: PieChartData[];
    legendData: LegendItem[];
  } => {
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );

    if (expenseTransactions.length === 0) {
      return { chartData: [], legendData: [] };
    }

    // Group by category
    const categoryTotals: { [key: string]: number } = {};

    expenseTransactions.forEach((transaction) => {
      const category = transaction.category || "Other";
      const amount = Math.abs(Number(transaction.amount));
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    // Calculate total expenses
    const totalExpenses = Object.values(categoryTotals).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // Convert to data formats
    const processedData = Object.entries(categoryTotals)
      .map(([category, amount]) => {
        const categoryFromDB = getCategoryById(category);
        const percentage = `${((amount / totalExpenses) * 100).toFixed(1)}%`;
        const color =
          categoryFromDB?.color ||
          categoryColors[category] ||
          categoryColors["Other"];
        const name = categoryFromDB?.name || category;
        const id = category.toLowerCase().replace(/\s+/g, "-");
        const icon = getCategoryIcon(name);

        return {
          id,
          name,
          amount,
          percentage,
          color,
          icon,
        };
      })
      .sort((a, b) => b.amount - a.amount) // Sort by amount descending
      .slice(0, 5); // Show top 5 categories

    // Create chart data
    const chartData: PieChartData[] = processedData.map((item) => ({
      id: item.id,
      name: item.name,
      value: item.amount,
      color: item.color,
      percentage: item.percentage,
    }));

    // Create legend data
    const legendData: LegendItem[] = processedData.map((item) => ({
      id: item.id,
      name: item.name,
      value: item.amount,
      percentage: item.percentage,
      color: item.color,
      icon: item.icon,
    }));

    return { chartData, legendData };
  };

  const { chartData, legendData } = calculateCategoryData();

  if (categoriesLoading) {
    return (
      <Card className="w-full max-w-sm">
        <CardBody className="p-5 space-y-6">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-foreground">
              {t("stats.expensesByCategory")}
            </h3>
          </div>
          <div className="flex justify-center items-center h-60">
            <span className="text-foreground-500">{t("common.loading")}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardBody className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">
            {t("stats.expensesByCategory")}
          </h3>
        </div>

        {/* Content */}
        {chartData.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center"
            style={{ width: 240, height: 240 }}
          >
            <span className="text-foreground-500">{t("stats.noExpenses")}</span>
          </div>
        ) : (
          <>
            {/* Pie Chart */}
            <ReusablePieChart
              data={chartData}
              width={240}
              height={240}
              showTooltip={true}
              outerRadius={100}
            />

            {/* Legend */}
            <StatisticsLegend
              items={legendData}
              formatValue={formatCurrency}
              showBorder={true}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ExpensesByCategory;
