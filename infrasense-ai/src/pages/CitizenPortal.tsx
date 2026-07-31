import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import type { Issue } from '../types';
import { DamageCard } from '../components/cards/DamageCard';
import { IssueDetailsModal } from '../components/modals/IssueDetailsModal';
import { PlusCircle, Compass, FileSpreadsheet } from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        const allReps = await reportService.getReports();
        // Citizen sees their reports (or mock list filtered by their name if they logged in)
        const citizenReps = allReps.filter(r => r.reportedBy.includes(user?.name || '') || r.reportedBy === 'Elena Rostova' || r.reportedBy === 'Marcus Vance');
        setReports(citizenReps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCitizenData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-tealbrand-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-soft select-none">
        <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-white/5 translate-y-10 translate-x-10" />
        <div className="space-y-3 relative z-10 max-w-xl">
          <span className="text-[10px] font-bold tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full uppercase">
            Citizen Engagement
          </span>
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            Hi, {user?.name || 'Citizen'}! Welcome to the Public Safety Portal.
          </h2>
          <p className="text-xs text-brand-100 leading-relaxed">
            Report potholes, failed traffic lights, pipe leaks, or bridge cracking. Our computer vision AI screens reports instantly to accelerate municipal repairs.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/report')}
              className="px-5 py-2.5 bg-white text-brand-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow hover:scale-102 hover:shadow-lg transition-all"
            >
              <PlusCircle className="h-4.5 w-4.5" /> File Infrastructure Report
            </button>
          </div>
        </div>
      </div>

      {/* Grid of status tallies */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">My Reports</span>
          <span className="text-2xl font-bold mt-2 text-slate-800 dark:text-white">{reports.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Review</span>
          <span className="text-2xl font-bold mt-2 text-amber-500">{reports.filter(r => r.status === 'New').length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active repairs</span>
          <span className="text-2xl font-bold mt-2 text-brand-500">{reports.filter(r => r.status === 'Repairing' || r.status === 'Assigned').length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Resolved</span>
          <span className="text-2xl font-bold mt-2 text-success">{reports.filter(r => r.status === 'Completed').length}</span>
        </div>
      </div>

      {/* Reports history */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 select-none">
          <FileSpreadsheet className="h-4.5 w-4.5 text-brand-500" /> My Incident Logs
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Fetching history logs...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-darkbg-border rounded-3xl text-slate-400 text-xs">
            <Compass className="h-8 w-8 mx-auto mb-2 text-slate-350" />
            No incidents reported yet. Help keep your neighborhood safe by submitting defect tickets.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => (
              <DamageCard
                key={r.id}
                issue={r}
                onClick={() => {
                  setSelectedIssue(r);
                  setIsDetailsOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Issue Details Modal */}
      <IssueDetailsModal
        isOpen={isDetailsOpen}
        issue={selectedIssue}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};
export default CitizenPortal;
