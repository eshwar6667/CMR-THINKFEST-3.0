import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../services/api';
import type { Report } from '../types';
import { FileText, Clock, CheckCircle2, AlertCircle, PlusCircle, ArrowRight, MapPin } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizenData = async () => {
      if (!user) return;
      try {
        const data = await reportsApi.getReports({ citizenId: user.id });
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCitizenData();
  }, [user]);

  // Compute stat card metrics
  const totalReports = reports.length;
  const inProgress = reports.filter((r) => r.status === 'In Progress' || r.status === 'Assigned' || r.status === 'Under Review').length;
  const completed = reports.filter((r) => r.status === 'Completed').length;
  const pendingReview = reports.filter((r) => r.status === 'Submitted').length;

  const getStatusStyle = (status: Report['status']) => {
    const styles = {
      Submitted: 'bg-blue-50 text-brand-600 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30',
      'Under Review': 'bg-amber-50 text-warning border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
      Assigned: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
      'In Progress': 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/30',
      Completed: 'bg-green-50 text-success border-green-200 dark:bg-green-950/20 dark:border-green-900/30',
      Rejected: 'bg-red-50 text-critical border-red-200 dark:bg-red-950/20 dark:border-red-900/30'
    };
    return styles[status] || 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-darkbg-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 select-none">
            Welcome, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Submit damage reports and track public property repairs live.
          </p>
        </div>
        <button
          onClick={() => navigate('/citizen/report/new')}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs hover:scale-102 hover:shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Report New Damage
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading citizen summary...</div>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Total Submitted</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{totalReports}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 text-brand-500 rounded-xl">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Pending Review</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{pendingReview}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-warning rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">In Progress</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{inProgress}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-darkbg-card p-4 border border-slate-200/80 dark:border-darkbg-border rounded-2xl flex items-center gap-3 shadow-soft">
              <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-success rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400">Completed</span>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{completed}</p>
              </div>
            </div>
          </div>

          {/* Past Reports List */}
          <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Your Past Damage Reports
            </h3>

            {reports.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2 border-2 border-dashed border-slate-100 dark:border-darkbg-border rounded-2xl select-none">
                <p>No damage reports submitted yet.</p>
                <button
                  onClick={() => navigate('/citizen/report/new')}
                  className="text-brand-500 hover:underline font-semibold"
                >
                  Create your first report now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => navigate(`/citizen/reports?id=${report.id}`)}
                    className="group border border-slate-200/80 dark:border-darkbg-border hover:border-brand-500 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/30 dark:bg-darkbg-card/45"
                  >
                    <div className="space-y-3">
                      {report.images.length > 0 ? (
                        <img
                          src={report.images[0]}
                          alt={report.category}
                          className="h-32 w-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="h-32 w-full bg-slate-100 dark:bg-darkbg-border rounded-xl flex items-center justify-center text-slate-400 font-medium text-xs uppercase tracking-wide">
                          No Photo Evidence
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-white truncate">
                            {report.category}
                          </h4>
                          <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold shrink-0 ${getStatusStyle(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {report.description}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-darkbg-border/60 pt-3 mt-3 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {report.location.address.split(',')[0]}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-brand-500 group-hover:translate-x-0.5 transition-transform">
                        Track <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default CitizenDashboard;
