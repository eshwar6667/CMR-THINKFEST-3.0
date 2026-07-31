import React from 'react';
import { Compass, Cpu, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: string; // 'report' | 'ai_detection' | 'assignment' | 'completion'
  user: string;
  action: string;
  timestamp: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'report':
        return {
          icon: Compass,
          bg: 'bg-blue-50 text-brand-500 dark:bg-blue-950/20 dark:text-brand-400',
        };
      case 'ai_detection':
        return {
          icon: Cpu,
          bg: 'bg-red-50 text-critical dark:bg-red-950/20 dark:text-critical',
        };
      case 'assignment':
        return {
          icon: UserCheck,
          bg: 'bg-amber-50 text-warning dark:bg-amber-950/20 dark:text-warning',
        };
      case 'completion':
        return {
          icon: CheckCircle2,
          bg: 'bg-green-50 text-success dark:bg-green-950/20 dark:text-success',
        };
      default:
        return {
          icon: AlertCircle,
          bg: 'bg-slate-50 text-slate-500 dark:bg-slate-800/30 dark:text-slate-400',
        };
    }
  };

  const severityBadges = {
    Low: 'text-success bg-green-50 dark:bg-green-950/15',
    Medium: 'text-brand-500 bg-blue-50 dark:bg-blue-950/15',
    High: 'text-warning bg-amber-50 dark:bg-amber-950/15',
    Critical: 'text-critical bg-red-50 dark:bg-red-950/15',
  };

  const { icon: Icon, bg } = getIcon();

  return (
    <div className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
      <div className={`p-2.5 rounded-xl shrink-0 ${bg}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {activity.user}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
            {activity.timestamp}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-1">
          {activity.action}
        </p>
        {activity.severity && (
          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${severityBadges[activity.severity]}`}>
            {activity.severity} Severity
          </span>
        )}
      </div>
    </div>
  );
};
