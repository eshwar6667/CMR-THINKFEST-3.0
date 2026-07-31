import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportsApi } from '../services/api';
import type { Category, GPSLocation } from '../types';
import { Camera, MapPin, Upload, X, ArrowLeft } from 'lucide-react';

export const CitizenReportForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form Fields
  const [category, setCategory] = useState<Category>('Road');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(17.5064);
  const [lng, setLng] = useState(78.3837);
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');

  // UI Coordinates Pin Position percentage
  const [clickX, setClickX] = useState(50);
  const [clickY, setClickY] = useState(50);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-capture Geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLat(latitude);
          setLng(longitude);
          setAddress(`Geo Sector Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Automatic GPS)`);
          
          // Project to visual grid mapping coordinate bounds: Lat 17.3000 to 17.7000, Lng 78.2000 to 78.7000
          const minLat = 17.3000;
          const maxLat = 17.7000;
          const minLng = 78.2000;
          const maxLng = 78.7000;

          let targetLat = latitude;
          let targetLng = longitude;
          if (latitude > 35 || latitude < 10) {
            targetLat = 17.5064;
          }
          if (longitude < 0) {
            targetLng = 78.3837;
          }

          const yPct = (1 - (targetLat - minLat) / (maxLat - minLat)) * 100;
          const xPct = ((targetLng - minLng) / (maxLng - minLng)) * 100;
          setClickX(xPct);
          setClickY(yPct);
        },
        (err) => {
          console.warn('Geolocation not allowed or failed, using Hyderabad default:', err);
          setLat(17.5064);
          setLng(78.3837);
          setAddress('Anna Nagar Ring Road, Ward 4');
          setClickX(55);
          setClickY(45);
        }
      );
    }
  }, []);

  // Handle mock file uploads (Convert to base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Map pin placement simulation (Mock Map canvas grid click)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    setClickX(xPct);
    setClickY(yPct);

    // Map to simulated Hyderabad coordinates bounds: Lat 17.3 to 17.7, Lng 78.2 to 78.7
    const calculatedLat = 17.3000 + ((100 - yPct) / 100) * 0.4000;
    const calculatedLng = 78.2000 + (xPct / 100) * 0.5000;

    setLat(calculatedLat);
    setLng(calculatedLng);
    setAddress(`Sector ${Math.floor(xPct/10)}-${Math.floor(yPct/10)}, Ward ${Math.floor(xPct / 15) + 1} (Custom Pin)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!description.trim()) {
      setErrorMsg('Please describe the damage in detail.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const location: GPSLocation = { lat, lng, address };
      
      // Submit with default severity 'Medium', to be processed later by AI model
      await reportsApi.createReport({
        citizenId: user.id,
        category,
        severity: 'Medium', // Default placeholder for AI predicted severity
        description,
        images,
        location
      });
      navigate('/citizen/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs min-h-[calc(100vh-10rem)] flex flex-col justify-between select-none">
      <div className="space-y-6 flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-darkbg-border pb-4">
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="p-2 border border-slate-200 dark:border-darkbg-border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
              Report Civic Damage
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Submit photo evidence, pinpoint the incident coordinates on the map grid, and alert municipal authorities.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-critical text-xs rounded-xl border border-red-200 dark:border-red-900/30 text-center font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Main Grid form columns */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Form column */}
          <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 space-y-5 shadow-soft flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category selection */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Damage Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
                >
                  <option value="Road">Road</option>
                  <option value="Bridge">Bridge</option>
                  <option value="Monument/Heritage Site">Monument/Heritage Site</option>
                  <option value="Park/Public Garden">Park/Public Garden</option>
                  <option value="Streetlight">Streetlight</option>
                  <option value="Water Infrastructure">Water Infrastructure</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Note on predicted AI Severity */}
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/20 rounded-xl">
                <span className="text-[10px] font-bold block mb-0.5">ℹ️ AI SEVERITY PREDICTION ENABLED</span>
                <span className="text-[9px] leading-relaxed block text-slate-500 dark:text-slate-400">
                  Damage impact level (Low/Medium/High/Critical) will be automatically computed using a real-time computer vision classifier.
                </span>
              </div>

              {/* Description text */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Description of Damage</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detail of structural degradation, public safety hazard, and scope of patching required..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Details & submit */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Contact Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-205 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md transition-all uppercase tracking-wider"
              >
                {loading ? 'Submitting Damage Report...' : 'File Damage Report'}
              </button>
            </div>
          </div>

          {/* Right Upload & Map Column */}
          <div className="flex flex-col gap-6">
            
            {/* Photo Evidence Drag Widget */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-100 dark:border-darkbg-border/60 pb-2">
                  <Camera className="h-4.5 w-4.5 text-brand-500" /> Photo Evidence Upload
                </h3>

                <div className="border-2 border-dashed border-slate-200 dark:border-darkbg-border rounded-2xl p-6 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-50/50 dark:hover:bg-darkbg-border/10 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="font-bold text-slate-700 dark:text-slate-250">Drag & Drop Image Files</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Supports JPG, PNG formats up to 5MB</span>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative h-20 rounded-lg overflow-hidden border border-slate-150">
                      <img src={img} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-0.5 bg-slate-900/60 rounded-full text-white hover:bg-slate-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Pin Drop Widget - Expanded Map height */}
            <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border rounded-3xl p-6 shadow-soft space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-darkbg-border/60 pb-2">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="h-4.5 w-4.5 text-brand-500" /> Select Damage Coordinates
                  </h3>
                  <span className="text-[9px] text-slate-450 font-bold font-mono">
                    Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                  </span>
                </div>

                {/* Interactive Grid Map Canvas - Height increased to h-72 */}
                <div
                  onClick={handleMapClick}
                  className="h-72 w-full bg-slate-100 dark:bg-slate-900/60 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-darkbg-border cursor-crosshair flex items-center justify-center"
                >
                  {/* Map grid lines SVG */}
                  <svg className="absolute inset-0 h-full w-full opacity-25 pointer-events-none">
                    <defs>
                      <pattern id="citizen-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-350 dark:text-slate-700" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#citizen-grid)" />
                  </svg>

                  {/* Pulsing Target marker pin */}
                  <div className="absolute flex flex-col items-center select-none animate-bounce" style={{ left: `${clickX}%`, top: `${clickY}%`, transform: 'translate(-50%, -50%)' }}>
                    <span className="h-3.5 w-3.5 rounded-full bg-brand-500 animate-ping absolute" />
                    <MapPin className="h-7 w-7 text-brand-650 relative drop-shadow" />
                  </div>

                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[8px] font-bold px-2.5 py-0.5 rounded-full select-none">
                    Click Grid Map to Position Pin
                  </div>
                </div>
              </div>

              {/* Address Fallback Text */}
              <div className="space-y-1 pt-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Pinpoint Address Location</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Anna Nagar Ring Road, Sector 3"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
export default CitizenReportForm;
