import React, { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types';
import { Bell, Info, AlertTriangle, AlertCircle, CheckCircle2, Megaphone } from 'lucide-react';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Alarms' | 'System' | 'Feedbacks'>('All');
  const [loading, setLoading] = useState(true);

  // Broadcast state
  const [broadcastText, setBroadcastText] = useState('');

  const fetchNotifs = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    // Creates a mock emergency broadcast notification
    const newBroadcast: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Emergency Broadcast Broadcast',
      message: broadcastText,
      type: 'error',
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications((prev) => [newBroadcast, ...prev]);
    setBroadcastText('');
    alert('Emergency alert broadcasted successfully to all municipal worker channels.');
  };

  const getFilteredNotifs = () => {
    switch (activeTab) {
      case 'Alarms':
        return notifications.filter((n) => n.type === 'error' || n.type === 'warning');
      case 'System':
        return notifications.filter((n) => n.type === 'info');
      case 'Feedbacks':
        return notifications.filter((n) => n.type === 'success');
      default:
        return notifications;
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-critical shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />;
      default:
        return <Info className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none">
        <div>
          <h1 className="text-xl font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <Bell className="h-5.5 w-5.5 text-brand-500" /> Platform Notifications & Alarms
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Real-time critical failure alerts, work assignments, and citizen feedback transcripts.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 border border-slate-200 dark:border-darkbg-border hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-650 dark:text-slate-400 text-xs font-semibold rounded-xl transition-all"
        >
          Mark All As Read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Category tabs & listing */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-darkbg-border select-none text-xs font-semibold">
            {(['All', 'Alarms', 'System', 'Feedbacks'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 transition-all ${
                  activeTab === tab ? 'text-brand-500 border-b-2 border-brand-500' : 'text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-450">Retrieving system notifications...</div>
          ) : getFilteredNotifs().length === 0 ? (
            <div className="p-12 text-center border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl text-slate-400 text-xs select-none">
              No active notification logs.
            </div>
          ) : (
            <div className="space-y-3">
              {getFilteredNotifs().map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`p-4 rounded-2xl border flex gap-3 cursor-pointer transition-colors duration-150 bg-white dark:bg-darkbg-card ${
                    !notif.read
                      ? 'border-brand-500 bg-brand-50/10 dark:bg-brand-950/5'
                      : 'border-slate-200/80 dark:border-darkbg-border hover:bg-slate-50 dark:hover:bg-slate-800/10'
                  }`}
                >
                  {getIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-850 dark:text-white' : 'text-slate-600 dark:text-slate-350'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {new Date(notif.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${!notif.read ? 'text-slate-700 dark:text-slate-205 font-medium' : 'text-slate-500 dark:text-slate-450'}`}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Emergency Broadcast center */}
        <div className="bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border p-5 rounded-2xl shadow-soft space-y-4">
          <div className="border-b border-slate-100 dark:border-darkbg-border pb-3 flex items-center gap-1.5 select-none">
            <Megaphone className="h-5 w-5 text-critical animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Emergency Broadcast Center
            </h3>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Broadcast emergency alerts immediately to all logged-in engineers and municipal department heads. Warning: this triggers WebSocket push popups.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-3">
            <textarea
              rows={4}
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="e.g. Hurricane alert: sewer storm drainage lines are in critical overflow risk sector 4..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-805 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-critical hover:bg-critical-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1"
            >
              Push Emergency Alert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Notifications;
