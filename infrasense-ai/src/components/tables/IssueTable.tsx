import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import type { Issue } from '../../types';

interface IssueTableProps {
  issues: Issue[];
  onViewDetails: (issue: Issue) => void;
  onUpdateStatus?: (id: string, status: Issue['status']) => void;
}

export const IssueTable: React.FC<IssueTableProps> = ({ issues, onViewDetails, onUpdateStatus }) => {
  const severityBadge = (severity: Issue['severity']) => {
    const badgeColors = {
      Low: 'text-success bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
      Medium: 'text-brand-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
      High: 'text-warning bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
      Critical: 'text-critical bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeColors[severity]}`}>
        {severity}
      </span>
    );
  };

  const statusBadge = (status: Issue['status']) => {
    const badgeColors = {
      New: 'text-blue-500 bg-blue-50 dark:bg-blue-950/10',
      Assigned: 'text-amber-500 bg-amber-50 dark:bg-amber-950/10',
      Inspection: 'text-purple-500 bg-purple-50 dark:bg-purple-950/10',
      Repairing: 'text-orange-500 bg-orange-50 dark:bg-orange-950/10',
      Completed: 'text-green-500 bg-green-50 dark:bg-green-950/10',
      Cancelled: 'text-slate-500 bg-slate-50 dark:bg-slate-900/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeColors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4">Issue ID</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Address</th>
            <th className="py-3.5 px-4">Severity</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Reported By</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-xs text-slate-700 dark:text-slate-300">
          {issues.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-slate-500">
                No reports found matching criteria.
              </td>
            </tr>
          ) : (
            issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-550 dark:text-slate-400">{issue.id}</td>
                <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">{issue.category}</td>
                <td className="py-3.5 px-4 max-w-[200px] truncate" title={issue.location.address}>
                  {issue.location.address}
                </td>
                <td className="py-3.5 px-4">{severityBadge(issue.severity)}</td>
                <td className="py-3.5 px-4">{statusBadge(issue.status)}</td>
                <td className="py-3.5 px-4 font-medium">{issue.reportedBy}</td>
                <td className="py-3.5 px-4">
                  {new Date(issue.reportedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewDetails(issue)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-darkbg-border text-slate-450 hover:text-brand-500 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {onUpdateStatus && issue.status !== 'Completed' && (
                      <button
                        onClick={() => onUpdateStatus(issue.id, 'Completed')}
                        className="p-1 rounded hover:bg-green-50 dark:hover:bg-green-950/20 text-slate-450 hover:text-success transition-colors"
                        title="Mark Complete"
                      >
                        <CheckCircle2 className="h-4 w-4" />
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
