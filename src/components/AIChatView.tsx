import React, { useState, useRef, useEffect } from 'react';
import { Language, UserProfile, ChatMessage } from '../types/campus';
import { askCampusAI, speakText } from '../services/geminiService';

interface AIChatViewProps {
  language: Language;
  onToggleLanguage: () => void;
  currentUser: UserProfile;
  initialPrompt?: string;
  onOpenPdf: (title: string, type: 'circular' | 'syllabus' | 'rulebook', refNo?: string) => void;
  onOpenFeePortal: () => void;
  onOpenHallTicket: () => void;
  onOpenRules: () => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  language,
  onToggleLanguage,
  currentUser,
  initialPrompt,
  onOpenPdf,
  onOpenFeePortal,
  onOpenHallTicket,
  onOpenRules,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Can I pay semester fees in two installments, and what is the last date for BCA 3rd Sem?',
      time: '10:14 AM',
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: 'Hello Rahul! Yes, fee installment requests are permitted subject to Principal approval:',
      time: '10:14 AM',
      departmentSource: 'Finance & Accounts Registry',
      verifiedSource: 'Circular No. ADM/2024/88 • Finance Desk',
      installments: {
        first: { percentage: '60%', dueDate: 'October 25, 2024' },
        second: { percentage: '40%', dueDate: 'December 10, 2024' },
        fineNotice: 'Fine of ₹50/day applicable after the due date.',
      },
      actions: [
        { type: 'fee_portal', label: 'Open Fee Payment Portal' },
        { type: 'pdf', label: 'Download Official Approval Form (PDF)' },
      ],
    },
    {
      id: 'msg-3',
      sender: 'user',
      text: 'ಲೈಬ್ರರಿ ಶನಿವಾರ ಎಷ್ಟು ಗಂಟೆವರೆಗೆ ಇರುತ್ತೆ?',
      time: '10:16 AM',
      kannadaQuery: true,
    },
    {
      id: 'msg-4',
      sender: 'assistant',
      text: 'ಕಾಲೇಜು ಗ್ರಂಥಾಲಯವು ಶನಿವಾರ ಬೆಳಗ್ಗೆ 9:00 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1:30 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ.',
      time: '10:16 AM',
      departmentSource: 'Central Library System',
      verifiedSource: 'Library Handbook 2024-25',
      kannadaAnswer: 'ಕಾಲೇಜು ಗ್ರಂಥಾಲಯವು ಶನಿವಾರ ಬೆಳಗ್ಗೆ 9:00 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1:30 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ.',
      englishTranslation: 'The college library is open on Saturdays from 9:00 AM to 1:30 PM. (Reading room remains open till 4:00 PM).',
      facilityCards: [
        { title: 'Reading Room', subtitle: 'Till 4:00 PM', icon: 'local_library' },
        { title: 'Entry Pass', subtitle: 'ID Mandatory', icon: 'badge' },
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle incoming initial prompt from other views
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kannadaQuery: /[\u0C80-\u0CFF]/.test(textToSend),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await askCampusAI(textToSend, history, language);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        departmentSource: 'Academic Affairs Registry',
        verifiedSource: 'Verified College Grounding DB',
      };

      // Add actionable shortcuts if query matched common themes
      const lower = textToSend.toLowerCase();
      if (lower.includes('fee') || lower.includes('installment') || lower.includes('ಶುಲ್ಕ')) {
        botMsg.actions = [
          { type: 'fee_portal', label: 'Open Fee Payment Portal' },
          { type: 'pdf', label: 'Download Fee Circular (PDF)' },
        ];
      } else if (lower.includes('hall ticket') || lower.includes('exam') || lower.includes('ಪರೀಕ್ಷೆ')) {
        botMsg.actions = [
          { type: 'hall_ticket', label: 'Download Digital Hall Ticket' },
          { type: 'pdf', label: 'View Odd Sem Exam Timetable (PDF)' },
        ];
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'This query could not be verified in active circulars. Please contact the Admin Desk or Student Welfare Office.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        departmentSource: 'Central Desk',
        verifiedSource: 'Unverified Notice',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
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
          setIsRecording(false);
          handleSendMessage(transcript);
        };

        recognition.onerror = () => {
          triggerVoiceFallback();
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition failed', e);
      }
    }

    triggerVoiceFallback();
  };

  const triggerVoiceFallback = () => {
    setTimeout(() => {
      setIsRecording(false);
      const sample =
        language === 'kn'
          ? 'ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಗೆ ಕಡ್ಡಾಯ ಹಾಜರಾತಿ ಎಷ್ಟು ಬೇಕು?'
          : 'What is the attendance requirement for lab exams?';
      setInputVal(sample);
    }, 2000);
  };

  const handleSpeechPlayback = (msg: ChatMessage) => {
    setActiveSpeechMsgId(msg.id);
    const textToSpeak = msg.kannadaAnswer || msg.text;
    const isKn = msg.kannadaAnswer ? true : /[\u0C80-\u0CFF]/.test(textToSpeak);
    speakText(textToSpeak, isKn ? 'kn' : 'en');
    setTimeout(() => {
      setActiveSpeechMsgId(null);
    }, 4500);
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Assistant Status Bar & Sub-Context */}
      <div className="px-4 pt-2 pb-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between bg-white rounded-xl px-3.5 py-2.5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#0051d5] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">Campus AI Assistant</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0051d5] text-[10px] font-bold">
                  v2.4
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span className="text-[10px] text-teal-800 font-semibold truncate">
                  Online • Grounded on Verified College DB
                </span>
              </div>
            </div>
          </div>

          {/* Quick Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-full p-0.5">
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#000f1d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ENG
            </button>
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                language === 'kn'
                  ? 'bg-[#000f1d] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>

        {/* Official Session Verification Banner */}
        <div className="flex items-center justify-between px-2 py-0.5 text-slate-500 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#0051d5]">verified_user</span>
            <span>
              Student ID: <strong className="text-slate-800 font-semibold">{currentUser.idNumber} ({currentUser.name})</strong>
            </span>
          </div>
          <span>Academic Session 2024–25</span>
        </div>
      </div>

      {/* Chat History Stream */}
      <div className="flex flex-col px-4 gap-3.5 pb-2">
        {/* Time Separator */}
        <div className="flex items-center justify-center my-1">
          <span className="px-3 py-1 rounded-full bg-slate-200/70 text-[10px] text-slate-600 font-medium">
            Today • BCA Dept (3rd Sem)
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${
              msg.sender === 'user' ? 'items-end self-end max-w-[85%]' : 'items-start self-start max-w-[95%]'
            }`}
          >
            {/* Bot department header */}
            {msg.sender === 'assistant' && (
              <div className="flex items-center gap-1.5 px-1 mb-0.5">
                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[#0051d5]">
                  <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
                </div>
                <span className="text-[11px] font-bold text-[#0051d5]">Campus AI Bot</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] text-slate-500">{msg.departmentSource || 'Registry'}</span>
              </div>
            )}

            {/* Bubble body */}
            <div
              className={`p-3.5 rounded-2xl shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#000f1d] text-white rounded-tr-xs'
                  : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs space-y-2.5'
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-line">{msg.text}</p>

              {/* Installment breakdown box */}
              {msg.installments && (
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2 border border-slate-200">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#0051d5] text-[18px] mt-0.5">
                      calendar_clock
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">
                        1st Installment ({msg.installments.first.percentage})
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Due by <strong className="text-slate-900 font-bold">{msg.installments.first.dueDate}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#0051d5] text-[18px] mt-0.5">
                      event_upcoming
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">
                        2nd Installment ({msg.installments.second.percentage})
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Due by <strong className="text-slate-900 font-bold">{msg.installments.second.dueDate}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-red-50 text-red-800 px-2.5 py-1.5 rounded-lg border border-red-200">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span className="text-[11px] font-medium">{msg.installments.fineNotice}</span>
                  </div>
                </div>
              )}

              {/* Kannada Answer & English Translation */}
              {msg.kannadaAnswer && (
                <div className="space-y-2">
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 text-[10px] font-bold">
                        ಕನ್ನಡ ಆವೃತ್ತಿ
                      </span>
                      <div className="flex items-center gap-1 text-teal-800 font-bold text-[11px]">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>9:00 AM – 1:30 PM</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-900 leading-relaxed font-medium">
                      {msg.kannadaAnswer}
                    </p>
                  </div>

                  {msg.englishTranslation && (
                    <div className="px-1 text-[11px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800 uppercase text-[10px] block mb-0.5">
                        English Translation:
                      </span>
                      {msg.englishTranslation}
                    </div>
                  )}
                </div>
              )}

              {/* Facility Cards */}
              {msg.facilityCards && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {msg.facilityCards.map((c, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#0051d5] text-[18px]">{c.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-500 font-medium">{c.title}</span>
                        <span className="text-[11px] font-bold text-slate-900 truncate">{c.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Verified Source Stamp */}
              {msg.verifiedSource && (
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[10px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-teal-600 text-[15px]">verified</span>
                    <span className="truncate">{msg.verifiedSource}</span>
                  </div>
                  <span
                    onClick={onOpenRules}
                    className="text-[#0051d5] font-semibold cursor-pointer hover:underline shrink-0"
                  >
                    View Rules
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              {msg.actions && (
                <div className="flex flex-col gap-2 pt-1">
                  {msg.actions.map((act, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (act.type === 'fee_portal') onOpenFeePortal();
                        else if (act.type === 'hall_ticket') onOpenHallTicket();
                        else onOpenPdf('Fee & Circular Official Document', 'circular');
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 ${
                        idx === 0
                          ? 'bg-[#0051d5] hover:bg-blue-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[17px]">
                          {act.type === 'fee_portal'
                            ? 'account_balance_wallet'
                            : act.type === 'hall_ticket'
                            ? 'download_for_offline'
                            : 'download'}
                        </span>
                        <span>{act.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bubble Footer & Feedback / Listen */}
            <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
              <span>{msg.time}</span>
              <span className="text-slate-300">•</span>
              {msg.sender === 'assistant' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSpeechPlayback(msg)}
                    className={`flex items-center gap-1 hover:text-[#0051d5] transition-colors font-semibold ${
                      activeSpeechMsgId === msg.id ? 'text-[#0051d5] animate-pulse' : 'text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">volume_up</span>
                    <span>Listen (ಧ್ವನಿ)</span>
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => alert('Marked as helpful!')}
                    className="flex items-center gap-0.5 hover:text-slate-700 text-slate-500"
                  >
                    <span className="material-symbols-outlined text-[13px]">thumb_up</span>
                    <span>Helpful</span>
                  </button>
                </>
              ) : (
                <span className="material-symbols-outlined text-[14px] text-[#0051d5]">done_all</span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2 self-start max-w-[90%] animate-fadeIn">
            <div className="w-6 h-6 rounded-full bg-[#0051d5] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[13px]">smart_toy</span>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <span>Grounding answer on campus database</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5] animate-ping"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries */}
      <div className="px-4 mt-1 flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#0051d5]">bolt</span>
            Suggested Inquiries
          </span>
          <span
            onClick={() => onOpenPdf('Full Academic Schedule & Dates', 'circular')}
            className="text-[11px] text-[#0051d5] font-semibold cursor-pointer hover:underline"
          >
            More topics
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => handleSendMessage('When is the odd semester theory exam timetable released?')}
            className="shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 px-3 py-1.5 rounded-full shadow-xs text-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#0051d5]">table_chart</span>
            <span className="whitespace-nowrap">Exam Timetable</span>
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('What are the attendance shortage and condonation rules?')}
            className="shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 px-3 py-1.5 rounded-full shadow-xs text-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-red-600">rule</span>
            <span className="whitespace-nowrap">Attendance Shortage Rules</span>
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('What are the office visiting hours for student welfare?')}
            className="shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 px-3 py-1.5 rounded-full shadow-xs text-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-[#0051d5]">support_agent</span>
            <span className="whitespace-nowrap">Contact Office</span>
          </button>
          <button
            type="button"
            onClick={onOpenHallTicket}
            className="shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 text-slate-800 px-3 py-1.5 rounded-full shadow-xs text-xs"
          >
            <span className="material-symbols-outlined text-[15px] text-teal-700">confirmation_number</span>
            <span className="whitespace-nowrap">Hall Ticket Download</span>
          </button>
        </div>
      </div>

      {/* Active Sticky Input Tray */}
      <div className="px-4 mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="bg-white rounded-2xl p-2 border border-slate-200 shadow-md flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 px-1">
            <button
              type="button"
              onClick={() => onOpenPdf('Circular #KA-2024/88', 'circular')}
              title="Attach Document or Receipt"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'kn'
                  ? 'ಹಾಲ್ ಟಿಕೆಟ್, ಶುಲ್ಕ ಅಥವಾ ಕಾಲೇಜಿನ ನಿಯಮಗಳ ಬಗ್ಗೆ ಕೇಳಿ...'
                  : 'Ask in English ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ...'
              }
              className="flex-grow bg-transparent text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none py-1.5"
            />

            <button
              type="button"
              onClick={handleVoiceToggle}
              title="Kannada & English Voice Input"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-600 text-white animate-pulse' : 'text-[#0051d5] hover:bg-blue-50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim()}
              title="Send Message"
              className="w-9 h-9 rounded-xl bg-[#0051d5] hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[19px]">send</span>
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <div className="flex items-center justify-center gap-1 mt-2 text-center">
          <span className="material-symbols-outlined text-[13px] text-slate-400 shrink-0">shield</span>
          <p className="text-[10px] text-slate-500">
            Answers are grounded via verified college records. If unavailable, contact Admin Desk.
          </p>
        </div>
      </div>
    </div>
  );
};
