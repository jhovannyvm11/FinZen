"use client";

import React from "react";

export interface LegendItem {
  id: string;
  name: string;
  value: number;
  percentage: string;
  color: string;
  icon?: React.ReactNode;
}

interface StatisticsLegendProps {
  items: LegendItem[];
  formatValue?: (value: number) => string;
  className?: string;
  showBorder?: boolean;
}

const StatisticsLegend: React.FC<StatisticsLegendProps> = ({
  items,
  formatValue = (value) => value.toLocaleString(),
  className = "",
  showBorder = true,
}) => {
  if (items.length === 0) {
    return (
      <div className={`text-center py-8 text-foreground-500 ${className}`}>
        No data available
      </div>
    );
  }

  return (
    <div className={`space-y-0 ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center gap-3 py-3 px-2 ${
            showBorder && index < items.length - 1
              ? "border-b border-divider"
              : ""
          }`}
        >
          {/* Icon with colored background */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full p-2 flex-shrink-0"
            style={{ backgroundColor: item.color }}
          >
            {item.icon && (
              <div className="text-white w-4 h-4 flex items-center justify-center">
                {item.icon}
              </div>
            )}
          </div>

          {/* Item name */}
          <span className="flex-1 text-base font-medium text-foreground truncate">
            {item.name}
          </span>

          {/* Value and percentage */}
          <div className="flex flex-col items-end text-right">
            <span className="text-base font-medium text-foreground">
              {formatValue(item.value)}
            </span>
            <span className="text-sm text-foreground-500">
              {item.percentage}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsLegend;