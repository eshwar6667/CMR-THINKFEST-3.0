import React, { useEffect, useState } from 'react';
import type { Repair } from '../types';
import { repairService } from '../services/repairService';
import { CheckCircle2, Award, Clock, ShieldCheck, Heart, BarChart4, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const CompletedAssets: React.FC = () => {
  const [completedRepairs, setCompletedRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedData = async () => {
      try {
        const allRepairs = await repairService.getRepairs();
        // Filter out completed ones
        const completed = allRepairs.filter((r) => r.status === 'Completed');
        setCompletedRepairs(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedData();
  }, []);

  // Static mock efficiency values for completed assets
  const efficiencyData = [
    { name: 'Broadway Pothole', efficiency: 94, lifespanExtension: 3, uptime: 99.8 },
    { name: 'Empire Gutter 4', efficiency: 88, lifespanExtension: 2, uptime: 98.5 },
    { name: 'Queens Boulevard', efficiency: 91, lifespanExtension: 4, uptime: 99.2 },
    { name: 'JFK Pipe Section', efficiency: 96, lifespanExtension: 8, uptime: 99.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 select-none">
          <CheckCircle2 className="h-5.5 w-5.5 text-success" /> Completed Assets & Efficiency
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Review fully resolved civil infrastructure repairs, cost metrics, and operational efficiency analytics.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 select-none">Loading resolved asset ledger...</div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 text-success rounded-xl">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Resolved Work Tickets</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{completedRepairs.length} Assets</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-brand-500 rounded-xl">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Mean Efficiency Coefficient</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">92.2%</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-xl">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Avg. Lifespan Extension</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">+4.2 Years</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-warning rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Average Resolution Time</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">16.4 Hours</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Completed work orders grid list */}
            <div className="xl:col-span-2 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-2xl p-5 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Resolved Assets Directory
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider select-none">
                        <th className="py-3 px-4">Ticket</th>
                        <th className="py-3 px-4">Work Order Name</th>
                        <th className="py-3 px-4">Assigned Engineer</th>
                        <th className="py-3 px-4">Budget Spent</th>
                        <th className="py-3 px-4">Uptime Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-xs text-slate-700 dark:text-slate-300">
                      {completedRepairs.map((rep) => (
                        <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-500 dark:text-slate-400">{rep.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">{rep.issueTitle}</td>
                          <td className="py-3.5 px-4 font-medium">{rep.engineerName}</td>
                          <td className="py-3.5 px-4 font-semibold">${rep.cost.toLocaleString()}</td>
                          <td className="py-3.5 px-4 font-bold text-success flex items-center gap-1">
                            <ArrowUpRight className="h-3.5 w-3.5" /> 99.8%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Working Efficiency Graphs */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-2xl p-5 shadow-soft space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                  <BarChart4 className="h-4.5 w-4.5 text-brand-500" /> Operational Efficiency & Lifespan
                </h3>
                <span className="text-[10px] text-slate-450 mt-1 block">Years of service life extended by engineers patch actions.</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData} margin={{ left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Legend verticalAlign="top" height={36} iconSize={6} iconType="circle" formatter={(v) => <span className="text-xs text-slate-500">{v}</span>} />
                    <Bar dataKey="efficiency" fill="#0d9488" radius={[4, 4, 0, 0]} name="Efficiency (%)" />
                    <Bar dataKey="lifespanExtension" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Lifespan Ext. (Yrs)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CompletedAssets;
