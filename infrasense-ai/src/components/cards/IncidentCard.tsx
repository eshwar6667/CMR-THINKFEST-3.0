import React from 'react';
import { Hammer, User, DollarSign, Clock } from 'lucide-react';
import type { Repair } from '../../types';

interface IncidentCardProps {
  repair: Repair;
  onClick?: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ repair, onClick }) => {
  const statusColors = {
    New: 'bg-blue-50 text-blue-500 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
    Assigned: 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
    Inspection: 'bg-purple-50 text-purple-500 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
    Repairing: 'bg-orange-50 text-orange-500 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/30',
    Completed: 'bg-green-50 text-green-500 border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
    Cancelled: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/20 dark:border-slate-800/30',
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border hover:shadow-soft transition-all duration-150 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-xs font-semibold text-slate-850 dark:text-white line-clamp-1">
          {repair.issueTitle}
        </h4>
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${statusColors[repair.status]}`}>
          {repair.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-3 font-mono">
        <span>Order: {repair.id}</span>
        <span>Issue: {repair.issueId}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3 border-t border-slate-100 dark:border-darkbg-border pt-3">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate">{repair.engineerName || 'Unassigned'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="truncate">{repair.status === 'Completed' ? 'Closed' : repair.estimatedCompletion.split('T')[0]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 col-span-2">
          <DollarSign className="h-3.5 w-3.5 text-slate-400" />
          <span>Cost Allocated: **${repair.cost.toLocaleString()}**</span>
        </div>
      </div>

      {repair.updates && repair.updates.length > 0 && (
        <div className="bg-slate-50 dark:bg-darkbg-border/30 rounded-lg p-2 text-[10px] text-slate-500 dark:text-slate-400 flex gap-1.5">
          <Hammer className="h-3.5 w-3.5 text-brand-500 shrink-0 mt-0.5" />
          <p className="line-clamp-1 leading-normal italic">
            "{repair.updates[repair.updates.length - 1].notes}"
          </p>
        </div>
      )}
    </div>
  );
};
