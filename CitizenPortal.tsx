import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  QrCode, 
  FileText, 
  MapPin, 
  User, 
  Building,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  Eye,
  UserCheck,
  BadgeCheck
} from 'lucide-react';
import { caseService } from '../api/services';
import { CitizenTrackResponse } from '../types';
import { useCase } from '../context/CaseContext';

export const CitizenPortal: React.FC = () => {
  const { currentUser } = useCase();
  const defaultQuery = currentUser?.caseNumber || 'BV-2026-MH-4201';
  const [searchQuery, setSearchQuery] = useState<string>(defaultQuery);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackResult, setTrackResult] = useState<CitizenTrackResponse | null>(null);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || searchQuery;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await caseService.trackCitizenCase(q);
      setTrackResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial search for default case
  React.useEffect(() => {
    handleSearch(undefined, defaultQuery);
  }, [defaultQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Citizen Hero Search Banner */}
      <div className="glass-panel p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Transparent Citizen Land Record Tracking Portal</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Digital Land Record (RoR / 7/12)
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Verify real-time status of your land title digitization, mutation adjudication, and download certified blockchain-backed land records.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mt-4">
          <div className="flex items-center bg-white rounded-2xl shadow-lg border border-slate-300/80 p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/30">
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Case No. (e.g. BV-2026-MH-4201) or Survey No..."
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track Record'}
            </button>
          </div>

          {/* Quick Registry Queries */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="text-slate-400 text-[11px]">Recent Registry Searches:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('BV-2026-MH-4201');
                handleSearch(undefined, 'BV-2026-MH-4201');
              }}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 rounded-lg border border-slate-200 text-[11px] font-medium transition-all"
            >
              🌾 Gat 142/2 Hiware Bazar (Ahilyanagar)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('BV-2026-MH-1080');
                handleSearch(undefined, 'BV-2026-MH-1080');
              }}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 rounded-lg border border-slate-200 text-[11px] font-medium transition-all"
            >
              🌾 Gat 215/1 Palashi (Satara)
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('BV-2026-MH-760');
                handleSearch(undefined, 'BV-2026-MH-760');
              }}
              className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-800 rounded-lg border border-slate-200 text-[11px] font-medium transition-all"
            >
              🌾 Gat 76/2 Wadner Gangai (Amravati)
            </button>
          </div>
        </form>
      </div>

      {/* Track Result Card */}
      {trackResult && (
        <div className="glass-panel p-6 space-y-6 animate-in fade-in">
          
          {/* Header info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
                Case Reference: {trackResult.case_number}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Gat / Survey {trackResult.survey_number} • {trackResult.claimant_name}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {trackResult.village}, Taluka {trackResult.district}, {trackResult.state_name}
              </p>
            </div>

            <div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                trackResult.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                trackResult.status === 'FLAGGED_FOR_OFFICER' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                trackResult.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                'bg-slate-100 text-slate-800 border-slate-300'
              }`}>
                {trackResult.status === 'APPROVED' ? '✓ Digitally Certified' :
                 trackResult.status === 'FLAGGED_FOR_OFFICER' ? '⚠ Field Inquiry in Progress' :
                 trackResult.status === 'REJECTED' ? '✕ Application Frozen' : 'Processing'}
              </span>
            </div>
          </div>

          {/* Official Officer Action Notice (Strictly Shown on Citizen Portal) */}
          {trackResult.status === 'FLAGGED_FOR_OFFICER' ? (
            <div className="p-5 bg-gradient-to-r from-rose-50/90 via-amber-50/90 to-orange-50/90 border-2 border-rose-300 rounded-2xl shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-rose-950">
                      Official Revenue Order: Record Flagged by Revenue Officer
                    </h4>
                    <p className="text-[11px] text-rose-700">
                      Action committed to tamper-evident blockchain ledger under MLR Code Section 135-D.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 self-start sm:self-center">
                  ⚠️ Action Taken: FLAGGED FOR INQUIRY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-rose-200/90">
                  <span className="text-slate-500 text-[11px] font-semibold block">Adjudicating Authority:</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Smt. Smita Deshpande</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Tahsildar & Revenue Adjudicator</span>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-rose-200/90">
                  <span className="text-slate-500 text-[11px] font-semibold block">Statutory Order Status:</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-amber-900">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>Mojani Field Inspection Ordered</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Summons dispatched to Talathi & Surveyor</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-xs space-y-1">
                <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
                  Officer Adjudication Finding:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">
                  {trackResult.case_number.includes('1080')
                    ? "Active spatial collision: 68.5 sq.m boundary overlap (17.1%) detected with adjoining Gat 215/2 along eastern farm bund. Mutation M-1042 contested pending physical site measurement."
                    : "Revenue officer inquiry initiated: Discrepancy identified in land record verification. Physical ground survey notice issued under Section 135-D."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>Citizen Helpline: For inquiry hearing dates, contact the Taluka Revenue Office.</span>
                <span className="font-semibold text-rose-800">Status: Discrepancy Active</span>
              </div>
            </div>
          ) : trackResult.status === 'APPROVED' ? (
            <div className="p-5 bg-gradient-to-r from-emerald-50/90 via-teal-50/90 to-cyan-50/90 border-2 border-emerald-300 rounded-2xl shadow-sm space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-emerald-950">
                      Officer Action Completed: Title Cleared & Authenticated
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      Verified clean title with 100% cadastral match and unencumbered ownership.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-center">
                  ✓ Action Taken: CLEARED & CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200/90">
                  <span className="text-slate-500 text-[11px] font-semibold block">Adjudicating Authority:</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Smt. Smita Deshpande</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Tahsildar & Revenue Adjudicator</span>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-emerald-200/90">
                  <span className="text-slate-500 text-[11px] font-semibold block">Digital Certificate:</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-emerald-900">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>RoR 7/12 Cryptographically Sealed</span>
                  </div>
                  <span className="text-[11px] text-slate-500">SHA-256 genesis fingerprint secured</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                  Officer Order Summary:
                </span>
                <p className="text-slate-800 leading-relaxed font-sans">
                  "All multi-factor verifications completed satisfactorily. Zero legal encumbrances, zero boundary overlaps, and title holder authenticated against official state land database."
                </p>
              </div>
            </div>
          ) : null}

          {/* 5-Step Visual Stepper */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Digitization & Adjudication Lifecycle
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-emerald-500/40 ml-4">
              {(trackResult.steps || []).map((st) => {
                const isCurrent = trackResult.current_step === st.step;
                const isCompleted = st.completed;

                return (
                  <div key={st.step} className="relative">
                    {/* Circle Node */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                        : isCurrent
                        ? 'bg-amber-500 text-white border-amber-500 animate-pulse'
                        : 'bg-white text-slate-400 border-slate-300'
                    }`}>
                      {isCompleted ? '✓' : st.step}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${
                          isCompleted ? 'text-slate-900' : isCurrent ? 'text-amber-800' : 'text-slate-400'
                        }`}>
                          {st.title}
                        </span>
                        {st.timestamp && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({new Date(st.timestamp).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {st.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate Download Card if Approved */}
          {trackResult.is_certificate_ready && (
            <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-200 text-emerald-700">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Your Certified Digital Record of Rights is Ready
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Legally valid digital document with QR-code cryptographic signature.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.open(`/api/v1/cases/${trackResult.case_number}/report`, '_blank')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          )}

          {/* Citizen Helpdesk Note */}
          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              Toll-Free Revenue Grievance Helpline: 1800-22-26018
            </span>
            <span>Digital India Land Records Modernization Programme (DILRMP)</span>
          </div>

        </div>
      )}

    </div>
  );
};
