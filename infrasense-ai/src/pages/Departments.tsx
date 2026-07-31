import React, { useEffect, useState } from 'react';
import type { Department } from '../types';
import { DepartmentsTable } from '../components/tables/DepartmentsTable';
import { Building2, DollarSign, Award, Clock } from 'lucide-react';
import { DepartmentChart } from '../components/charts/DepartmentChart';

export const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch departments data
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        // We fetch departments mock data
        // For fallback mock during API checks, we fetch from our local endpoints
        const res = await fetch('/src/mock/departments.json');
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        // Fallback hardcoded defaults if network fetches throw errors
        setDepartments([
          { id: 'dept-roads', name: 'Civil Infrastructure (Roads)', head: 'James Gordon', pendingRepairs: 32, completedRepairs: 542, averageResolutionHours: 24, budgetAllocated: 2500000, budgetUsed: 1850000, efficiencyScore: 92.4 },
          { id: 'dept-bridges', name: 'Bridges & Overpasses', head: 'Dr. Angela Merkel', pendingRepairs: 8, completedRepairs: 45, averageResolutionHours: 142, budgetAllocated: 5000000, budgetUsed: 4100000, efficiencyScore: 88.5 },
          { id: 'dept-electric', name: 'Electrical Grid', head: 'Thomas Edison', pendingRepairs: 18, completedRepairs: 382, averageResolutionHours: 12, budgetAllocated: 1200000, budgetUsed: 920000, efficiencyScore: 95.1 },
          { id: 'dept-water', name: 'Water & Sanitation', head: 'Director Marie Curie', pendingRepairs: 26, completedRepairs: 315, averageResolutionHours: 18, budgetAllocated: 3000000, budgetUsed: 2450000, efficiencyScore: 90.7 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const totalAllocatedBudget = departments.reduce((acc, curr) => acc + curr.budgetAllocated, 0);
  const totalUsedBudget = departments.reduce((acc, curr) => acc + curr.budgetUsed, 0);
  const averageResolution = departments.reduce((acc, curr) => acc + curr.averageResolutionHours, 0) / (departments.length || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 select-none">
          <Building2 className="h-5.5 w-5.5 text-brand-500" /> Municipal Departments Dashboard
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Monitor public works budget usage, resolution efficiencies, and queue loads.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 select-none">Loading departments performance data...</div>
      ) : (
        <>
          {/* Top overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-brand-500 rounded-xl">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Total Allocated Budget</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">${(totalAllocatedBudget / 1000000).toFixed(2)}M</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-teal-50 dark:bg-teal-950/20 text-tealbrand-500 rounded-xl">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Total Budget Spent</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">${(totalUsedBudget / 1000000).toFixed(2)}M</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-warning rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Average Resolution</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{averageResolution.toFixed(1)} Hours</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 text-success rounded-xl">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Mean Efficiency Score</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {(departments.reduce((acc, curr) => acc + curr.efficiencyScore, 0) / (departments.length || 1)).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Table */}
            <div className="xl:col-span-2 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-2xl p-5 shadow-soft">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-4">
                Department Performance Statistics
              </h3>
              <DepartmentsTable departments={departments} />
            </div>

            {/* Budget allocation chart */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-2xl p-5 shadow-soft">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-4">
                Budget Allocation Comparison
              </h3>
              <DepartmentChart data={departments.map(d => ({
                department: d.name.split(' ')[0],
                budget: d.budgetAllocated,
                spent: d.budgetUsed
              }))} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Departments;
