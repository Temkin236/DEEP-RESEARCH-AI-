import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TechResearchExplorer } from './pages/TechResearchExplorer';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { NewResearchPage } from './pages/NewResearchPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ReportPage } from './pages/ReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { ChatPage } from './pages/ChatPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Primary TechResearch Explorer Interface */}
      <Route path="/" element={<TechResearchExplorer />} />
      <Route path="/explorer" element={<TechResearchExplorer />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Main Research Workspace Layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/research/new" element={<NewResearchPage />} />
        <Route path="/workspace/:id" element={<WorkspacePage />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/reports/:id" element={<ReportPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
