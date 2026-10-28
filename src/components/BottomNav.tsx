import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingEscalationsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingEscalationsCount = 18,
}) => {
  const tabs = [
    { id: 'home', label: 'Home', labelKn: 'ಮುಖಪುಟ', icon: 'home' },
    { id: 'chat', label: 'AI Chat', labelKn: 'ಎಐ ಚಾಟ್', icon: 'auto_awesome' },
    { id: 'calendar', label: 'Calendar', labelKn: 'ಕ್ಯಾಲೆಂಡರ್', icon: 'calendar_month' },
    { id: 'courses', label: 'Courses', labelKn: 'ಕೋರ್ಸ್‌ಗಳು', icon: 'school' },
    { id: 'notices', label: 'Notices', labelKn: 'ಪ್ರಕಟಣೆಗಳು', icon: 'campaign', hasBadge: true },
    { id: 'admin', label: 'Admin', labelKn: 'ಅಡ್ಮಿನ್', icon: 'admin_panel_settings', badgeCount: pendingEscalationsCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(15,37,55,0.06)] pb-safe">
      <div className="flex justify-around items-center h-18 px-1 max-w-lg mx-auto w-full">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[46px] h-12 transition-all group ${
                isActive ? 'text-[#0051d5] font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`relative w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'bg-[#dbe1ff]' : 'group-hover:bg-slate-100'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[21px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>

                {/* Badge indicator */}
                {tab.hasBadge && (
                  <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold ring-2 ring-white">
                    {tab.badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
