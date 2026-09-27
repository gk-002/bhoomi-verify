import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  Copy, 
  Edit3, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Hash,
  Languages,
  Key,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { ExtractedField } from '../../types';

export const OCRViewer: React.FC = () => {
  const { 
    currentCase, 
    selectedFieldHighlight, 
    setSelectedFieldHighlight, 
    setActiveTab,
    apiKey,
    setIsApiKeyModalOpen,
    uploadAndProcessDocument,
    isProcessing
  } = useCase();

  const [zoom, setZoom] = useState<number>(100);
  const [uploadStep, setUploadStep] = useState<string | null>(null);
  const [activeHoverField, setActiveHoverField] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'scan' | 'digitized'>('digitized');

  const handleRealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setUploadedImageUrl(URL.createObjectURL(file));
        setViewMode('scan');
      }
      setUploadStep('Uploading document scan...');
      
      try {
        setTimeout(() => setUploadStep('Recognizing State Authority & Revenue Portal across 28 states...'), 600);
        setTimeout(() => setUploadStep('Executing Multilingual Indic OCR & Strictly Verifying Dates (Anti-Hallucination active)...'), 1300);
        setTimeout(() => setUploadStep('Synchronizing Cadastral GIS & Vansh-Vruksha Lineage...'), 2000);

        await uploadAndProcessDocument(file);
      } finally {
        setUploadStep(null);
      }
    }
  };

  const highlightedKey = selectedFieldHighlight || activeHoverField;

  return (
    <div className="space-y-6">
      {/* Top Controls & Ingestion Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 ring-2 ring-emerald-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                AI Land Record Ingestion & State Recognition Engine
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {apiKey ? 'Gemini Multimodal Active' : 'Native DILRMP Parser'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Recognized Jurisdiction: <strong className="text-slate-800 font-sans">{currentCase.state_name} ({currentCase.state_code})</strong> • SHA-256: {currentCase.canonical_record.raw_data_hash.substring(0, 18)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* API Key Status Pill */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              apiKey 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'API Key Connected' : 'Set AI API Key'}</span>
          </button>

          {/* Real Upload Button */}
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 text-xs font-bold transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload RoR / 7/12 Scan</span>
            <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff" 
              className="hidden" 
              onChange={handleRealUpload}
              disabled={isProcessing}
            />
          </label>

          <button
            onClick={() => setActiveTab('review')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-semibold transition-all shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Edit Fields</span>
          </button>
        </div>
      </div>

      {/* Date Anti-Hallucination Assurance Banner */}
      <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-emerald-950">
            Strict Anti-Hallucination Guardrail Active:
          </span>
          <span className="text-emerald-800 text-[11px]">
            Dates and mutation chronologies are strictly verified from the scan. Missing dates are preserved as <strong>null / unstated</strong> with zero interpolation.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline">
          Temp: 0.0 Deterministic
        </span>
      </div>

      {/* Processing Animation Step Banner */}
      {(uploadStep || isProcessing) && (
        <div className="glass-card p-6 border-emerald-400 bg-emerald-50/60 text-center animate-in fade-in">
          <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-spin" />
          <h4 className="text-sm font-bold text-slate-900">{uploadStep || 'Processing Land Document...'}</h4>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing Indic typography, recognizing state revenue headers, and extracting non-hallucinated dates
          </p>
        </div>
      )}

      {/* Split Screen Document Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Document Canvas */}
        <div className="lg:col-span-7 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Recognized Document Canvas</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                {currentCase.canonical_record.document_type}
              </span>

              {uploadedImageUrl && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 ml-2">
                  <button
                    onClick={() => setViewMode('scan')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      viewMode === 'scan' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Original Scan
                  </button>
                  <button
                    onClick={() => setViewMode('digitized')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      viewMode === 'digitized' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Digitized Form
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setZoom(prev => Math.max(70, prev - 15))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-xs"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 px-1">{zoom}%</span>
              <button 
                onClick={() => setZoom(prev => Math.min(150, prev + 15))}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-xs"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas with parchment simulation & bounding boxes */}
          <div className="relative flex-1 bg-amber-50/40 rounded-xl border border-amber-200/60 p-4 overflow-auto min-h-[460px] shadow-inner select-none">
            {viewMode === 'scan' && uploadedImageUrl ? (
              <div className="flex flex-col items-center justify-center p-2 min-h-[460px]">
                <div 
                  className="relative inline-block transition-transform origin-top"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <img
                    src={uploadedImageUrl}
                    alt="Original Scan"
                    className="rounded-lg shadow-xl border border-slate-300 max-w-[580px] max-h-[520px] object-contain bg-white"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-2 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Recognized: {currentCase.state_name} ({currentCase.state_code})</span>
                  </div>
                </div>
              </div>
            ) : (
            <div 
              className="relative mx-auto bg-[#fffdfa] border border-amber-300/80 rounded-lg p-6 shadow-md transition-transform origin-top"
              style={{ 
                width: '100%', 
                maxWidth: '620px', 
                minHeight: '440px',
                transform: `scale(${zoom / 100})`
              }}
            >
              {/* Document Header Representation */}
              <div className="text-center pb-4 mb-4 border-b-2 border-slate-800">
                <div className="text-[11px] font-serif font-bold text-slate-900 tracking-wider">
                  {currentCase.state_name} शासन • महसूल विभाग (Revenue Department)
                </div>
                <div className="text-base font-serif font-extrabold text-slate-900 mt-0.5">
                  {currentCase.canonical_record.document_type}
                </div>
                <div className="text-[10px] text-slate-600 italic">
                  (Digital India Land Records Modernization Programme — DILRMP)
                </div>
              </div>

              {/* Record Grid Layout */}
              <div className="space-y-4 font-serif text-slate-800 text-xs">
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">गाव / Village:</span>
                    <span className="font-bold">{currentCase.village}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">तालुका / Tehsil:</span>
                    <span className="font-bold">{currentCase.taluka}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">जिल्हा / District:</span>
                    <span className="font-bold">{currentCase.district} ({currentCase.state_code})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block">भूमापन क्रमांक / Gat / Survey No:</span>
                    <span className="text-base font-extrabold font-mono text-emerald-900">
                      {currentCase.survey_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">एकूण क्षेत्र / Area:</span>
                    <span className="font-bold font-mono">
                      {currentCase.canonical_record.area_value} {currentCase.canonical_record.area_unit} ({currentCase.canonical_record.area_in_sqm.toLocaleString()} sq.m)
                    </span>
                  </div>
                </div>

                <div className="pb-3 border-b border-slate-300">
                  <span className="text-[10px] text-slate-500 block">खातेदाराचे नाव व हिस्सा / Khatedar & Share:</span>
                  <div className="font-extrabold text-slate-950 mt-1 text-sm">
                    {currentCase.claimant_name}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    धारणा प्रकार / Tenure: {currentCase.canonical_record.tenure_type}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block">इतर हक्क व फेरफार नोंदी / Mutations & Dates:</span>
                  <div className="text-xs text-slate-700 mt-1 space-y-1.5">
                    {currentCase.canonical_record.mutations.map((m, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2 p-1.5 bg-amber-50 rounded border border-amber-200">
                        <span className="font-bold font-mono bg-amber-200 px-1.5 py-0.2 rounded text-[10px] text-amber-950">
                          {m.mutation_number}
                        </span>
                        <span className="font-medium text-slate-900">{m.type}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-700 font-mono text-[11px] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-700" />
                          {m.date ? <strong>{m.date}</strong> : <span className="italic text-slate-400">Unrecorded on scan (Null)</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bounding Box Highlights Overlay */}
              {currentCase.extracted_fields.map(field => {
                if (!field.bbox) return null;
                const isFieldActive = highlightedKey === field.key;

                return (
                  <div
                    key={field.id}
                    onMouseEnter={() => setActiveHoverField(field.key)}
                    onMouseLeave={() => setActiveHoverField(null)}
                    onClick={() => setSelectedFieldHighlight(isFieldActive ? null : field.key)}
                    className={`absolute cursor-pointer rounded transition-all duration-150 ${
                      isFieldActive
                        ? 'border-2 border-emerald-600 bg-emerald-500/20 shadow-lg ring-4 ring-emerald-400/40 z-20'
                        : 'border border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-600 hover:bg-emerald-500/15'
                    }`}
                    style={{
                      left: `${field.bbox.x}%`,
                      top: `${field.bbox.y}%`,
                      width: `${field.bbox.width}%`,
                      height: `${field.bbox.height}%`,
                    }}
                  >
                    <span className={`absolute -top-5 left-0 px-1.5 py-0.2 rounded text-[9px] font-bold whitespace-nowrap transition-opacity ${
                      isFieldActive 
                        ? 'bg-emerald-700 text-white opacity-100 shadow-xs' 
                        : 'bg-emerald-600 text-white opacity-0 group-hover:opacity-100'
                    }`}>
                      {field.label.split('(')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 pt-2 flex items-center justify-between">
            <span>Hover on bounding boxes or field cards on right to inspect values</span>
            <span className="text-emerald-700 font-medium">Automatic State Recognition: {currentCase.state_name}</span>
          </div>
        </div>

        {/* Right Column: Extracted Canonical Fields */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Extracted Canonical Fields</span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  {currentCase.extracted_fields.length}
                </span>
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Languages className="w-3.5 h-3.5 text-emerald-600" />
                <span>Indic & English Normalized</span>
              </div>
            </div>

            {/* Field Cards List */}
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {currentCase.extracted_fields.map(field => {
                const isSelected = highlightedKey === field.key;
                const confidencePct = Math.round(field.confidence * 100);

                return (
                  <div
                    key={field.id}
                    onMouseEnter={() => setActiveHoverField(field.key)}
                    onMouseLeave={() => setActiveHoverField(null)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <span>{field.label}</span>
                          {field.indicOriginal && (
                            <span className="text-slate-400 font-serif">({field.indicOriginal})</span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                          {field.normalizedValue}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          Raw Scan: <span className="italic">{field.rawValue}</span>
                        </div>
                      </div>

                      {/* Status and Confidence */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          {field.status === 'CONFIRMED' && (
                            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.2 rounded border border-emerald-300">
                              <CheckCircle className="w-3 h-3 mr-0.5" />
                              Match
                            </span>
                          )}
                          {field.status === 'FLAGGED' && (
                            <span className="inline-flex items-center text-[10px] font-semibold text-rose-700 bg-rose-100/90 px-1.5 py-0.2 rounded border border-rose-300">
                              <AlertCircle className="w-3 h-3 mr-0.5" />
                              Flagged
                            </span>
                          )}
                          {field.status === 'MANUALLY_EDITED' && (
                            <span className="inline-flex items-center text-[10px] font-semibold text-indigo-700 bg-indigo-100/90 px-1.5 py-0.2 rounded border border-indigo-300">
                              <Edit3 className="w-3 h-3 mr-0.5" />
                              Edited
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] font-mono text-slate-500">
                          {confidencePct}% Conf
                        </div>
                        <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                          <div
                            className={`h-full rounded-full ${
                              confidencePct >= 95 ? 'bg-emerald-500' :
                              confidencePct >= 85 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${confidencePct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
