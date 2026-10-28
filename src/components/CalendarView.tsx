import React, { useState } from 'react';
import { CalendarEvent, Language } from '../types/campus';
import { useOfflineStatus } from '../services/offlineSync';

interface CalendarViewProps {
  language: Language;
  events: CalendarEvent[];
  onToggleReminder: (eventId: string, noticeTime?: string) => void;
  onAskAIAboutEvent: (event: CalendarEvent) => void;
  onOpenPdf: (title: string, type: 'circular' | 'syllabus' | 'rulebook', refNo?: string) => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  language,
  events,
  onToggleReminder,
  onAskAIAboutEvent,
  onOpenPdf,
  onShowToast,
}) => {
  const { isOnline, isSyncing, syncNow } = useOfflineStatus();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReminderModalEvent, setActiveReminderModalEvent] = useState<CalendarEvent | null>(null);
  const [reminderLeadTime, setReminderLeadTime] = useState<string>('1 day before');

  // Month filters
  const months = [
    { id: 'all', label: 'All Months', labelKn: 'ಎಲ್ಲ ತಿಂಗಳು' },
    { id: '2024-10', label: 'Oct 2024', labelKn: 'ಅಕ್ಟೋಬರ್ 2024' },
    { id: '2024-11', label: 'Nov 2024', labelKn: 'ನವೆಂಬರ್ 2024' },
    { id: '2024-12', label: 'Dec 2024', labelKn: 'ಡಿಸೆಂಬರ್ 2024' },
    { id: '2025-01', label: 'Jan 2025', labelKn: 'ಜನವರಿ 2025' },
  ];

  // Category filters
  const categories = [
    { id: 'all', label: 'All Events', labelKn: 'ಎಲ್ಲವೂ', icon: 'event' },
    { id: 'exam', label: 'Exams', labelKn: 'ಪರೀಕ್ಷೆಗಳು', icon: 'edit_calendar', color: 'text-red-600 bg-red-50 border-red-200' },
    { id: 'holiday', label: 'Holidays', labelKn: 'ರಜೆಗಳು', icon: 'beach_access', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { id: 'deadline', label: 'Deadlines', labelKn: 'ಗಡುವುಗಳು', icon: 'alarm', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'academic', label: 'Academic', labelKn: 'ಶೈಕ್ಷಣಿಕ', icon: 'school', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { id: 'event', label: 'Fests', labelKn: 'ಉತ್ಸವ', icon: 'celebration', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  // Filtered event list
  const filteredEvents = events.filter((ev) => {
    const matchesMonth = selectedMonth === 'all' || ev.month === selectedMonth;
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      ev.title.toLowerCase().includes(q) ||
      ev.titleKn.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      ev.descriptionKn.toLowerCase().includes(q) ||
      (ev.venue && ev.venue.toLowerCase().includes(q));

    return matchesMonth && matchesCategory && matchesQuery;
  });

  // Active reminders
  const activeRemindersCount = events.filter((e) => e.reminderSet).length;

  // Format date helper
  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dayNum = d.getDate().toString().padStart(2, '0');
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      return { dayOfWeek, dayNum, monthShort };
    } catch {
      return { dayOfWeek: 'DAY', dayNum: '01', monthShort: 'NOV' };
    }
  };

  // Export iCalendar (.ics) file
  const handleExportIcs = (eventToExport?: CalendarEvent) => {
    const eventsList = eventToExport ? [eventToExport] : events.filter((e) => e.reminderSet);
    if (eventsList.length === 0) {
      onShowToast('No reminders selected to export. Please toggle a reminder first.', 'warning');
      return;
    }

    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Bengaluru Central Campus//Campus Help AI//EN\n';
    eventsList.forEach((ev) => {
      const dClean = ev.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDESCRIPTION:${ev.description}\nDTSTART:${dClean}\nDTEND:${dClean}\nLOCATION:${ev.venue || 'Central College Campus'}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Academic_Calendar_${Date.now()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast(`Exported ${eventsList.length} events to your device calendar (.ics)`, 'calendar_month');
  };

  const handleConfirmReminderModal = () => {
    if (!activeReminderModalEvent) return;
    onToggleReminder(activeReminderModalEvent.id, reminderLeadTime);
    onShowToast(`Reminder set for ${activeReminderModalEvent.title} (${reminderLeadTime})`, 'notifications_active');
    setActiveReminderModalEvent(null);
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Academic Banner */}
      <section className="px-4 pt-3 pb-2 flex flex-col gap-2.5">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#000f1d] via-[#102436] to-[#002925] p-4 rounded-2xl shadow-sm text-white">
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#0051d5] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-[22px]">calendar_month</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">
                    Official Gazette
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <h1 className="text-sm font-bold text-white mt-0.5">
                  Academic Calendar 2024–25
                </h1>
              </div>
            </div>
            
            {/* Service Worker Cache / Offline Sync Badge & Action */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={async () => {
                  const ok = await syncNow();
                  onShowToast(
                    ok ? 'Calendar & exam timetable cached for offline campus use!' : 'Using cached calendar events',
                    'offline_pin'
                  );
                }}
                disabled={isSyncing}
                className="px-2.5 py-1 rounded-full bg-teal-900/70 hover:bg-teal-800/80 border border-teal-500/40 text-teal-200 flex items-center gap-1 text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
                title="Service Worker offline cache status"
              >
                <span className={`material-symbols-outlined text-[13px] ${isSyncing ? 'animate-spin' : ''}`}>
                  {isSyncing ? 'sync' : isOnline ? 'offline_pin' : 'cloud_off'}
                </span>
                <span>
                  {isSyncing ? 'Caching...' : isOnline ? 'Cached Offline' : 'Offline Mode'}
                </span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-2 relative z-10 leading-relaxed">
            {language === 'kn'
              ? 'ವಿಶ್ವವಿದ್ಯಾಲಯದ ಪರೀಕ್ಷಾ ದಿನಾಂಕಗಳು, ಸರ್ಕಾರಿ ರಜೆಗಳು ಮತ್ತು ಸೆಮಿಸ್ಟರ್ ಗಡುವುಗಳ ಅಧಿಕೃತ ವೇಳಾಪಟ್ಟಿ.'
              : 'Verified odd & even semester examination dates, government holidays, and deadline alerts.'}
          </p>
        </div>

        {/* Offline on Campus notice banner when student is disconnected */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3 flex items-center justify-between text-amber-950 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-amber-900 shrink-0">
                <span className="material-symbols-outlined text-[18px]">wifi_off</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight">
                  {language === 'kn' ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯ (Offline on Campus)' : 'Offline on Campus • Cached Access Active'}
                </p>
                <p className="text-[10px] text-amber-800 truncate mt-0.5">
                  {language === 'kn'
                    ? `${events.length} ಕ್ಯಾಲೆಂಡರ್ ದಿನಾಂಕಗಳು ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಲಭ್ಯವಿವೆ`
                    : `${events.length} academic dates & deadlines served directly from service worker cache`}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0">
              PWA Ready
            </span>
          </div>
        )}

        {/* Search Input */}
        <div className="relative w-full">
          <div className="h-11 bg-white rounded-xl border border-slate-200 flex items-center px-3.5 shadow-xs gap-2.5">
            <span className="material-symbols-outlined text-[#0051d5] text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'kn'
                  ? 'ಪರೀಕ್ಷೆ, ರಜೆ ಅಥವಾ ಗಡುವು ಹುಡುಕಿ...'
                  : 'Search exam dates, holidays, deadlines...'
              }
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[17px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Month Filter Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {months.map((m) => {
            const isSelected = selectedMonth === m.id;
            const count =
              m.id === 'all'
                ? events.length
                : events.filter((e) => e.month === m.id).length;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMonth(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0051d5] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{language === 'kn' ? m.labelKn : m.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-7 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-[#000f1d] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                <span>{language === 'kn' ? cat.labelKn : cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Reminders & Sync Widget */}
      <section className="px-4 py-1">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0051d5] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">notifications_active</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  {activeRemindersCount} Active Reminders
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] text-slate-500 truncate">
                Alerts sound 1–2 days prior to examinations &amp; fee closures
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleExportIcs()}
            title="Export reminders to Google or Apple Calendar"
            className="px-2.5 py-1.5 rounded-xl bg-white border border-blue-300 hover:bg-blue-50 text-[#0051d5] text-[11px] font-bold flex items-center gap-1 shadow-2xs shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>.ICS Sync</span>
          </button>
        </div>
      </section>

      {/* Event Stream List */}
      <section className="px-4 py-2 flex flex-col gap-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((ev) => {
            const { dayOfWeek, dayNum, monthShort } = formatDateDisplay(ev.date);

            const catBadge =
              ev.category === 'exam'
                ? { label: 'Exam', color: 'bg-red-100 text-red-800 border-red-200', icon: 'edit_calendar' }
                : ev.category === 'holiday'
                ? { label: 'Holiday', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: 'beach_access' }
                : ev.category === 'deadline'
                ? { label: 'Deadline', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: 'alarm' }
                : ev.category === 'event'
                ? { label: 'Fest / Event', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'celebration' }
                : { label: 'Academic', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'school' };

            return (
              <article
                key={ev.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col gap-2.5 hover:border-blue-400 transition-all"
              >
                {/* Top Strip: Date Tile + Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual Date Tile */}
                    <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 text-center leading-none">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{monthShort}</span>
                      <span className="text-base font-bold text-slate-900 my-0.5">{dayNum}</span>
                      <span className="text-[9px] font-semibold text-[#0051d5]">{dayOfWeek}</span>
                    </div>

                    {/* Title & Category */}
                    <div className="min-w-0 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`px-2 py-0.2 rounded-full text-[9px] font-bold border uppercase flex items-center gap-0.5 ${catBadge.color}`}
                        >
                          <span className="material-symbols-outlined text-[12px]">{catBadge.icon}</span>
                          <span>{catBadge.label}</span>
                        </span>
                        {ev.time && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            <span>{ev.time}</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-xs font-bold text-slate-900 leading-snug">
                        {language === 'kn' ? ev.titleKn : ev.title}
                      </h2>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {language === 'kn' ? ev.title : ev.titleKn}
                      </p>
                    </div>
                  </div>

                  {/* Reminder Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!ev.reminderSet) {
                        setActiveReminderModalEvent(ev);
                      } else {
                        onToggleReminder(ev.id);
                        onShowToast(`Reminder cancelled for ${ev.title}`, 'notifications_off');
                      }
                    }}
                    title={ev.reminderSet ? 'Cancel reminder' : 'Set reminder'}
                    className={`h-8 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all active:scale-95 shadow-2xs ${
                      ev.reminderSet
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        ev.reminderSet ? 'text-emerald-700 animate-bounce' : 'text-slate-400'
                      }`}
                    >
                      {ev.reminderSet ? 'notifications_active' : 'add_alert'}
                    </span>
                    <span className="hidden sm:inline">
                      {ev.reminderSet ? 'Reminder On' : 'Remind'}
                    </span>
                  </button>
                </div>

                {/* Description Text */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  {language === 'kn' ? ev.descriptionKn : ev.description}
                </p>

                {/* Metadata details: Venue, Official Ref, Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                  <div className="flex items-center gap-2 truncate">
                    {ev.venue && (
                      <span className="flex items-center gap-0.5 text-slate-600 font-medium truncate">
                        <span className="material-symbols-outlined text-[13px] text-[#0051d5]">location_on</span>
                        <span className="truncate">{ev.venue}</span>
                      </span>
                    )}
                    {ev.officialRef && (
                      <span className="hidden sm:inline text-slate-400">• {ev.officialRef}</span>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAskAIAboutEvent(ev)}
                      title="Ask Campus AI about this event"
                      className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0051d5] font-semibold text-[10px] flex items-center gap-0.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                      <span>Ask AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportIcs(ev)}
                      title="Add to Google/Apple Calendar"
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] flex items-center gap-0.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[13px]">event</span>
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <span className="material-symbols-outlined text-[28px]">event_busy</span>
            </div>
            <p className="text-sm font-bold text-slate-900">No events found for this filter</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Try selecting &apos;All Months&apos; or clear the search keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedMonth('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#0051d5] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Reminder Config Bottom Sheet Modal */}
      {activeReminderModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans text-xs">
            {/* Header */}
            <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">alarm_add</span>
                <span className="font-semibold text-sm">Set Event Reminder</span>
              </div>
              <button
                onClick={() => setActiveReminderModalEvent(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 bg-slate-50">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">
                  {activeReminderModalEvent.category.toUpperCase()}
                </span>
                <h3 className="font-bold text-slate-900 text-xs">
                  {activeReminderModalEvent.title}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Scheduled Date: <strong>{activeReminderModalEvent.date}</strong> ({activeReminderModalEvent.time || 'All Day'})
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block text-[11px] mb-1">
                  Alert Lead Time
                </label>
                <select
                  value={reminderLeadTime}
                  onChange={(e) => setReminderLeadTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="1 day before">1 Day Before (at 9:00 AM)</option>
                  <option value="2 days before">2 Days Before (at 9:00 AM)</option>
                  <option value="Morning of event">Morning of Event (at 7:30 AM)</option>
                  <option value="1 hour before">1 Hour Before Scheduled Time</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl text-[11px] text-blue-900 space-y-1">
                <span className="font-bold block">Push &amp; In-App Notification</span>
                <p>
                  You will receive a notification in Campus Help AI and an instant push reminder on registered devices.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveReminderModalEvent(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReminderModal}
                className="px-4 py-1.5 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">check</span>
                <span>Activate Reminder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
