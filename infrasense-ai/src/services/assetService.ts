import { api } from '../api/client';
import type { InfrastructureAsset } from '../types';
import assetsMock from '../mock/assets.json';

const ASSETS_KEY = 'infrasense_assets';

const getMockAssets = (): InfrastructureAsset[] => {
  const data = localStorage.getItem(ASSETS_KEY);
  if (!data) {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assetsMock));
    return assetsMock as InfrastructureAsset[];
  }
  return JSON.parse(data);
};

const saveAssets = (assets: InfrastructureAsset[]) => {
  localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
};

export const assetService = {
  getAssets: async (): Promise<InfrastructureAsset[]> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/assets');
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockAssets();
  },

  getAssetById: async (id: string): Promise<InfrastructureAsset | undefined> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get(`/api/assets/${id}`);
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getMockAssets().find(a => a.id === id);
  },

  performInspection: async (id: string, healthScore: number, status: InfrastructureAsset['status']): Promise<InfrastructureAsset> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post(`/api/assets/${id}/inspect`, { healthScore, status });
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    const assets = getMockAssets();
    const idx = assets.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Asset not found');

    const updated: InfrastructureAsset = {
      ...assets[idx],
      healthScore,
      status,
      lastInspectionDate: new Date().toISOString().split('T')[0],
      nextInspectionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 90 days out
    };

    assets[idx] = updated;
    saveAssets(assets);
    return updated;
  }
};
