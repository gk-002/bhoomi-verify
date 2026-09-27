import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Download, 
  QrCode, 
  Key, 
  Send, 
  CheckCircle2, 
  Building2,
  Stamp,
  Eye,
  Flag
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { OfficerActionType } from '../../types';

export const OfficerTriage: React.FC = () => {
  const { currentCase, submitDecision, isProcessing, setActiveTab } = useCase();
  const [selectedAction, setSelectedAction] = useState<OfficerActionType>('CLEAR');
  const [remarks, setRemarks] = useState<string>('All statutory multi-factor verifications completed with satisfactory results.');
  const [officerName, setOfficerName] = useState<string>('Smt. Smita Deshpande');
  const [officerPin, setOfficerPin] = useState<string>('24018');
  const [isSigned, setIsSigned] = useState<boolean>(currentCase.status === 'APPROVED');

  const handleExecuteDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitDecision(selectedAction, remarks, officerName, officerPin);
    if (selectedAction === 'APPROVE' || selectedAction === 'CLEAR') {
      setIsSigned(true);
    }
  };

  const handleDownloadPdf = () => {
    window.open(`/api/v1/cases/${currentCase.case_number}/report`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Revenue Officer Triage & Statutory Decision Workspace
            </h3>
            <p className="text-xs text-slate-500">
              Empowered under Section 148 of Maharashtra Land Revenue Code & DILRMP Digital Protocol.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Status: <strong className="text-slate-900">{currentCase.status}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Officer Decision Form */}
        <div className="lg:col-span-7 glass-panel p-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Stamp className="w-4 h-4 text-emerald-600" />
            Adjudication Action Console
          </h4>

          <form onSubmit={handleExecuteDecision} className="space-y-4 text-xs">
            {/* Action Buttons Radio */}
            <div>
              <label className="font-semibold text-slate-700 block mb-2">Select Statutory Officer Action:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Inspect */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAction('INSPECT');
                    setRemarks('Notice issued under Section 135-D of Maharashtra Land Revenue Code for physical ground boundary inspection & Mojani survey.');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === 'INSPECT' || selectedAction === 'FLAG_FOR_INSPECTION'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 text-xs">
                    <Eye className="w-4 h-4 text-amber-600" />
                    Inspect (Field Mojani)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Summons Talathi / Mojani surveyor for physical measurement.
                  </p>
                </button>

                {/* 2. Flag */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAction('FLAG');
                    setRemarks('Active discrepancy flagged: Boundary collision with adjoining survey number and contested succession.');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === 'FLAG'
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 text-xs">
                    <Flag className="w-4 h-4 text-rose-600" />
                    Flag Discrepancy
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Flags boundary overlap, contested mutation, or encumbrance.
                  </p>
                </button>

                {/* 3. Clear */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAction('CLEAR');
                    setRemarks('All statutory multi-factor checks verified and passed. Title clear and certified.');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === 'CLEAR' || selectedAction === 'APPROVE'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Clear & Approve Title
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Clears discrepancies and issues digitally signed RoR.
                  </p>
                </button>

                {/* 4. Clerical Correction */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAction('REQUEST_CLERICAL');
                    setRemarks('Return to data entry operator for Indic spelling and transliteration resolution.');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAction === 'REQUEST_CLERICAL'
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-indigo-800 text-xs">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Request Clerical Edit
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Minor typographical or spelling correction without contest.
                  </p>
                </button>

                {/* 5. Reject & Freeze */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAction('REJECT');
                    setRemarks('Application rejected due to adverse court injunction stay order / fraudulent title chain.');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all sm:col-span-2 ${
                    selectedAction === 'REJECT'
                      ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 text-xs">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Reject & Legal Freeze
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Freezes digital conveyance; reports adverse court injunction to Sub-Registrar.
                  </p>
                </button>
              </div>
            </div>

            {/* Formal Order Remarks */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Order Remarks / Adjudication Finding:
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full glass-input text-xs"
                placeholder="Enter statutory reasoning..."
                required
              />
            </div>

            {/* Officer Identity & Digital PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Authorizing Officer Name:</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full glass-input"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Digital Signature PIN / Key:</label>
                <input
                  type="password"
                  value={officerPin}
                  onChange={(e) => setOfficerPin(e.target.value)}
                  className="w-full glass-input font-mono"
                  placeholder="•••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isProcessing ? 'Recording Decision...' : 'Commit Adjudication to Cryptographic Ledger'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Certified RoR Digital Certificate Preview */}
        <div className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Digital Certificate Preview
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Secured by SHA-256
              </span>
            </div>

            {/* Certificate Card */}
            <div className="bg-[#fffdf9] p-4 rounded-xl border-2 border-emerald-600/40 shadow-sm relative overflow-hidden font-serif">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-slate-900 font-extrabold text-5xl">
                BHOOMI
              </div>

              <div className="text-center pb-3 border-b border-slate-200 mb-3">
                <div className="text-[10px] uppercase font-bold text-slate-700">Government of India • DILRMP</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  Verified Land Record Certificate
                </div>
                <div className="text-[9px] text-slate-500 font-sans mt-0.5">
                  Unique Certificate ID: CERT-2026-{currentCase.state_code}-{currentCase.survey_number.replace('/', '-')}
                </div>
              </div>

              <div className="space-y-2 text-[11px] font-sans text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Holder / Khatedar:</span>
                  <span className="font-bold text-slate-900">{currentCase.claimant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gat / Survey:</span>
                  <span className="font-bold text-emerald-900 font-mono">{currentCase.survey_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-800">{currentCase.village}, {currentCase.taluka}, {currentCase.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Certified Area:</span>
                  <span className="font-bold font-mono text-slate-900">{currentCase.canonical_record.area_value} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Assessment:</span>
                  <span className="font-bold text-emerald-700">{currentCase.risk_band} ({currentCase.risk_score}/100)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white p-1 rounded border border-slate-300 shadow-2xs flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-mono">HASH PROOF</span>
                    <span className="text-[10px] font-mono text-slate-600 block">
                      {currentCase.canonical_record.raw_data_hash.substring(0, 12)}...
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block">DIGITALLY SIGNED BY</span>
                  <span className="text-[11px] font-bold text-slate-800 block">{officerName}</span>
                  <span className="text-[9px] text-emerald-700 font-semibold">Tahsildar / Revenue Inspector</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 rounded-xl border border-slate-200 shadow-xs text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Official ReportLab PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
