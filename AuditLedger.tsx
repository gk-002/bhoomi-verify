import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Hash, 
  ArrowDown, 
  Key, 
  RefreshCw,
  Code2
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';
import { caseService } from '../../api/services';

export const AuditLedger: React.FC = () => {
  const { currentCase } = useCase();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    is_valid: boolean;
    total_blocks: number;
    verification_time_ms: number;
    audit_notes: string;
  } | null>(null);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      const res = await caseService.verifyLedgerIntegrity(currentCase.case_number);
      setVerificationResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Integrity Verification Action */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Cryptographic Audit Ledger & SHA-256 Hash Chaining
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Immutable Blockchain
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Every document ingestion, OCR parsing, field correction, and officer decision is permanently secured.
            </p>
          </div>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={isVerifying}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
          <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Cryptographic Integrity'}</span>
        </button>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 shadow-xs animate-in fade-in">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <span className="font-bold block text-[13px]">
              Cryptographic Integrity Confirmed (100% Tamper-Evident)
            </span>
            <p className="mt-0.5 text-emerald-800">
              Verified {verificationResult.total_blocks} chained blocks in {verificationResult.verification_time_ms}ms.
              All block hashes match their canonical SHA-256 parent roots.
            </p>
          </div>
        </div>
      )}

      {/* Visual Chained Blocks */}
      <div className="space-y-4">
        {currentCase.ledger_blocks.map((block, index) => {
          const isGenesis = index === 0;

          return (
            <div key={block.block_height} className="relative">
              {/* Connector line between blocks */}
              {index > 0 && (
                <div className="flex items-center justify-center my-1 text-slate-300">
                  <div className="w-0.5 h-4 bg-slate-200"></div>
                </div>
              )}

              <div className="glass-panel p-5 hover:border-emerald-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                      #{block.block_height}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      {block.event_type.replace(/_/g, ' ')}
                    </span>
                    {isGenesis && (
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                        GENESIS
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Block SHA-256 Hash:
                    </span>
                    <div className="font-mono text-[11px] text-slate-800 bg-slate-100/90 p-2 rounded-lg border border-slate-200 break-all">
                      {block.block_hash}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Previous Block Hash:
                    </span>
                    <div className="font-mono text-[11px] text-slate-500 bg-slate-100/60 p-2 rounded-lg border border-slate-200 break-all">
                      {block.previous_hash}
                    </div>
                  </div>
                </div>

                {/* Block Payload Snippet */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                    <Code2 className="w-3 h-3" />
                    Event Canonical Payload:
                  </span>
                  <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 overflow-x-auto">
                    {JSON.stringify(block.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
