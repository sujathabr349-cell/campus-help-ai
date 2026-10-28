import React from 'react';
import { supabaseService } from '../../services/supabase';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const logs = supabaseService.getAuditLogs();
  const status = supabaseService.getStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">security</span>
            <div>
              <span className="font-semibold text-sm block">Supabase &amp; AI Security Audit Log</span>
              <span className="text-[10px] text-slate-400">Database RLS &amp; Grounding Operations</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Status card */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cluster Region</span>
              <span className="font-bold text-slate-800 font-mono text-[11px]">{status.cluster}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Vector Model</span>
              <span className="font-bold text-teal-700 font-mono text-[11px]">{status.vectorModel}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] px-1 text-slate-600">
            <span>Grounding Query Latency: <strong>{status.latencyMs}</strong></span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Row Level Security Active
            </span>
          </div>
        </div>

        {/* Log stream */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-grow font-mono text-[11px]">
          {logs.map((log, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2">
              <span className="text-teal-600 font-bold shrink-0">{log.time}</span>
              <span className="text-slate-800 break-words">{log.event}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
