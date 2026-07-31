import { api } from '../api/client';
import heatmapMock from '../mock/heatmap.json';

export const mapService = {
  getHeatmapPoints: async () => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/map/heatmap');
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return heatmapMock;
  }
};
