import React, { useState } from 'react';
import { CaseProvider, useCase } from './context/CaseContext';
import { Navbar } from './components/Navbar';
import { CaseHeader } from './components/CaseHeader';
import { CaseSubnav } from './components/CaseSubnav';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CitizenPortal } from './components/CitizenPortal';
import { LoginPage } from './components/LoginPage';

// The 7 Specialized Workspaces
import { OCRViewer } from './components/tabs/OCRViewer';
import { GISCadastralMap } from './components/tabs/GISCadastralMap';
import { LineageGraph } from './components/tabs/LineageGraph';
import { RiskAssessment } from './components/tabs/RiskAssessment';
import { FieldReview } from './components/tabs/FieldReview';
import { OfficerTriage } from './components/tabs/OfficerTriage';
import { AuditLedger } from './components/tabs/AuditLedger';

const MainLayout: React.FC = () => {
  const { activeTab, userRole, isAuthenticated } = useCase();
  const [currentView, setCurrentView] = useState<'dashboard' | 'cases' | 'citizen'>('cases');

  // If not logged in, show RBAC Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // STRICT CITIZEN VIEW: No officer features, no Case Dossier, no Executive Dashboard
  if (userRole === 'CITIZEN') {
    return (
      <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900 bg-slate-50/80">
        <Navbar
          currentView="citizen"
          onNavigateHome={() => {}}
          onNavigateDashboard={() => {}}
          onNavigateCases={() => {}}
          onNavigateCitizen={() => {}}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CitizenPortal />
        </main>

        <footer className="glass-nav border-t border-slate-200/80 mt-12 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-800">BhoomiVerify</span>
              <span>• Citizen Land Records Modernization Portal</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right text-[11px] text-slate-400">
              <a
                href="/BhoomiVerify-GitHub.zip"
                download="BhoomiVerify-GitHub.zip"
                className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
                title="Download complete clean codebase ready for GitHub"
              >
                <span>📦 Download GitHub Repo (.zip)</span>
              </a>
              <span className="hidden sm:inline">•</span>
              <span>Ministry of Rural Development • Digital India Land Records Modernization Programme (DILRMP)</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // OFFICER VIEW: Full access to all 7 workspaces, dashboard, and adjudication
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'ocr':
        return <OCRViewer />;
      case 'gis':
        return <GISCadastralMap />;
      case 'lineage':
        return <LineageGraph />;
      case 'risk':
        return <RiskAssessment />;
      case 'review':
        return <FieldReview />;
      case 'triage':
        return <OfficerTriage />;
      case 'audit':
        return <AuditLedger />;
      default:
        return <OCRViewer />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Glassmorphic Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateHome={() => setCurrentView('dashboard')}
        onNavigateDashboard={() => setCurrentView('dashboard')}
        onNavigateCases={() => setCurrentView('cases')}
        onNavigateCitizen={() => setCurrentView('citizen')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'dashboard' && (
          <ExecutiveDashboard onSelectCase={() => setCurrentView('cases')} />
        )}

        {currentView === 'citizen' && (
          <CitizenPortal />
        )}

        {currentView === 'cases' && (
          <div className="space-y-6">
            {/* Persistent Case Header with live Risk Badge */}
            <CaseHeader />

            {/* 7-Tab Navigation Subnav */}
            <CaseSubnav />

            {/* Active Workspace View */}
            <div className="transition-opacity duration-200">
              {renderActiveTabContent()}
            </div>
          </div>
        )}
      </main>

      {/* National Footer */}
      <footer className="glass-nav border-t border-slate-200/80 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-800">BhoomiVerify</span>
            <span>• SIH 2026 Problem Statement 26018</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Ministry of Rural Development • Digital India Land Records Modernization Programme (DILRMP)
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CaseProvider>
      <MainLayout />
    </CaseProvider>
  );
};

export default App;
