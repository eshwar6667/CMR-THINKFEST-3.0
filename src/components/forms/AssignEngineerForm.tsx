import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserCheck, DollarSign, Calendar } from 'lucide-react';
import { repairService } from '../../services/repairService';
import type { Engineer, Repair } from '../../types';

interface AssignFormData {
  engineerId: string;
  costEstimate: number;
  timeEstimate: string;
}

interface AssignEngineerFormProps {
  repair: Repair;
  onSubmitSuccess: (assignedRepair: Repair) => void;
  onCancel: () => void;
}

export const AssignEngineerForm: React.FC<AssignEngineerFormProps> = ({
  repair,
  onSubmitSuccess,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AssignFormData>({
    defaultValues: {
      costEstimate: repair.cost || 1000,
      timeEstimate: '3 days',
    }
  });

  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const data = await repairService.getEngineers();
        setEngineers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEngineers();
  }, []);

  const handleFormSubmit = async (data: AssignFormData) => {
    try {
      await repairService.assignEngineer(repair.id, data.engineerId);
      const fullyUpdated = await repairService.updateRepair(repair.id, {
        cost: Number(data.costEstimate),
        estimatedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // mock 3 days out
        status: 'Assigned'
      });
      onSubmitSuccess(fullyUpdated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
          Assign Engineering Team
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-550">
          Assigning work order **{repair.id}**: *{repair.issueTitle}*
        </p>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
          Retrieving engineer rosters...
        </div>
      ) : (
        <>
          {/* Engineer Select */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-slate-450" /> Select Lead Engineer
            </label>
            <select
              {...register('engineerId', { required: 'Please select an engineer' })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Choose Lead Engineer --</option>
              {engineers.map((e) => (
                <option 
                  key={e.id} 
                  value={e.id} 
                  disabled={e.availability === 'On Leave'}
                >
                  {e.name} ({e.specialization}) - {e.availability}
                </option>
              ))}
            </select>
            {errors.engineerId && (
              <span className="text-[10px] text-critical">{errors.engineerId.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cost Estimate */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-slate-450" /> Cost Allocated ($)
              </label>
              <input
                type="number"
                {...register('costEstimate', { required: 'Cost allocation is required', min: 1 })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.costEstimate && (
                <span className="text-[10px] text-critical">{errors.costEstimate.message}</span>
              )}
            </div>

            {/* Time Estimate */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-450" /> Completion Timeline
              </label>
              <input
                type="text"
                {...register('timeEstimate', { required: 'ETA is required' })}
                placeholder="e.g. 5 days"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.timeEstimate && (
                <span className="text-[10px] text-critical">{errors.timeEstimate.message}</span>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-200 dark:border-darkbg-border text-slate-650 dark:text-slate-400 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Confirm Assignment
            </button>
          </div>
        </>
      )}
    </form>
  );
};
