import React from 'react';
import { ReportIssueForm } from '../components/forms/ReportIssueForm';
import { reportService } from '../services/reportService';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export const ReportIssue: React.FC = () => {
  const navigate = useNavigate();

  const handleReportSubmit = async (formData: any) => {
    try {
      // Create issue in service
      await reportService.createReport(formData);
      // Wait for user to read success message on form or redirect
      setTimeout(() => {
        navigate('/citizen');
      }, 2000);
    } catch (err) {
      console.error('Error logging report:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-205 dark:border-darkbg-border bg-white dark:bg-darkbg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-all"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-500" /> Log Civil Defect Report
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Submit anomalies directly to municipal public works database.
          </p>
        </div>
      </div>

      {/* Form Frame */}
      <ReportIssueForm onSubmitSuccess={handleReportSubmit} />
    </div>
  );
};
export default ReportIssue;
