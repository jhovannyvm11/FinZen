"use client";

import { Card, CardBody, Chip } from "@heroui/react";

interface StatsCardProps {
  title: string;
  amount: string;
  percentage: string;
  isPositive: boolean;
  variant?: 'balance' | 'income' | 'expense';
}

export default function StatsCard({ 
  title, 
  amount, 
  percentage, 
  isPositive,
  variant = 'balance'
}: StatsCardProps) {
  const getAmountColor = () => {
    switch (variant) {
      case 'balance':
        return 'text-foreground';
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-danger';
      default:
        return 'text-foreground';
    }
  };

  const getBadgeColor = () => {
    return isPositive ? 'bg-success-50 text-success-700 border-success-200' : 'bg-danger-50 text-danger-700 border-danger-200';
  };

  const getIcon = () => {
    if (isPositive) {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
  };

  return (
    <Card className="bg-content1 border border-divider shadow-sm">
      <CardBody className="p-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground-500">{title}</h3>
          
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getAmountColor()}`}>
              {amount}
            </span>
            
            <Chip 
              size="sm" 
              variant="flat"
              className={`${getBadgeColor()} border`}
              startContent={getIcon()}
            >
              {percentage}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}