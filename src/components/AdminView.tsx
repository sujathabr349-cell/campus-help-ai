import React, { useState } from 'react';
import { Language, UserProfile, EscalatedQuery, FAQ, Notice } from '../types/campus';
import { supabaseService } from '../services/supabase';
import { translateToKannada } from '../services/geminiService';

interface AdminViewProps {
  language: Language;
  currentUser: UserProfile;
  escalations: EscalatedQuery[];
  onOpenAddFaq: () => void;
  onOpenAuditLog: () => void;
  onAddNotice: (notice: Omit<Notice, 'id'>) => void;
  onRefreshData: () => void;
  onShowToast: (message: string, icon?: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  language,
  currentUser,
  escalations,
  onOpenAddFaq,
  onOpenAuditLog,
  onAddNotice,
  onRefreshData,
  onShowToast,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<
    'exams' | 'circulars' | 'events' | 'placements' | 'holidays'
  >('circulars');
  const [targetAudience, setTargetAudience] = useState('All Students & Staff');
  const [autoKannada, setAutoKannada] = useState(true);
  const [triggerPush, setTriggerPush] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Resolving ticket state
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [answerDraft, setAnswerDraft] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Timings modal toggle
  const [showTimingsEditor, setShowTimingsEditor] = useState(false);
  const [librarySaturdayHours, setLibrarySaturdayHours] = useState('9:00 AM – 1:30 PM');

  // Handle Review & Add Answer
  const handleOpenAnswerModal = (ticketId: string) => {
    setActiveTicketId(ticketId);
    setAnswerDraft(
      'Special verification slips for BMTC sports quota are issued at Director of Physical Education desk (Room #108) between 11:00 AM and 1:30 PM with state medal certificate.'
    );
  };

  const handleSaveAnswerToFaq = async (ticket: EscalatedQuery) => {
    if (!answerDraft.trim()) return;
    setIsSubmittingAnswer(true);

    try {
      // 1. Add as verified FAQ in Supabase
      await supabaseService.addFaq({
        question: ticket.query.replace(/[“"”]/g, ''),
        questionKn: `ಕ್ರೀಡಾ ಕೋಟಾ ರಿಯಾಯಿತಿ: ${ticket.query.replace(/[“"”]/g, '')}`,
        answer: answerDraft.trim(),
        answerKn: `ಅಧಿಕೃತ ನಿಯಮ: ${answerDraft.trim()}`,
        category: 'rules',
        verifiedSource: 'Student Welfare & Sports Council Resolution',
      });

      // 2. Resolve escalation ticket
      await supabaseService.resolveEscalatedQuery(ticket.id, answerDraft.trim());

      onShowToast('Answer draft added to Knowledge Vector Database.', 'verified');
      setActiveTicketId(null);
      setAnswerDraft('');
      onRefreshData();
    } catch (e) {
      console.error(e);
      onShowToast('Failed to save answer.', 'error');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Handle Assign to Exam Cell
  const handleAssignTicket = async (ticketId: string) => {
    await supabaseService.assignEscalatedQuery(ticketId, 'Exam Controller Desk #4');
    onShowToast('Ticket routed to Exam Controller Desk #4.', 'forward_to_inbox');
    onRefreshData();
  };

  // Handle Broadcast Submission
  const handleBroadcast = async () => {
    if (!broadcastTitle.trim()) {
      onShowToast('Please specify announcement title first.', 'warning');
      return;
    }

    setIsBroadcasting(true);
    try {
      let knTitle = '';
      if (autoKannada) {
        knTitle = await translateToKannada(broadcastTitle);
      }

      await onAddNotice({
        title: broadcastTitle.trim(),
        kannadaTitle: knTitle || undefined,
        category: broadcastCategory,
        publishedAt: 'Just now',
        officialBadge: 'Registrar',
        content: `Official notice broadcasted to ${targetAudience}. Please check college portal for digitally signed circular.`,
        kannadaContent: knTitle ? `ಅಧಿಕೃತ ಪ್ರಕಟಣೆ: ${knTitle}` : undefined,
      });

      onShowToast(
        triggerPush
          ? 'Urgent alert broadcasted to 4,290 registered devices!'
          : 'Circular published to Notice Board.',
        'campaign'
      );
      setBroadcastTitle('');
    } catch (e) {
      console.error(e);
      onShowToast('Broadcast failed.', 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Handle PDF file upload simulation
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onShowToast(`Circular "${file.name}" queued for Gemini indexing.`, 'upload_file');
      supabaseService.logAuditEvent(`Uploaded circular PDF "${file.name}" - parsed 8 clauses into pgvector`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-28">
      <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
        {/* Staff Identity & Security Clearance Strip */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#0051d5] shrink-0">
                <span className="material-symbols-outlined text-[24px]">shield_person</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-slate-900 truncate">
                    {currentUser.role === 'admin' ? currentUser.name : 'Prof. S. Sharma'}
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-blue-100 text-[#0051d5] text-[10px] font-bold">
                    HOD / Admin Desk
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Faculty ID: KA-ADM-4092 • Bengaluru Central Campus
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-[10px] font-bold">Active Session</span>
            </div>
          </div>

          {/* Security Sync Banner */}
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#0051d5] text-[17px] shrink-0">lock</span>
              <span className="text-xs truncate font-medium">
                Supabase RLS Active • Gemini AI Grounding Synced
              </span>
            </div>
            <span
              onClick={onOpenAuditLog}
              className="text-xs text-[#0051d5] font-bold shrink-0 cursor-pointer hover:underline"
            >
              Audit Log
            </span>
          </div>
        </div>

        {/* Quick Metrics Deck */}
        <div className="grid grid-cols-1 gap-2.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Indexed Knowledge
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900">342</span>
                <span className="text-xs text-teal-700 font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> Verified FAQs
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5">Bilingual vectors primed</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">menu_book</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Today&apos;s Queries</span>
                <span className="material-symbols-outlined text-[#0051d5] text-[17px]">forum</span>
              </div>
              <div className="mt-1.5">
                <span className="text-xl font-bold text-slate-900">1,280</span>
                <div className="flex items-center gap-1 mt-0.5 text-teal-700 text-[10px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  <span>98.4% auto-resolved</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-red-600 font-medium">Desk Escalations</span>
                <span className="material-symbols-outlined text-red-600 text-[17px]">priority_high</span>
              </div>
              <div className="mt-1.5">
                <span className="text-xl font-bold text-slate-900">{escalations.length}</span>
                <div className="flex items-center gap-1 mt-0.5 text-red-600 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  <span>Needs staff review</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Manage College Knowledge Base */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5] text-[22px]">database</span>
              <h2 className="text-sm font-bold text-slate-900">Manage Knowledge Base</h2>
            </div>
            <span className="text-[10px] text-[#0051d5] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
              Gemini 3.8 Flash
            </span>
          </div>

          <p className="text-xs text-slate-500 -mt-1 leading-relaxed">
            Teach the AI university rules, fee timetables, and academic circulars. Grounded updates sync instantly across student apps.
          </p>

          <div className="flex flex-col gap-2">
            {/* Action 1: Add Verified FAQ */}
            <button
              type="button"
              onClick={onOpenAddFaq}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0051d5] shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[19px]">add_task</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#0051d5] truncate">
                    + Add Verified FAQ / Rule
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    Define structured Q&amp;A pair in English or Kannada
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px] group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </button>

            {/* Action 2: Upload Official Circular PDF */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0051d5] shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[19px]">upload_file</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900">Upload Official Circular PDF</span>
                  <span className="text-[10px] text-slate-500">Auto-vectorized into Supabase Embeddings</span>
                </div>
              </div>

              <label className="p-3 rounded-xl bg-white border-dashed border-2 border-slate-300 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/40 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-[#0051d5] text-[26px] mb-0.5">
                  cloud_upload
                </span>
                <span className="text-xs font-bold text-slate-900">Tap to select notification file</span>
                <span className="text-[10px] text-slate-400">Exam circulars, fee schedules (Max 25MB)</span>
              </label>
            </div>

            {/* Action 3: Update Timings & Fee Deadlines */}
            <button
              type="button"
              onClick={() => setShowTimingsEditor(!showTimingsEditor)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-all text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0051d5] shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-[19px]">event_repeat</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#0051d5] truncate">
                    Update Timings &amp; Fee Deadlines
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
                    Library, hostel gates, Odd-Semester fees portal
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                {showTimingsEditor ? 'expand_less' : 'chevron_right'}
              </span>
            </button>

            {showTimingsEditor && (
              <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-2 text-xs animate-fadeIn">
                <label className="font-bold text-slate-800 block text-[11px]">
                  Saturday Library Hours Override
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={librarySaturdayHours}
                    onChange={(e) => setLibrarySaturdayHours(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(`Updated library Saturday hours to: ${librarySaturdayHours}`, 'schedule');
                      setShowTimingsEditor(false);
                    }}
                    className="px-3 py-1.5 bg-[#0051d5] text-white rounded-lg font-bold text-xs"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Escalated Queries Queue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[22px]">inbox</span>
              <h2 className="text-sm font-bold text-slate-900">Escalated Queries Queue</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
              {escalations.filter((e) => e.status === 'pending').length} Pending
            </span>
          </div>

          <p className="text-xs text-slate-500 -mt-1 leading-relaxed">
            Queries where Gemini AI requested human administrative confirmation before advising students.
          </p>

          <div className="flex flex-col gap-2.5">
            {escalations.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all ${
                  ticket.status === 'resolved'
                    ? 'bg-emerald-50/40 border-emerald-200 opacity-80'
                    : ticket.status === 'assigned'
                    ? 'bg-blue-50/40 border-blue-200 opacity-90'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                    {ticket.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{ticket.timeAgo}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Student Query:</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">{ticket.query}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 text-[11px]">
                    <span className="material-symbols-outlined text-[15px] text-slate-400">account_circle</span>
                    <span>
                      {ticket.studentName} (USN: {ticket.usn}) • {ticket.semester}
                    </span>
                  </div>
                </div>

                {ticket.status === 'pending' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenAnswerModal(ticket.id)}
                      className="flex-1 h-9 px-3 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[17px]">rate_review</span>
                      <span>Review &amp; Add Answer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAssignTicket(ticket.id)}
                      className="h-9 px-3 rounded-xl bg-[#000f1d] hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1"
                      title="Assign to Exam Cell"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span className="hidden sm:inline">Assign</span>
                    </button>
                  </div>
                ) : ticket.status === 'assigned' ? (
                  <div className="p-2 bg-blue-100/70 rounded-lg text-[11px] text-blue-900 font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">forward_to_inbox</span>
                    <span>Assigned to {ticket.assignedTo}</span>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-100/70 rounded-lg text-[11px] text-emerald-900 font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">done_all</span>
                    <span>Answer Indexed into Grounded Vector DB</span>
                  </div>
                )}

                {/* Inline modal / drawer to submit answer for this ticket */}
                {activeTicketId === ticket.id && (
                  <div className="p-3 bg-white border border-blue-300 rounded-xl space-y-2 mt-1 animate-fadeIn">
                    <label className="font-bold text-slate-800 text-[11px] block">
                      Compose Verified Answer (Will be indexed into Grounding Database):
                    </label>
                    <textarea
                      rows={3}
                      value={answerDraft}
                      onChange={(e) => setAnswerDraft(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTicketId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSubmittingAnswer}
                        onClick={() => handleSaveAnswerToFaq(ticket)}
                        className="px-3.5 py-1 rounded-lg bg-[#0051d5] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        {isSubmittingAnswer ? (
                          <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                        <span>Index &amp; Resolve</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Broadcast Urgent Campus Alert */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0051d5] text-[22px]">campaign</span>
              <h2 className="text-sm font-bold text-slate-900">Broadcast Campus Alert</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              Push + Circular
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g., Heavy Rainfall Holiday / Hall Ticket Release"
                className="w-full h-11 px-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 text-xs focus:bg-white focus:border-blue-600 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white"
                >
                  <option value="circulars">Urgent Circular</option>
                  <option value="exams">Examination</option>
                  <option value="holidays">Holiday Notice</option>
                  <option value="events">Cultural / Fest</option>
                  <option value="placements">Placements</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:bg-white"
                >
                  <option>All Students &amp; Staff</option>
                  <option>UG Students Only</option>
                  <option>PG Students Only</option>
                  <option>Hostel Residents</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoKannada}
                  onChange={(e) => setAutoKannada(e.target.checked)}
                  className="rounded text-[#0051d5] accent-[#0051d5] w-4 h-4"
                />
                <span className="text-xs text-slate-800">
                  Auto-generate Kannada version (ಕನ್ನಡ ಅನುವಾದ)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={triggerPush}
                  onChange={(e) => setTriggerPush(e.target.checked)}
                  className="rounded text-[#0051d5] accent-[#0051d5] w-4 h-4"
                />
                <span className="text-xs text-slate-800">
                  Trigger instant push notification &amp; SMS emergency broadcast
                </span>
              </label>
            </div>

            <button
              type="button"
              disabled={isBroadcasting}
              onClick={handleBroadcast}
              className="w-full h-12 rounded-xl bg-[#0051d5] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 mt-1"
            >
              {isBroadcasting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Broadcasting &amp; Translating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[19px]">send</span>
                  <span>Broadcast Officially Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 4: System Configuration & Supabase Sync Status */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-700 text-[20px]">tune</span>
              <h3 className="text-xs font-bold text-slate-900">Supabase Cloud &amp; AI Node</h3>
            </div>
            <span className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">cloud_done</span>
                <span className="text-slate-800">Database Cluster: pgvector-asia-south1</span>
              </div>
              <span className="text-teal-700 font-bold text-[11px]">Connected</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700 text-[18px]">auto_awesome</span>
                <span className="text-slate-800">Gemini Text-Embedding-004</span>
              </div>
              <span className="text-teal-700 font-bold text-[11px]">Synced (0.4s)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0051d5] text-[18px]">badge</span>
                <span className="text-slate-800">Active Session Role</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold">
                college_admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
