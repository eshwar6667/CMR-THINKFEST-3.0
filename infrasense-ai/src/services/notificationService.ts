import { api } from '../api/client';
import type { Notification } from '../types';
import notificationsMock from '../mock/notifications.json';

const NOTIFICATIONS_KEY = 'infrasense_notifications';

const getMockNotifications = (): Notification[] => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!data) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notificationsMock));
    return notificationsMock as Notification[];
  }
  return JSON.parse(data);
};

const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/notifications');
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getMockNotifications();
  },

  markAsRead: async (id: string): Promise<Notification> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post(`/api/notifications/${id}/read`);
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    const notifs = getMockNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Notification not found');

    notifs[idx].read = true;
    saveNotifications(notifs);
    return notifs[idx];
  },

  markAllAsRead: async (): Promise<boolean> => {
    if (import.meta.env.VITE_API_URL) {
      await api.post('/api/notifications/read-all');
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    const notifs = getMockNotifications().map(n => ({ ...n, read: true }));
    saveNotifications(notifs);
    return true;
  }
};
