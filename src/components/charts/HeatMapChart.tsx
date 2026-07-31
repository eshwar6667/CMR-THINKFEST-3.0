import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskData {
  name: string;
  index: number;
}

interface HeatMapChartProps {
  data: RiskData[];
}

export const HeatMapChart: React.FC<HeatMapChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#94a3b8', fontSize: 9 }}
          />
          <Radar 
            name="Risk Index" 
            dataKey="index" 
            stroke="#ef4444" 
            fill="#ef4444" 
            fillOpacity={0.2} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '11px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
