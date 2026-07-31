import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'teal' | 'green' | 'orange' | 'red' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      icon: 'text-brand-500 dark:text-brand-400',
      border: 'hover:border-brand-500/25',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/20',
      icon: 'text-tealbrand-500 dark:text-tealbrand-400',
      border: 'hover:border-tealbrand-500/25',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      icon: 'text-success dark:text-success',
      border: 'hover:border-success/25',
    },
    orange: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      icon: 'text-warning dark:text-warning',
      border: 'hover:border-warning/25',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      icon: 'text-critical dark:text-critical',
      border: 'hover:border-critical/25',
    },
    slate: {
      bg: 'bg-slate-50 dark:bg-slate-800/30',
      icon: 'text-slate-500 dark:text-slate-400',
      border: 'hover:border-slate-500/20',
    },
  };

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border hover:shadow-soft transition-all duration-200 ${colorMap[color].border}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide uppercase text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-850 dark:text-white leading-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color].bg}`}>
          <Icon className={`h-5 w-5 ${colorMap[color].icon}`} />
        </div>
      </div>
      
      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive 
                ? 'text-success bg-green-50 dark:bg-green-950/20' 
                : 'text-critical bg-red-50 dark:bg-red-950/20'
            }`}>
              {trend.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
