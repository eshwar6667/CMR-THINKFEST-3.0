import React from 'react';
import { MapPin, Calendar, Cpu, ChevronRight } from 'lucide-react';
import type { Issue } from '../../types';

interface DamageCardProps {
  issue: Issue;
  onClick?: () => void;
}

export const DamageCard: React.FC<DamageCardProps> = ({ issue, onClick }) => {
  const severityColors = {
    Low: 'bg-green-50 text-success border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
    Medium: 'bg-blue-50 text-brand-600 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
    High: 'bg-amber-50 text-warning border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
    Critical: 'bg-red-50 text-critical border-red-200 dark:bg-red-950/20 dark:border-red-900/30',
  };

  const statusColors = {
    New: 'text-blue-500 bg-blue-50 dark:bg-blue-950/10',
    Assigned: 'text-amber-500 bg-amber-50 dark:bg-amber-950/10',
    Inspection: 'text-purple-500 bg-purple-50 dark:bg-purple-950/10',
    Repairing: 'text-orange-500 bg-orange-50 dark:bg-orange-950/10',
    Completed: 'text-green-500 bg-green-50 dark:bg-green-950/10',
    Cancelled: 'text-slate-500 bg-slate-50 dark:bg-slate-900/20',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-darkbg-card rounded-2xl border border-slate-200/80 dark:border-darkbg-border overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Image Preview */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 shrink-0 select-none">
        {issue.imageUrl ? (
          <img src={issue.imageUrl} alt={issue.category} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
            No image available
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${severityColors[issue.severity]}`}>
            {issue.severity}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[issue.status]}`}>
            {issue.status}
          </span>
        </div>

        {issue.aiDetection && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-brand-600/90 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-sm shadow-sm">
            <Cpu className="h-3 w-3 animate-pulse" /> AI Engine
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
              {issue.id}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
              {issue.category}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-darkbg-border space-y-1.5">
          <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{issue.location.address}</span>
          </div>
          <div className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 gap-1.5 justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-0.5 hover:text-brand-500">
              Inspect details <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
