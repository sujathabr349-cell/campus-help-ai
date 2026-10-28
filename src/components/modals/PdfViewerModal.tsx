import React from 'react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentType: 'circular' | 'syllabus' | 'rulebook';
  referenceNo?: string;
  date?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  documentType,
  referenceNo = 'REF-BC/2024/88',
  date = 'November 02, 2024',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* PDF Top Bar */}
        <div className="bg-[#000f1d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-400 text-[20px]">picture_as_pdf</span>
            <span className="font-semibold text-sm truncate max-w-[240px]">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* PDF Document Canvas */}
        <div className="overflow-y-auto p-6 bg-slate-50 flex-grow font-serif text-slate-800 space-y-4 text-xs leading-relaxed select-text">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <div className="flex justify-center mb-1">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-base">
                BC
              </div>
            </div>
            <h2 className="font-bold text-sm tracking-wide text-blue-950 uppercase">Bengaluru Central Campus</h2>
            <p className="text-[10px] text-slate-500 font-sans">
              Central College Campus, Dr. B.R. Ambedkar Veedhi, Bengaluru - 560001
            </p>
            <p className="text-[9px] text-slate-400 font-sans mt-0.5">
              NAAC Accredited A+ Grade • Affiliated to Bengaluru City University
            </p>
          </div>

          {/* Reference & Date */}
          <div className="flex justify-between items-center text-[11px] font-sans text-slate-600 border-b border-slate-200 pb-2">
            <span>Ref No: <strong>{referenceNo}</strong></span>
            <span>Date: <strong>{date}</strong></span>
          </div>

          {/* Title Header */}
          <div className="text-center py-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 underline">
              {title}
            </h3>
          </div>

          {/* Body Content based on document type */}
          {documentType === 'circular' && (
            <div className="space-y-3 font-sans text-slate-700 text-xs">
              <p>
                <strong>NOTIFICATION / OFFICIAL CIRCULAR:</strong>
              </p>
              <p>
                It is hereby informed to all students enrolled in BCA, BBA, and MBA programs that the 
                <strong> Odd Semester Theory Examinations (2024-25)</strong> will officially commence from 
                <strong> November 18, 2024</strong> across designated examination centres.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold">IMPORTANT DATES:</div>
                <div>• Last date for exam form submission (without penalty): <strong>Nov 10, 2024</strong></div>
                <div>• Release of Digital Hall Tickets: <strong>Nov 14, 2024</strong></div>
                <div>• Commencement of Practical Lab Exams: <strong>Nov 08, 2024</strong></div>
              </div>
              <p>
                <strong>Eligibility Notice:</strong> As per University Regulations §14.2, students having less than 
                <strong> 75% aggregate attendance</strong> in theory and practical courses will strictly NOT be issued hall tickets.
              </p>
            </div>
          )}

          {documentType === 'syllabus' && (
            <div className="space-y-3 font-sans text-slate-700 text-xs">
              <p>
                <strong>CURRICULUM REGULATION: NEP 2020 SCHEME</strong>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-2.5 space-y-1 text-[11px]">
                <div className="font-bold text-blue-900">CS301: DATA STRUCTURES USING C</div>
                <div>• Lecture Hours / Week: 4 Hours | Credits: 4.0</div>
                <div>• Practical Lab / Week: 3 Hours | Lab Credits: 2.0</div>
                <div>• Continuous Internal Assessment (CIE): 40 Marks</div>
                <div>• Semester End Exam (SEE): 60 Marks</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-slate-900">MODULE OUTLINE:</div>
                <div className="text-[11px] space-y-0.5">
                  <p>1. <strong>Unit I:</strong> Introduction to Pointers, Dynamic Memory Allocation, Abstract Data Types.</p>
                  <p>2. <strong>Unit II:</strong> Stacks &amp; Queues, Circular Queues, Priority Queues, Infix-to-Postfix conversion.</p>
                  <p>3. <strong>Unit III:</strong> Singly &amp; Doubly Linked Lists, Polynomial representation, Circular lists.</p>
                  <p>4. <strong>Unit IV:</strong> Non-linear data structures: Binary Trees, BST traversals, AVL balancing, Graph BFS/DFS.</p>
                </div>
              </div>
            </div>
          )}

          {documentType === 'rulebook' && (
            <div className="space-y-3 font-sans text-slate-700 text-xs">
              <p><strong>CAMPUS CONDUCT &amp; ACADEMIC HANDBOOK:</strong></p>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                <li><strong>Attendance:</strong> Minimum 75% required in all courses. Condonation fee applicable between 65%-74%.</li>
                <li><strong>Identity Card:</strong> Must be worn visibly on lanyard at all times inside campus, labs, and library.</li>
                <li><strong>Hostel Curfew:</strong> Strictly 9:00 PM for Boys hostel and 8:30 PM for Girls hostel.</li>
                <li><strong>Anti-Ragging:</strong> Severe zero-tolerance policy. Contact helpline 1800-180-5522.</li>
              </ul>
            </div>
          )}

          {/* Official Seal and Signature */}
          <div className="pt-4 flex justify-between items-end border-t border-slate-200 font-sans text-[11px]">
            <div>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-800/40 flex items-center justify-center text-[9px] text-blue-900 font-bold uppercase text-center rotate-[-12deg]">
                REGISTRAR<br/>OFFICIAL<br/>SEAL
              </div>
            </div>
            <div className="text-right">
              <div className="font-script text-sm text-blue-950 font-bold">Dr. K. S. Murthy</div>
              <div className="font-semibold text-slate-800">Registrar (Evaluation)</div>
              <div className="text-[10px] text-slate-500">Bengaluru Central Campus</div>
            </div>
          </div>
        </div>

        {/* PDF Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Page 1 of 1 • Digitally Signed</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">print</span>
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob(['Official Document: ' + title], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = `${title.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="px-4 py-1.5 rounded-lg bg-[#0051d5] text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
