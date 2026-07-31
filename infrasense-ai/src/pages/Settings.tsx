import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Server, Map, Globe, User as UserIcon, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  
  // Profile settings state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // API endpoints config state
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:8000');
  const [mapProvider, setMapProvider] = useState('CartoDB Dark');
  const [language, setLanguage] = useState('English');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Profile credentials updated successfully.');
  };

  const handleApiSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('REST API and GIS Server endpoints successfully re-bound.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <SettingsIcon className="h-5.5 w-5.5 text-brand-500" /> Platform Settings & Integrations
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Configure REST API endpoints, update profile settings, and modify map layers.
          </p>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 text-xs text-green-400 bg-green-950/20 border border-green-900/30 rounded-xl flex items-center gap-2 select-none animate-pulse">
          <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0" /> {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Sidebar Panel */}
        <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border p-4 rounded-2xl space-y-1 select-none shadow-soft">
          <h3 className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-2">Settings Sections</h3>
          <button className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-500 bg-brand-50/50 dark:bg-brand-950/20 rounded-xl flex items-center gap-2.5">
            <UserIcon className="h-4.5 w-4.5" /> User profile details
          </button>
          <button className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center gap-2.5">
            <Server className="h-4.5 w-4.5 text-slate-400" /> API Connections
          </button>
          <button className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center gap-2.5">
            <Map className="h-4.5 w-4.5 text-slate-400" /> Map Providers
          </button>
          <button className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl flex items-center gap-2.5">
            <Globe className="h-4.5 w-4.5 text-slate-400" /> Localizations
          </button>
        </div>

        {/* Configurations Fields */}
        <div className="md:col-span-2 space-y-6">
          {/* Section 1: profile settings */}
          <div className="bg-white dark:bg-darkbg-card border border-slate-202/80 dark:border-darkbg-border p-5 rounded-2xl shadow-soft space-y-4">
            <div className="border-b border-slate-100 dark:border-darkbg-border pb-3 flex items-center gap-2 select-none">
              <UserIcon className="h-4.5 w-4.5 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">User Profile Details</h3>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-202 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-202 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-darkbg-border pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-202 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Set new credentials"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-202 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end select-none">
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: API connection strings */}
          <div className="bg-white dark:bg-darkbg-card border border-slate-202/80 dark:border-darkbg-border p-5 rounded-2xl shadow-soft space-y-4">
            <div className="border-b border-slate-100 dark:border-darkbg-border pb-3 flex items-center gap-2 select-none">
              <Server className="h-4.5 w-4.5 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">API Connection Strings</h3>
            </div>

            <form onSubmit={handleApiSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">REST API Base Endpoint</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-202 dark:border-darkbg-border bg-slate-50 dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none font-mono"
                  required
                />
                <span className="text-[9px] text-slate-400 block mt-1 select-none">
                  Currently configured fallback mock parameters. Maps to environment variable: **.env [VITE_API_URL]**
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-darkbg-border pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">GIS Tile Layer Provider</label>
                  <select
                    value={mapProvider}
                    onChange={(e) => setMapProvider(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-202 bg-slate-50 dark:bg-darkbg-input dark:border-darkbg-border text-slate-800 focus:outline-none"
                  >
                    <option value="CartoDB Dark">CartoDB Dark Matter (Recommended)</option>
                    <option value="Voyager Road">CartoDB Voyager Road</option>
                    <option value="Esri Satellite">Esri World Imagery (Satellite)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Localization</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-202 bg-slate-50 dark:bg-darkbg-input dark:border-darkbg-border text-slate-800 focus:outline-none"
                  >
                    <option value="English">English (US)</option>
                    <option value="Spanish">Spanish (ES)</option>
                    <option value="French">French (FR)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end select-none">
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-655 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Save API Bindings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
