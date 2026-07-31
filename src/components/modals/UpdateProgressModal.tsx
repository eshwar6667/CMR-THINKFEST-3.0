import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Clock, Calendar, FileText } from 'lucide-react';
import { repairService } from '../../services/repairService';
import type { Repair, IssueStatus } from '../../types';

interface ProgressFormData {
  status: IssueStatus | 'Delayed due to rain';
  estimatedCompletion: string;
  notes: string;
}

interface UpdateProgressModalProps {
  repair: Repair;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedRepair: Repair) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  repair,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProgressFormData>({
    defaultValues: {
      status: repair.status === 'Completed' ? 'Completed' : 'Repairing',
      estimatedCompletion: repair.estimatedCompletion ? repair.estimatedCompletion.split('T')[0] : '',
      notes: '',
    }
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ProgressFormData) => {
    try {
      // Map 'Delayed due to rain' to 'Repairing' or 'Inspection' status but log it in the notes,
      // or we can allow the status to map to 'Repairing' but add rain delay metadata.
      // To keep it compatible with IssueStatus types, if status is 'Delayed due to rain', 
      // we store status as 'Repairing' or keep its current status, but log the notes.
      const targetStatus: IssueStatus = 
        data.status === 'Delayed due to rain' ? 'Repairing' : data.status;

      const notesText = 
        data.status === 'Delayed due to rain' 
          ? `Work delayed due to rain. ${data.notes}` 
          : data.notes;

      const updated = await repairService.updateRepair(repair.id, {
        status: targetStatus,
        estimatedCompletion: new Date(data.estimatedCompletion).toISOString(),
        updates: [
          ...(repair.updates || []),
          {
            timestamp: new Date().toISOString(),
            status: targetStatus,
            notes: notesText || `Status updated to ${data.status}`,
            updatedBy: 'Municipal Officer'
          }
        ]
      });

      onSuccess(updated);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 select-none">
      <div className="bg-white dark:bg-darkbg-card border border-slate-205 dark:border-darkbg-border rounded-2xl w-full max-w-md overflow-hidden shadow-glass p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkbg-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-105">
              Log Repair Progress Update
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Order: {repair.id} | Asset: {repair.issueTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-darkbg-border text-slate-400 hover:text-slate-650"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
          {/* Status select */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-455 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-450" /> Update Current Status
            </label>
            <select
              {...register('status', { required: 'Please select a status' })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="Repairing">Work in Progress</option>
              <option value="Delayed due to rain">Delayed due to rain</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Date input */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-455 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-450" /> Est. Completion Date
            </label>
            <input
              type="date"
              {...register('estimatedCompletion', { required: 'Estimated completion date is required' })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none font-mono"
            />
            {errors.estimatedCompletion && (
              <span className="text-[10px] text-critical">{errors.estimatedCompletion.message}</span>
            )}
          </div>

          {/* Progress Notes */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-455 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-450" /> Log Progress Notes
            </label>
            <textarea
              rows={3}
              {...register('notes', { required: 'Please provide progress details.' })}
              placeholder="e.g. Concrete setting underway or heavy rain stalled structural excavation operations..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none"
            />
            {errors.notes && (
              <span className="text-[10px] text-critical">{errors.notes.message}</span>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2.5 pt-2 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-darkbg-border text-slate-655 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-md"
            >
              Update Work Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateProgressModal;
