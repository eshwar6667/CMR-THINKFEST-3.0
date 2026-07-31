import React, { useEffect, useState } from 'react';
import { reportsApi, engineersApi } from '../services/api';
import type { Report, Engineer } from '../types';
import { CheckCircle2, Download, Search } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const OfficerReportsPDF: React.FC = () => {
  const [completedReports, setCompletedReports] = useState<Report[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const allReports = await reportsApi.getReports({
        category: categoryFilter,
        status: 'Completed',
        search: searchQuery
      });
      setCompletedReports(allReports);

      const engs = await engineersApi.getEngineers();
      setEngineers(engs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter, searchQuery]);

  // Client-side PDF generator using jsPDF
  const generatePDFReport = async (report: Report) => {
    try {
      // Fetch progress updates for timeline details
      const updates = await reportsApi.getProgressUpdates(report.id);
      const assignment = await reportsApi.getAssignments(report.id);
      const engineerName = engineers.find(e => e.id === assignment?.engineerId)?.name || 'Specialist Lead';

      const doc = new jsPDF();

      // Page Title Header
      doc.setFillColor(15, 23, 42); // slate-900 background for top header bar
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('INFRASENSE AI - CIVIL COMPLETION DOSSIER', 15, 15);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`TRACKING NUMBER: ${report.trackingId} | STATUS: RESOLVED`, 15, 22);
      doc.text(`SYSTEM GENERATED COMPLETION CERTIFICATE - AUGUST 2026`, 15, 27);

      // Report details Section
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. INCIDENT & ANALYSIS METRICS', 15, 48);
      
      doc.setDrawColor(226, 232, 240); // slate-200 border
      doc.line(15, 51, 195, 51);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Category:', 15, 59);
      doc.text('Severity:', 15, 65);
      doc.text('Location Address:', 15, 71);
      doc.text('Coordinates:', 15, 77);
      doc.text('Submission Date:', 15, 83);
      doc.text('Completion Date:', 15, 89);

      doc.setFont('helvetica', 'normal');
      doc.text(report.category, 50, 59);
      doc.text(report.severity, 50, 65);
      doc.text(report.location.address, 50, 71);
      doc.text(`Lat ${report.location.lat.toFixed(5)}, Lng ${report.location.lng.toFixed(5)}`, 50, 77);
      doc.text(new Date(report.createdAt).toLocaleDateString() + ' ' + new Date(report.createdAt).toLocaleTimeString(), 50, 83);
      doc.text(new Date(report.updatedAt).toLocaleDateString() + ' ' + new Date(report.updatedAt).toLocaleTimeString(), 50, 89);

      // Description
      doc.setFont('helvetica', 'bold');
      doc.text('Description of incident reported:', 15, 98);
      doc.setFont('helvetica', 'normal');
      const splitDesc = doc.splitTextToSize(report.description, 175);
      doc.text(splitDesc, 15, 104);

      const descHeight = splitDesc.length * 5;
      let currentY = 104 + descHeight + 10;

      // Engineer assignment Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. DISPATCH & MANPOWER ASSIGNMENT', 15, currentY);
      doc.line(15, currentY + 3, 195, currentY + 3);
      currentY += 10;

      doc.setFontSize(9);
      doc.text('Assigned Lead Engineer:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(engineerName, 60, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'bold');
      doc.text('Assignment Instruction notes:', 15, currentY);
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(assignment?.notes || 'Perform immediate structural repairs.', 175);
      doc.text(splitNotes, 15, currentY + 5);

      const notesHeight = splitNotes.length * 5;
      currentY += 5 + notesHeight + 10;

      // Resolution timeline Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('3. RESOLUTION TIMELINE STEPS & AUDIT REMARKS', 15, currentY);
      doc.line(15, currentY + 3, 195, currentY + 3);
      currentY += 10;

      doc.setFontSize(8);
      updates.forEach((u) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(`[${new Date(u.createdAt).toLocaleDateString()}] STAGE: ${u.status} (${u.percentComplete}% Complete) | Author: ${u.authorId}`, 15, currentY);
        doc.setFont('helvetica', 'normal');
        const splitLogs = doc.splitTextToSize(u.notes, 170);
        doc.text(splitLogs, 18, currentY + 4);
        currentY += 4 + (splitLogs.length * 4) + 4;
      });

      // Officer Sign off
      currentY += 10;
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.5);
      doc.line(15, currentY, 195, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('4. MUNICIPAL AUTHORITY SIGN-OFF', 15, currentY);
      currentY += 10;

      doc.setFontSize(8);
      doc.text('SIGNATURE / STAMP:', 15, currentY);
      doc.text('DATE CERTIFIED:', 120, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICER SMITH (CIVIL WORKS DEPT)', 15, currentY + 5);
      doc.text(new Date().toLocaleDateString(), 120, currentY + 5);

      // Save PDF in browser
      doc.save(`infrasense-completion-report-${report.trackingId}.pdf`);

    } catch (err) {
      console.error('Error generating PDF report:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2 select-none">
          <CheckCircle2 className="h-5.5 w-5.5 text-success" /> Completed Repairs Registry
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Review resolved municipal maintenance tasks and export certified completion reports as PDFs.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading resolved directory...</div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-5 shadow-soft flex flex-wrap items-center gap-3">
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

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-xs rounded-xl focus:outline-none font-semibold text-slate-655 dark:text-slate-250"
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
          </div>

          {/* Completed Work Ledger */}
          <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4">
            {completedReports.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border border-dashed border-slate-100 dark:border-darkbg-border rounded-xl">
                No resolved completed repairs match filters.
              </div>
            ) : (
              <div className="overflow-x-auto select-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Tracking ID</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Completed Date</th>
                      <th className="py-3 px-4 text-center">Export Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-slate-700 dark:text-slate-300 text-xs">
                    {completedReports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-550 dark:text-slate-400">
                          {report.trackingId}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-850 dark:text-white">
                          {report.category}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 border rounded-full text-[9px] font-bold bg-green-50 text-success border-green-200 dark:bg-green-950/20 dark:border-green-900/30">
                            Completed
                          </span>
                        </td>
                        <td className="py-3 px-4 truncate max-w-[150px]">
                          {report.location.address}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(report.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => generatePDFReport(report)}
                            className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-650 font-bold border border-brand-200 rounded-xl text-[10px] flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" /> PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default OfficerReportsPDF;
