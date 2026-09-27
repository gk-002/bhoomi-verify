import React from 'react';
import { 
  GitFork, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ArrowDown, 
  Calendar, 
  FileCheck, 
  UserX,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { LineageNode, LineageAnomaly } from '../../types';

export const LineageGraph: React.FC = () => {
  const { currentCase } = useCase();
  const { nodes, edges, anomalies } = currentCase.lineage_graph;

  // Group nodes by generation
  const generations = [1, 2, 3];

  const getNodeBadge = (node: LineageNode) => {
    switch (node.status) {
      case 'VALID':
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Title Verified
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-300 animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disputed Title
          </span>
        );
      case 'MISSING_HEIR':
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-red-800 bg-red-100/90 px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
            <UserX className="w-3 h-3 mr-1" />
            Excluded Co-Heir
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
            Pending Division
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Vansh-Vruksha (वंशवृक्ष) Genealogical Lineage & Succession DAG
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                anomalies.length > 0 
                  ? 'bg-rose-100 text-rose-800 border-rose-300' 
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {anomalies.length > 0 ? `${anomalies.length} Anomaly Alerts` : 'Continuous Succession Chain'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Traces ancestral inheritance chronology, sub-registrar partition deeds, and mutation orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Sanctioned
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Disputed/Excluded
          </span>
        </div>
      </div>

      {/* Anomalies Warning Banner if present */}
      {anomalies.length > 0 && (
        <div className="space-y-2">
          {anomalies.map((anom, idx) => (
            <div key={idx} className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-rose-900 block text-[13px]">
                  {anom.anomaly_type.replace(/_/g, ' ')} ({anom.severity} SEVERITY)
                </span>
                <p className="text-rose-800 mt-0.5">
                  {anom.description}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-rose-700 font-mono">
                  Affected Lineage Nodes: {anom.affected_nodes.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Family Tree / DAG Canvas */}
      <div className="glass-panel p-6 overflow-x-auto">
        <div className="min-w-[700px] flex flex-col items-center space-y-8 relative">
          
          {generations.map(gen => {
            const genNodes = nodes.filter(n => n.generation === gen);
            if (genNodes.length === 0) return null;

            return (
              <div key={gen} className="w-full flex flex-col items-center">
                {/* Generation Label */}
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <div className="h-[1px] w-12 bg-slate-200"></div>
                  <span>Generation {gen} {gen === 1 ? '(Root Khatedar)' : gen === 3 ? '(Current Generation)' : ''}</span>
                  <div className="h-[1px] w-12 bg-slate-200"></div>
                </div>

                {/* Nodes row */}
                <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
                  {genNodes.map(node => {
                    const isDisputed = node.status === 'DISPUTED' || node.status === 'MISSING_HEIR';
                    const isClaimant = node.is_current_claimant;

                    return (
                      <div
                        key={node.id}
                        className={`w-64 p-4 rounded-xl border transition-all duration-200 shadow-sm ${
                          isClaimant
                            ? 'bg-emerald-50/95 border-emerald-400 ring-2 ring-emerald-500/30 shadow-md'
                            : isDisputed
                            ? 'bg-rose-50/95 border-rose-300 ring-1 ring-rose-400/20'
                            : 'bg-white/90 border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {node.year || 'Recorded'}
                          </span>
                          {getNodeBadge(node)}
                        </div>

                        <div className="font-bold text-sm text-slate-900 leading-snug">
                          {node.label}
                        </div>

                        {node.is_current_claimant && (
                          <div className="text-[10px] uppercase font-bold text-emerald-700 mt-1">
                            ★ Current Applicant Khatedar
                          </div>
                        )}

                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex flex-col gap-0.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Transfer:</span>
                            <span className="font-medium text-slate-800">{node.transfer_type || 'Succession'}</span>
                          </div>
                          {node.mutation_id && (
                            <div className="flex justify-between font-mono text-[10px]">
                              <span className="text-slate-400">Ferfar Entry:</span>
                              <span className="font-bold text-emerald-800">{node.mutation_id}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Downward Connector Arrow to next generation */}
                {gen < 3 && (
                  <div className="my-3 flex flex-col items-center text-slate-300">
                    <div className="w-[2px] h-6 bg-slate-200"></div>
                    <ArrowDown className="w-4 h-4 text-slate-300 -mt-1" />
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* Mutation Orders Chronological Timeline */}
      <div className="glass-card p-5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          Certified Revenue Mutation Chronology (नोंदवही)
        </h4>

        <div className="space-y-3">
          {currentCase.canonical_record.mutations.map((m, idx) => (
            <div key={idx} className="p-3 bg-white/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                    {m.mutation_number}
                  </span>
                  <span className="font-bold text-slate-900">{m.type}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-mono">{m.date || 'Sanctioned'}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  <span>Beneficiary / Heir: <strong>{m.buyer_or_heir}</strong></span>
                  {m.seller_or_deceased && <span> (via {m.seller_or_deceased})</span>}
                </div>
                {m.remarks && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    Order Remarks: {m.remarks}
                  </p>
                )}
              </div>

              <span className={`self-start sm:self-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border ${
                m.status === 'SANCTIONED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                m.status === 'DISPUTED' ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse' :
                'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
