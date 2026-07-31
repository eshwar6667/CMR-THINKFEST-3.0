import type { User, Report, Assignment, ProgressUpdate, Notification, Engineer, ReportStatus, Category, Severity, UserRole, GPSLocation } from '../types';

// Storage keys
const REPORTS_KEY = 'infrasense_reports_v2';
const ASSIGNMENTS_KEY = 'infrasense_assignments_v2';
const UPDATES_KEY = 'infrasense_updates_v2';
const NOTIFICATIONS_KEY = 'infrasense_notifications_v2';
const USERS_KEY = 'infrasense_users_v2';

// Seed mock database
const defaultEngineers: Engineer[] = [
  { id: 'ENG-1', name: 'Sarah Connor', specialty: 'Roads & Asphalt', currentWorkload: 2 },
  { id: 'ENG-2', name: 'David Lee', specialty: 'Monument Restoration', currentWorkload: 1 },
  { id: 'ENG-3', name: 'Dr. Aris Thorne', specialty: 'Water Infrastructure', currentWorkload: 3 },
  { id: 'ENG-4', name: 'Michael Chang', specialty: 'Bridges & Overpasses', currentWorkload: 0 },
];

const defaultUsers: User[] = [
  { id: 'usr-1', name: 'John Citizen', email: 'citizen@example.com', role: 'Citizen', phone: '555-0199', ward: 'Ward 4' },
  { id: 'usr-2', name: 'Officer Smith', email: 'officer@example.com', role: 'Municipal Officer', phone: '555-0244' }
];

