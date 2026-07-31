// TypeScript interfaces for InfraSense AI

export type UserRole = 'Citizen' | 'Municipal Officer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  ward?: string;
  avatar?: string;
  department?: string;
}

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

export type Category = 
  | 'Road' 
  | 'Bridge' 
  | 'Monument/Heritage Site' 
  | 'Park/Public Garden' 
  | 'Streetlight' 
  | 'Water Infrastructure' 
  | 'Other';

export type ReportStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Completed' 
  | 'Rejected';

export interface GPSLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Report {
  id: string;
  trackingId: string;
  citizenId: string;
  category: Category;
  severity: Severity;
  description: string;
  images: string[]; // base64 or object URLs
  location: GPSLocation;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  reportId: string;
  engineerId: string;
  assignedBy: string; // User Name
  assignedAt: string;
  targetDate: string;
  notes: string;
}

export interface ProgressUpdate {
  id: string;
  reportId: string;
  authorId: string; // User Name or ID
  status: ReportStatus;
  percentComplete: number; // 0 to 100
  notes: string;
  images: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  reportId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Engineer {
  id: string;
  name: string;
  specialty: string;
  currentWorkload: number; // count of active tasks
}
