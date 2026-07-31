import React, { useEffect, useState } from 'react';
import { reportService } from '../services/reportService';
import type { Issue } from '../types';
import { CityMap } from '../components/maps/CityMap';
import { Search, Layers, CheckSquare, Square, Cpu } from 'lucide-react';

export const LiveMap: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState<'satellite' | 'road' | 'dark'>('dark');
  const [loading, setLoading] = useState(true);

  // Filters state
  const [categories, setCategories] = useState<Record<string, boolean>>({
    'Road Damage': true,
    'Bridge Damage': true,
    'Street Lights': true,
    'Water Leakage': true,
    'Potholes': true,
    'Buildings': true,
    'Drainage': true,
  });

  const [severities, setSeverities] = useState<Record<string, boolean>>({
    'Critical': true,
    'High': true,
    'Medium': true,
    'Low': true,
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await reportService.getReports();
        setIssues(data);
        setFilteredIssues(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Filter computation logic
  useEffect(() => {
    let result = issues;

    // Search Query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.location.address.toLowerCase().includes(q)
      );
    }

    // Category filter
    result = result.filter((i) => categories[i.category] === true);

    // Severity filter
    result = result.filter((i) => severities[i.severity] === true);

    setFilteredIssues(result);
  }, [issues, searchQuery, categories, severities]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleSeverity = (sev: string) => {
    setSeverities((prev) => ({ ...prev, [sev]: !prev[sev] }));
  };

  const selectIssueOnMap = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const severityBadge = (severity: Issue['severity']) => {
    const colors = {
      Low: 'text-success bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
      Medium: 'text-brand-500 bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
      High: 'text-warning bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
      Critical: 'text-critical bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase shrink-0 ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white leading-tight">Live GIS Infrastructure Monitor</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">Live geospatial coordinates mapping reported defects across districts.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border p-1.5 rounded-xl shadow-sm text-xs font-semibold">
          <Layers className="h-4 w-4 text-brand-500 ml-1" />
          <span>Layer:</span>
          {(['dark', 'road', 'satellite'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setMapType(layer)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                mapType === layer
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-230px)] min-h-[500px]">
        {/* Left Side: filters & issue cards list */}
        <div className="w-full xl:w-80 bg-white dark:bg-darkbg-card rounded-2xl border border-slate-200/80 dark:border-darkbg-border p-4 flex flex-col justify-between overflow-hidden shrink-0 shadow-soft">
          <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search GPS incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-darkbg-input border border-slate-200 dark:border-darkbg-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Checkbox filters */}
            <div className="space-y-3.5 select-none border-b border-slate-100 dark:border-darkbg-border pb-3.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Anomaly Category</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400 max-h-[110px] overflow-y-auto pr-1">
                  {Object.keys(categories).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="flex items-center gap-1.5 text-left hover:text-slate-800 dark:hover:text-slate-205"
                    >
                      {categories[cat] ? (
                        <CheckSquare className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-slate-350 shrink-0" />
                      )}
                      <span className="truncate">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Severities</span>
                <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                  {Object.keys(severities).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => toggleSeverity(sev)}
                      className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-205"
                    >
                      {severities[sev] ? (
                        <CheckSquare className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-slate-350 shrink-0" />
                      )}
                      <span>{sev}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Matching items List */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 select-none">
                Incident Register ({filteredIssues.length} matches)
              </span>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading pins...</div>
              ) : (
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-darkbg-border/60 pr-1 space-y-1">
                  {filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => selectIssueOnMap(issue)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors border text-xs flex gap-2 justify-between items-start ${
                        selectedIssue?.id === issue.id
                          ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20'
                          : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-205 truncate">
                            {issue.category}
                          </span>
                          {issue.aiDetection && <Cpu className="h-3.5 w-3.5 text-brand-500 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate leading-none">
                          {issue.location.address}
                        </p>
                        <span className="text-[9px] font-mono text-slate-400 block">ID: {issue.id}</span>
                      </div>
                      {severityBadge(issue.severity)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Map Container */}
        <div className="flex-1 min-h-[400px]">
          <CityMap
            issues={filteredIssues}
            selectedIssue={selectedIssue}
            onSelectIssue={selectIssueOnMap}
            mapType={mapType}
          />
        </div>
      </div>
    </div>
  );
};
export default LiveMap;
