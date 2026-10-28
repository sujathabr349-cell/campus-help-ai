import React from 'react';
import { Language, UserProfile } from '../types/campus';

interface HeaderProps {
  currentTab: string;
  language: Language;
  onToggleLanguage: () => void;
  currentUser: UserProfile;
  onOpenProfile: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenInstall: () => void;
  isInstalled?: boolean;
  onRefresh?: () => void;
  isOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  language,
  onToggleLanguage,
  currentUser,
  onOpenProfile,
  isMobileFrame,
  onToggleFrame,
  onOpenInstall,
  isInstalled,
  onRefresh,
  isOnline = true,
}) => {
  const tabTitles: Record<string, string> = {
    home: 'Home',
    chat: 'Ai Chat',
    calendar: 'Calendar',
    courses: 'Courses',
    notices: 'Notices',
    admin: 'Admin',
  };

  const title = tabTitles[currentTab] || 'Home';

  return (
    <header className="sticky top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 px-4 flex items-center justify-between max-w-lg mx-auto w-full">
        {/* Brand & Subtext */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-700/30">
            <span className="material-symbols-outlined text-[18px]">school</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-[#000f1d] leading-none tracking-tight">
                Campus Help AI
              </span>
              <span className="material-symbols-outlined text-[#0051d5] text-[16px]">verified</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[11px] text-slate-500 font-medium">{title}</span>
              <span className="text-slate-300 text-[10px]">•</span>
              {!isOnline ? (
                <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 border border-amber-200">
                  <span className="material-symbols-outlined text-[11px]">wifi_off</span>
                  Offline (Cached)
                </span>
              ) : (
                <span className="text-[11px] text-teal-700 font-semibold">Desk</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Icons: Install, Frame toggle, Language Switch, Profile */}
        <div className="flex items-center gap-2">
          {/* Install Button (PWA) */}
          <button
            type="button"
            onClick={onOpenInstall}
            title="Install Campus Help AI on Phone"
            className="h-8 px-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-1 font-bold text-[11px] transition-all shadow-xs active:scale-95 ring-1 ring-blue-400/30"
          >
            <span className="material-symbols-outlined text-[16px]">install_mobile</span>
            <span>Install</span>
          </button>

          {/* Frame switch toggle (Mobile shell vs full wide) */}
          <button
            type="button"
            onClick={onToggleFrame}
            title={isMobileFrame ? 'Expand to Full Viewport' : 'Switch to Mobile Frame'}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-xs hidden sm:flex cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">
              {isMobileFrame ? 'fullscreen' : 'smartphone'}
            </span>
          </button>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh || (() => window.location.reload())}
            title="Refresh App"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">refresh</span>
          </button>

          {/* Language Toggle Chip */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="h-8 px-2 rounded-full bg-slate-200/80 hover:bg-slate-200 flex items-center gap-1 transition-all shadow-none focus:outline-none"
            title="Toggle English and Kannada (ಕನ್ನಡ)"
          >
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#000f1d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                language === 'kn'
                  ? 'bg-[#000f1d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </span>
          </button>

          {/* User Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-9 h-9 rounded-full relative p-0.5 ring-2 ring-blue-500/30 hover:ring-blue-600 transition-all focus:outline-none"
            title={`Logged in as ${currentUser.name} (${currentUser.role})`}
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
