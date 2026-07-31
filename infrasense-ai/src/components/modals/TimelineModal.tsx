import React from 'react';
import { X, User, Clock } from 'lucide-react';
import type { Repair } from '../../types';

interface TimelineModalProps {
  repair: Repair | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({ repair, isOpen, onClose }) => {
  if (!isOpen || !repair) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 select-none">
      <div className="bg-white dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border rounded-2xl w-full max-w-lg overflow-hidden shadow-glass flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-darkbg-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Work Order Audit History
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Order: {repair.id} | Issue ID: {repair.issueId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-darkbg-border text-slate-400 hover:text-slate-650"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="relative border-l-2 border-slate-200 dark:border-darkbg-border ml-3 space-y-6">
            {repair.updates && repair.updates.length > 0 ? (
              repair.updates.map((update, index) => {
                const isLast = index === repair.updates.length - 1;
                return (
                  <div key={index} className="relative pl-6">
                    {/* Circle marker */}
                    <span className={`absolute -left-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white dark:ring-darkbg-card ${
                      isLast 
                        ? 'bg-brand-500 animate-pulse' 
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`} />
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          update.status === 'Completed' 
                            ? 'text-success bg-green-50 dark:bg-green-950/20' 
                            : update.status === 'Repairing' 
                            ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/15'
                            : 'text-brand-600 bg-blue-50 dark:bg-blue-950/15'
                        }`}>
                          {update.status}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(update.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                        {update.notes}
                      </p>
                      
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>Log Action: {update.updatedBy}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pl-6 text-xs text-slate-450 italic">
                No history entries logged.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-darkbg-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-darkbg-border dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-semibold"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
