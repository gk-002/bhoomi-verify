import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Layers, 
  ShieldAlert, 
  Filter, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useCase } from '../context/CaseContext';
import { MOCK_DASHBOARD_STATS, MOCK_CASES } from '../data/mockScenarios';

interface ExecutiveDashboardProps {
  onSelectCase: (caseId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onSelectCase }) => {
  const { setScenario } = useCase();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const stats = MOCK_DASHBOARD_STATS;

  const filteredCases = MOCK_CASES.filter(c => {
    if (selectedStatusFilter === 'ALL') return true;
    if (selectedStatusFilter === 'FLAGGED') return c.status === 'FLAGGED_FOR_OFFICER';
    if (selectedStatusFilter === 'APPROVED') return c.status === 'APPROVED';
    if (selectedStatusFilter === 'REJECTED') return c.status === 'REJECTED';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              National Land Record Digitization Command Center
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            DILRMP Executive Revenue Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ministry of Rural Development • Cross-State Multi-Factor Land Title & Cadastral Verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white/90 border border-slate-200/80 px-3 py-2 rounded-xl text-right shadow-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Engine Node</span>
            <span className="text-xs font-mono font-bold text-slate-800">DILRMP-GATEWAY-01</span>
          </div>
        </div>
      </div>

      {/* 4 High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Records Ingested */}
        <div className="glass-card p-5 border-slate-200/80 hover:border-emerald-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Parcels Digitized</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {stats.total_digitized.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% this month across 28 states</span>
          </div>
        </div>

        {/* KPI 2: Auto-Reconciliation Rate */}
        <div className="glass-card p-5 border-slate-200/80 hover:border-emerald-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Auto-Reconciled</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {stats.auto_reconciled_pct}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.auto_reconciled_count.toLocaleString()} clean titles automated
          </div>
        </div>

        {/* KPI 3: Flagged for Officer Investigation */}
        <div className="glass-card p-5 border-slate-200/80 hover:border-amber-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Officer Triage Queue</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800 font-mono">
            {stats.flagged_for_officer.toLocaleString()}
          </div>
          <div className="text-xs text-amber-700 mt-1 font-medium">
            Requires field inquiry or Mojani review
          </div>
        </div>

        {/* KPI 4: Average Verification Speed */}
        <div className="glass-card p-5 border-slate-200/80 hover:border-indigo-300">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Processing</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {stats.avg_processing_time_sec}s
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Full OCR, GIS & Bayesian Risk evaluation
          </div>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* State-wise Ingestion Volume Bar Chart */}
        <div className="lg:col-span-7 glass-panel p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                State-wise Ingestion & Verification Volume
              </h3>
              <p className="text-xs text-slate-500">
                Verified Records vs. Flagged for Tehsildar Inquiries
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              DILRMP Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.state_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="state_name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 8px 32px 0 rgba(15, 23, 42, 0.1)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="verified" name="Verified Clear (RoR Issued)" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flagged" name="Flagged for Inquiry" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="lg:col-span-5 glass-panel p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                National Risk Band Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Multi-Factor composite risk categorization
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.75rem',
                    boxShadow: '0 8px 32px 0 rgba(15, 23, 42, 0.1)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Live Priority Triage Queue Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Officer Triage Queue & Case Registry
            </h3>
            <p className="text-xs text-slate-500">
              Select any case to open the full 7-workspace dossier
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedStatusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              All Cases
            </button>
            <button
              onClick={() => setSelectedStatusFilter('FLAGGED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedStatusFilter === 'FLAGGED' ? 'bg-white text-amber-800 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Flagged
            </button>
            <button
              onClick={() => setSelectedStatusFilter('APPROVED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedStatusFilter === 'APPROVED' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setSelectedStatusFilter('REJECTED')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedStatusFilter === 'REJECTED' ? 'bg-white text-rose-800 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">Case / Parcel</th>
                <th className="px-5 py-3">Jurisdiction</th>
                <th className="px-5 py-3">Khatedar / Claimant</th>
                <th className="px-5 py-3">Area</th>
                <th className="px-5 py-3">Risk Assessment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => {
                const isScenarioA = c.case_number === 'BV-2026-MH-4201';
                const isScenarioB = c.case_number === 'BV-2026-MH-1080';
                const scenarioLetter = isScenarioA ? 'A' : isScenarioB ? 'B' : 'C';

                return (
                  <tr 
                    key={c.id} 
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => {
                      setScenario(scenarioLetter as any);
                      onSelectCase(c.id);
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-slate-900 block">
                        {c.case_number}
                      </span>
                      <span className="text-[11px] text-emerald-800 font-semibold font-mono">
                        Gat {c.survey_number}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <div className="flex items-center gap-1 font-medium text-slate-900">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{c.village}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {c.taluka}, {c.district} ({c.state_code})
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {c.claimant_name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {c.canonical_record.area_value} Ha
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-[10px] ${
                          c.risk_score <= 25 ? 'bg-emerald-600' :
                          c.risk_score <= 50 ? 'bg-amber-600' :
                          c.risk_score <= 75 ? 'bg-rose-600' : 'bg-red-700'
                        }`}>
                          {c.risk_score}
                        </span>
                        <span className="font-semibold text-[11px] text-slate-700">
                          {c.risk_band}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        c.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        c.status === 'FLAGGED_FOR_OFFICER' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                        c.status === 'REJECTED' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                        'bg-slate-50 text-slate-700 border-slate-300'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setScenario(scenarioLetter as any);
                          onSelectCase(c.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-all"
                      >
                        <span>Open Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
