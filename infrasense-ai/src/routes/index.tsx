import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Authentication } from '../pages/Authentication';
import { Dashboard } from '../pages/Dashboard';
import { CitizenPortal } from '../pages/CitizenPortal';
import { ReportIssue } from '../pages/ReportIssue';
import { CompletedAssets } from '../pages/CompletedAssets';
import { LiveMap } from '../pages/LiveMap';
import { AssetsScheduler } from '../pages/AssetsScheduler';
import { RepairManagement } from '../pages/RepairManagement';
import { Departments } from '../pages/Departments';
import { Notifications } from '../pages/Notifications';
import { Settings } from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={<Authentication />} />

      {/* Main protected App Layout routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="citizen" element={<CitizenPortal />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="completed-assets" element={<CompletedAssets />} />
        <Route path="map" element={<LiveMap />} />
        <Route path="assets-scheduler" element={<AssetsScheduler />} />
        <Route path="repairs" element={<RepairManagement />} />
        <Route path="departments" element={<Departments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Wildcard redirect fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
export default AppRoutes;
