import React from 'react';
import { 
  FileText, 
  Map, 
  GitFork, 
  ShieldAlert, 
  Edit3, 
  UserCheck, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useCase } from '../context/CaseContext';

interface TabItem {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'neutral';
}

export const CaseSubnav: React.FC = () => {
  const { currentCase, activeTab, setActiveTab } = useCase();

  const tabs: TabItem[] = [
    {
      id: 'ocr',
      label: 'OCR Digitization',
      subtitle: 'Multilingual Ingestion',
      icon: FileText,
      badge: `${currentCase.extracted_fields.length} Fields`,
      badgeType: 'neutral'
    },
    {
      id: 'gis',
      label: 'Cadastral GIS',
      subtitle: 'Spatial Discrepancy',
      icon: Map,
      badge: currentCase.gis_data.overlap.has_overlap 
        ? 'Overlap Alert' 
        : currentCase.gis_data.discrepancy.exceeds_tolerance 
        ? 'Area Exceeded' 
        : 'Synced',
      badgeType: currentCase.gis_data.overlap.has_overlap || currentCase.gis_data.discrepancy.exceeds_tolerance 
        ? 'danger' 
        : 'success'
    },
    {
      id: 'lineage',
      label: 'Vansh-Vruksha',
      subtitle: 'Genealogical DAG',
      icon: GitFork,
      badge: currentCase.lineage_graph.anomalies.length > 0 
        ? `${currentCase.lineage_graph.anomalies.length} Disputes` 
        : 'Intact',
      badgeType: currentCase.lineage_graph.anomalies.length > 0 ? 'warning' : 'success'
    },
    {
      id: 'risk',
      label: 'Risk Assessment',
      subtitle: '5-Factor Engine',
      icon: ShieldAlert,
      badge: `${currentCase.risk_score}/100`,
      badgeType: currentCase.risk_band === 'LOW' 
        ? 'success' 
        : currentCase.risk_band === 'MEDIUM' 
        ? 'warning' 
        : 'danger'
    },
    {
      id: 'review',
      label: 'Field Review',
      subtitle: 'Human-in-the-Loop',
      icon: Edit3,
      badge: `${currentCase.corrections.length} Edits`,
      badgeType: 'neutral'
    },
    {
      id: 'triage',
      label: 'Officer Decision',
      subtitle: 'Tehsildar Workspace',
      icon: UserCheck,
      badge: currentCase.status,
      badgeType: currentCase.status === 'APPROVED' ? 'success' : currentCase.status === 'REJECTED' ? 'danger' : 'warning'
    },
    {
      id: 'audit',
      label: 'Cryptographic Ledger',
      subtitle: 'SHA-256 Audit Trail',
      icon: Lock,
      badge: `${currentCase.ledger_blocks.length} Blocks`,
      badgeType: 'success'
    }
  ];

  return (
    <div className="mb-6 overflow-x-auto pb-2 scrollbar-thin">
      <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm min-w-max">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
          if (tab.badgeType === 'success') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          if (tab.badgeType === 'warning') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
          if (tab.badgeType === 'danger') badgeColor = 'bg-rose-100 text-rose-800 border-rose-300';

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all relative ${
                isActive
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-900/5 border border-slate-200/90 ring-1 ring-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-100/80 text-slate-600 group-hover:text-slate-900'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold leading-none">{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                  {tab.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
