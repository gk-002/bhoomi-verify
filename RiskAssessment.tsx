import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  CheckSquare, 
  Scale, 
  FileText, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';

export const RiskAssessment: React.FC = () => {
  const { currentCase, setActiveTab } = useCase();
  const { risk_score, risk_band, summary, recommendations, factors } = currentCase.risk_evaluation;

  // Circular gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (risk_score / 100) * circumference;

  const getGaugeColor = () => {
    if (risk_score <= 25) return '#059669'; // Emerald
    if (risk_score <= 50) return '#d97706'; // Amber
    if (risk_score <= 75) return '#e11d48'; // Rose
    return '#991b1b'; // Red / Crimson
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Composite Score + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Circular Gauge Card */}
        <div className="lg:col-span-4 glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Arc */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke={getGaugeColor()}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
                {risk_score}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              risk_band === 'LOW' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              risk_band === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-300' :
              risk_band === 'HIGH' ? 'bg-rose-100 text-rose-800 border-rose-300' :
              'bg-red-100 text-red-900 border-red-400 animate-pulse'
            }`}>
              {risk_band} RISK BAND
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Transparent multi-factor Bayesian calculation with zero blackbox decisions.
            </p>
          </div>
        </div>

        {/* Executive Decision Summary & Recommendations */}
        <div className="lg:col-span-8 glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Verification Synthesis & Legal Audit Notes</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Evaluated: {new Date(currentCase.risk_evaluation.evaluated_at).toLocaleTimeString()}
              </span>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-200">
              {summary}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              Statutory Recommendations:
            </h4>
            <div className="space-y-1.5">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5-Factor Detailed Evidence Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Detailed Factor-by-Factor Evidence Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((fact, idx) => {
            const isPass = fact.status === 'PASS';
            const isWarning = fact.status === 'WARNING';
            const isFail = fact.status === 'FAIL';

            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isPass ? 'bg-white/80 border-slate-200 hover:border-emerald-300' :
                  isWarning ? 'bg-amber-50/70 border-amber-300' :
                  'bg-rose-50/70 border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {isFail && <XCircle className="w-4 h-4 text-rose-600" />}
                      <span>{fact.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      Weight: {Math.round(fact.weight * 100)}% • Factor Score: {fact.score}/100
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                    isPass ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    isWarning ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {fact.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-2.5 leading-snug">
                  {fact.description}
                </p>

                {/* Evidence bullets */}
                <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Grounded Evidence:
                  </span>
                  {fact.evidence.map((ev, i) => (
                    <div key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
