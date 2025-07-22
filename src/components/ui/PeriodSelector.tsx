"use client";

import { useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

interface PeriodSelectorProps {
  onPeriodChange?: (period: string) => void;
}

const periods = [
  { key: 'this-month', label: 'This month' },
  { key: 'last-month', label: 'Last month' },
  { key: 'this-year', label: 'This year' },
  { key: 'last-12-months', label: 'Last 12 months' }
];

export default function PeriodSelector({ onPeriodChange }: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const selectedPeriodLabel = periods.find(p => p.key === selectedPeriod)?.label || 'This month';

  return (
    <div className="flex items-center space-x-1">
      {/* Period buttons */}
      <div className="flex items-center bg-default-100 rounded-lg p-1">
        {periods.map((period) => (
          <Button
            key={period.key}
            size="sm"
            variant={selectedPeriod === period.key ? "solid" : "light"}
            className={`
              ${selectedPeriod === period.key 
                ? 'bg-content1 text-foreground shadow-sm' 
                : 'bg-transparent text-foreground-500 hover:text-foreground'
              }
              font-medium px-3 py-2 rounded-md
            `}
            onPress={() => handlePeriodChange(period.key)}
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Custom period dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="bordered" 
            size="sm"
            className="border-divider text-foreground-500 hover:text-foreground"
            endContent={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            Select period
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Period selection">
          <DropdownItem key="custom-range">Custom range</DropdownItem>
          <DropdownItem key="last-week">Last week</DropdownItem>
          <DropdownItem key="last-quarter">Last quarter</DropdownItem>
          <DropdownItem key="last-year">Last year</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}