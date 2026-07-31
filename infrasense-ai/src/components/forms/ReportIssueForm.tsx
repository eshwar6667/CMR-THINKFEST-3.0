import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Camera, MapPin, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Issue } from '../../types';

interface FormData {
  category: Issue['category'];
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  reportedBy: string;
  severity: Issue['severity'];
}

interface ReportIssueFormProps {
  onSubmitSuccess: (data: any) => void;
}

export const ReportIssueForm: React.FC<ReportIssueFormProps> = ({ onSubmitSuccess }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      category: 'Road Damage',
      severity: 'Medium',
      latitude: 40.7128,
      longitude: -74.0060,
      address: '',
      reportedBy: 'Citizen Reporter'
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getGPSLocation = () => {
    setIsGettingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', Number(position.coords.latitude.toFixed(6)));
          setValue('longitude', Number(position.coords.longitude.toFixed(6)));
          setValue('address', `GPS Coordinates: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsGettingGps(false);
        },
        () => {
          // Fallback mock
          setValue('latitude', 40.7061);
          setValue('longitude', -73.9969);
          setValue('address', 'Brooklyn Bridge Span Sector 4');
          setIsGettingGps(false);
        }
      );
    } else {
      setIsGettingGps(false);
    }
  };

  const onFormSubmit = (data: FormData) => {
    const fullData = {
      ...data,
      imageUrl: imagePreview || undefined,
      location: {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        address: data.address,
        district: data.district,
        city: 'New York'
      }
    };
    onSubmitSuccess(fullData);
    setSuccessMsg('Thank you! Issue successfully logged in the system. AI Engine scanning initiated.');
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 bg-white dark:bg-darkbg-card p-6 rounded-2xl border border-slate-200/80 dark:border-darkbg-border max-w-2xl mx-auto">
      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 text-success border border-green-200 dark:border-green-900/30 flex gap-2.5 text-sm items-start animate-pulse">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="font-medium">{successMsg}</p>
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-slate-850 dark:text-white mb-1">Create Infrastructure Incident Report</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">Provide photos and details to dispatch engineering services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category select */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Incident Category</label>
          <select
            {...register('category', { required: true })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Road Damage">Road Damage / Potholes</option>
            <option value="Bridge Damage">Bridge Damage / Cracking</option>
            <option value="Street Lights">Street Light Outage</option>
            <option value="Water Leakage">Water Leakage / Pipe Burst</option>
            <option value="Potholes">Potholes Only</option>
            <option value="Buildings">Public Buildings Integrity</option>
            <option value="Drainage">Sewerage / Storm Drain Blockage</option>
          </select>
        </div>

        {/* Severity select */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Estimated Severity</label>
          <select
            {...register('severity', { required: true })}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Low">Low (No Immediate Danger)</option>
            <option value="Medium">Medium (Disruptive but Safe)</option>
            <option value="High">High (Safety Hazard present)</option>
            <option value="Critical">Critical (Immediate Structural Integrity Failure)</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Incident Details / Notes</label>
        <textarea
          rows={4}
          {...register('description', { required: 'Please provide a brief description.' })}
          placeholder="Describe the potholes depth, pipe flood rate, rebar exposure details..."
          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {errors.description && (
          <span className="text-[10px] text-critical flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.description.message}</span>
        )}
      </div>

      {/* Location GPS */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Geographical Location</label>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            {...register('latitude', { required: true })}
            className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            {...register('longitude', { required: true })}
            className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Address (e.g. 100 Main St, District 4)"
            {...register('address', { required: 'Address is required.' })}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
          />
          <button
            type="button"
            onClick={getGPSLocation}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-250 dark:bg-darkbg-border dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all"
          >
            <MapPin className="h-4 w-4 text-brand-500" />
            {isGettingGps ? 'Tracking...' : 'Use GPS'}
          </button>
        </div>
        {errors.address && (
          <span className="text-[10px] text-critical flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.address.message}</span>
        )}
      </div>

      {/* Image Upload/Capture */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Media Attachment (Photo / Scan)</label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Box drag-drop */}
          <div className="relative border-2 border-dashed border-slate-200 dark:border-darkbg-border hover:border-brand-500 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-darkbg-border/20 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="h-6 w-6 text-slate-400 mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click or Drag Image</p>
            <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB</p>
          </div>

          {/* Image Preview */}
          <div className="border border-slate-200 dark:border-darkbg-border rounded-2xl flex items-center justify-center p-2 bg-slate-50 dark:bg-darkbg-border/20 relative h-32">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1 text-[10px] font-bold"
                >
                  X
                </button>
              </>
            ) : (
              <div className="text-center text-slate-400 text-xs flex flex-col items-center gap-1">
                <Camera className="h-5 w-5 text-slate-400" />
                <span>Camera capture preview</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            setImagePreview(null);
            setSuccessMsg(null);
          }}
          className="px-4 py-2.5 border border-slate-200 dark:border-darkbg-border rounded-xl text-xs text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          Submit Work Order
        </button>
      </div>
    </form>
  );
};
