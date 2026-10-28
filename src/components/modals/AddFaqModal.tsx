import React, { useState } from 'react';
import { FAQ } from '../../types/campus';

interface AddFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Omit<FAQ, 'id'>) => void;
}

export const AddFaqModal: React.FC<AddFaqModalProps> = ({ isOpen, onClose, onSave }) => {
  const [question, setQuestion] = useState('');
  const [questionKn, setQuestionKn] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerKn, setAnswerKn] = useState('');
  const [category, setCategory] = useState<'timings' | 'fees' | 'exams' | 'admissions' | 'rules' | 'hostel'>('fees');
  const [verifiedSource, setVerifiedSource] = useState('Academic Circular 2024/25');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    onSave({
      question: question.trim(),
      questionKn: questionKn.trim() || question.trim(),
      answer: answer.trim(),
      answerKn: answerKn.trim() || answer.trim(),
      category,
      verifiedSource: verifiedSource.trim() || 'Verified Official Record',
    });

    setQuestion('');
    setQuestionKn('');
    setAnswer('');
    setAnswerKn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">add_task</span>
            <span className="font-semibold text-sm">Add Verified Knowledge Rule / FAQ</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 space-y-3.5 text-xs font-sans text-slate-700 flex-grow">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="fees">Fees &amp; Installments (ಶುಲ್ಕ)</option>
              <option value="exams">Examinations &amp; Hall Tickets (ಪರೀಕ್ಷೆ)</option>
              <option value="timings">Timings &amp; Counters (ವೇಳಾಪಟ್ಟಿ)</option>
              <option value="rules">Attendance &amp; Academic Rules (ನಿಯಮಗಳು)</option>
              <option value="admissions">Admissions &amp; Cutoffs (ದಾಖಲಾತಿ)</option>
              <option value="hostel">Hostel &amp; Campus Facilities (ವಿದ್ಯಾರ್ಥಿನಿಲಯ)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              English Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the deadline for supplementary exam form?"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Kannada Question (ಕನ್ನಡ ಪ್ರಶ್ನೆ)
            </label>
            <input
              type="text"
              value={questionKn}
              onChange={(e) => setQuestionKn(e.target.value)}
              placeholder="ಉದಾ: ಪೂರಕ ಪರೀಕ್ಷಾ ಅರ್ಜಿ ಸಲ್ಲಿಕೆಗೆ ಕೊನೆಯ ದಿನಾಂಕ ಯಾವಾಗ?"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Verified English Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="State clear factual policy, dates, numbers, and department room."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Kannada Answer (ಕನ್ನಡ ವಿವರಣೆ)
            </label>
            <textarea
              rows={3}
              value={answerKn}
              onChange={(e) => setAnswerKn(e.target.value)}
              placeholder="ಅಧಿಕೃತ ಕನ್ನಡ ಅನುವಾದ / ವಿವರಣೆ..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Verified Source Document Reference
            </label>
            <input
              type="text"
              value={verifiedSource}
              onChange={(e) => setVerifiedSource(e.target.value)}
              placeholder="e.g., Circular No. ADM/2024/88 • Registrar Office"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Index in Supabase</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
