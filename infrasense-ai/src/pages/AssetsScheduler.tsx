import React, { useEffect, useState } from 'react';
import type { InfrastructureAsset } from '../types';
import { assetService } from '../services/assetService';
import { FileSpreadsheet, Calendar as CalendarIcon, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';

export const AssetsScheduler: React.FC = () => {
  const [assets, setAssets] = useState<InfrastructureAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);

  // Calendar dates scheduled items state
  const [scheduledJobs, setScheduledJobs] = useState([
    { id: 1, title: 'Times Square Pipeline Seal', date: 3, time: '09:00', engineer: 'Sarah Connor', type: 'Pipeline', status: 'Scheduled' },
    { id: 2, title: 'Main Street Pothole Patching', date: 12, time: '08:00', engineer: 'David Lee', type: 'Road', status: 'Scheduled' },
    { id: 4, title: 'Bowery Traffic Junction Check', date: 24, time: '10:00', engineer: 'Michael Chang', type: 'Traffic Signal', status: 'Recurring' },
    { id: 5, title: 'Central Park Storm Gutter Clean', date: 28, time: '14:00', engineer: 'Elena Rostova', type: 'Drainage', status: 'Recurring' }
  ]);

  // AI Auto-Assign Simulation States
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const data = await assetService.getAssets();
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const getJobsForDay = (day: number) => {
    return scheduledJobs.filter((j) => j.date === day);
  };

  // Build grid calendar for August 2026 (Starts on Saturday, 31 days)
  const daysInMonth = 31;
  const startDayOffset = 6;
  
  const calendarSlots = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarSlots.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarSlots.push(i);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // AI Auto-Assignment optimization engine
  const handleAiAutoAssign = () => {
    setIsAiOptimizing(true);
    setAiMessage(null);

    setTimeout(() => {
      console.log('AI Model analyzing critical assets:', assets.filter(a => a.healthScore < 65));
      
      // Schedule them
      const newJobs = [
        {
          id: 101,
          title: 'Brooklyn Bridge Span Support',
          date: 15,
          time: '09:00',
          engineer: 'Dr. Aris Thorne',
          type: 'Bridge',
          status: 'AI Assigned'
        },
        {
          id: 102,
          title: 'Times Square Pipe Bypass',
          date: 6,
          time: '13:00',
          engineer: 'Sarah Connor',
          type: 'Pipeline',
          status: 'AI Assigned'
        },
        {
          id: 103,
          title: 'Bowery Junction Grid Repair',
          date: 20,
          time: '10:00',
          engineer: 'Michael Chang',
          type: 'Traffic Signal',
          status: 'AI Assigned'
        }
      ];

      // Update state
      setScheduledJobs((prev) => {
        // filter duplicates
        const filtered = prev.filter(j => j.id !== 101 && j.id !== 102 && j.id !== 103);
        return [...filtered, ...newJobs];
      });

      // Update assets list status in UI optimistically
      setAssets(prev => prev.map(a => {
        if (a.id === 'AST-101' || a.id === 'AST-102' || a.id === 'AST-106') {
          return { ...a, status: 'Under Inspection' };
        }
        return a;
      }));

      setIsAiOptimizing(false);
      setAiMessage(`AI Optimizer calculated and assigned workload: 3 critical assets successfully queued and scheduled on calendar slots.`);
    }, 2000);
  };

  const assetStatusBadge = (status: InfrastructureAsset['status']) => {
    const colors = {
      'Operational': 'text-success bg-green-50 dark:bg-green-950/20',
      'Requires Maintenance': 'text-warning bg-amber-50 dark:bg-amber-950/20',
      'Critical Repair Required': 'text-critical bg-red-50 dark:bg-red-950/20',
      'Under Inspection': 'text-purple-500 bg-purple-50 dark:bg-purple-950/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[8px] font-bold shrink-0 ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Section */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-tealbrand-600 rounded-3xl p-6 text-white shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/5 translate-x-20 -translate-y-10 blur-xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
              <Cpu className="h-3.5 w-3.5 animate-pulse" /> Predictive Dispatch Core
            </span>
            <h2 className="text-lg md:text-xl font-bold">Predictive AI Work Order Dispatch Roster</h2>
            <p className="text-xs text-brand-100 leading-relaxed">
              Auto-schedules maintenance using real-time structural health indices. The AI scheduler allocates available engineers to low health assets (<span className="font-bold underline">Health &lt; 65%</span>) based on specialization.
            </p>
          </div>

          <button
            onClick={handleAiAutoAssign}
            disabled={isAiOptimizing}
            className="px-5 py-3 bg-white text-brand-700 font-bold rounded-2xl text-xs hover:scale-102 hover:shadow-lg transition-all flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${isAiOptimizing ? 'animate-spin' : ''}`} />
            {isAiOptimizing ? 'Running Heuristics AI...' : 'Optimize & Assign Roster'}
          </button>
        </div>
      </div>

      {aiMessage && (
        <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/20 text-success border border-green-200 dark:border-green-900/30 flex gap-2.5 text-xs items-start animate-fade-in select-none">
          <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <p className="font-semibold">{aiMessage}</p>
        </div>
      )}

      {/* Main Grid: Assets Register Left, Calendar Right */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        
        {/* Left Grid: Assets register table */}
        <div className="xl:col-span-2 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-2xl p-5 shadow-soft flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5 select-none">
              <FileSpreadsheet className="h-4.5 w-4.5 text-brand-500" /> Monitored Assets Ledger
            </h3>
            
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading ledger assets...</div>
            ) : (
              <div className="overflow-y-auto max-h-[480px] divide-y divide-slate-100 dark:divide-darkbg-border/60">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-colors border text-xs flex justify-between items-start gap-2 ${
                      selectedAsset?.id === asset.id
                        ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/10'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold text-slate-800 dark:text-slate-205 truncate">
                        {asset.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        ID: {asset.id} | Health: **{asset.healthScore}%**
                      </span>
                    </div>
                    {assetStatusBadge(asset.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Grid: Calendar schedules */}
        <div className="xl:col-span-3 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border p-5 rounded-2xl shadow-soft">
          <div className="flex justify-between items-center mb-4 select-none">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <CalendarIcon className="h-4.5 w-4.5 text-brand-500" /> August 2026 Dispatch Slots
            </h3>
            <span className="text-[9px] bg-slate-100 dark:bg-darkbg-border text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
              August 2026
            </span>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none mb-1">
            {weekdays.map(d => <div key={d}>{d}</div>)}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarSlots.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-16 bg-slate-50/20 dark:bg-darkbg-border/10 rounded-lg" />;
              }

              const dayJobs = getJobsForDay(day);

              return (
                <div
                  key={`day-${day}`}
                  className="h-16 p-1 rounded-lg border border-slate-100 dark:border-darkbg-border flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <span className="text-[9px] font-extrabold text-slate-400">
                    {day}
                  </span>
                  
                  {/* Job indicators */}
                  <div className="space-y-0.5">
                    {dayJobs.map((job, jIdx) => (
                      <div
                        key={jIdx}
                        className={`text-[7px] px-1 py-0.2 rounded font-bold truncate leading-tight ${
                          job.status === 'AI Assigned'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30'
                            : job.status === 'Recurring'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                        }`}
                        title={`${job.title} (${job.engineer})`}
                      >
                        {job.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssetsScheduler;
