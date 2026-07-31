import React from 'react';
import { X, MapPin, AlertCircle, Cpu, Hammer } from 'lucide-react';
import type { Issue } from '../../types';

interface IssueDetailsModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (issue: Issue) => void;
}

export const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({
  issue,
  isOpen,
  onClose,
  onAssign,
}) => {
  if (!isOpen || !issue) return null;

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

  const detection = issue.aiDetection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border rounded-2xl w-full max-w-3xl overflow-hidden shadow-glass flex flex-col md:flex-row max-h-[90vh]">
        {/* Left: Image with Bounding Box Overlay */}
        <div className="w-full md:w-1/2 relative bg-slate-900 flex items-center justify-center p-2 min-h-[300px]">
          {issue.imageUrl ? (
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
              <img
                src={issue.imageUrl}
                alt={issue.category}
                className="max-h-[380px] w-auto object-contain rounded-lg"
              />
              {/* AI Bounding Box overlay */}
              {detection && detection.boundingBox && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${detection.boundingBox[0]}%`,
                    top: `${detection.boundingBox[1]}%`,
                    width: `${detection.boundingBox[2]}%`,
                    height: `${detection.boundingBox[3]}%`,
                    border: '3px solid #ef4444',
                    boxShadow: '0 0 12px rgba(239, 68, 68, 0.7)',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '4px',
                  }}
                  className="absolute pointer-events-none flex flex-col justify-start items-start"
                >
                  <span className="bg-red-500 text-white font-bold text-[8px] px-1 rounded-br py-0.5 uppercase tracking-wide">
                    {detection.category} ({(detection.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
              <AlertCircle className="h-6 w-6 text-slate-600" />
              No photo attached to report
            </div>
          )}
          
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white px-2 py-0.5 rounded text-[9px] font-mono select-none">
            {issue.id}
          </div>
        </div>

        {/* Right: Detailed report panel */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${severityColors[issue.severity]}`}>
                {issue.severity} Severity
              </span>
              <div className="flex items-center gap-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[issue.status]}`}>
                  {issue.status}
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-darkbg-border text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-850 dark:text-white">{issue.category}</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1 select-none">
                <MapPin className="h-3 w-3" /> {issue.location.address}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5 border-t border-slate-100 dark:border-darkbg-border pt-4">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Description</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Meta values */}
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-darkbg-border pt-4 text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Reported By</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{issue.reportedBy}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Report Date</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {new Date(issue.reportedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* AI Diagnostics details */}
            {detection && (
              <div className="bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100 dark:border-brand-900/30 rounded-xl p-3.5 space-y-2 select-none">
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                  <Cpu className="h-4 w-4 text-brand-500 animate-pulse" /> Computer Vision Diagnostics
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Anomaly Detected</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{detection.category}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Confidence Rating</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{(detection.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-slate-400 block">Recommended Patch Action</span>
                    <span className="font-medium text-slate-650 dark:text-slate-350">{detection.recommendedAction}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Est. Cost Allocation</span>
                    <span className="font-bold text-success">${detection.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Est. Time Outage</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{detection.estimatedTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="border-t border-slate-100 dark:border-darkbg-border pt-4 mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-darkbg-border text-slate-600 dark:text-slate-400 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Close Panel
            </button>
            {onAssign && issue.status === 'New' && (
              <button
                onClick={() => onAssign(issue)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1"
              >
                <Hammer className="h-4 w-4" /> Create Work Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
