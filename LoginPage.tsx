import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  User, 
  Lock, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  FileText,
  BadgeCheck,
  Fingerprint,
  Download
} from 'lucide-react';
import { useCase } from '../context/CaseContext';

export const LoginPage: React.FC = () => {
  const { login } = useCase();
  const [activeTab, setActiveTab] = useState<'OFFICER' | 'CITIZEN'>('OFFICER');

  // Officer credentials state
  const [officerUsername, setOfficerUsername] = useState('officer');
  const [officerPassword, setOfficerPassword] = useState('officer123');
  const [officerPin, setOfficerPin] = useState('24018');

  // Citizen credentials state
  const [citizenIdentifier, setCitizenIdentifier] = useState('BV-2026-MH-4201');
  const [citizenOtp, setCitizenOtp] = useState('123456');

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('OFFICER', {
      username: officerUsername,
      fullName: 'Smt. Smita Deshpande',
      designation: 'Tahsildar & Revenue Adjudicator',
      role: 'OFFICER'
    });
  };

  const handleCitizenLogin = (e: React.FormEvent, customCase?: string, customName?: string) => {
    if (e) e.preventDefault();
    const caseNum = customCase || citizenIdentifier;
    let name = customName;
    if (!name) {
      if (caseNum.includes('1080')) name = 'Suresh Babanrao Kadam';
      else if (caseNum.includes('760')) name = 'Dnyaneshwar Ramchandra Patil';
      else name = 'Balasaheb Tukaram Pawar';
    }

    login('CITIZEN', {
      username: `citizen_${caseNum}`,
      fullName: name,
      designation: `Registered Landholder`,
      caseNumber: caseNum,
      role: 'CITIZEN'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Subtle Geometry Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top National Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 ring-2 ring-white/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Bhoomi<span className="text-emerald-400">Verify</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SIH 2026 • 26018
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              National Cadastral Map & Digital Land Records Verification System
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-400">
          <div className="font-semibold text-slate-300">Digital India Land Records (DILRMP)</div>
          <div className="text-[11px] text-slate-500">Ministry of Rural Development, GoI</div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="max-w-xl w-full mx-auto my-8 z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
          
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Single Sign-On (RBAC Access Portal)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your authorization role to enter the secure verification system.
            </p>
          </div>

          {/* Role Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('OFFICER')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'OFFICER'
                  ? 'bg-white text-emerald-800 shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Revenue Officer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CITIZEN')}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'CITIZEN'
                  ? 'bg-white text-emerald-800 shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Citizen Portal</span>
            </button>
          </div>

          {/* 1. Officer Login Form */}
          {activeTab === 'OFFICER' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <Building2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <strong className="block font-bold">Authorized Departmental Access Only</strong>
                  For Tahsildars, Sub-Divisional Officers, and Mojani Surveyors under Maharashtra Land Revenue Code, 1966.
                </div>
              </div>

              <form onSubmit={handleOfficerLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Officer Username / Government Email:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={officerUsername}
                      onChange={(e) => setOfficerUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Password:</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={officerPassword}
                        onChange={(e) => setOfficerPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">2FA Officer PIN / Key:</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={officerPin}
                        onChange={(e) => setOfficerPin(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-mono"
                        placeholder="•••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate as Revenue Officer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Login Preset */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Fast Demo Persona Login:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    login('OFFICER', {
                      username: 'officer_smita',
                      fullName: 'Smt. Smita Deshpande',
                      designation: 'Tahsildar & Revenue Adjudicator',
                      role: 'OFFICER'
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 rounded-xl border border-slate-200/90 text-left transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <strong className="block text-slate-900">Smt. Smita Deshpande (Tahsildar)</strong>
                      <span className="text-[11px] text-slate-500">Parner / Ahilyanagar & Satara Jurisdiction</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    1-Click Login →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Citizen Login Form */}
          {activeTab === 'CITIZEN' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-start gap-3">
                <Fingerprint className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-teal-950">
                  <strong className="block font-bold">Public Citizen & Landholder Portal</strong>
                  Track your digital 7/12 RoR, view Mojani surveyor inspection notices, and download certified records. Strictly isolated from internal revenue officer consoles.
                </div>
              </div>

              <form onSubmit={handleCitizenLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Application Case Ref. / Registered Mobile No.:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={citizenIdentifier}
                      onChange={(e) => setCitizenIdentifier(e.target.value)}
                      placeholder="e.g. BV-2026-MH-4201 or 9876543210"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Aadhaar OTP / Security Code:</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={citizenOtp}
                      onChange={(e) => setCitizenOtp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs font-mono"
                      placeholder="••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as Citizen Landholder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Fast 1-Click Citizen Personas */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Demo Citizen Persona:
                </span>
                
                {/* Clean Record Citizen */}
                <button
                  type="button"
                  onClick={(e) => handleCitizenLogin(e, 'BV-2026-MH-4201', 'Balasaheb Tukaram Pawar')}
                  className="w-full p-2.5 bg-emerald-50/60 hover:bg-emerald-100/70 text-slate-800 rounded-xl border border-emerald-200 text-left transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <strong className="block text-slate-900">Balasaheb Pawar (Clean Title)</strong>
                      <span className="text-[11px] text-slate-500">🌾 Gat 142/2 Hiware Bazar • RoR Approved</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Login →
                  </span>
                </button>

                {/* Flagged Record Citizen */}
                <button
                  type="button"
                  onClick={(e) => handleCitizenLogin(e, 'BV-2026-MH-1080', 'Suresh Babanrao Kadam')}
                  className="w-full p-2.5 bg-amber-50/60 hover:bg-amber-100/70 text-slate-800 rounded-xl border border-amber-200 text-left transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <div>
                      <strong className="block text-slate-900">Suresh Kadam (Officer Flagged)</strong>
                      <span className="text-[11px] text-slate-500">🌾 Gat 215/1 Palashi • Boundary Dispute Notice</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                    Login →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Security & DILRMP Seal */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              256-Bit SHA-256 Ledger Authenticated
            </span>
            <span>Role-Based Access Control (RBAC) Active</span>
          </div>

          {/* Quick GitHub Archive Package Download */}
          <div className="pt-1 flex items-center justify-center">
            <a
              href="/BhoomiVerify-GitHub.zip"
              download="BhoomiVerify-GitHub.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-500/10 transition-all border border-emerald-500/20"
              title="Download clean repository ZIP package ready for GitHub upload"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download GitHub Repository Archive (.zip)</span>
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 z-10 flex flex-col items-center gap-2.5 pb-2">
        <div>
          © 2026 Ministry of Rural Development • Digital India Land Records Modernization Programme (DILRMP)
        </div>
        <div>
          <a
            href="/BhoomiVerify-GitHub.zip"
            download="BhoomiVerify-GitHub.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all shadow-md hover:shadow-emerald-500/10"
            title="Download clean repository ZIP package ready for GitHub upload"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Clean GitHub Repository (.zip)</span>
          </a>
        </div>
      </footer>

    </div>
  );
};
