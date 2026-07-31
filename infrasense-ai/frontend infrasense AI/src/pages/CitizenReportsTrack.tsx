import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../services/api';
import type { Report, ProgressUpdate } from '../types';
import { Search, MapPin, Clock, AlertTriangle } from 'lucide-react';

export const CitizenReportsTrack: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');

  // Reports listing state
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchReportsData = async () => {
    if (!user) return;
    try {
      const data = await reportsApi.getReports({
        citizenId: user.id,
        category: categoryFilter,
        status: statusFilter,
        search: searchQuery
      });
      setReports(data);

      // Handle default/URL selected item
      if (selectedId) {
        const selected = data.find((r) => r.id === selectedId || r.trackingId === selectedId);
        if (selected) {
          setSelectedReport(selected);
          const updates = await reportsApi.getProgressUpdates(selected.id);
          setProgressUpdates(updates);
        }
      } else if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
        const updates = await reportsApi.getProgressUpdates(data[0].id);
        setProgressUpdates(updates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, [user, categoryFilter, statusFilter, searchQuery, selectedId]);

  const selectReportItem = async (report: Report) => {
    setSelectedReport(report);
    setSearchParams({ id: report.id });
    try {
      const updates = await reportsApi.getProgressUpdates(report.id);
      setProgressUpdates(updates);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status: Report['status']) => {
    const classes = {
      Submitted: 'bg-blue-50 text-brand-600 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
      'Under Review': 'bg-amber-50 text-warning border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
      Assigned: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
      'In Progress': 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
      Completed: 'bg-green-50 text-success border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
      Rejected: 'bg-red-50 text-critical border-red-200 dark:bg-red-950/20 dark:border-red-900/30'
    };
    return classes[status] || 'bg-slate-50 text-slate-500';
  };

  // Timeline step stages
  const timelineStages: Report['status'][] = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Completed'];

  const getTimelineStatus = (stage: Report['status'], currentStatus: Report['status']) => {
    const currentIdx = timelineStages.indexOf(currentStatus);
    const stageIdx = timelineStages.indexOf(stage);

    if (currentStatus === 'Rejected') {
      return stage === 'Submitted' ? 'completed' : 'inactive';
    }

    if (stageIdx < currentIdx) return 'completed';
    if (stageIdx === currentIdx) return 'active';
    return 'inactive';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start text-xs select-none">
      
      {/* Left Column: Filterable Reports List */}
      <div className="lg:col-span-2 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-5 shadow-soft space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-105 uppercase tracking-wide">
            Track Progress Directory
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Filter and search filed damage reports</p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search tracking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-darkbg-border bg-slate-50/50 dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-darkbg-border bg-slate-50/50 dark:bg-darkbg-input text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-darkbg-border bg-slate-50/50 dark:bg-darkbg-input text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
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

        {/* List items */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading reports ledger...</div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-dashed border-slate-100 dark:border-darkbg-border rounded-xl">
            No matching reports found.
          </div>
        ) : (
          <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => selectReportItem(report)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex gap-3 ${
                  selectedReport?.id === report.id
                    ? 'border-brand-500 bg-brand-50/15 dark:bg-brand-950/10'
                    : 'border-slate-100 hover:border-slate-205 dark:border-darkbg-border/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/10'
                }`}
              >
                {report.images.length > 0 ? (
                  <img
                    src={report.images[0]}
                    alt={report.category}
                    className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 bg-slate-100 dark:bg-darkbg-border text-slate-400 font-bold rounded-lg flex items-center justify-center text-[8px] uppercase shrink-0">
                    No Photo
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-mono font-bold text-slate-400 uppercase tracking-wide">
                      {report.trackingId}
                    </span>
                    <span className={`px-2 py-0.2 border rounded-full text-[8px] font-bold shrink-0 ${getStatusBadgeClass(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-white truncate">
                    {report.category}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    Filed on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Detailed Status timeline & stepper */}
      <div className="lg:col-span-3 space-y-6">
        {selectedReport ? (
          <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-6">
            
            {/* Report Info Banner */}
            <div className="flex justify-between items-start gap-4 border-b border-slate-100 dark:border-darkbg-border pb-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-450 font-mono font-bold uppercase tracking-wider block">
                  Report Tracking ID: {selectedReport.trackingId}
                </span>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                  {selectedReport.category} Damage Review
                </h2>
                <span className="text-[10px] font-bold text-slate-400 block flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedReport.location.address}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 border rounded-full font-bold ${getStatusBadgeClass(selectedReport.status)}`}>
                {selectedReport.status}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 select-none">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Resolution Timeline Stepper
              </h4>
              
              <div className="flex justify-between items-start relative px-2">
                {/* Horizontal line */}
                <div className="absolute top-3.5 left-10 right-10 h-0.5 bg-slate-100 dark:bg-darkbg-border -z-0" />
                
                {timelineStages.map((stage, idx) => {
                  const stateStatus = getTimelineStatus(stage, selectedReport.status);
                  
                  const bubbleColors = {
                    completed: 'bg-success text-white border-success ring-4 ring-green-100 dark:ring-green-950/20',
                    active: 'bg-brand-500 text-white border-brand-500 ring-4 ring-blue-100 dark:ring-blue-950/20 animate-pulse',
                    inactive: 'bg-white dark:bg-darkbg-card border-slate-200 dark:border-darkbg-border text-slate-400'
                  };

                  return (
                    <div key={stage} className="flex flex-col items-center gap-1.5 relative z-10 w-16 text-center">
                      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${bubbleColors[stateStatus]}`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[9px] font-bold ${stateStatus === 'inactive' ? 'text-slate-450' : 'text-slate-800 dark:text-slate-200'}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Progress Log list */}
            <div className="space-y-4 border-t border-slate-100 dark:border-darkbg-border pt-4">
              <h4 className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Status Logs & Officer Remarks
              </h4>

              {progressUpdates.length === 0 ? (
                <div className="py-4 text-center text-slate-400 font-medium select-none">
                  Pending officer triage review.
                </div>
              ) : (
                <div className="space-y-4">
                  {progressUpdates.map((update) => (
                    <div key={update.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-darkbg-border rounded-2xl space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-darkbg-border/60 pb-1.5 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Stage: {update.status} ({update.percentComplete}%)
                        </span>
                        <span className="font-mono">
                          {new Date(update.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-750 dark:text-slate-300 leading-relaxed text-xs">
                        {update.notes}
                      </p>
                      {update.images.length > 0 && (
                        <div className="flex gap-2.5 pt-1.5">
                          {update.images.map((img, imgIdx) => (
                            <img key={imgIdx} src={img} alt="Update progress patch" className="h-16 w-16 object-cover rounded-lg border bg-slate-100" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Original Submissions images & map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-darkbg-border pt-4">
              {/* Uploaded Pictures - Half Side */}
              <div className="flex flex-col">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Original Evidence Dossier</h4>
                <div className="flex-1 min-h-[250px] flex items-stretch">
                  {selectedReport.images.length === 0 ? (
                    <div className="w-full bg-slate-50 dark:bg-slate-900 border dark:border-darkbg-border rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xs select-none">
                      NO PHOTO ATTACHED
                    </div>
                  ) : selectedReport.images.length === 1 ? (
                    <img
                      src={selectedReport.images[0]}
                      alt="Submitted evidence"
                      className="w-full h-[250px] object-cover rounded-2xl border bg-slate-100"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {selectedReport.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="Submitted evidence"
                          className="w-full h-[120px] object-cover rounded-xl border bg-slate-100"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Coordinates Map - Half Side */}
              <div className="flex flex-col">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Reported Incident Map Location</h4>
                <div className="h-[250px] w-full bg-slate-50 dark:bg-slate-900/60 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-darkbg-border flex items-center justify-center">
                  {/* Grid background SVG */}
                  <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none">
                    <defs>
                      <pattern id="track-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-350 dark:text-slate-655" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#track-grid)" />
                  </svg>
                  
                  {/* Position target pin dynamically based on mapped coordinates */}
                  {(() => {
                    // Projection bounds
                    const minLat = 17.3000;
                    const maxLat = 17.7000;
                    const minLng = 78.2000;
                    const maxLng = 78.7000;
                    
                    let targetLat = selectedReport.location.lat;
                    let targetLng = selectedReport.location.lng;
                    if (targetLat > 35 || targetLat < 10) {
                      targetLat = 17.5064;
                    }
                    if (targetLng < 0) {
                      targetLng = 78.3837;
                    }

                    const xPct = Math.max(5, Math.min(95, ((targetLng - minLng) / (maxLng - minLng)) * 100));
                    const yPct = Math.max(5, Math.min(95, (1 - (targetLat - minLat) / (maxLat - minLat)) * 100));

                    return (
                      <div className="absolute flex flex-col items-center" style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -50%)' }}>
                        <span className="h-3 w-3 rounded-full bg-brand-500 animate-ping absolute" />
                        <MapPin className="h-6 w-6 text-brand-650 relative drop-shadow" />
                      </div>
                    );
                  })()}

                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[8px] font-bold px-2 py-0.5 rounded-full select-none">
                    Lat: {selectedReport.location.lat.toFixed(4)}, Lng: {selectedReport.location.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white dark:bg-darkbg-card border border-slate-205 dark:border-darkbg-border rounded-3xl p-12 text-center text-slate-400 select-none shadow-soft">
            <AlertTriangle className="h-10 w-10 mx-auto text-slate-350 animate-bounce mb-3" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">No Report Selected</p>
            <p className="text-[10px] text-slate-400 mt-1">Please select an item from the track directory list.</p>
          </div>
        )}
      </div>

    </div>
  );
};
export default CitizenReportsTrack;
