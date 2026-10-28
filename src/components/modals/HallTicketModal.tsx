import React from 'react';
import { STUDENT_USER } from '../../services/supabase';

interface HallTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HallTicketModal: React.FC<HallTicketModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const subjects = [
    { code: 'CS301', title: 'Data Structures with C', date: 'Nov 18, 2024', time: '10:00 AM - 1:00 PM', room: 'Exam Hall 3B' },
    { code: 'CS302', title: 'Database Management Systems', date: 'Nov 20, 2024', time: '10:00 AM - 1:00 PM', room: 'Exam Hall 3B' },
    { code: 'CS303', title: 'Computer Communication Networks', date: 'Nov 23, 2024', time: '10:00 AM - 1:00 PM', room: 'Exam Hall 3B' },
    { code: 'CS304', title: 'Web Application Development Lab', date: 'Nov 26, 2024', time: '9:30 AM - 12:30 PM', room: 'Tech Lab 2' },
    { code: 'CS305', title: 'Indian Constitution & Cyber Laws', date: 'Nov 28, 2024', time: '10:00 AM - 12:00 PM', room: 'Exam Hall 3B' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">assignment_turned_in</span>
            <span className="font-semibold text-sm">Official Examination Hall Ticket</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 bg-slate-50 flex-grow font-sans text-xs space-y-3.5">
          {/* Institution Header */}
          <div className="text-center border-b pb-2">
            <h3 className="font-bold text-sm text-blue-950 uppercase tracking-wide">
              Bengaluru Central Campus (Affiliated University)
            </h3>
            <p className="text-[10px] text-slate-500">Odd Semester End Examinations — November 2024</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
              Admit Card / Hall Ticket (Verified)
            </span>
          </div>

          {/* Candidate Card */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
            <div className="space-y-1">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Candidate Name: </span>
                <strong className="text-slate-900 text-xs">{STUDENT_USER.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">USN / Roll No: </span>
                <strong className="text-blue-700 text-xs font-mono">{STUDENT_USER.idNumber}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Degree &amp; Branch: </span>
                <span className="text-slate-700 text-[11px]">BCA (3rd Semester - NEP 2020)</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Attendance Clearance: </span>
                <span className="text-emerald-700 font-semibold text-[11px]">84.2% (Eligible)</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={STUDENT_USER.avatarUrl}
                alt="Candidate"
                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-300 shadow-sm"
              />
              <span className="text-[9px] text-slate-400 mt-1">Verified Photo</span>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
              <span>Course / Examination Schedule</span>
              <span className="text-slate-500 font-normal text-[10px]">Center: #KA-001 Central College</span>
            </div>
            <div className="divide-y divide-slate-100 text-[11px]">
              {subjects.map((sub) => (
                <div key={sub.code} className="p-2.5 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">
                      <span className="text-blue-700 font-mono font-bold mr-1">{sub.code}:</span>
                      {sub.title}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {sub.date} • {sub.time}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                      {sub.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Examination Rules */}
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[10px] text-amber-900 space-y-0.5">
            <p className="font-bold">MANDATORY INSTRUCTIONS FOR CANDIDATE:</p>
            <p>1. Candidates must arrive at the examination hall 20 minutes prior to the commencement of exam.</p>
            <p>2. Electronic gadgets, smart watches, and calculators (unless specified) are strictly barred.</p>
            <p>3. This Admit Card and College ID Card must be produced on demand by the room invigilator.</p>
          </div>

          {/* Barcode & Signature */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="font-mono text-[9px] text-slate-500 tracking-widest">
              ||| ||||| |||| |||||||| ||||| ||||||| <br />
              BC-2024-U21BC408-REG
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-800 text-[11px]">Dr. K. S. Murthy</div>
              <div className="text-[9px] text-slate-400">Controller of Examinations</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">print</span>
            <span>Print Admit Card</span>
          </button>
          <button
            onClick={() => {
              alert('Official Digital Admit Card downloaded successfully!');
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
