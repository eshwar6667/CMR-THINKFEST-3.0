import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  CalendarDays,
  Settings,
  Bell,
  LogOut,
  X,
  Compass,
  Hammer,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
    onClose();
  };

  const navItems = [
    { to: '/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { to: '/citizen', label: 'Citizen Portal', icon: Compass },
    { to: '/report', label: 'Report Issue', icon: FileText },
    { to: '/completed-assets', label: 'Completed Assets', icon: CheckCircle2 },
    { to: '/map', label: 'Live City Map', icon: MapPin },
    { to: '/assets-scheduler', label: 'Assets & Scheduler', icon: CalendarDays },
    { to: '/repairs', label: 'Repair Management', icon: Hammer },
    { to: '/departments', label: 'Departments Performance', icon: Building2 },
    { to: '/notifications', label: 'Platform Alerts', icon: Bell },
    { to: '/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-darkbg-card border-r border-slate-200/80 dark:border-darkbg-border transition-all duration-300 md:sticky md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-darkbg-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-tealbrand-500 shadow-md">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-100 uppercase">
                InfraSense AI
              </h1>
              <span className="text-[9px] text-slate-400 font-medium">Smart City Sentinel</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-darkbg-border md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-50 dark:bg-darkbg-border/30 border border-slate-100 dark:border-darkbg-border flex items-center gap-3">
            <img
              src={user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin'}
              alt={user.name}
              className="h-10 w-10 rounded-full border border-brand-500/20 bg-slate-100"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-250 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-950/20 border-l-2 border-brand-500 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-darkbg-border/40'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-150 dark:border-darkbg-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-critical hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Sign Out Session
          </button>
        </div>
      </aside>
    </>
  );
};
