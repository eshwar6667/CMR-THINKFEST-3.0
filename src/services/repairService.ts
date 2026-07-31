import { api } from '../api/client';
import type { Repair, Engineer } from '../types';
import repairsMock from '../mock/repairs.json';
import engineersMock from '../mock/engineers.json';

const REPAIRS_KEY = 'infrasense_repairs';
const ENGINEERS_KEY = 'infrasense_engineers';

const getMockRepairs = (): Repair[] => {
  const data = localStorage.getItem(REPAIRS_KEY);
  if (!data) {
    localStorage.setItem(REPAIRS_KEY, JSON.stringify(repairsMock));
    return repairsMock as Repair[];
  }
  return JSON.parse(data);
};

const getMockEngineers = (): Engineer[] => {
  const data = localStorage.getItem(ENGINEERS_KEY);
  if (!data) {
    localStorage.setItem(ENGINEERS_KEY, JSON.stringify(engineersMock));
    return engineersMock as Engineer[];
  }
  return JSON.parse(data);
};

const saveRepairs = (repairs: Repair[]) => {
  localStorage.setItem(REPAIRS_KEY, JSON.stringify(repairs));
};

export const repairService = {
  getRepairs: async (): Promise<Repair[]> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/repairs');
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockRepairs();
  },

  getEngineers: async (): Promise<Engineer[]> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/engineers');
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getMockEngineers();
  },

  updateRepair: async (id: string, updates: Partial<Repair>): Promise<Repair> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.put(`/api/repairs/${id}`, updates);
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 350));
    const repairs = getMockRepairs();
    const idx = repairs.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Repair work order not found');

    const updated: Repair = {
      ...repairs[idx],
      ...updates,
      updates: [
        ...(repairs[idx].updates || []),
        {
          timestamp: new Date().toISOString(),
          status: updates.status || repairs[idx].status,
          notes: `Status updated to ${updates.status || repairs[idx].status}`,
          updatedBy: 'System Platform'
        }
      ]
    };

    repairs[idx] = updated;
    saveRepairs(repairs);
    return updated;
  },

  assignEngineer: async (repairId: string, engineerId: string): Promise<Repair> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post(`/api/repairs/${repairId}/assign`, { engineerId });
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    const repairs = getMockRepairs();
    const engineers = getMockEngineers();
    const repairIdx = repairs.findIndex(r => r.id === repairId);
    const engineer = engineers.find(e => e.id === engineerId);

    if (repairIdx === -1) throw new Error('Repair not found');
    if (!engineer) throw new Error('Engineer not found');

    const updated: Repair = {
      ...repairs[repairIdx],
      engineerId: engineer.id,
      engineerName: engineer.name,
      status: 'Assigned',
      updates: [
        ...(repairs[repairIdx].updates || []),
        {
          timestamp: new Date().toISOString(),
          status: 'Assigned',
          notes: `Engineer ${engineer.name} assigned to work order.`,
          updatedBy: 'Municipality Officer'
        }
      ]
    };

    repairs[repairIdx] = updated;
    saveRepairs(repairs);
    return updated;
  }
};
