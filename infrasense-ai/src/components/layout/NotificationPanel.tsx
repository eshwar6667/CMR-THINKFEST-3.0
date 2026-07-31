import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types';

export const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Simulate polling every 30 seconds
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

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
      await notificationService.markAsRead(id);
      fetchNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifs();
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-critical" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-brand-500" />;
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
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-darkbg-card rounded-2xl shadow-glass border border-slate-100 dark:border-darkbg-border overflow-hidden z-50 transition-all duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-darkbg-border flex items-center justify-between">
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
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-darkbg-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No active notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors duration-150 ${
                    !notif.read ? 'bg-brand-50/50 dark:bg-brand-950/10' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-semibold truncate ${
                        !notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-350'
                      }`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      !notif.read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 text-center border-t border-slate-100 dark:border-darkbg-border">
            <button className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:underline">
              View all notification logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
