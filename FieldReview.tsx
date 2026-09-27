import React, { useState } from 'react';
import { 
  Edit3, 
  CheckCircle, 
  Clock, 
  User, 
  History, 
  AlertCircle, 
  Check, 
  X,
  FileCheck2,
  Shield
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { ExtractedField } from '../../types';

export const FieldReview: React.FC = () => {
  const { currentCase, submitCorrection, isProcessing } = useCase();
  const [selectedField, setSelectedField] = useState<ExtractedField | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  const [reason, setReason] = useState<string>('Clerical typographical correction');
  const [officerName, setOfficerName] = useState<string>('Revenue Inspector / Tahsildar');

  const openCorrectionModal = (field: ExtractedField) => {
    setSelectedField(field);
    setNewValue(field.normalizedValue);
    setReason('Clerical typographical correction');
  };

  const closeModal = () => {
    setSelectedField(null);
  };

  const handleApplyCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !newValue.trim()) return;

    await submitCorrection(
      selectedField.key,
      selectedField.label,
      selectedField.normalizedValue,
      newValue.trim(),
      reason,
      officerName
    );

    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Top Description */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Human-in-the-Loop Field Review & Correction Workspace
            </h3>
            <p className="text-xs text-slate-500">
              Authorized revenue officers can verify, correct, and certify OCR canonical fields with immutable audit tracking.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Case: {currentCase.case_number}
        </div>
      </div>

      {/* Field Comparison Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Canonical Fields & OCR Match Verification
          </h4>
          <span className="text-[11px] text-slate-500">
            Click &quot;Suggest Correction&quot; to alter any field with audit logging
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Field Name</th>
                <th className="px-4 py-3">Raw OCR Extract</th>
                <th className="px-4 py-3">Normalized Value</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentCase.extracted_fields.map(field => (
                <tr key={field.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {field.label}
                    {field.indicOriginal && (
                      <span className="text-slate-400 block font-serif text-[11px] font-normal">
                        {field.indicOriginal}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px] italic">
                    {field.rawValue}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {field.normalizedValue}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      field.confidence >= 0.95 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {Math.round(field.confidence * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {field.status === 'CONFIRMED' && (
                      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    )}
                    {field.status === 'FLAGGED' && (
                      <span className="inline-flex items-center text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Flagged
                      </span>
                    )}
                    {field.status === 'MANUALLY_EDITED' && (
                      <span className="inline-flex items-center text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Officer Corrected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openCorrectionModal(field)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-[11px] font-semibold transition-all shadow-xs"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Audit Trail of Field Edits */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-3">
          <History className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Cryptographic Field Revision History ({currentCase.corrections.length} recorded revisions)
          </h4>
        </div>

        {currentCase.corrections.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No manual corrections recorded. All fields currently match automated OCR extraction.
          </p>
        ) : (
          <div className="space-y-2.5">
            {currentCase.corrections.map(corr => (
              <div key={corr.id} className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{corr.field_label}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-rose-600 line-through font-mono">{corr.old_value}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-700 font-bold font-mono">{corr.new_value}</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    <strong>Justification:</strong> {corr.reason}
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-400 sm:flex-shrink-0 font-mono">
                  <div className="text-slate-700 font-sans font-semibold">{corr.officer_name}</div>
                  <div>{new Date(corr.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggest Correction Modal */}
      {selectedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Suggest Field Correction</h4>
                  <p className="text-xs text-slate-500">Case {currentCase.case_number}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyCorrection} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Field</label>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-900">
                  {selectedField.label} ({selectedField.indicOriginal || selectedField.key})
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Value (from OCR)</label>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 font-mono text-[11px]">
                  {selectedField.normalizedValue}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">New Corrected Value *</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full glass-input"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Justification Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full glass-input"
                >
                  <option value="Clerical typographical correction">Clerical typographical error in parchment</option>
                  <option value="Indic script transliteration alignment">Indic script OCR transliteration alignment</option>
                  <option value="Match with official physical Talathi register">Match with physical Talathi / Patwari register</option>
                  <option value="Sub-Registrar Index-II deed verification">Sub-Registrar Index-II deed verification</option>
                  <option value="Resolution of alias or patronymic expansion">Resolution of alias or patronymic expansion</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Authorizing Officer Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full glass-input font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Recording...' : 'Commit Correction to Ledger'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
