import React, { useState, useEffect } from 'react';
import { Language, UserProfile, Course, FAQ, Notice, EscalatedQuery, CalendarEvent } from './types/campus';
import { supabaseService, STUDENT_USER, ADMIN_USER } from './services/supabase';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { AIChatView } from './components/AIChatView';
import { CalendarView } from './components/CalendarView';
import { CoursesView } from './components/CoursesView';
import { NoticesView } from './components/NoticesView';
import { AdminView } from './components/AdminView';

// Modals
import { PdfViewerModal } from './components/modals/PdfViewerModal';
import { HallTicketModal } from './components/modals/HallTicketModal';
import { FeePaymentModal } from './components/modals/FeePaymentModal';
import { SmartCounselorModal } from './components/modals/SmartCounselorModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { AddFaqModal } from './components/modals/AddFaqModal';
import { AuditLogModal } from './components/modals/AuditLogModal';
import { InstallGuideModal } from './components/modals/InstallGuideModal';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOfflineStatus } from './services/offlineSync';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [currentUser, setCurrentUser] = useState<UserProfile>(STUDENT_USER);
  const [frameMode, setFrameMode] = useState<'mobile' | 'tablet' | 'full'>('mobile');
  const isMobileFrame = frameMode !== 'full';
  const { isOnline } = useOfflineStatus();

  const handleToggleRotate = () => {
    setFrameMode((prev) => {
      if (prev === 'mobile') return 'tablet';
      if (prev === 'tablet') return 'full';
      return 'mobile';
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // PWA Install hook
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [escalations, setEscalations] = useState<EscalatedQuery[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Navigation prompt to AI Chat
  const [initialChatPrompt, setInitialChatPrompt] = useState<string>('');

  // Modals state
  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean;
    title: string;
    type: 'circular' | 'syllabus' | 'rulebook';
    refNo?: string;
  }>({
    isOpen: false,
    title: '',
    type: 'circular',
  });
  const [isHallTicketOpen, setIsHallTicketOpen] = useState(false);
  const [isFeePortalOpen, setIsFeePortalOpen] = useState(false);
  const [isCounselorOpen, setIsCounselorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ visible: boolean; message: string; icon: string }>({
    visible: false,
    message: '',
    icon: 'check_circle',
  });

  const showToast = (message: string, icon: string = 'check_circle') => {
    setToast({ visible: true, message, icon });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  const loadData = async () => {
    const loadedCourses = await supabaseService.getCourses();
    const loadedFaqs = await supabaseService.getFaqs();
    const loadedNotices = await supabaseService.getNotices();
    const loadedEscalations = await supabaseService.getEscalatedQueries();
    const loadedCalendar = await supabaseService.getCalendarEvents();
    const activeUsr = supabaseService.getActiveUser();

    setCourses(loadedCourses);
    setFaqs(loadedFaqs);
    setNotices(loadedNotices);
    setEscalations(loadedEscalations);
    setCalendarEvents(loadedCalendar);
    setCurrentUser(activeUsr);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleLanguage = () => {
    const next = language === 'en' ? 'kn' : 'en';
    setLanguage(next);
    showToast(next === 'kn' ? 'ಭಾಷೆ: ಕನ್ನಡಕ್ಕೆ ಬದಲಾಗಿದೆ' : 'Language set to English', 'translate');
  };

  const handleSwitchUser = (role: 'student' | 'admin') => {
    const updated = supabaseService.switchUser(role);
    setCurrentUser(updated);
    if (role === 'admin') {
      setCurrentTab('admin');
      showToast('Logged in as Admin (Prof. S. Sharma)', 'admin_panel_settings');
    } else {
      setCurrentTab('home');
      showToast('Logged in as Student (Rahul S.)', 'school');
    }
  };

  const handleNavigateToTab = (tab: string, prompt?: string) => {
    if (prompt) {
      setInitialChatPrompt(prompt);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPdf = (
    title: string,
    type: 'circular' | 'syllabus' | 'rulebook',
    refNo?: string
  ) => {
    setPdfModal({
      isOpen: true,
      title,
      type,
      refNo,
    });
  };

  const handleSaveFaq = async (newFaq: Omit<FAQ, 'id'>) => {
    await supabaseService.addFaq(newFaq);
    showToast('FAQ and verified rule added into pgvector!', 'verified');
    loadData();
  };

  const handleAddNotice = async (newNotice: Omit<Notice, 'id'>) => {
    await supabaseService.addNotice(newNotice);
    loadData();
  };

  const handleToggleReminder = async (eventId: string, noticeTime?: string) => {
    const res = await supabaseService.toggleCalendarEventReminder(eventId, noticeTime);
    if (res) {
      const updatedEvents = await supabaseService.getCalendarEvents();
      setCalendarEvents(updatedEvents);
      showToast(
        res.isSet
          ? `Reminder set for ${res.event.title} (${res.event.reminderNoticeTime || '1 day before'})`
          : `Reminder cancelled for ${res.event.title}`,
        res.isSet ? 'notifications_active' : 'notifications_off'
      );
    }
  };

  const handleAskAIAboutEvent = (event: CalendarEvent) => {
    const prompt =
      language === 'kn'
        ? `"${event.titleKn}" (${event.date}) ಬಗ್ಗೆ ಅಧಿಕೃತ ನಿಯಮಗಳು ಮತ್ತು ಸಿದ್ಧತೆಗಳೇನು?`
        : `Tell me official guidelines, timetable details, and preparation checklist for "${event.title}" on ${event.date}.`;
    handleNavigateToTab('chat', prompt);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        showToast('Campus Help AI installed successfully!', 'check_circle');
        return;
      }
    }
    setIsInstallOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#06121e] text-slate-900 flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 select-none">
      {/* Top Companion Bar aligned directly under AI Studio dashboard (preview, code, artifacts, rotate and refresh) */}
      <aside
        aria-label="Preview Dashboard Controls"
        className="w-full max-w-[440px] sm:max-w-xl mx-auto mb-2.5 px-3 py-1.5 rounded-2xl sm:rounded-full bg-[#0a1829]/95 border border-blue-900/50 shadow-xl backdrop-blur-md flex items-center justify-between text-slate-300 z-50 shrink-0"
      >
        <div className="flex items-center gap-2 pl-1">
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="font-semibold text-xs tracking-tight text-white">Campus Help AI</span>
          <span className={`hidden xs:inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${
            isOnline
              ? 'text-blue-300 bg-blue-950/90 border-blue-800/40'
              : 'text-amber-300 bg-amber-950/90 border-amber-800/40'
          }`}>
            {isOnline ? 'Online Synced' : 'Campus Offline (Cached)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Prominent Install Button */}
          <button
            type="button"
            onClick={handleInstallClick}
            className="h-7.5 px-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ring-1 ring-blue-300/40 cursor-pointer"
            title="Install Campus Help AI as PWA on Phone or Desktop"
          >
            <span className="material-symbols-outlined text-[16px]">download_for_offline</span>
            <span>Install</span>
          </button>

          {/* Rotate / Orientation button */}
          <button
            type="button"
            onClick={handleToggleRotate}
            className="h-7.5 w-7.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
            title={`Rotate View (Current: ${frameMode})`}
          >
            <span className="material-symbols-outlined text-[16px]">screen_rotation</span>
          </button>

          {/* Refresh App button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="h-7.5 w-7.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
            title="Refresh App"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </aside>

      {/* Outer viewport container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col bg-[#f8f9ff] ${
          frameMode === 'mobile'
            ? 'sm:max-w-[440px] sm:h-[890px] sm:rounded-[42px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.5)] sm:border-[8px] sm:border-[#1a2530] overflow-hidden'
            : frameMode === 'tablet'
            ? 'sm:max-w-[780px] sm:h-[640px] sm:rounded-[36px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.5)] sm:border-[8px] sm:border-[#1a2530] overflow-hidden'
            : 'max-w-2xl min-h-screen sm:shadow-2xl sm:rounded-2xl overflow-hidden'
        }`}
      >
        {/* Mobile Top Bezel / Status Bar (Only in framed mode) */}
        {isMobileFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-slate-800 bg-[#f8f9ff] select-none z-50">
            <span>10:14</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[13px]">wifi</span>
              <span className="material-symbols-outlined text-[14px]">battery_full</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          currentTab={currentTab}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          currentUser={currentUser}
          onOpenProfile={() => setIsProfileOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={handleToggleRotate}
          onOpenInstall={handleInstallClick}
          isInstalled={isInstalled}
          onRefresh={handleRefresh}
          isOnline={isOnline}
        />

        {/* Scrollable Main Views Area */}
        <main className="flex-1 overflow-y-auto overscroll-contain flex flex-col relative w-full">
          {currentTab === 'home' && (
            <HomeView
              language={language}
              currentUser={currentUser}
              onNavigateToTab={handleNavigateToTab}
              onOpenPdf={handleOpenPdf}
              onOpenFeePortal={() => setIsFeePortalOpen(true)}
              onOpenHallTicket={() => setIsHallTicketOpen(true)}
              onOpenCounselor={() => setIsCounselorOpen(true)}
              onOpenInstall={() => setIsInstallOpen(true)}
              faqs={faqs}
            />
          )}

          {currentTab === 'chat' && (
            <AIChatView
              language={language}
              onToggleLanguage={handleToggleLanguage}
              currentUser={currentUser}
              initialPrompt={initialChatPrompt}
              onOpenPdf={handleOpenPdf}
              onOpenFeePortal={() => setIsFeePortalOpen(true)}
              onOpenHallTicket={() => setIsHallTicketOpen(true)}
              onOpenRules={() => handleOpenPdf('Campus Conduct & Academic Rules', 'rulebook')}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              language={language}
              events={calendarEvents}
              onToggleReminder={handleToggleReminder}
              onAskAIAboutEvent={handleAskAIAboutEvent}
              onOpenPdf={handleOpenPdf}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'courses' && (
            <CoursesView
              language={language}
              courses={courses}
              onOpenPdf={handleOpenPdf}
              onOpenCounselor={() => setIsCounselorOpen(true)}
              onAskCourseAI={(courseCode, prompt) => handleNavigateToTab('chat', prompt)}
            />
          )}

          {currentTab === 'notices' && (
            <NoticesView
              language={language}
              notices={notices}
              onOpenPdf={handleOpenPdf}
              onOpenHallTicket={() => setIsHallTicketOpen(true)}
              onAskNoticeAI={(title) =>
                handleNavigateToTab('chat', `Summarize official guidelines and important dates for: "${title}"`)
              }
            />
          )}

          {currentTab === 'admin' && (
            <AdminView
              language={language}
              currentUser={currentUser}
              escalations={escalations}
              onOpenAddFaq={() => setIsAddFaqOpen(true)}
              onOpenAuditLog={() => setIsAuditLogOpen(true)}
              onAddNotice={handleAddNotice}
              onRefreshData={loadData}
              onShowToast={showToast}
            />
          )}
        </main>

        {/* Docked Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => handleNavigateToTab(tab)}
          pendingEscalationsCount={escalations.filter((e) => e.status === 'pending').length}
        />

        {/* Mobile Home Bar Pill Indicator */}
        {isMobileFrame && (
          <div className="hidden sm:flex justify-center pb-1 bg-white select-none z-50">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        )}

        {/* Toast Notification Container */}
        <div
          className={`fixed sm:absolute bottom-20 left-4 right-4 z-50 transition-all duration-300 pointer-events-none ${
            toast.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-[#000f1d] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700/60 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#89f5e7] text-[20px]">
                {toast.icon}
              </span>
              <span className="text-xs font-semibold leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        <PdfViewerModal
          isOpen={pdfModal.isOpen}
          onClose={() => setPdfModal((prev) => ({ ...prev, isOpen: false }))}
          title={pdfModal.title}
          documentType={pdfModal.type}
          referenceNo={pdfModal.refNo}
        />

        <HallTicketModal
          isOpen={isHallTicketOpen}
          onClose={() => setIsHallTicketOpen(false)}
        />

        <FeePaymentModal
          isOpen={isFeePortalOpen}
          onClose={() => setIsFeePortalOpen(false)}
        />

        <SmartCounselorModal
          isOpen={isCounselorOpen}
          onClose={() => setIsCounselorOpen(false)}
          onNavigateToChat={(prompt) => handleNavigateToTab('chat', prompt)}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onOpenInstall={handleInstallClick}
        />

        <AddFaqModal
          isOpen={isAddFaqOpen}
          onClose={() => setIsAddFaqOpen(false)}
          onSave={handleSaveFaq}
        />

        <AuditLogModal
          isOpen={isAuditLogOpen}
          onClose={() => setIsAuditLogOpen(false)}
        />

        <InstallGuideModal
          isOpen={isInstallOpen}
          onClose={() => setIsInstallOpen(false)}
          language={language}
          onTriggerInstall={install}
          isInstallable={isInstallable}
          isIOS={isIOS}
          isAndroid={isAndroid}
        />
      </div>
    </div>
  );
}