const defaultReports: Report[] = [
  {
    id: 'REP-101',
    trackingId: 'TRK-938210',
    citizenId: 'usr-1',
    category: 'Road',
    severity: 'High',
    description: 'Huge pothole in the middle of Main Street junction, causing cars to swerve dangerously.',
    images: ['https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'],
    location: { lat: 17.5064, lng: 78.3837, address: 'Gachibowli Main Rd, Ward 4' },
    status: 'In Progress',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'REP-102',
    trackingId: 'TRK-219483',
    citizenId: 'usr-1',
    category: 'Monument/Heritage Site',
    severity: 'Medium',
    description: 'Chipped marble and structural cracks forming on the base of the City Hall fountain monument.',
    images: ['https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=600&q=80'],
    location: { lat: 17.4320, lng: 78.4110, address: 'Anna Nagar Circle, Ward 2' },
    status: 'Completed',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'REP-103',
    trackingId: 'TRK-492019',
    citizenId: 'usr-1',
    category: 'Streetlight',
    severity: 'Low',
    description: 'Three consecutive streetlights are out near Elm Street alley, making it dark and unsafe at night.',
    images: [],
    location: { lat: 17.4680, lng: 78.3120, address: 'Secunderabad Colony, Ward 5' },
    status: 'Submitted',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

const defaultAssignments: Assignment[] = [
  {
    reportId: 'REP-101',
    engineerId: 'ENG-1',
    assignedBy: 'Officer Smith',
    assignedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Prioritize patching before the weekend rush hour traffic.'
  }
];

const defaultUpdates: ProgressUpdate[] = [
  {
    id: 'upd-1',
    reportId: 'REP-101',
    authorId: 'Officer Smith',
    status: 'Assigned',
    percentComplete: 20,
    notes: 'Lead engineer Sarah Connor has been dispatched to run ground diagnostics.',
    images: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'upd-2',
    reportId: 'REP-101',
    authorId: 'Officer Smith',
    status: 'In Progress',
    percentComplete: 60,
    notes: 'Asphalt milling complete. Sub-base reinforced. Top layer paving set for tomorrow morning.',
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'upd-3',
    reportId: 'REP-102',
    authorId: 'Officer Smith',
    status: 'Completed',
    percentComplete: 100,
    notes: 'Base crack sealed with weather-resistant polymer epoxy. Sculptures cleaned and repolished.',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const defaultNotifications: Notification[] = [
  {
    id: 'ntf-1',
    userId: 'usr-1',
    reportId: 'REP-101',
    message: 'Your report #TRK-938210 status has been updated to In Progress (60% complete)',
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ntf-2',
    userId: 'usr-1',
    reportId: 'REP-102',
    message: 'Congratulations! Your report #TRK-219483 has been successfully Resolved and Completed.',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// LocalStorage helpers
const getItem = <T>(key: string, seed: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(item);
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Global Central helper to trigger citizen updates
export const notifyCitizen = (reportId: string, citizenId: string, message: string) => {
  const notifications = getItem<Notification[]>(NOTIFICATIONS_KEY, defaultNotifications);
  const newNotification: Notification = {
    id: 'ntf-' + Math.random().toString(36).substr(2, 9),
    userId: citizenId,
    reportId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  setItem(NOTIFICATIONS_KEY, [newNotification, ...notifications]);
};

// -------------------------------------------------------------
// Unified API Service Layer
// -------------------------------------------------------------
export const authApi = {
  login: async (email: string, role: UserRole): Promise<User> => {
    // In future this will be: return axios.post('/api/auth/login', { email, role })
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getItem<User[]>(USERS_KEY, defaultUsers);
    
    // Check if user exists
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (!user) {
      // Auto-provision standard account if it's citizen, otherwise officer needs standard seed
      if (role === 'Citizen') {
        user = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role: 'Citizen',
          phone: '555-0100',
          ward: 'Ward 1'
        };
        setItem(USERS_KEY, [...users, user]);
      } else {
        // Officer accounts are pre-provisioned
        const officerDefault = users.find(u => u.role === 'Municipal Officer');
        if (officerDefault) {
          user = officerDefault;
        } else {
          throw new Error('Pre-provisioned officer account not found.');
        }
      }
    }
    return user;
  },

  signup: async (name: string, email: string, phone: string, ward: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getItem<User[]>(USERS_KEY, defaultUsers);
    
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === 'Citizen');
    if (existing) {
      throw new Error('Email already registered as citizen.');
    }

    const newUser: User = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'Citizen',
      phone,
      ward
    };
    setItem(USERS_KEY, [...users, newUser]);
    return newUser;
  }
};

export const reportsApi = {
  getReports: async (filters?: {
    citizenId?: string;
    status?: string;
    category?: string;
    severity?: string;
    search?: string;
  }): Promise<Report[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let reports = getItem<Report[]>(REPORTS_KEY, defaultReports);

    if (filters) {
      if (filters.citizenId) {
        reports = reports.filter(r => r.citizenId === filters.citizenId);
      }
      if (filters.status && filters.status !== 'All') {
        reports = reports.filter(r => r.status === filters.status);
      }
      if (filters.category && filters.category !== 'All') {
        reports = reports.filter(r => r.category === filters.category);
      }
      if (filters.severity && filters.severity !== 'All') {
        reports = reports.filter(r => r.severity === filters.severity);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        reports = reports.filter(r => 
          r.trackingId.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.address.toLowerCase().includes(q)
        );
      }
    }
    // Sort by newest
    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getReportById: async (id: string): Promise<Report | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const reports = getItem<Report[]>(REPORTS_KEY, defaultReports);
    return reports.find(r => r.id === id || r.trackingId === id);
  },

  createReport: async (reportData: {
    citizenId: string;
    category: Category;
    severity: Severity;
    description: string;
    images: string[];
    location: GPSLocation;
  }): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reports = getItem<Report[]>(REPORTS_KEY, defaultReports);

    const trackingNum = Math.floor(100000 + Math.random() * 900000);
    const newReport: Report = {
      id: 'REP-' + trackingNum,
      trackingId: 'TRK-' + trackingNum,
      citizenId: reportData.citizenId,
      category: reportData.category,
      severity: reportData.severity,
      description: reportData.description,
      images: reportData.images,
      location: reportData.location,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setItem(REPORTS_KEY, [newReport, ...reports]);
    notifyCitizen(newReport.id, reportData.citizenId, `Your report #${newReport.trackingId} has been successfully filed.`);
    return newReport;
  },

  assignReport: async (reportId: string, engineerId: string, notes: string, targetDate: string, officerName: string): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const reports = getItem<Report[]>(REPORTS_KEY, defaultReports);
    const assignments = getItem<Assignment[]>(ASSIGNMENTS_KEY, defaultAssignments);

    const index = reports.findIndex(r => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    // Create or update assignment
    const newAssignment: Assignment = {
      reportId,
      engineerId,
      assignedBy: officerName,
      assignedAt: new Date().toISOString(),
      targetDate,
      notes
    };
    setItem(ASSIGNMENTS_KEY, [newAssignment, ...assignments.filter(a => a.reportId !== reportId)]);

    // Update Report
    reports[index].status = 'Assigned';
    reports[index].updatedAt = new Date().toISOString();
    setItem(REPORTS_KEY, reports);

    // Create Initial Progress Update
    const updates = getItem<ProgressUpdate[]>(UPDATES_KEY, defaultUpdates);
    const newUpdate: ProgressUpdate = {
      id: 'upd-' + Math.random().toString(36).substr(2, 9),
      reportId,
      authorId: officerName,
      status: 'Assigned',
      percentComplete: 10,
      notes: `Lead engineer assigned: ${defaultEngineers.find(e => e.id === engineerId)?.name || 'Lead Specialist'}. target Completion: ${targetDate}. Notes: ${notes}`,
      images: [],
      createdAt: new Date().toISOString()
    };
    setItem(UPDATES_KEY, [newUpdate, ...updates]);

    notifyCitizen(reportId, reports[index].citizenId, `Your report #${reports[index].trackingId} has been assigned to an engineer.`);
    return reports[index];
  },

  updateReportProgress: async (reportId: string, status: ReportStatus, percentComplete: number, notes: string, images: string[], officerName: string): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const reports = getItem<Report[]>(REPORTS_KEY, defaultReports);
    const updates = getItem<ProgressUpdate[]>(UPDATES_KEY, defaultUpdates);

    const index = reports.findIndex(r => r.id === reportId);
    if (index === -1) throw new Error('Report not found');

    // Append progress log
    const newUpdate: ProgressUpdate = {
      id: 'upd-' + Math.random().toString(36).substr(2, 9),
      reportId,
      authorId: officerName,
      status,
      percentComplete,
      notes,
      images,
      createdAt: new Date().toISOString()
    };
    setItem(UPDATES_KEY, [newUpdate, ...updates]);

    // Update Report
    reports[index].status = status;
    reports[index].updatedAt = new Date().toISOString();
    setItem(REPORTS_KEY, reports);

    // Trigger Notification
    notifyCitizen(reportId, reports[index].citizenId, `Your report #${reports[index].trackingId} status has been updated to ${status} (${percentComplete}% complete).`);
    return reports[index];
  },

  getAssignments: async (reportId: string): Promise<Assignment | undefined> => {
    const assignments = getItem<Assignment[]>(ASSIGNMENTS_KEY, defaultAssignments);
    return assignments.find(a => a.reportId === reportId);
  },

  getProgressUpdates: async (reportId: string): Promise<ProgressUpdate[]> => {
    const updates = getItem<ProgressUpdate[]>(UPDATES_KEY, defaultUpdates);
    return updates
      .filter(u => u.reportId === reportId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
};

export const engineersApi = {
  getEngineers: async (): Promise<Engineer[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return defaultEngineers;
  }
};

export const notificationsApi = {
  getNotifications: async (userId: string): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const notifications = getItem<Notification[]>(NOTIFICATIONS_KEY, defaultNotifications);
    return notifications.filter(n => n.userId === userId);
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    const notifications = getItem<Notification[]>(NOTIFICATIONS_KEY, defaultNotifications);
    const updated = notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
    setItem(NOTIFICATIONS_KEY, updated);
  }
};
