import { api } from '../api/client';
import analyticsMock from '../mock/analytics.json';

export const analyticsService = {
  getAnalytics: async () => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/analytics');
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return analyticsMock;
  }
};
