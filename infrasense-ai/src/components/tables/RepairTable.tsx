import React from 'react';
import { Eye, UserCheck } from 'lucide-react';
import type { Repair } from '../../types';

interface RepairTableProps {
  repairs: Repair[];
  onViewDetails: (repair: Repair) => void;
  onAssignEngineer?: (repair: Repair) => void;
}

export const RepairTable: React.FC<RepairTableProps> = ({ repairs, onViewDetails, onAssignEngineer }) => {
  const statusBadge = (status: Repair['status']) => {
    const badgeColors = {
      New: 'text-blue-500 bg-blue-50 dark:bg-blue-950/10',
      Assigned: 'text-amber-500 bg-amber-50 dark:bg-amber-950/10',
      Inspection: 'text-purple-500 bg-purple-50 dark:bg-purple-950/10',
      Repairing: 'text-orange-500 bg-orange-50 dark:bg-orange-950/10',
      Completed: 'text-green-500 bg-green-50 dark:bg-green-950/10',
      Cancelled: 'text-slate-500 bg-slate-50 dark:bg-slate-900/20',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4">Order ID</th>
            <th className="py-3.5 px-4">Work Title</th>
            <th className="py-3.5 px-4">Engineer</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Allocated Budget</th>
            <th className="py-3.5 px-4">Estimated End Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-xs text-slate-700 dark:text-slate-300">
          {repairs.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                No active repair logs.
              </td>
            </tr>
          ) : (
            repairs.map((repair) => (
              <tr key={repair.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-550 dark:text-slate-400">{repair.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">{repair.issueTitle}</td>
                <td className="py-3.5 px-4 font-medium">
                  {repair.engineerName || (
                    <span className="text-warning italic font-normal">Awaiting Assignment</span>
                  )}
                </td>
                <td className="py-3.5 px-4">{statusBadge(repair.status)}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-850 dark:text-white">
                  ${repair.cost.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  {repair.status === 'Completed' ? (
                    <span className="text-success font-medium">Completed</span>
                  ) : (
                    new Date(repair.estimatedCompletion).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewDetails(repair)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-darkbg-border text-slate-450 hover:text-brand-500 transition-colors"
                      title="View Order Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {onAssignEngineer && repair.status === 'New' && (
                      <button
                        onClick={() => onAssignEngineer(repair)}
                        className="p-1 rounded hover:bg-amber-50 dark:hover:bg-amber-950/20 text-slate-450 hover:text-warning transition-colors"
                        title="Assign Lead Engineer"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
