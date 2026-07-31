import React from 'react';
import { Mail, Phone, UserCheck } from 'lucide-react';
import type { Citizen } from '../../types';

interface CitizenTableProps {
  citizens: Citizen[];
}

export const CitizenTable: React.FC<CitizenTableProps> = ({ citizens }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-darkbg-border text-slate-400 dark:text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-4">Citizen Name</th>
            <th className="py-3.5 px-4">Contact Info</th>
            <th className="py-3.5 px-4">Reports Logged</th>
            <th className="py-3.5 px-4">Account Status</th>
            <th className="py-3.5 px-4 text-right">Access level</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-darkbg-border text-xs text-slate-700 dark:text-slate-300">
          {citizens.map((citizen) => (
            <tr key={citizen.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400">
                    {citizen.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-850 dark:text-white">{citizen.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{citizen.id}</span>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-slate-550 dark:text-slate-450 text-[11px]">
                    <Mail className="h-3 w-3 text-slate-400" /> {citizen.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-550 dark:text-slate-450 text-[11px]">
                    <Phone className="h-3 w-3 text-slate-400" /> {citizen.phone}
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-4 font-bold text-brand-600 dark:text-brand-400">
                {citizen.reportsSubmitted} Issues
              </td>
              <td className="py-3.5 px-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  citizen.status === 'Active' 
                    ? 'text-success bg-green-50 dark:bg-green-950/20' 
                    : 'text-slate-400 bg-slate-100 dark:bg-darkbg-border'
                }`}>
                  {citizen.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-darkbg-border px-2 py-0.5 rounded-lg flex items-center gap-1 justify-end w-fit ml-auto">
                  <UserCheck className="h-3.5 w-3.5 text-success" /> Verified Citizen
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
