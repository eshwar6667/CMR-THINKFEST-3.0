import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Authentication } from '../pages/Authentication';
import { CitizenDashboard } from '../pages/CitizenDashboard';
import { CitizenReportForm } from '../pages/CitizenReportForm';
import { CitizenReportsTrack } from '../pages/CitizenReportsTrack';
import { OfficerDashboard } from '../pages/OfficerDashboard';
import { OfficerRequestDetail } from '../pages/OfficerRequestDetail';
import { OfficerReportsPDF } from '../pages/OfficerReportsPDF';
import { useAuth } from '../context/AuthContext';

// Helper component for role guard
const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === 'Citizen') {
    return <Navigate to="/citizen/dashboard" replace />;
  }

  if (user.role === 'Municipal Officer') {
    return <Navigate to="/officer/dashboard" replace />;
  }

  return <Navigate to="/auth" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={<Authentication />} />

      {/* Main protected App Layout routes */}
      <Route path="/" element={<AppLayout />}>
        {/* Role based root redirect */}
        <Route index element={<RoleRedirect />} />

        {/* Citizen Portal Pages */}
        <Route path="citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="citizen/report/new" element={<CitizenReportForm />} />
        <Route path="citizen/reports" element={<CitizenReportsTrack />} />
        <Route path="citizen/reports/:id" element={<CitizenReportsTrack />} />

        {/* Officer Portal Pages */}
        <Route path="officer/dashboard" element={<OfficerDashboard />} />
        <Route path="officer/requests/:id" element={<OfficerRequestDetail />} />
        <Route path="officer/reports" element={<OfficerReportsPDF />} />
      </Route>

      {/* Wildcard redirect fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
