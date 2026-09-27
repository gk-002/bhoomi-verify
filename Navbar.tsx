import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  FileCheck, 
  Search, 
  User, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Layers,
  Building2,
  FolderOpen,
  Key,
  X,
  Sparkles,
  ShieldCheck,
  Cpu,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useCase } from '../context/CaseContext';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
  onNavigateCases: () => void;
  onNavigateCitizen: () => void;
  currentView: 'dashboard' | 'cases' | 'citizen';
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateDashboard,
  onNavigateCases,
  onNavigateCitizen,
  currentView
}) => {
  const { 
    currentCase, 
    availableCases,
    selectCase, 
    userRole, 
    setUserRole,
    currentUser,
    logout,
    notification,
    dismissNotification,
    apiKey,
    setApiKey,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen
  } = useCase();

  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey.trim());
    setIsApiKeyModalOpen(false);
  };

  return (
    <header className="glass-nav border-b border-slate-200/80 sticky top-0 z-50">
      {/* Top Notification Bar if active */}
      {notification && (
        <div className={`px-4 py-2 text-xs font-medium flex items-center justify-between transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' :
          notification.type === 'warning' ? 'bg-amber-50 text-amber-800 border-b border-amber-200' :
          notification.type === 'error' ? 'bg-rose-50 text-rose-800 border-b border-rose-200' :
          'bg-slate-100 text-slate-800 border-b border-slate-200'
        }`}>
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
            {notification.type === 'error' && <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            <span>{notification.message}</span>
            <button 
              onClick={dismissNotification}
              className="ml-auto text-slate-400 hover:text-slate-600 font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo and National Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 ring-2 ring-white/80">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Bhoomi<span className="text-emerald-600">Verify</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-300/60">
                  DILRMP • SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Ministry of Rural Development • National Cadastral Validation System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          {userRole === 'OFFICER' ? (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={onNavigateDashboard}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Executive Dashboard
              </button>
              <button
                onClick={onNavigateCases}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'cases'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>Case Dossier</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-mono font-bold">
                  Gat {currentCase.survey_number}
                </span>
              </button>
              <button
                onClick={onNavigateCitizen}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'citizen'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                Citizen Portal Preview
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Citizen Land Records & 7/12 Verification Portal</span>
            </div>
          )}

          {/* Active Record File Selector & API Key Settings & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {userRole === 'OFFICER' ? (
              <>
                {/* Rural Village Case File Selector */}
                <div className="hidden sm:flex items-center bg-white/95 border border-emerald-200/90 rounded-xl px-2.5 py-1 shadow-xs text-xs">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mr-1.5">
                    <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Rural Record:
                  </span>
                  <select
                    value={currentCase.id}
                    onChange={(e) => {
                      selectCase(e.target.value);
                      onNavigateCases();
                    }}
                    className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs"
                  >
                    {availableCases.map((c) => (
                      <option key={c.id} value={c.id}>
                        🌾 Gat {c.survey_number} • {c.village} ({c.district} Rural)
                      </option>
                    ))}
                  </select>
                </div>

                {/* API Key Configuration Button */}
                <button
                  onClick={() => {
                    setInputKey(apiKey);
                    setIsApiKeyModalOpen(true);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
                    apiKey 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-emerald-700'
                  }`}
                  title="Configure Gemini Vision / Land Record API Key"
                >
                  <Key className={`w-3.5 h-3.5 ${apiKey ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">API Key</span>
                  <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                </button>

                {/* Officer Profile Badge */}
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl px-2.5 py-1 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-bold text-emerald-950 hidden lg:inline">
                    {currentUser?.fullName || 'Smt. Smita Deshpande'}
                  </span>
                  <span className="text-[10px] bg-emerald-200/60 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    Tahsildar
                  </span>
                </div>

                {/* Download GitHub Repo Archive */}
                <a
                  href="/BhoomiVerify-GitHub.zip"
                  download="BhoomiVerify-GitHub.zip"
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs"
                  title="Download clean repository ZIP package ready for GitHub upload"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GitHub ZIP</span>
                </a>

                {/* Officer Sign Out */}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold transition-all shadow-xs"
                  title="Sign out of Officer Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                {/* Citizen Profile Badge */}
                <div className="flex items-center gap-2 bg-white/95 border border-emerald-200 rounded-xl px-3 py-1.5 shadow-xs text-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-[11px] leading-tight">
                      {currentUser?.fullName || currentCase.claimant_name}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono">
                      Gat {currentCase.survey_number} • {currentCase.village}
                    </div>
                  </div>
                </div>

                {/* Citizen Sign Out */}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold transition-all shadow-xs"
                  title="Sign out to Login Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit / Sign Out</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Land Record Vision & State Gateway API Key
                  </h4>
                  <p className="text-xs text-slate-500">
                    Google Gemini Multimodal Vision API Integration
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsApiKeyModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Anti-Hallucination Guardrail Banner */}
            <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Strict Date Non-Hallucination Guarantee</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                When an RoR or 7/12 document is uploaded, dates are extracted with deterministic temperature <code>0.0</code>. 
                Dates not explicitly present on the parchment scan are strictly preserved as <strong>null / unrecorded</strong> with zero fabrication.
              </p>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Google Gemini API Key (or Land Record AI Key):
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full glass-input pr-16 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(prev => !prev)}
                    className="absolute right-2.5 top-2 text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Get your free Gemini API key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-emerald-600 underline">aistudio.google.com</a>. If left blank, the system automatically uses the local multilingual Indic rule parser.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                {apiKey ? (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey('');
                      setInputKey('');
                      setIsApiKeyModalOpen(false);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Clear Key
                  </button>
                ) : <div></div>}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyModalOpen(false)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    Save & Activate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
