"use client";

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Transaction } from '@/lib/supabase';
import { formatCurrency } from '@/utils/currency';

// Icon components for different categories
const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 2L14 8M3.33 8V14M12.67 8V14M6 8.67V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3.33H14V12.67H2V3.33ZM2 6.67H14M4.67 10H4.68M7.33 10H8.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TransportationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.33 10H5.33M10 10H12.67M8 4V7.33M2 4H14V11.33H2V4ZM6 11.33H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GroceriesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.33 4.67H12.67M8 2V7.33M6.67 7H9.33M8 2H10.67V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShoppingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4.67 2.67H11.33V6.67M2 6.67H14V13.33H2V6.67ZM6.67 8.67H9.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CategoryData {
  id: string;
  name: string;
  percentage: string;
  amount: number;
  color: string;
  icon: React.ReactNode;
}

const categoryColors: { [key: string]: string } = {
  'Food': '#17B26A',
  'Entertainment': '#F04438',
  'Transportation': '#0BA5EC',
  'Shopping': '#4E5BA6',
  'Bills': '#9E77ED',
  'Health': '#F79009',
  'Education': '#6172F3',
  'Travel': '#DD2590',
  'Other': '#667085'
};

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('food') || lowerCategory.includes('grocery')) return <GroceriesIcon />;
  if (lowerCategory.includes('entertainment')) return <CreditCardIcon />;
  if (lowerCategory.includes('transport')) return <TransportationIcon />;
  if (lowerCategory.includes('shopping')) return <ShoppingIcon />;
  if (lowerCategory.includes('house') || lowerCategory.includes('bill')) return <HouseIcon />;
  return <ShoppingIcon />; // Default icon
};

interface ExpensesByCategoryProps {
  transactions?: Transaction[];
}

// Simple pie chart component using SVG
const PieChart = ({ data }: { data: CategoryData[] }) => {
  const size = 240;
  const center = size / 2;
  const radius = 100;
  
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <span className="text-foreground-500">No expense data available</span>
      </div>
    );
  }
  
  // Convert amounts to angles
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = 0;
  
  const segments = data.map((item) => {
    const percentage = (item.amount / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return {
      ...item,
      pathData
    };
  });
  
  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className="fill-default-100"
        />
        {/* Pie segments */}
        {segments.map((segment) => (
          <path
            key={segment.id}
            d={segment.pathData}
            fill={segment.color}
          />
        ))}
      </svg>
    </div>
  );
};

const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = ({ transactions = [] }) => {
  // Calculate expenses by category from transactions
  const calculateCategoryData = (): CategoryData[] => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    if (expenseTransactions.length === 0) {
      return [];
    }
    
    // Group by category
    const categoryTotals: { [key: string]: number } = {};
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      const amount = Math.abs(Number(transaction.amount));
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    
    // Calculate total expenses
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    // Convert to CategoryData format
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        amount,
        percentage: `${((amount / totalExpenses) * 100).toFixed(1)}%`,
        color: categoryColors[category] || categoryColors['Other'],
        icon: getCategoryIcon(category)
      }))
      .sort((a, b) => b.amount - a.amount) // Sort by amount descending
      .slice(0, 5); // Show top 5 categories
  };
  
  const categoryData = calculateCategoryData();
  
  return (
    <Card className="w-full max-w-sm">
      <CardBody className="p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">
            Expenses by category
          </h3>
        </div>
        
        {/* Pie Chart */}
        <PieChart data={categoryData} />
        
        {/* Legend */}
        <div className="space-y-0">
          {categoryData.length === 0 ? (
            <div className="text-center py-8 text-foreground-500">
              No expense data available
            </div>
          ) : (
            categoryData.map((category, index) => (
              <div 
                key={category.id} 
                className={`flex items-center gap-2 py-3 px-2 ${
                  index < categoryData.length - 1 ? 'border-b border-divider' : ''
                }`}
              >
                {/* Icon with colored background */}
                <div 
                  className="flex items-center justify-center w-8 h-8 rounded-full p-2"
                  style={{ backgroundColor: category.color }}
                >
                  <div className="text-white w-4 h-4 flex items-center justify-center">
                    {category.icon}
                  </div>
                </div>
                
                {/* Category name */}
                <span className="flex-1 text-base font-medium text-foreground">
                  {category.name}
                </span>
                
                {/* Percentage */}
                <span className="text-base font-medium text-foreground-500">
                  {category.percentage}
                </span>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ExpensesByCategory;