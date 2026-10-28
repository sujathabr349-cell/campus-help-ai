import React, { useState } from 'react';
import { Notice, Language } from '../types/campus';

interface NoticesViewProps {
  language: Language;
  notices: Notice[];
  onOpenPdf: (title: string, type: 'circular' | 'syllabus' | 'rulebook', refNo?: string) => void;
  onOpenHallTicket: () => void;
  onAskNoticeAI: (noticeTitle: string) => void;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  language,
  notices,
  onOpenPdf,
  onOpenHallTicket,
  onAskNoticeAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [showSubscriptionToast, setShowSubscriptionToast] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const filteredNotices = notices.filter((n) => {
    const matchesFilter =
      currentFilter === 'all' || n.category === currentFilter;
    const matchesSearch =
      searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.kannadaTitle && n.kannadaTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleApplyPlacement = (id: string) => {
    setAppliedJobs((prev) => [...prev, id]);
    alert('Application submitted to Campus Placement Hub! Hall ticket & test credentials sent to college email.');
  };

  const handleRegisterEvent = (id: string) => {
    setRegisteredEvents((prev) => [...prev, id]);
    alert('Registered for IGNITE 2024 Fest! Entry pass issued to Student USN portal.');
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Hero Summary & Search Panel */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2.5">
        {/* Urgent Alert Header Box */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0f2537] via-[#213145] to-[#000f1d] p-4 rounded-2xl shadow-sm text-white">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#0051d5] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[22px]">campaign</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">
                    Official Bulletin
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <p className="text-sm font-bold text-white mt-0.5">Campus Notice Desk</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 flex items-center gap-1 text-[10px] font-bold">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>Live Sync</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-2 relative z-10">
            All circulars verified directly from Registrar Office &amp; Examination Board.
          </p>
        </div>

        {/* Omni Search Bar */}
        <div className="relative w-full">
          <div className="h-12 bg-white rounded-xl border border-slate-200 flex items-center px-3.5 shadow-xs gap-2.5">
            <span className="material-symbols-outlined text-[#0051d5] text-[22px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars, exam dates, syllabus..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchQuery('Exam')}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#0051d5]"
            >
              <span className="material-symbols-outlined text-[17px]">mic</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { id: 'all', label: 'All', icon: 'all_inclusive' },
            { id: 'exams', label: 'Examinations', icon: 'edit_calendar', iconColor: 'text-red-500' },
            { id: 'circulars', label: 'Circulars', icon: 'description', iconColor: 'text-[#0051d5]' },
            { id: 'events', label: 'Events & Fest', icon: 'celebration', iconColor: 'text-purple-600' },
            { id: 'placements', label: 'Placements', icon: 'work', iconColor: 'text-teal-600' },
            { id: 'holidays', label: 'Holidays', icon: 'cottage', iconColor: 'text-amber-600' },
          ].map((chip) => {
            const isSelected = currentFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setCurrentFilter(chip.id)}
                className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all shadow-xs ${
                  isSelected
                    ? 'bg-[#0051d5] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`material-symbols-outlined text-[15px] ${chip.iconColor || ''}`}>
                  {chip.icon}
                </span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notices Feed Section */}
      <div className="px-4 flex flex-col gap-3.5 mt-1">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <article
              key={notice.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-2.5 transition-all"
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${
                      notice.category === 'exams'
                        ? 'bg-red-100 text-red-800'
                        : notice.category === 'events'
                        ? 'bg-purple-100 text-purple-800'
                        : notice.category === 'placements'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {notice.category === 'exams' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                    {notice.category.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    {notice.publishedAt}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>{notice.officialBadge}</span>
                </div>
              </div>

              {/* Event Visual Banner if present */}
              {notice.bannerImage && (
                <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-xs">
                  <img
                    src={notice.bannerImage}
                    alt={notice.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <div className="flex items-center gap-1 text-white text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-teal-300">pin_drop</span>
                      <span>{notice.eventLocation}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-snug">{notice.title}</h2>
                {notice.kannadaTitle && (
                  <p className="text-xs text-[#0051d5] font-semibold mt-0.5">
                    ({notice.kannadaTitle})
                  </p>
                )}
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notice.content}</p>
                {language === 'kn' && notice.kannadaContent && (
                  <div className="mt-1 p-2 bg-blue-50/60 rounded-lg text-xs text-slate-800 leading-relaxed font-medium">
                    {notice.kannadaContent}
                  </div>
                )}
              </div>

              {/* PDF Attachment Box if present */}
              {notice.pdfAttachment && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                      <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {notice.pdfAttachment.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {notice.pdfAttachment.size} • {notice.pdfAttachment.refNo}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenPdf(notice.title, 'circular', notice.pdfAttachment?.refNo)
                    }
                    className="shrink-0 h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0051d5] text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    <span>Download</span>
                  </button>
                </div>
              )}

              {/* Placement Details Card */}
              {notice.packageDetails && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#000f1d] text-white flex items-center justify-center text-[11px] font-bold">
                      BCA
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-900">
                        {notice.packageDetails}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {notice.deadline || 'Placement Hub'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyPlacement(notice.id)}
                    className="h-8 px-3.5 rounded-lg bg-[#000f1d] hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <span>{appliedJobs.includes(notice.id) ? 'Applied ✓' : 'Apply'}</span>
                    <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                  </button>
                </div>
              )}

              {/* Event Registration Button */}
              {notice.category === 'events' && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">Open for all departments</span>
                  <button
                    type="button"
                    onClick={() => handleRegisterEvent(notice.id)}
                    className="h-9 px-3.5 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <span>
                      {registeredEvents.includes(notice.id) ? 'Registered ✓' : 'Register / Guidelines'}
                    </span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              )}

              {/* Action Buttons for Exams */}
              {notice.category === 'exams' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onOpenHallTicket}
                    className="h-10 px-3 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[17px]">download_for_offline</span>
                    <span>Get Hall Ticket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAskNoticeAI(notice.title)}
                    className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[17px] text-[#0051d5]">auto_awesome</span>
                    <span>Ask AI Summary</span>
                  </button>
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <span className="material-symbols-outlined text-[28px]">find_in_page</span>
            </div>
            <p className="text-sm font-bold text-slate-900">No circulars matched</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Try adjusting your filter or search keywords to view campus announcements.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentFilter('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Notification Subscription Banner */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-200/60 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2.5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0051d5] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">notifications_active</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">Instant Circular Alerts</span>
                <span className="text-[11px] text-slate-600">
                  Get instant WhatsApp &amp; Push alerts for emergency notices
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => {
                  setWhatsappAlerts(e.target.checked);
                  setShowSubscriptionToast(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0051d5]"></div>
            </label>
          </div>

          {showSubscriptionToast && (
            <div className="bg-white p-2 px-3 rounded-xl border border-slate-200 flex items-center justify-between text-teal-800 text-[11px] font-medium shadow-2xs">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                WhatsApp alert connected: +91 98801-XXXXX
              </span>
              <button
                type="button"
                onClick={() => alert('Change alert mobile number modal')}
                className="text-[#0051d5] font-bold hover:underline"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
