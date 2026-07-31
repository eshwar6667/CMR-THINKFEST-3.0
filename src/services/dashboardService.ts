import { api } from '../api/client';
import dashboardMock from '../mock/dashboard.json';

export const dashboardService = {
  getDashboard: async () => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/dashboard');
      return response.data;
    }
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return dashboardMock;
  }
};
