"use client";

import React from "react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export interface PieChartData {
  id: string;
  name: string;
  value: number;
  color: string;
  percentage?: string;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData & { total: number };
    value: number;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-foreground font-medium">{data.name}</p>
        <p className="text-foreground-500">
          Value: <span className="font-semibold">{data.value.toLocaleString()}</span>
        </p>
        <p className="text-foreground-500">
          Percentage: <span className="font-semibold">{data.percentage || `${((data.value / payload[0].payload.total) * 100).toFixed(1)}%`}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 300,
  height = 300,
  showTooltip = true,
  showLegend = false,
  innerRadius = 0,
  outerRadius = 100,
  className = "",
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex justify-center items-center ${className}`} style={{ width, height }}>
        <span className="text-foreground-500">No data available</span>
      </div>
    );
  }

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;