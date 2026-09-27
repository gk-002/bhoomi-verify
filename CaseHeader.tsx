import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Download, 
  ShieldCheck, 
  Building, 
  UserCheck, 
  ExternalLink,
  ShieldAlert,
  Eye,
  Flag
} from 'lucide-react';
import { useCase } from '../context/CaseContext';

export const CaseHeader: React.FC = () => {
  const { currentCase, setActiveTab, quickOfficerAction, isProcessing } = useCase();

  const getStatusBadge = () => {
    switch (currentCase.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Certified & Approved
          </span>
        );
      case 'FLAGGED_FOR_OFFICER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Flagged for Field Inquiry
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected / Legal Freeze
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            Verification In Progress
          </span>
        );
    }
  };

  const getRiskBadge = () => {
    const score = currentCase.risk_score;
    if (score <= 25) {
      return (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
            {score}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Composite Risk</div>
            <div className="text-xs font-semibold text-emerald-700">Low Risk (Pass)</div>
          </div>
        </div>
      );
    }
    if (score <= 50) {
      return (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
            {score}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Composite Risk</div>
            <div className="text-xs font-semibold text-amber-700">Moderate Risk</div>
          </div>
        </div>
      );
    }
    if (score <= 75) {
      return (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
            {score}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Composite Risk</div>
            <div className="text-xs font-semibold text-rose-700">High Risk (Audit Req)</div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-300 px-3 py-1.5 rounded-xl shadow-sm animate-pulse">
        <div className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-xs">
          {score}
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-red-900 tracking-wider">Composite Risk</div>
          <div className="text-xs font-semibold text-red-800">Critical Risk (Freeze)</div>
        </div>
      </div>
    );
  };

  const handleDownloadPdf = () => {
    // Direct link to backend PDF report generator if available, else simulate download
    const url = `/api/v1/cases/${currentCase.case_number}/report`;
    window.open(url, '_blank');
  };

  return (
    <div className="glass-panel p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Case Identifiers & Location Breadcrumb */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              {currentCase.case_number}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {currentCase.village}, Taluka {currentCase.taluka}, Dist. {currentCase.district}, {currentCase.state_name}
            </span>
            <span>•</span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200/80 font-mono text-[11px]">
              ULPIN: {currentCase.canonical_record.ulpin || 'PENDING'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100/90 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300 font-bold text-[10px]">
              🌱 Rural Village Jurisdiction (ग्रामीण महसूल क्षेत्र)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Gat / Survey No. <span className="text-emerald-700 font-mono">{currentCase.survey_number}</span>
            </h1>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Khatedar:</span>
              <span className="text-sm font-bold text-slate-900 bg-white/80 px-2.5 py-0.5 rounded-lg border border-slate-200/80 shadow-xs">
                {currentCase.claimant_name}
              </span>
            </div>
            {getStatusBadge()}
          </div>

          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
            <span><strong>Document:</strong> {currentCase.document_type}</span>
            <span><strong>Cultivable Area:</strong> {currentCase.canonical_record.area_value} {currentCase.canonical_record.area_unit} ({currentCase.canonical_record.area_in_sqm.toLocaleString()} sq.m)</span>
            <span><strong>Tenure:</strong> {currentCase.canonical_record.tenure_type}</span>
            <span><strong>Usage:</strong> {currentCase.canonical_record.land_usage}</span>
          </div>
        </div>

        {/* Right: Risk Badge & Quick Actions */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <button 
            onClick={() => setActiveTab('risk')} 
            className="text-left hover:scale-[1.02] transition-transform"
          >
            {getRiskBadge()}
          </button>

          {/* Officer Action Toggle Group */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-2 flex items-center gap-1 border-r border-slate-200/80 mr-1 hidden sm:flex">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              Officer:
            </span>

            {/* Inspect Toggle */}
            <button
              type="button"
              onClick={() => quickOfficerAction('INSPECT')}
              disabled={isProcessing}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCase.status === 'FLAGGED_FOR_OFFICER'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50'
              }`}
              title="Order Talathi / Mojani physical boundary site inspection"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>

            {/* Flag Toggle */}
            <button
              type="button"
              onClick={() => quickOfficerAction('FLAG')}
              disabled={isProcessing}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCase.status === 'FLAGGED_FOR_OFFICER' && currentCase.risk_score > 30
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-800 hover:bg-rose-50'
              }`}
              title="Flag active boundary collision or dispute"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Flag</span>
            </button>

            {/* Clear Toggle */}
            <button
              type="button"
              onClick={() => quickOfficerAction('CLEAR')}
              disabled={isProcessing}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentCase.status === 'APPROVED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
              title="Clear all discrepancies and digitally certify title"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('triage')}
              className="ml-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white transition-all"
              title="Open full statutory adjudication console"
            >
              More...
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-700 rounded-xl border border-slate-200/80 shadow-sm text-xs font-semibold transition-all hover:shadow hover:border-emerald-300"
              title="Download Certified Land Record & Audit Trail PDF"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Audit PDF</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
