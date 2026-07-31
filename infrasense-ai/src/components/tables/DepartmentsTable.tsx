import React from 'react';
import { Award } from 'lucide-react';
import type { Department } from '../../types';

interface DepartmentsTableProps {
  departments: Department[];
}

export const DepartmentsTable: React.FC<DepartmentsTableProps> = ({ departments }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4">Municipal Department</th>
            <th className="py-3.5 px-4">Department Head</th>
            <th className="py-3.5 px-4">Active Backlog</th>
            <th className="py-3.5 px-4">Average Resolution Time</th>
            <th className="py-3.5 px-4">Budget Spent Ratio</th>
            <th className="py-3.5 px-4 text-right">Efficiency Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-xs text-slate-700 dark:text-slate-300">
          {departments.map((dept) => {
            const spentPercentage = (dept.budgetUsed / dept.budgetAllocated) * 100;
            return (
              <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-white">
                  {dept.name}
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-650 dark:text-slate-400">
                  {dept.head}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1">
                    {dept.pendingRepairs} Orders
                    {dept.pendingRepairs > 20 && (
                      <span className="h-2 w-2 rounded-full bg-critical animate-pulse" />
                    )}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {dept.averageResolutionHours} Hours
                </td>
                <td className="py-3.5 px-4">
                  <div className="w-full max-w-[150px]">
                    <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-semibold">
                      <span>${(dept.budgetUsed / 1000).toFixed(0)}k spent</span>
                      <span>{spentPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-darkbg-border rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          spentPercentage > 85 
                            ? 'bg-critical' 
                            : spentPercentage > 60 
                            ? 'bg-warning' 
                            : 'bg-brand-500'
                        }`} 
                        style={{ width: `${spentPercentage}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center gap-1 justify-end font-bold text-success">
                    <Award className="h-4 w-4 text-success" />
                    {dept.efficiencyScore.toFixed(1)}%
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
