import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BudgetData {
  department: string;
  budget: number;
  spent: number;
}

interface DepartmentChartProps {
  data: BudgetData[];
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  const formatYAxis = (tick: number) => {
    return `$${(tick / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis 
            dataKey="department" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxis}
          />
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`]}
            contentStyle={{
              backgroundColor: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{value}</span>}
          />
          <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Allocated Budget" />
          <Bar dataKey="spent" fill="#0d9488" radius={[4, 4, 0, 0]} name="Budget Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
