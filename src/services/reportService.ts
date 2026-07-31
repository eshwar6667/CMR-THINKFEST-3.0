import { api } from '../api/client';
import type { Issue } from '../types';
import reportsMock from '../mock/reports.json';

const LOCAL_STORAGE_KEY = 'infrasense_reports';

const getMockReports = (): Issue[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reportsMock));
    return reportsMock as Issue[];
  }
  return JSON.parse(data);
};

const saveMockReports = (reports: Issue[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reports));
};

export const reportService = {
  getReports: async (filters?: {
    severity?: string;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Issue[]> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get('/api/reports', { params: filters });
      return response.data;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 400));
    let reports = getMockReports();

    if (filters) {
      if (filters.severity && filters.severity !== 'All') {
        reports = reports.filter(r => r.severity === filters.severity);
      }
      if (filters.category && filters.category !== 'All') {
        reports = reports.filter(r => r.category === filters.category);
      }
      if (filters.status && filters.status !== 'All') {
        reports = reports.filter(r => r.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        reports = reports.filter(r => 
          r.id.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.location.address.toLowerCase().includes(query) ||
          r.reportedBy.toLowerCase().includes(query)
        );
      }
    }
    return reports;
  },

  getReportById: async (id: string): Promise<Issue | undefined> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.get(`/api/reports/${id}`);
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getMockReports().find(r => r.id === id);
  },

  createReport: async (report: Omit<Issue, 'id' | 'reportedAt' | 'status'>): Promise<Issue> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.post('/api/reports', report);
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    const reports = getMockReports();
    const newReport: Issue = {
      ...report,
      id: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedAt: new Date().toISOString(),
      status: 'New'
    };
    reports.unshift(newReport);
    saveMockReports(reports);
    return newReport;
  },

  updateIssue: async (id: string, updates: Partial<Issue>): Promise<Issue> => {
    if (import.meta.env.VITE_API_URL) {
      const response = await api.put(`/api/reports/${id}`, updates);
      return response.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    const reports = getMockReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Issue not found');
    const updated = { ...reports[index], ...updates };
    reports[index] = updated;
    saveMockReports(reports);
    return updated;
  },

  deleteIssue: async (id: string): Promise<boolean> => {
    if (import.meta.env.VITE_API_URL) {
      await api.delete(`/api/reports/${id}`);
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    const reports = getMockReports();
    const filtered = reports.filter(r => r.id !== id);
    saveMockReports(filtered);
    return true;
  }
};
