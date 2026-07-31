import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../services/api';
import type { Report } from '../types';
import { FileText, AlertCircle, Clock, CheckCircle2, Search, MapPin, Eye } from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Map toggle state
  const [showMapView, setShowMapView] = useState(false);

  const fetchOfficerReports = async () => {
    try {
      const data = await reportsApi.getReports({
        category: categoryFilter,
        severity: severityFilter,
        status: statusFilter,
        search: searchQuery
      });
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficerReports();
  }, [categoryFilter, severityFilter, statusFilter, searchQuery]);

  // Compute stat card metrics
  const totalIncoming = reports.length;
  const pendingTriage = reports.filter((r) => r.status === 'Submitted').length;
  const inProgress = reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
  const completedThisMonth = reports.filter((r) => r.status === 'Completed').length;

  const getSeverityBadgeClass = (sev: Report['severity']) => {
    const classes = {
      Low: 'bg-green-50 text-success border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
      Medium: 'bg-blue-50 text-brand-500 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
      High: 'bg-amber-50 text-warning border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
      Critical: 'bg-red-50 text-critical border-red-200 dark:bg-red-950/20 dark:border-red-900/30'
    };
    return classes[sev] || 'bg-slate-50 text-slate-500';
  };

  const getStatusBadgeClass = (status: Report['status']) => {
    const classes = {
      Submitted: 'bg-blue-50 text-brand-600 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
      'Under Review': 'bg-amber-50 text-warning border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
      Assigned: 'bg-purple-50 text-purple-650 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
      'In Progress': 'bg-purple-50 text-purple-650 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
      Completed: 'bg-green-50 text-success border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
      Rejected: 'bg-red-50 text-critical border-red-200 dark:bg-red-950/20 dark:border-red-900/30'
    };
    return classes[status] || 'bg-slate-50 text-slate-500';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-darkbg-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 select-none">
            Municipal Officer Operations Control
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Triage filed civic reports, assign specialists, and oversee repair timelines.
          </p>
        </div>
        <button
          onClick={() => setShowMapView(!showMapView)}
          className="px-4 py-2 border border-slate-200 dark:border-darkbg-border hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-all select-none"
        >
          <MapPin className="h-4.5 w-4.5 text-brand-500" />
          {showMapView ? 'Switch to List view' : 'Switch to Map view'}
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading operations controls...</div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Incoming Requests</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{totalIncoming}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-critical rounded-xl">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Pending Review</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{pendingTriage}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-warning rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Active Repair Tasks</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{inProgress}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-success rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Completed This Month</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{completedThisMonth}</p>
              </div>
            </div>
          </div>

          {/* Map / List View Conditional panels */}
          {showMapView ? (
            /* Mock map view containing coordinates pins clusters */
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4 select-none">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-105 uppercase tracking-wide">
                Incident Clusters Map View
              </h3>
              <div className="h-[550px] w-full bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-250 dark:border-darkbg-border relative flex items-center justify-center overflow-hidden">
                <svg className="absolute inset-0 h-full w-full opacity-20">
                  <defs>
                    <pattern id="officer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-350 dark:text-slate-650" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#officer-grid)" />
                </svg>

                {/* Plot report pins */}
                {reports.map((r) => {
                  // Hyderabad bounds projection: Lat 17.3 to 17.7, Lng 78.2 to 78.7
                  const minLat = 17.3000;
                  const maxLat = 17.7000;
                  const minLng = 78.2000;
                  const maxLng = 78.7000;
                  
                  let targetLat = r.location.lat;
                  let targetLng = r.location.lng;
                  
                  // Handle NYC legacy seeds or invalid bounds mapping
                  if (targetLat > 35 || targetLat < 10) {
                    targetLat = 17.5064;
                  }
                  if (targetLng < 0) {
                    targetLng = 78.3837;
                  }

                  const xPct = Math.max(5, Math.min(95, ((targetLng - minLng) / (maxLng - minLng)) * 100));
                  const yPct = Math.max(5, Math.min(95, (1 - (targetLat - minLat) / (maxLat - minLat)) * 100));

                  const colors = {
                    Low: 'bg-green-500',
                    Medium: 'bg-blue-500',
                    High: 'bg-amber-500',
                    Critical: 'bg-red-500',
                  };

                  return (
                    <div
                      key={r.id}
                      onClick={() => navigate(`/officer/requests/${r.id}`)}
                      className="absolute flex items-center gap-1 cursor-pointer group hover:scale-110 transition-transform select-none"
                      style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <span className={`h-4.5 w-4.5 rounded-full ${colors[r.severity || 'Medium']} ring-2 ring-white dark:ring-slate-900 drop-shadow animate-pulse`} />
                      <span className="bg-slate-900/85 backdrop-blur text-white text-[7px] px-1 py-0.5 rounded font-bold uppercase pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                        {r.trackingId} ({r.category})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Queue Table Grid */
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4">
              
              {/* Filters / Search line */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full md:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search tracking ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-205 dark:border-darkbg-border bg-slate-50/50 dark:bg-darkbg-input text-xs rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-[11px] rounded-xl focus:outline-none font-semibold text-slate-655 dark:text-slate-250"
                  >
                    <option value="All">All Categories</option>
                    <option value="Road">Road</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Monument/Heritage Site">Monument</option>
                    <option value="Park/Public Garden">Park</option>
                    <option value="Streetlight">Streetlight</option>
                    <option value="Water Infrastructure">Water</option>
                    <option value="Other">Other</option>
                  </select>

                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-[11px] rounded-xl focus:outline-none font-semibold text-slate-655 dark:text-slate-250"
                  >
                    <option value="All">All Severities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-[11px] rounded-xl focus:outline-none font-semibold text-slate-655 dark:text-slate-250"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Table List View */}
              {reports.length === 0 ? (
                <div className="py-12 text-center text-slate-400 border border-dashed border-slate-100 dark:border-darkbg-border rounded-xl">
                  No incoming requests match the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto select-none">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Evidence</th>
                        <th className="py-3 px-4">Tracking ID</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Filed Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-slate-700 dark:text-slate-300 text-xs">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                          <td className="py-3 px-4">
                            {report.images.length > 0 ? (
                              <img
                                src={report.images[0]}
                                alt={report.category}
                                className="h-10 w-10 rounded-lg object-cover bg-slate-100"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-slate-100 dark:bg-darkbg-border text-slate-400 rounded-lg flex items-center justify-center text-[7px] uppercase font-bold">
                                No Photo
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                            {report.trackingId}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-850 dark:text-white">
                            {report.category}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold ${getSeverityBadgeClass(report.severity)}`}>
                              {report.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 truncate max-w-[150px]" title={report.location.address}>
                            {report.location.address}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold ${getStatusBadgeClass(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => navigate(`/officer/requests/${report.id}`)}
                              className="p-1.5 border border-slate-200 dark:border-darkbg-border rounded-lg text-slate-500 hover:text-brand-500 hover:border-brand-300 dark:hover:bg-slate-800/50 transition-colors"
                              title="Triage & Manage Request"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default OfficerDashboard;
