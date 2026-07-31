import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-darkbg-border transition-all duration-150"
      >
        <img
          src={user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin'}
          alt={user.name}
          className="h-8 w-8 rounded-full border-2 border-brand-500/20 bg-slate-100"
        />
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            {user.name}
          </p>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-darkbg-border px-1.5 py-0.5 rounded">
            {user.role}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkbg-card rounded-2xl shadow-glass border border-slate-100 dark:border-darkbg-border overflow-hidden z-50 py-1 transition-all duration-200">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-darkbg-border">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {user.email}
            </p>
            {user.department && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <Shield className="h-3 w-3 text-brand-500" /> {user.department}
              </p>
            )}
          </div>



          <div className="border-t border-slate-100 dark:border-darkbg-border py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-xs text-critical hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 transition-colors font-medium"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
