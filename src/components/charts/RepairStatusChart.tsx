import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RepairData {
  month: string;
  completed: number;
  backlog: number;
  avgDays: number;
}

interface RepairStatusChartProps {
  data: RepairData[];
}

export const RepairStatusChart: React.FC<RepairStatusChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
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
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="completed" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Completed Repairs"
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="backlog" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Active Backlog"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="avgDays" 
            stroke="#8b5cf6" 
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 2 }}
            name="Avg Resolution Time (Days)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
