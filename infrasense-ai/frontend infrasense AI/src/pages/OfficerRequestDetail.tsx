import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsApi, engineersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Report, Engineer, Assignment, ProgressUpdate, ReportStatus } from '../types';
import { ArrowLeft, UserCheck, Hammer, MapPin, Clock, Camera, ShieldCheck, Mail, Phone } from 'lucide-react';

export const OfficerRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState<Report | null>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [progressLogs, setProgressLogs] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Engineer assignment fields
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Daily progress update fields
  const [progressStatus, setProgressStatus] = useState<ReportStatus>('In Progress');
  const [percentComplete, setPercentComplete] = useState(50);
  const [progressNotes, setProgressNotes] = useState('');
  const [progressImage, setProgressImage] = useState<string | null>(null);

  const [submittingAssign, setSubmittingAssign] = useState(false);
  const [submittingProgress, setSubmittingProgress] = useState(false);

  const fetchTriageDetails = async () => {
    if (!id) return;
    try {
      const reportData = await reportsApi.getReportById(id);
      if (reportData) {
        setReport(reportData);
        setProgressStatus(reportData.status === 'Completed' ? 'Completed' : 'In Progress');
        
        // Fetch engineers roster
        const engs = await engineersApi.getEngineers();
        setEngineers(engs);

        // Fetch existing assignment
        const assignData = await reportsApi.getAssignments(reportData.id);
        if (assignData) {
          setAssignment(assignData);
          setSelectedEngineerId(assignData.engineerId);
          setTargetDate(assignData.targetDate);
        }

        // Fetch progress logs timeline
        const logs = await reportsApi.getProgressUpdates(reportData.id);
        setProgressLogs(logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriageDetails();
  }, [id]);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !user || !selectedEngineerId) return;

    setSubmittingAssign(true);
    try {
      const updated = await reportsApi.assignReport(
        report.id,
        selectedEngineerId,
        assignmentNotes || 'Perform immediate structural repairs.',
        targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        user.name
      );
      setReport(updated);
      await fetchTriageDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !user || !progressNotes.trim()) return;

    setSubmittingProgress(true);
    try {
      const images = progressImage ? [progressImage] : [];
      const updated = await reportsApi.updateReportProgress(
        report.id,
        progressStatus,
        percentComplete,
        progressNotes,
        images,
        user.name
      );
      setReport(updated);
      setProgressNotes('');
      setProgressImage(null);
      await fetchTriageDetails();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingProgress(false);
    }
  };

  const handleProgressImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setProgressImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-400">Loading triage panel details...</div>;
  }

  if (!report) {
    return (
      <div className="py-12 text-center text-slate-400 select-none">
        <p className="font-bold">Report not found.</p>
        <button onClick={() => navigate('/officer/dashboard')} className="text-brand-500 hover:underline mt-2">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs min-h-[calc(100vh-10rem)] flex flex-col justify-between">
      <div className="space-y-6 flex-1">
        {/* Top navbar header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkbg-border pb-4 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="p-2 border border-slate-205 dark:border-darkbg-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-850 dark:text-white">
                Triage Control Hub
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Review public damage details, assign specialist engineers, and record daily status logs.
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 dark:bg-darkbg-border text-slate-550 dark:text-slate-350 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Severity: {report.severity}
          </span>
        </div>

        {/* Main Grid split: Report info left, form actions right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          
          {/* Left Column: Damage dossier + Audit Timeline (No empty spaces) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Dossier Card */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-darkbg-border/60 pb-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wide block">
                    Tracking ID: {report.trackingId}
                  </span>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                    {report.category} Damage Dossier
                  </h2>
                </div>

                {/* Evidence Image Gallery */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Evidence Photo Dossier</span>
                  {report.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {report.images.map((img, idx) => (
                        <img key={idx} src={img} alt="Evidence" className="h-44 w-full object-cover rounded-xl border bg-slate-100" />
                      ))}
                    </div>
                  ) : (
                    <div className="h-36 w-full bg-slate-50 dark:bg-slate-900 border dark:border-darkbg-border rounded-xl flex items-center justify-center text-slate-400 font-bold tracking-wider">
                      NO PHOTO ATTACHED
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Citizen Remarks</span>
                  <p className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl text-slate-705 dark:text-slate-300 leading-relaxed text-xs">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Pinpoint Map & Citizen details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-darkbg-border/60">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Incident Location Pinpoint</span>
                  <div className="h-48 w-full bg-slate-50 dark:bg-slate-900/60 rounded-xl relative overflow-hidden border border-slate-200 dark:border-darkbg-border flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full opacity-20 pointer-events-none">
                      <defs>
                        <pattern id="detail-grid-v2" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-350 dark:text-slate-650" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#detail-grid-v2)" />
                    </svg>
                    
                    {/* Position target pin dynamically based on mapped coordinates */}
                    {(() => {
                      const minLat = 17.3000;
                      const maxLat = 17.7000;
                      const minLng = 78.2000;
                      const maxLng = 78.7000;
                      
                      let targetLat = report.location.lat;
                      let targetLng = report.location.lng;
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
                          <span className="h-3 w-3 rounded-full bg-red-500 animate-ping absolute" />
                          <MapPin className="h-6 w-6 text-red-650 relative drop-shadow" />
                        </div>
                      );
                    })()}

                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[8px] font-bold px-2 py-0.5 rounded-full select-none">
                      Lat: {report.location.lat.toFixed(4)}, Lng: {report.location.lng.toFixed(4)}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block font-semibold truncate" title={report.location.address}>
                    {report.location.address}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Filing Citizen Profile</span>
                  <div className="p-3 border dark:border-darkbg-border rounded-xl space-y-2 bg-slate-50/20 dark:bg-slate-900/10">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="font-bold">Citizen Contact</span>
                    </div>
                    <div className="space-y-1.5 text-[10px] text-slate-400 font-medium">
                      <p className="flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> ID: {report.citizenId}</p>
                      <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone: 555-0199</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Audit Logs card */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4 select-none flex-1">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-105 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 dark:border-darkbg-border/60 pb-2">
                <Clock className="h-4.5 w-4.5 text-brand-500 animate-pulse" /> Repair Audit Dispatch Timeline
              </h3>

              {progressLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-semibold select-none">
                  Pending engineer assignment dispatch.
                </div>
              ) : (
                <div className="relative border-l border-slate-150 dark:border-darkbg-border pl-6 ml-3 space-y-6 max-h-[300px] overflow-y-auto pr-2">
                  {progressLogs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline node icon */}
                      <span className="absolute -left-9 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-darkbg-card border border-brand-500 shadow-sm text-brand-500">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-bold text-slate-655 dark:text-slate-350">
                            Status: {log.status} ({log.percentComplete}%) | {log.authorId}
                          </span>
                          <span className="font-mono">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">
                          {log.notes}
                        </p>
                        {log.images.length > 0 && (
                          <div className="flex gap-2 pt-2">
                            {log.images.map((img, idx) => (
                              <img key={idx} src={img} alt="Progress update" className="h-14 w-14 object-cover rounded-lg border bg-slate-100" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Actions Forms panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Form 1: Assign Specialist */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-5 shadow-soft space-y-4 flex-1">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-105 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 dark:border-darkbg-border/60 pb-2">
                <UserCheck className="h-4.5 w-4.5 text-brand-500" /> Assign Engineer Specialist
              </h3>

              <form onSubmit={handleAssignSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Lead Engineer</label>
                  <select
                    value={selectedEngineerId}
                    onChange={(e) => setSelectedEngineerId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-150 focus:outline-none font-medium"
                  >
                    <option value="">Select Specialist...</option>
                    {engineers.map((eng) => (
                      <option key={eng.id} value={eng.id}>
                        {eng.name} ({eng.specialty}) | Tasks: {eng.currentWorkload}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Target Completion Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-150 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Assignment Notes</label>
                  <textarea
                    rows={3}
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    placeholder="Provide guidance notes, materials requirements, structural safety limits..."
                    className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAssign || report.status === 'Completed'}
                  className="w-full py-2.5 bg-brand-650 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-md uppercase tracking-wider"
                >
                  {submittingAssign ? 'Assigning Specialist...' : assignment ? 'Update Assignment' : 'Assign Engineer Team'}
                </button>
              </form>
            </div>

            {/* Form 2: Daily Progress remarks */}
            {report.status !== 'Submitted' && (
              <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-5 shadow-soft space-y-4 flex-1">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-105 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 dark:border-darkbg-border/60 pb-2">
                  <Hammer className="h-4.5 w-4.5 text-brand-500" /> Daily Repair Progress Log
                </h3>

                <form onSubmit={handleProgressSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Transition Status</label>
                    <select
                      value={progressStatus}
                      onChange={(e) => setProgressStatus(e.target.value as ReportStatus)}
                      className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-850 dark:text-slate-100 focus:outline-none font-medium"
                    >
                      <option value="Assigned">Assigned (Queue)</option>
                      <option value="In Progress">In Progress (Active)</option>
                      <option value="Completed">Completed (Resolved)</option>
                      <option value="Rejected">Rejected / Invalid</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                      <label>Task Completed Percentage</label>
                      <span className="font-mono text-brand-500 font-bold">{percentComplete}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={percentComplete}
                      onChange={(e) => setPercentComplete(Number(e.target.value))}
                      className="w-full accent-brand-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 select-none cursor-pointer font-bold">
                      <Camera className="h-4 w-4 text-brand-500" /> Work Progress Photo (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProgressImageChange}
                      className="w-full text-xs file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                    />
                    {progressImage && (
                      <img src={progressImage} alt="Progress log upload preview" className="h-14 w-14 object-cover rounded-lg border mt-2" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Progress Log Remarks</label>
                    <textarea
                      rows={3}
                      required
                      value={progressNotes}
                      onChange={(e) => setProgressNotes(e.target.value)}
                      placeholder="Describe patch details, concrete setting hours, weather halts..."
                      className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProgress}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-md uppercase tracking-wider"
                  >
                    {submittingProgress ? 'Logging Progress Update...' : 'Commit Progress Log'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
export default OfficerRequestDetail;
