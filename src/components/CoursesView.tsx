import React, { useState } from 'react';
import { Course, Language } from '../types/campus';

interface CoursesViewProps {
  language: Language;
  courses: Course[];
  onOpenPdf: (title: string, type: 'circular' | 'syllabus' | 'rulebook', refNo?: string) => void;
  onOpenCounselor: () => void;
  onAskCourseAI: (courseCode: string, promptText: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  language,
  courses,
  onOpenPdf,
  onOpenCounselor,
  onAskCourseAI,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'bca' | 'bba' | 'mba'>('all');

  const filteredCourses = courses.filter((c) => {
    const matchesFilter =
      activeFilter === 'all' || c.code.toLowerCase() === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.electives.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eligibility.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Search & Program Filter Tabs */}
      <section className="px-4 pt-3 pb-2 flex flex-col gap-2.5">
        {/* Search input with mic */}
        <div className="relative w-full shadow-xs rounded-xl overflow-hidden bg-white border border-slate-200">
          <div className="flex items-center px-3.5 py-2.5 gap-2.5">
            <span className="material-symbols-outlined text-[#0051d5] text-[22px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs, electives, or fees..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchQuery('Cloud')}
              title="Filter by Cloud/Tech"
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#0051d5] transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">mic</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Programs' },
            { id: 'bca', label: 'BCA' },
            { id: 'bba', label: 'BBA' },
            { id: 'mba', label: 'MBA' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? 'bg-[#0051d5] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Smart Counselor Banner */}
      <section className="px-4 py-1.5">
        <div className="bg-gradient-to-r from-[#0f2537] via-[#213145] to-[#122b40] p-4 rounded-2xl relative overflow-hidden shadow-sm text-white">
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-300 text-[18px]">psychology</span>
                <span className="text-[10px] text-teal-300 uppercase tracking-wider font-bold">
                  Smart Counselor
                </span>
              </div>
              <h2 className="text-sm font-bold leading-tight">Need help choosing your path?</h2>
              <p className="text-[11px] text-slate-300 leading-snug">
                Let Campus AI compare eligibility &amp; career outcomes for you in seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCounselor}
              title="Open Smart Counselor Assistant"
              className="shrink-0 w-10 h-10 rounded-full bg-[#0051d5] hover:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </button>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/20 blur-xl pointer-events-none"></div>
        </div>
      </section>

      {/* Course Cards Stream */}
      <section className="px-4 py-2 flex flex-col gap-3.5">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => (
            <article
              key={c.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-2.5 transition-all"
            >
              {/* Header & Badges */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span className="text-[10px] font-bold">{c.tag}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{c.level}</span>
                </div>

                <div className="flex items-start justify-between gap-2 mt-0.5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-none">{c.code}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{c.name}</p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      {c.code === 'BCA' ? 'terminal' : c.code === 'BBA' ? 'monitoring' : 'corporate_fare'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#0051d5]">schedule</span>
                  {c.duration}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0051d5] text-[10px] font-bold">
                  {c.electives}
                </span>
              </div>

              {/* Key Metrics Panel */}
              <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium">Tuition / Year</span>
                  <span className="text-sm font-bold text-slate-900">{c.tuitionDisplay}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {c.placementRate ? 'Placement Rate' : c.incubatorAccess ? 'Incubator Access' : 'Specialization'}
                  </span>
                  <span className="text-sm font-bold text-teal-700 flex items-center gap-1">
                    {c.placementRate || c.incubatorAccess || c.specializationTrack}
                    {c.placementRate && (
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Eligibility Snippet */}
              <div className="flex items-start gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60">
                <span className="material-symbols-outlined text-[17px] text-slate-500 shrink-0 mt-0.5">
                  school
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Eligibility</span>
                  <span className="text-xs text-slate-800">{c.eligibility}</span>
                </div>
              </div>

              {/* Program Highlights or Dual Specialization Tracks */}
              {c.dualSpecializations ? (
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">
                    Dual Specialization Tracks
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.dualSpecializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">
                    Program Highlights
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {c.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1 text-slate-700 text-xs">
                        <span className="material-symbols-outlined text-[#0051d5] text-[15px]">
                          {i === 0 ? 'devices' : 'workspace_premium'}
                        </span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onOpenPdf(`${c.code} NEP Scheme Syllabus & Regulations`, 'syllabus', 'NEP 2020')
                  }
                  className="h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[17px]">description</span>
                  <span>{c.code === 'MBA' ? 'Curriculum & Fees' : 'Syllabus PDF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAskCourseAI(
                      c.code,
                      `Tell me about the ${c.code} curriculum, admissions cutoff, tuition installments, and placement records.`
                    )
                  }
                  className="h-10 px-3 rounded-xl bg-[#0051d5] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                  <span>Ask AI</span>
                </button>
              </div>
            </article>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <span className="material-symbols-outlined text-[28px]">menu_book</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800">No matching programs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Try searching for &apos;Analytics&apos;, &apos;Fintech&apos;, or &apos;Cloud&apos;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-3 px-4 py-2 bg-[#0051d5] text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Quick Compare & Guidance Floating Trigger Dock */}
      <aside className="sticky bottom-24 mx-4 mt-2 z-20">
        <div className="bg-[#000f1d] text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 backdrop-blur-md border border-slate-700/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#0051d5] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[19px]">psychology_alt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                Campus AI Advisor
              </span>
              <span className="text-xs truncate text-slate-200 font-medium">
                Verify your eligibility in 30 seconds
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCounselor}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#dbe1ff] text-[#00174b] font-bold text-xs hover:bg-white transition-colors active:scale-95 flex items-center gap-1"
          >
            <span>Check</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
