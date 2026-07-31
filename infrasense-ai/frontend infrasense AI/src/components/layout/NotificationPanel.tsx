import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCheck, Info } from 'lucide-react';
import { notificationsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Notification } from '../../types';

export const NotificationPanel: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const data = await notificationsApi.getNotifications(user.id);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll every 10 seconds for mock real-time updates
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      fetchNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      for (const n of notifications) {
        if (!n.read) {
          await notificationsApi.markAsRead(n.id);
        }
      }
      fetchNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkbg-border transition-all duration-150"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-critical text-[10px] font-bold text-white ring-2 ring-white dark:ring-darkbg">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-darkbg-card rounded-2xl shadow-glass border border-slate-100 dark:border-darkbg-border overflow-hidden z-50 transition-all duration-200 select-none">
          <div className="p-4 border-b border-slate-100 dark:border-darkbg-border flex items-center justify-between text-xs">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 font-normal">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-brand-605 dark:text-brand-400 hover:underline flex items-center gap-1 font-bold"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-darkbg-border text-xs">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                No active notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`p-3.5 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors duration-150 ${
                    !notif.read ? 'bg-brand-50/30 dark:bg-brand-950/10 font-bold' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <Info className="h-4 w-4 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className={`leading-relaxed text-[11px] ${
                      !notif.read ? 'text-slate-800 dark:text-slate-100 font-semibold' : 'text-slate-550 dark:text-slate-400'
                    }`}>
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-slate-400 block font-normal">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationPanel;
