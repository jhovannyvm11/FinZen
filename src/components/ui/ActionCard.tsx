"use client";

import { Card, CardBody } from "@heroui/react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'income' | 'expense';
}

export default function ActionCard({ 
  title, 
  description, 
  icon, 
  onClick,
  variant = 'income'
}: ActionCardProps) {
  const getIconBgColor = () => {
    return variant === 'income' ? 'bg-success-100' : 'bg-danger-100';
  };

  return (
    <Card 
      className="bg-content1 border border-divider shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      isPressable
      onPress={onClick}
    >
      <CardBody className="p-6">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${getIconBgColor()}`}>
            {icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-foreground-500">
              {description}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Icon components
export const IncomeIcon = () => (
  <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export const ExpenseIcon = () => (
  <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

export const TransferIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

export const GoalIcon = () => (
  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);