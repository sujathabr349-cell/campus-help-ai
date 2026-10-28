import React from 'react';
import { UserProfile } from '../../types/campus';
import { STUDENT_USER, ADMIN_USER } from '../../services/supabase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUser: (role: 'student' | 'admin') => void;
  onOpenInstall?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  onOpenInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">badge</span>
            <span className="font-semibold text-sm">Account &amp; Campus Identity</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Digital ID Card Preview */}
        <div className="p-5 bg-slate-50 space-y-4 text-xs font-sans">
          <div className="bg-gradient-to-br from-blue-900 to-[#000f1d] text-white p-4 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block">
                  Bengaluru Central Campus
                </span>
                <span className="text-xs font-bold text-teal-300">
                  {currentUser.role === 'admin' ? 'FACULTY SMART CARD' : 'STUDENT IDENTITY CARD'}
                </span>
              </div>
              <span className="material-symbols-outlined text-teal-400 text-[22px]">verified</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-white/40 shadow-sm"
              />
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-white">{currentUser.name}</h4>
                <p className="text-[11px] font-mono text-blue-200">
                  {currentUser.role === 'admin' ? `Faculty ID: ${currentUser.idNumber}` : `USN: ${currentUser.idNumber}`}
                </p>
                <p className="text-[10px] text-slate-300 line-clamp-1">{currentUser.department}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-300">
              <span>Academic Session 2024–25</span>
              <span className="text-teal-300 font-semibold">Active &amp; Grounded</span>
            </div>
          </div>

          {/* Switch Role / Login Option */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block text-xs">Switch User Profile (Testing &amp; Auth)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSwitchUser('student');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentUser.role === 'student'
                    ? 'border-[#0051d5] bg-blue-50 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  <span className="text-xs">Student Login</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">Rahul S. (BCA Sem 3)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSwitchUser('admin');
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentUser.role === 'admin'
                    ? 'border-[#0051d5] bg-blue-50 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  <span className="text-xs">Admin Login</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">Prof. Sharma (HOD)</span>
              </button>
            </div>
          </div>

          {/* Install on Phone Action */}
          {onOpenInstall && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInstall();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300 text-blue-900 flex items-center justify-between transition-all active:scale-98 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0051d5] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">install_mobile</span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs block text-slate-900 leading-tight">Install on Phone (PWA)</span>
                  <span className="text-[10px] text-slate-500">Add to home screen for 1-tap offline access</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#0051d5] text-[18px]">arrow_forward</span>
            </button>
          )}

          {/* Security and Cloud status */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
            <div className="flex justify-between items-center">
              <span>Supabase Authentication:</span>
              <span className="text-emerald-700 font-semibold">Active RLS</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gemini AI Grounding:</span>
              <span className="text-emerald-700 font-semibold">Synced (0.4s)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
