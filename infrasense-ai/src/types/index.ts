// Infrastructure Model TypeScript Interfaces

export type UserRole = 'Citizen' | 'Municipality Officer' | 'Engineer' | 'Admin' | 'State Authority';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
}

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  address: string;
  district?: string;
  city?: string;
}

export interface DamageDetection {
  boundingBox: [number, number, number, number]; // [x, y, width, height] as percentage
  category: string;
  confidence: number; // 0 to 1
  severity: Severity;
  recommendedAction: string;
  estimatedCost: number;
  estimatedTime: string; // e.g. "3 days"
}

export interface Citizen {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  reportsSubmitted: number;
}

export interface Engineer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  availability: 'Available' | 'On Assignment' | 'On Leave';
  activeTasks: number;
  efficiencyRating: number; // 0 to 5
}

export interface Department {
  id: string;
  name: string;
  head: string;
  pendingRepairs: number;
  completedRepairs: number;
  averageResolutionHours: number;
  budgetAllocated: number;
  budgetUsed: number;
  efficiencyScore: number; // 0 to 100
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: 'Road' | 'Bridge' | 'Park' | 'Street Light' | 'Drainage' | 'Pipeline' | 'Traffic Signal';
  healthScore: number; // 0 to 100
  riskIndex: number; // 0 to 100
  lastInspectionDate: string;
  nextInspectionDate: string;
  lastRepairDate?: string;
  status: 'Operational' | 'Requires Maintenance' | 'Critical Repair Required' | 'Under Inspection';
  location: GPSLocation;
}

export type IssueStatus = 'New' | 'Assigned' | 'Inspection' | 'Repairing' | 'Completed' | 'Cancelled';

export interface Issue {
  id: string;
  category: 'Road Damage' | 'Bridge Damage' | 'Street Lights' | 'Water Leakage' | 'Potholes' | 'Buildings' | 'Drainage';
  description: string;
  location: GPSLocation;
  reportedAt: string;
  reportedBy: string; // Citizen name or System AI
  imageUrl?: string;
  aiDetection?: DamageDetection;
  severity: Severity;
  status: IssueStatus;
  departmentId?: string;
  assignedEngineerId?: string;
  costEstimate?: number;
  timeEstimate?: string;
}

export interface Repair {
  id: string;
  issueId: string;
  issueTitle: string;
  status: IssueStatus;
  engineerId: string;
  engineerName: string;
  startDate?: string;
  endDate?: string;
  estimatedCompletion: string;
  cost: number;
  updates: Array<{
    timestamp: string;
    status: IssueStatus;
    notes: string;
    updatedBy: string;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  issueId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface DashboardStats {
  totalReports: number;
  pendingRepairs: number;
  criticalDamage: number;
  engineersActive: number;
  completedRepairs: number;
  averageResolutionTime: string; // e.g. "34 Hours"
  aiAccuracy: number; // percentage
  infrastructureHealthScore: number; // percentage
}
