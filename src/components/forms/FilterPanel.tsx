import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export const FilterPanel: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useSearch();

  return (
    <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-soft select-none transition-colors">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 flex items-center gap-1.5 shrink-0 pr-1 border-r border-slate-200 dark:border-darkbg-border">
          <Filter className="h-4.5 w-4.5 text-brand-500" /> Filter Controls
        </span>

        {/* Severity selection */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400">Severity</span>
          <select
            value={filters.severity}
            onChange={(e) => updateFilters({ severity: e.target.value })}
            className="text-xs bg-slate-50 dark:bg-darkbg-input border border-slate-200 dark:border-darkbg-border text-slate-705 dark:text-slate-250 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Category selection */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400">Category</span>
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="text-xs bg-slate-50 dark:bg-darkbg-input border border-slate-200 dark:border-darkbg-border text-slate-705 dark:text-slate-250 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Bridge Damage">Bridge Integrity</option>
            <option value="Street Lights">Lighting Networks</option>
            <option value="Water Leakage">Water & Hydraulics</option>
            <option value="Potholes">Potholes Only</option>
            <option value="Buildings">Public Buildings</option>
            <option value="Drainage">Sewerage</option>
          </select>
        </div>

        {/* Status Selection */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400">Work Status</span>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="text-xs bg-slate-50 dark:bg-darkbg-input border border-slate-200 dark:border-darkbg-border text-slate-705 dark:text-slate-250 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="Inspection">Inspection</option>
            <option value="Repairing">Repairing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* District selection */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase font-bold text-slate-400">Municipal District</span>
          <select
            value={filters.district}
            onChange={(e) => updateFilters({ district: e.target.value })}
            className="text-xs bg-slate-50 dark:bg-darkbg-input border border-slate-200 dark:border-darkbg-border text-slate-705 dark:text-slate-250 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Districts</option>
            <option value="Manhattan">Manhattan Hub</option>
            <option value="Brooklyn">Brooklyn East</option>
            <option value="Queens">Queens Corridor</option>
            <option value="Bronx">Bronx North</option>
          </select>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-darkbg-border dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-semibold rounded-xl flex items-center gap-1 transition-all"
        title="Clear filters"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Clear Filters
      </button>
    </div>
  );
};
