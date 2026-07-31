import React, { useEffect, useState } from 'react';
import { repairService } from '../services/repairService';
import type { Repair, IssueStatus } from '../types';
import { IncidentCard } from '../components/cards/IncidentCard';
import { TimelineModal } from '../components/modals/TimelineModal';
import { AssignEngineerForm } from '../components/forms/AssignEngineerForm';
import { Hammer, Plus, Clock } from 'lucide-react';
import { UpdateProgressModal } from '../components/modals/UpdateProgressModal';

export const RepairManagement: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal control states
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  
  const [assigningRepair, setAssigningRepair] = useState<Repair | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressRepair, setProgressRepair] = useState<Repair | null>(null);

  const openProgressUpdate = (repair: Repair) => {
    setProgressRepair(repair);
    setIsProgressOpen(true);
  };

  const handleProgressSuccess = (updatedRepair: Repair) => {
    setRepairs((prev) =>
      prev.map((r) => (r.id === updatedRepair.id ? updatedRepair : r))
    );
    setIsProgressOpen(false);
    setProgressRepair(null);
  };

  // Drag over state column tracking
  const [draggedOverColumn, setDraggedOverColumn] = useState<IssueStatus | null>(null);

  const fetchRepairs = async () => {
    try {
      const data = await repairService.getRepairs();
      setRepairs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const columns: IssueStatus[] = ['New', 'Assigned', 'Inspection', 'Repairing', 'Completed', 'Cancelled'];

  const getColumnsData = (col: IssueStatus) => {
    return repairs.filter((r) => r.status === col);
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, col: IssueStatus) => {
    e.preventDefault();
    setDraggedOverColumn(col);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCol: IssueStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const repairId = e.dataTransfer.getData('text/plain');
    if (!repairId) return;

    // Check if dragging from/to same state
    const repairItem = repairs.find((r) => r.id === repairId);
    if (!repairItem || repairItem.status === targetCol) return;

    // Optimistic Update
    setRepairs((prev) =>
      prev.map((r) => (r.id === repairId ? { ...r, status: targetCol } : r))
    );

    try {
      await repairService.updateRepair(repairId, { status: targetCol });
      fetchRepairs();
    } catch (err) {
      console.error(err);
      fetchRepairs(); // roll back on failure
    }
  };

  const openTimeline = (repair: Repair) => {
    setSelectedRepair(repair);
    setIsTimelineOpen(true);
  };

  const openAssign = (repair: Repair) => {
    setAssigningRepair(repair);
    setIsAssignOpen(true);
  };

  const handleAssignSuccess = (updatedRepair: Repair) => {
    setRepairs((prev) => prev.map((r) => (r.id === updatedRepair.id ? updatedRepair : r)));
    setIsAssignOpen(false);
    setAssigningRepair(null);
  };

  const columnHeaders = {
    New: { label: 'New Tickets', color: 'bg-blue-500' },
    Assigned: { label: 'Assigned', color: 'bg-amber-500' },
    Inspection: { label: 'Field Audit', color: 'bg-purple-500' },
    Repairing: { label: 'Repairing', color: 'bg-orange-500' },
    Completed: { label: 'Resolved', color: 'bg-green-500' },
    Cancelled: { label: 'Cancelled', color: 'bg-slate-400' },
  };

  return (
    <div className="space-y-6 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <Hammer className="h-5.5 w-5.5 text-brand-500" /> Maintenance Repair Kanban Board
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Drag and drop work orders between columns to dispatch crews and update completion statuses.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 shrink-0">Loading Kanban Columns...</div>
      ) : (
        /* Kanban viewport container */
        <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 min-w-[1200px] h-[calc(100vh-250px)] items-start">
            {columns.map((col) => {
              const colData = getColumnsData(col);
              const header = columnHeaders[col];
              const isOver = draggedOverColumn === col;

              return (
                <div
                  key={col}
                  onDragOver={(e) => handleDragOver(e, col)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col)}
                  className={`w-80 shrink-0 rounded-2xl bg-slate-50/70 dark:bg-darkbg-card/45 border p-3 flex flex-col max-h-full transition-all duration-200 ${
                    isOver 
                      ? 'border-brand-500/80 bg-brand-50/10 dark:bg-brand-950/5 shadow-inner scale-[1.01]' 
                      : 'border-slate-200/80 dark:border-darkbg-border'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1.5 select-none shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${header.color}`} />
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                        {header.label}
                      </h3>
                      <span className="text-[10px] bg-slate-200/70 dark:bg-darkbg-border/60 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                        {colData.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards stack */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[400px]">
                    {colData.length === 0 ? (
                      <div className="py-12 border-2 border-dashed border-slate-200/50 dark:border-darkbg-border/30 rounded-xl text-center text-[10px] text-slate-400 select-none">
                        No active items
                      </div>
                    ) : (
                      colData.map((repair) => (
                        <div
                          key={repair.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, repair.id)}
                          className="active:opacity-50 select-none"
                        >
                          <IncidentCard
                            repair={repair}
                            onClick={() => openTimeline(repair)}
                          />
                          {repair.status === 'New' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssign(repair);
                              }}
                              className="w-full mt-1 py-1.5 border border-dashed border-amber-250 hover:border-amber-500 rounded-xl text-[10px] text-amber-600 font-semibold flex items-center justify-center gap-1 bg-amber-50/20"
                            >
                              <Plus className="h-3 w-3" /> Assign Engineer Team
                            </button>
                          )}
                          {repair.status !== 'New' && repair.status !== 'Completed' && repair.status !== 'Cancelled' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProgressUpdate(repair);
                              }}
                              className="w-full mt-1.5 py-1.5 border border-dashed border-brand-300 hover:border-brand-500 rounded-xl text-[10px] text-brand-650 font-semibold flex items-center justify-center gap-1 bg-brand-50/20"
                            >
                              <Clock className="h-3 w-3" /> Log Progress Update
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline Audit history Modal */}
      <TimelineModal
        isOpen={isTimelineOpen}
        repair={selectedRepair}
        onClose={() => setIsTimelineOpen(false)}
      />

      {/* Assign Engineer form modal overlay */}
      {isAssignOpen && assigningRepair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border rounded-2xl w-full max-w-md p-6 shadow-glass relative">
            <AssignEngineerForm
              repair={assigningRepair}
              onSubmitSuccess={handleAssignSuccess}
              onCancel={() => {
                setIsAssignOpen(false);
                setAssigningRepair(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Progress update log modal */}
      {isProgressOpen && progressRepair && (
        <UpdateProgressModal
          isOpen={isProgressOpen}
          repair={progressRepair}
          onClose={() => {
            setIsProgressOpen(false);
            setProgressRepair(null);
          }}
          onSuccess={handleProgressSuccess}
        />
      )}
    </div>
  );
};
export default RepairManagement;
