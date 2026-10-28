import React, { useState } from 'react';
import { Language, UserProfile, FAQ } from '../types/campus';

interface HomeViewProps {
  language: Language;
  currentUser: UserProfile;
  onNavigateToTab: (tab: string, prompt?: string) => void;
  onOpenPdf: (title: string, type: 'circular' | 'syllabus' | 'rulebook', refNo?: string) => void;
  onOpenFeePortal: () => void;
  onOpenHallTicket: () => void;
  onOpenCounselor: () => void;
  onOpenInstall?: () => void;
  faqs: FAQ[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  currentUser,
  onNavigateToTab,
  onOpenPdf,
  onOpenFeePortal,
  onOpenHallTicket,
  onOpenCounselor,
  onOpenInstall,
  faqs,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPlaceholder, setRecordingPlaceholder] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Handle Voice Search / Speech Recognition
  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setRecordingPlaceholder(
      language === 'kn'
        ? 'ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... (ಮಾತನಾಡಿ)'
        : 'Listening in Kannada or English... (Speak now)'
    );

    // Try native browser Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'kn' ? 'kn-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchInput(transcript);
          setIsRecording(false);
          onNavigateToTab('chat', transcript);
        };

        recognition.onerror = () => {
          simulateVoiceInput();
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition start failed, simulating:', e);
      }
    }

    simulateVoiceInput();
  };

  const simulateVoiceInput = () => {
    setTimeout(() => {
      setIsRecording(false);
      const simulatedText =
        language === 'kn'
          ? 'ಶನಿವಾರ ಲೈಬ್ರರಿ ಎಷ್ಟು ಗಂಟೆಗೆ ಮುಚ್ಚುತ್ತದೆ?'
          : 'What is the fee payment deadline for 3rd semester?';
      setSearchInput(simulatedText);
      setTimeout(() => {
        onNavigateToTab('chat', simulatedText);
      }, 700);
    }, 2400);
  };

  // Lens / OCR feedback
  const handleLensTrigger = () => {
    setSearchInput('Interpreting scanned Circular #KA-2024/88...');
    setTimeout(() => {
      onNavigateToTab('chat', 'Summarize Odd Semester Exam Form submission rules from scanned circular.');
    }, 900);
  };

  // Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigateToTab('chat', searchInput.trim());
    }
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Greeting & Live Pulse Section */}
      <section className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#89f5e7] text-[#00201d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e9b8f] animate-pulse mr-1"></span>
                {currentUser.semester || 'Academic Session • Active'}
              </span>
              <span className="text-slate-500 text-[11px]">Bengaluru Central</span>
            </div>

            <h1 className="text-2xl font-bold text-[#000f1d] tracking-tight flex items-center gap-1">
              {language === 'kn' ? (
                <>ನಮಸ್ಕಾರ, {currentUser.name.split(' ')[0]}! <span className="animate-bounce">👋</span></>
              ) : (
                <>Namaskara, {currentUser.name.split(' ')[0]}! <span className="animate-bounce">👋</span></>
              )}
            </h1>

            <p className="text-xs text-slate-600 mt-0.5">
              What do you need assistance with today?
              <span className="block text-slate-800 font-medium text-[11px]">
                (ನಿಮಗೆ ಇಂದು ಯಾವ ಸಹಾಯ ಬೇಕು?)
              </span>
            </p>
          </div>

          <div className="shrink-0">
            <div className="relative w-12 h-12 rounded-2xl bg-[#dce9ff] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#0051d5] text-[28px]">shield</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0051d5] rounded-full ring-2 ring-white"></span>
            </div>
          </div>
        </div>

        {/* AI Omni Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-3.5 relative">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 p-2 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#dbe1ff]/60 flex items-center justify-center text-[#0051d5] shrink-0">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={
                  recordingPlaceholder ||
                  (language === 'kn'
                    ? 'ಶುಲ್ಕ, ಹಾಲ್ ಟಿಕೆಟ್, ಲೈಬ್ರರಿ ಸಮಯ ಕೇಳಿ...'
                    : 'Ask timings, fees, BCA/MBA, hall ticket...')
                }
                className="w-full bg-transparent border-0 p-0 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none"
              />
              <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                <span className="text-[10px] text-[#0051d5] font-semibold">
                  ಕನ್ನಡ ಅಥವಾ English
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] text-slate-400">Instant Answer</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleLensTrigger}
                title="Scan Notice with Camera Lens"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">photo_camera</span>
              </button>

              <button
                type="button"
                onClick={handleVoiceToggle}
                title="Bilingual Voice Query"
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 ${
                  isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-[#0051d5] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {isRecording ? 'graphic_eq' : 'mic'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </section>


      {/* Urgent University Circular Alert */}
      <section className="px-4 py-1.5">
        <div className="bg-gradient-to-r from-red-50 to-rose-100/60 border border-red-200 rounded-2xl p-3 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase">
                  Urgent
                </span>
                <span className="text-[11px] text-red-900 font-semibold">Circular #KA-2024/88</span>
              </div>
              <h2 className="text-xs font-bold text-slate-900 leading-snug">
                Odd Semester Exam Form Submission Deadline
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                Regular registration closes Nov 10 without penalty. Hall tickets release Nov 14.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenFeePortal}
                  className="px-3 py-1.5 bg-[#000f1d] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>Apply Online</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenPdf('Odd Semester Exam Form Submission Circular', 'circular', 'Circular #KA-2024/88')
                  }
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
                >
                  Read PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Campus Status Dual Ticker */}
      <section className="px-4 py-2">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: College Timing */}
          <div
            onClick={() => onNavigateToTab('chat', 'What are the current campus and library timings?')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#89f5e7] text-[#00201d] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#1e9b8f] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#1e9b8f] animate-ping"></span>
                  Open Now
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Campus Hours</div>
              <div className="text-sm font-bold text-[#000f1d] mt-0.5">8:30 AM – 5:00 PM</div>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[10px]">
              <span>Main Gates Open</span>
              <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </div>
          </div>

          {/* Card 2: Next Exam Milestone */}
          <div
            onClick={() => onNavigateToTab('calendar')}
            className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex flex-col justify-between cursor-pointer hover:border-blue-400 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#dbe1ff] text-[#0051d5] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">event_upcoming</span>
                </div>
                <span className="text-[10px] text-[#0051d5] font-bold bg-[#dbe1ff]/60 px-1.5 py-0.5 rounded-full">
                  12 Days Left
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Odd Sem Exams</div>
              <div className="text-sm font-bold text-[#000f1d] mt-0.5">Nov 18, 2024</div>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[10px]">
              <span>Timetable Released</span>
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Language & Topic Pills */}
      <section className="px-4 py-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedTopic('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-all ${
              selectedTopic === 'all'
                ? 'bg-[#000f1d] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700'
            }`}
          >
            <span>All Inquiries</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('fees');
              onNavigateToTab('chat', 'What are the semester fee installment dates and payment methods?');
            }}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 shrink-0 shadow-xs flex items-center gap-1"
          >
            <span>ಶುಲ್ಕ ವಿವರ (Fees)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('exams');
              onNavigateToTab('chat', 'When is the odd semester theory exam timetable and hall ticket release?');
            }}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 shrink-0 shadow-xs flex items-center gap-1"
          >
            <span>ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ (Exams)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('hostel');
              onNavigateToTab('chat', 'What are the campus gate closing hours and hostel rules?');
            }}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 shrink-0 shadow-xs flex items-center gap-1"
          >
            <span>ವಿದ್ಯಾರ್ಥಿ ನಿಲಯ (Hostel)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('admissions');
              onOpenCounselor();
            }}
            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 shrink-0 shadow-xs flex items-center gap-1"
          >
            <span>ದಾಖಲಾತಿ (Admissions)</span>
          </button>
        </div>
      </section>

      {/* Quick Access 2x3 University Desks Grid */}
      <section className="px-4 pt-2 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-base font-bold text-[#000f1d]">University Desks</h2>
            <p className="text-[11px] text-slate-500">Direct portals, policies, and AI assistants</p>
          </div>
          <span className="text-xs text-[#0051d5] font-semibold">6 Services</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Desk 1: College Timings */}
          <div
            onClick={() => onNavigateToTab('chat', 'What are the central library and administrative office timings?')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-2.5 group-hover:bg-[#000f1d] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">hourglass_top</span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-tight">College Timings</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                Library, Registrar Office, IT &amp; Science Labs
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                Live shifts
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Desk 2: Course Catalog */}
          <div
            onClick={() => onNavigateToTab('courses')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#dbe1ff] text-[#0051d5] flex items-center justify-center mb-2.5 group-hover:bg-[#0051d5] group-hover:text-white transition-colors">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  menu_book
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-tight">Course Catalog</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                BCA, BBA, MCA, MBA NEP 2020 syllabi &amp; credits
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0051d5] bg-blue-50 px-2 py-0.5 rounded-full">
                NEP Curricula
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Desk 3: Fee Counter */}
          <div
            onClick={onOpenFeePortal}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#89f5e7] text-[#00201d] flex items-center justify-center mb-2.5 group-hover:bg-[#00201d] group-hover:text-[#89f5e7] transition-colors">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_balance_wallet
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-tight">Fee Counter</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                SBI Collect challan, UPI receipt &amp; concession
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                Due Nov 15
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Desk 4: Examinations */}
          <div
            onClick={onOpenHallTicket}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-2.5 group-hover:bg-[#000f1d] group-hover:text-white transition-colors">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  assignment_turned_in
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-tight">Examinations</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                Hall tickets, seating map, marks &amp; revaluation
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0051d5] bg-blue-50 px-2 py-0.5 rounded-full">
                New Timetable
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Desk 5: Admissions 2025 */}
          <div
            onClick={onOpenCounselor}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center mb-2.5 group-hover:bg-[#0051d5] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-tight">Admissions 2025</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                Eligibility criteria, quota cutoffs &amp; SSP grants
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                SSP Portal
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
          </div>

          {/* Desk 6: College Rules */}
          <div
            onClick={() => onOpenPdf('Campus Conduct & Academic Rules Handbook', 'rulebook', 'Ordinance §14.2')}
            className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center mb-2.5 group-hover:bg-red-700 group-hover:text-white transition-colors">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  gavel
                </span>
              </div>
              <h3 className="font-bold text-xs text-slate-900 leading-tight">College Rules</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                75% attendance policy, anti-ragging &amp; dress code
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                Mandatory 75%
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Quick Spark Prompts Carousel / FAQs */}
      <section className="px-4 pt-1 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#0051d5] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <h2 className="text-base font-bold text-[#000f1d]">Frequently Asked</h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Tap to ask AI</span>
        </div>

        <div className="flex flex-col gap-2">
          {faqs.slice(0, 3).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onNavigateToTab('chat', f.question)}
              className="w-full text-left bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all flex items-center justify-between gap-3 group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0051d5] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[17px]">
                    {f.category === 'timings'
                      ? 'local_library'
                      : f.category === 'fees'
                      ? 'school'
                      : 'science'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {language === 'kn' ? f.questionKn : f.question}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {language === 'kn' ? f.question : f.questionKn}
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-[#000f1d] group-hover:text-white transition-colors shrink-0">
                <span className="material-symbols-outlined text-[14px]">send</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Live Assistant Sample Showcase Preview Card */}
      <section className="px-4 pb-2">
        <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0051d5] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              </div>
              <span className="text-xs font-bold text-slate-900">Live Assistant Sample</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-teal-800 bg-[#89f5e7]/40 px-2 py-0.5 rounded-full font-bold">
              <span className="material-symbols-outlined text-[13px]">verified</span> Verified Source
            </span>
          </div>

          <div className="space-y-2">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-[#0f2537] text-white px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] text-xs shadow-xs">
                Where can I download BCA 3rd Sem Data Structures syllabus?
              </div>
            </div>

            {/* Bot message */}
            <div className="flex justify-start">
              <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-xs max-w-[92%] border border-slate-200 text-xs shadow-xs space-y-2">
                <p className="leading-relaxed">
                  BCA NEP Scheme syllabus for <strong>CS301 Data Structures with C</strong> is available under Department of Computer Applications.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-red-500 text-[20px]">picture_as_pdf</span>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-bold text-slate-900 truncate">
                        BCA_Sem3_DS_2024.pdf
                      </span>
                      <span className="text-[9px] text-slate-400">1.2 MB • NEP Regulation</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenPdf('BCA NEP Scheme - CS301 Data Structures Syllabus', 'syllabus', 'NEP 2020')
                    }
                    className="px-2.5 py-1 bg-[#0051d5] hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0"
                  >
                    <span className="material-symbols-outlined text-[13px]">download</span>
                    <span>Get</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-medium">Multilingual speech &amp; text enabled</span>
            <button
              type="button"
              onClick={() => onNavigateToTab('chat')}
              className="px-3 py-1.5 bg-[#0051d5] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <span>Ask Custom Question</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
