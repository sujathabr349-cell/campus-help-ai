import React, { useState } from 'react';
import { askCampusAI } from '../../services/geminiService';

interface SmartCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToChat?: (initialPrompt: string) => void;
}

export const SmartCounselorModal: React.FC<SmartCounselorModalProps> = ({
  isOpen,
  onClose,
  onNavigateToChat,
}) => {
  const [stream, setStream] = useState<'science' | 'commerce' | 'arts' | 'graduation'>('science');
  const [percentage, setPercentage] = useState<number>(78);
  const [hasMathCs, setHasMathCs] = useState<boolean>(true);
  const [counselorResult, setCounselorResult] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    let text = '';
    const pct = Number(percentage) || 0;

    if (stream === 'graduation') {
      if (pct >= 50) {
        text = `✅ Eligible for MBA! You qualify for admission with graduation aggregate (${pct}% >= 50%). You can select 2 dual specializations (Finance, Marketing, HR, Business Analytics) upon clearing PGCET/KMAT/MAT.`;
      } else {
        text = `⚠️ MBA requires minimum 50% aggregate in graduation (45% for SC/ST/Cat-1 candidates). Your current score is ${pct}%. Please check reserved quota relaxation policies.`;
      }
    } else {
      const bcaEligible = (stream === 'science' || hasMathCs) && pct >= 50;
      const bbaEligible = pct >= 45;

      const lines = [];
      if (bcaEligible) {
        lines.push(`✅ Eligible for BCA: Your ${pct}% meets the 50% cutoff with Mathematics/CS background. Average placement package: ₹4.2 – 6.5 LPA.`);
      } else {
        lines.push(`❌ BCA Not Eligible: Requires 10+2 with Mathematics/CS background and minimum 50% aggregate.`);
      }

      if (bbaEligible) {
        lines.push(`✅ Eligible for BBA: Your ${pct}% exceeds the 45% minimum criteria for any stream. Access to E-Cell incubator and Fintech tracks.`);
      } else {
        lines.push(`❌ BBA Not Eligible: Requires minimum 45% aggregate in 10+2.`);
      }

      text = lines.join('\n\n');
    }

    setCounselorResult(text);
  };

  const handleAskCustom = async () => {
    if (!customQuestion.trim()) return;
    setIsAsking(true);
    try {
      const res = await askCampusAI(`Admissions counseling inquiry: ${customQuestion}`);
      setAiAnswer(res.reply);
    } catch {
      setAiAnswer('Campus admissions records could not be retrieved.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Handle for bottom sheet */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0051d5] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Campus AI Academic Counselor</h3>
              <p className="text-[10px] text-teal-700 font-semibold">Instant Eligibility &amp; Career Roadmap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 space-y-4 text-xs font-sans text-slate-700 flex-grow">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 space-y-1">
            <span className="font-bold block">NEP 2020 Multi-Disciplinary Scheme</span>
            <p>
              Verify your eligibility for <strong>BCA, BBA, &amp; MBA</strong> against official University Council requirements in 30 seconds.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Current Academic Level / Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="science">10+2 / PUC Science (PCMB / PCMC)</option>
                <option value="commerce">10+2 / PUC Commerce</option>
                <option value="arts">10+2 / PUC Arts / Humanities</option>
                <option value="graduation">Bachelor's Degree (UG Completed / Final Year)</option>
              </select>
            </div>

            {stream !== 'graduation' && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasMathCs}
                  onChange={(e) => setHasMathCs(e.target.checked)}
                  className="rounded text-[#0051d5] accent-[#0051d5] w-4 h-4"
                />
                <span className="text-[11px] text-slate-700 font-medium">Studied Mathematics, Statistics, or Computer Science</span>
              </label>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-slate-700">Aggregate Marks Percentage (%)</label>
                <span className="font-bold text-blue-700 text-xs">{percentage}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full accent-[#0051d5] cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleEvaluate}
              className="w-full py-2.5 rounded-xl bg-[#0051d5] text-white font-semibold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Verify My Eligibility</span>
            </button>
          </div>

          {/* Result Box */}
          {counselorResult && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 space-y-2 whitespace-pre-line text-xs font-medium animate-fadeIn">
              {counselorResult}
            </div>
          )}

          {/* Ask AI Counselor Custom Query */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="font-semibold text-slate-800 text-[11px] block">Ask Admissions Counselor Any Question:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g., Can I take AI electives without coding experience?"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                onKeyDown={(e) => e.key === 'Enter' && handleAskCustom()}
              />
              <button
                type="button"
                disabled={isAsking}
                onClick={handleAskCustom}
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all"
              >
                {isAsking ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">send</span>
                )}
              </button>
            </div>

            {aiAnswer && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs leading-relaxed animate-fadeIn">
                <span className="text-[10px] font-bold text-blue-700 block mb-1 uppercase tracking-wide">
                  Grounded Counselor Response:
                </span>
                {aiAnswer}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[10px] text-slate-500">Official Admissions Desk 2024-25</span>
          <button
            onClick={() => {
              onClose();
              if (onNavigateToChat) {
                onNavigateToChat(`Check my eligibility and admission cutoffs for BCA and MBA with ${percentage}%.`);
              }
            }}
            className="text-[#0051d5] font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Open Detailed Chat</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
