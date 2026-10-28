import { Course, FAQ, Notice, EscalatedQuery, CampusTiming, UserProfile, CalendarEvent } from '../types/campus';

// Initial verified seed data for Bengaluru Central Campus
const INITIAL_COURSES: Course[] = [
  {
    id: 'course-bca',
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    level: 'Undergraduate',
    tag: 'NEP 2020 Aligned',
    duration: '3 Years • 6 Semesters',
    semesters: 6,
    electives: 'AI & Cloud Computing Electives',
    tuitionYear: 75000,
    tuitionDisplay: '₹75,000',
    placementRate: '92%',
    eligibility: '10+2 with Math/CS (min 50% aggregate)',
    highlights: ['Modern Labs', 'Industry Certs'],
    syllabusPdfUrl: 'BCA_Sem3_DS_2024.pdf',
  },
  {
    id: 'course-bba',
    code: 'BBA',
    name: 'Bachelor of Business Administration',
    level: 'Undergraduate',
    tag: 'Accredited A+',
    duration: '3 Years • 6 Semesters',
    semesters: 6,
    electives: 'Fintech & Digital Marketing',
    tuitionYear: 65000,
    tuitionDisplay: '₹65,000',
    incubatorAccess: 'E-Cell active',
    eligibility: '10+2 Any stream (min 45% aggregate)',
    highlights: ['Industry Internships', 'Case Study Pedagogy'],
    syllabusPdfUrl: 'BBA_NEP_Curriculum_2024.pdf',
  },
  {
    id: 'course-mba',
    code: 'MBA',
    name: 'Master of Business Administration',
    level: 'Postgraduate',
    tag: 'Postgraduate Flagship',
    duration: '2 Years • 4 Semesters',
    semesters: 4,
    electives: 'Dual Specialization',
    tuitionYear: 120000,
    tuitionDisplay: '₹1,20,000',
    specializationTrack: 'Flexible Tracks',
    eligibility: 'Graduation (min 50%) + PGCET / KMAT / MAT',
    highlights: ['Dual Specialization Tracks', 'Corporate Incubator'],
    dualSpecializations: ['Finance', 'Marketing', 'Human Resources', 'Business Analytics'],
    syllabusPdfUrl: 'MBA_Executive_Curriculum_2024.pdf',
  },
  {
    id: 'course-mca',
    code: 'MCA',
    name: 'Master of Computer Applications',
    level: 'Postgraduate',
    tag: 'AICTE Approved',
    duration: '2 Years • 4 Semesters',
    semesters: 4,
    electives: 'Full Stack & Distributed Systems',
    tuitionYear: 95000,
    tuitionDisplay: '₹95,000',
    placementRate: '95%',
    eligibility: 'BCA / B.Sc / B.Tech (min 50%) + PGCET / KMAT',
    highlights: ['Cloud Research Labs', 'High Placement Track'],
    syllabusPdfUrl: 'MCA_Advanced_Computing_2024.pdf',
  },
];

const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'When does the library close on Saturdays?',
    questionKn: 'ಶನಿವಾರ ಗ್ರಂಥಾಲಯ ಯಾವಾಗ ಮುಚ್ಚುತ್ತದೆ?',
    answer: 'The college library is open on Saturdays from 9:00 AM to 1:30 PM. The reading room remains accessible until 4:00 PM for enrolled students with mandatory college ID card.',
    answerKn: 'ಕಾಲೇಜು ಗ್ರಂಥಾಲಯವು ಶನಿವಾರ ಬೆಳಗ್ಗೆ 9:00 ರಿಂದ ಮಧ್ಯಾಹ್ನ 1:30 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ. ಓದುವ ಕೊಠಡಿಯು (Reading Room) ಸಂಜೆ 4:00 ರವರೆಗೆ ಲಭ್ಯವಿರುತ್ತದೆ. ಗುರುತಿನ ಚೀಟಿ ಕಡ್ಡಾಯ.',
    category: 'timings',
    verifiedSource: 'Library Handbook 2024-25',
  },
  {
    id: 'faq-2',
    question: 'How to apply for fee concession or SSP post-matric scholarship?',
    questionKn: 'ಶುಲ್ಕ ರಿಯಾಯಿತಿ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿವೇತನ ಅರ್ಜಿ ಹೇಗೆ?',
    answer: 'Eligible students can apply on Karnataka State Scholarship Portal (SSP: ssp.postmatric.karnataka.gov.in). Submit RD numbers, Aadhaar verification, and college Bonafide to the Student Welfare Desk (Room #104).',
    answerKn: 'ಅರ್ಹ ವಿದ್ಯಾರ್ಥಿಗಳು ಕರ್ನಾಟಕ ರಾಜ್ಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ತಾಣದಲ್ಲಿ (SSP) ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು. RD ಸಂಖ್ಯೆ, ಆಧಾರ್ ದೃಢೀಕರಣ ಮತ್ತು ಬೋನಫೈಡ್ ದಾಖಲೆಗಳನ್ನು ವಿದ್ಯಾರ್ಥಿ ಕ್ಷೇಮಪಾಲನಾ ಕೊಠಡಿ #104 ರಲ್ಲಿ ಸಲ್ಲಿಸಿ.',
    category: 'fees',
    verifiedSource: 'State Scholarship Circular No. 2024/09',
    actionType: 'fee_portal',
    actionLabel: 'Fee Details & Concession',
  },
  {
    id: 'faq-3',
    question: 'What is the minimum attendance requirement for practical lab exams?',
    questionKn: 'ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಗೆ ಕಡ್ಡಾಯ ಹಾಜರಾತಿ ನಿಯಮಗಳು',
    answer: 'Strictly 75% attendance in theory and 75% in practical lab classes is mandatory. Attendance below 65% results in non-issuance of hall tickets and semester repetition.',
    answerKn: 'ಥಿಯರಿ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ತರಗತಿಗಳಲ್ಲಿ ಕನಿಷ್ಠ 75% ಹಾಜರಾತಿ ಕಡ್ಡಾಯವಾಗಿದೆ. 65% ಕ್ಕಿಂತ ಕಡಿಮೆ ಹಾಜರಾತಿ ಇದ್ದರೆ ಪರೀಕ್ಷಾ ಹಾಲ್ ಟಿಕೆಟ್ ನೀಡಲಾಗುವುದಿಲ್ಲ.',
    category: 'rules',
    verifiedSource: 'Academic Council Ordinance §14.2',
  },
  {
    id: 'faq-4',
    question: 'Can I pay semester fees in two installments for BCA 3rd Sem?',
    questionKn: 'BCA 3ನೇ ಸೆಮಿಸ್ಟರ್ ಶುಲ್ಕವನ್ನು ಎರಡು ಕಂತುಗಳಲ್ಲಿ ಪಾವತಿಸಬಹುದೇ?',
    answer: 'Yes, fee installment requests are permitted subject to Principal approval: 1st Installment (60%) due by Oct 25, 2024, and 2nd Installment (40%) due by Dec 10, 2024. Late fine: ₹50/day.',
    answerKn: 'ಹೌದು, ಪ್ರಾಂಶುಪಾಲರ ಅನುಮೋದನೆಯೊಂದಿಗೆ 2 ಕಂತುಗಳಲ್ಲಿ ಪಾವತಿಸಬಹುದು: 1ನೇ ಕಂತು (60%) ಅಕ್ಟೋಬರ್ 25 ರೊಳಗೆ, 2ನೇ ಕಂತು (40%) ಡಿಸೆಂಬರ್ 10 ರೊಳಗೆ. ತಡವಾದಲ್ಲಿ ದಿನಕ್ಕೆ ₹50 ದಂಡ.',
    category: 'fees',
    verifiedSource: 'Circular No. ADM/2024/88 • Finance Desk',
    actionType: 'fee_portal',
    actionLabel: 'Open Fee Payment Portal',
  },
  {
    id: 'faq-5',
    question: 'Where can I download BCA 3rd Sem Data Structures syllabus?',
    questionKn: 'BCA 3ನೇ ಸೆಮಿಸ್ಟರ್ ಡೇಟಾ ಸ್ಟ್ರಕ್ಚರ್ಸ್ ಪಠ್ಯಕ್ರಮ ಎಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು?',
    answer: 'BCA NEP Scheme syllabus for CS301 Data Structures with C is available under Department of Computer Applications official curriculum documents.',
    answerKn: 'BCA NEP ಯೋಜನೆಯ CS301 ಡೇಟಾ ಸ್ಟ್ರಕ್ಚರ್ಸ್ ಪಠ್ಯಕ್ರಮವು ಕಂಪ್ಯೂಟರ್ ಅಪ್ಲಿಕೇಷನ್ಸ್ ವಿಭಾಗದ ಅಧಿಕೃತ ದಾಖಲೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ.',
    category: 'exams',
    verifiedSource: 'NEP 2020 Curricula Register',
    actionType: 'pdf',
    actionLabel: 'BCA_Sem3_DS_2024.pdf',
  },
  {
    id: 'faq-6',
    question: 'What are the campus entry gate and hostel curfew hours?',
    questionKn: 'ಕ್ಯಾಂಪಸ್ ಪ್ರವೇಶ ಗೇಟ್ ಮತ್ತು ಹಾಸ್ಟೆಲ್ ಸಮಯಗಳೇನು?',
    answer: 'Main campus gates open at 7:45 AM and close at 7:00 PM. Boys hostel curfew is 9:00 PM; Girls hostel curfew is 8:30 PM. Late entry requires warden pre-authorization.',
    answerKn: 'ಮುಖ್ಯ ಗೇಟ್ ಬೆಳಗ್ಗೆ 7:45 ಕ್ಕೆ ತೆರೆಯುತ್ತದೆ ಮತ್ತು ಸಂಜೆ 7:00 ಕ್ಕೆ ಮುಚ್ಚುತ್ತದೆ. ಬಾಲಕರ ಹಾಸ್ಟೆಲ್ ಸಮಯ ರಾತ್ರಿ 9:00; ಬಾಲಕಿಯರ ಹಾಸ್ಟೆಲ್ ಸಮಯ ರಾತ್ರಿ 8:30.',
    category: 'hostel',
    verifiedSource: 'Hostel Code of Conduct 2024',
  },
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-exam-timetable',
    title: 'End-Semester Theory Exam Timetable - Odd Sem 2024-25',
    kannadaTitle: 'ಬೆಸ ಸೆಮಿಸ್ಟರ್ ಥಿಯರಿ ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ 2024-25',
    category: 'exams',
    publishedAt: '2 hours ago',
    officialBadge: 'Official',
    content: 'The university final timetable for 1st, 3rd, and 5th sem BCA/BBA is announced. Regular examination begins Nov 18, 2024. Download hall tickets before Nov 12.',
    kannadaContent: '1, 3 ಮತ್ತು 5 ನೇ ಸೆಮಿಸ್ಟರ್ BCA/BBA ಅಂತಿಮ ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ. ನವೆಂಬರ್ 12 ರೊಳಗೆ ಹಾಲ್ ಟಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
    pdfAttachment: {
      name: 'Circular_Ref_412.pdf',
      size: '1.2 MB',
      refNo: 'Ref #KA-2024/88',
    },
    hallTicketAvailable: true,
  },
  {
    id: 'notice-ignite-fest',
    title: 'IGNITE 2024 - Annual National Inter-Collegiate Cultural Fest',
    kannadaTitle: 'ಇಗ್ನೈಟ್ 2024 - ವಾರ್ಷಿಕ ರಾಷ್ಟ್ರೀಯ ಕಾಲೇಜು ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವ',
    category: 'events',
    publishedAt: '1 day ago',
    officialBadge: 'Student Council',
    eventDates: 'Nov 22 - 24, 2024',
    eventLocation: 'Main Auditorium & Quadrangle',
    bannerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeuTDlJ0l2jSBW1i9W71DLkeTGzDN0nIM_s_w1Nj35ek8UVt0xUFX10jtKeJeGRsoGxtVsquJdmwCo35fmOEpQjAClJ-NJ5SJFrRrVFNAoITlgmLjCj0DK_JuSXoKZz_vAVo9ot9psaYQW4gtpmFsaVQO4c0AXfsasxXnpRFnI_3aKxl37MahJUy4opi_0xujBBkmBOUJ-2qNoej9kyri3ZtYQk3w8yaIs11_oMX8n7X2DYOWxpmVx',
    content: 'Over 45 competitive events including Battle of Bands, Western Dance, Hack-Sprint, and Fine Arts. Cash prizes worth ₹2,50,000! Open for all undergraduate and postgraduate departments.',
    kannadaContent: 'ಬ್ಯಾಟಲ್ ಆಫ್ ಬ್ಯಾಂಡ್ಸ್, ವೆಸ್ಟರ್ನ್ ಡ್ಯಾನ್ಸ್, ಹ್ಯಾಕ್-ಸ್ಪ್ರಿಂಟ್ ಸೇರಿದಂತೆ 45ಕ್ಕೂ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳು. ₹2,50,000 ಬಹುಮಾನ!',
  },
  {
    id: 'notice-placements-drive',
    title: 'Campus Recruitment: Infosys & TCS for Final Year BCA',
    kannadaTitle: 'ಕ್ಯಾಂಪಸ್ ನೇಮಕಾತಿ: ಅಂತಿಮ ವರ್ಷದ BCA ಗೆ Infosys & TCS',
    category: 'placements',
    publishedAt: '2 days ago',
    officialBadge: 'Placement Cell',
    packageDetails: 'Package: ₹3.6 - 4.5 LPA',
    deadline: 'Register by Oct 28',
    content: 'Registration open for Systems Associate and Trainee roles. Minimum CGPA required: 6.5 with no active backlogs. Round 1 Online Assessment starts Nov 04 at Tech Park labs.',
    kannadaContent: 'ಸಿಸ್ಟಮ್ಸ್ ಅಸೋಸಿಯೇಟ್ ಹುದ್ದೆಗಳಿಗೆ ನೋಂದಣಿ ಆರಂಭವಾಗಿದೆ. ಕನಿಷ್ಠ 6.5 CGPA ಅಗತ್ಯವಿದೆ. ಆನ್‌ಲೈನ್ ಪರೀಕ್ಷೆ ನವೆಂಬರ್ 4 ರಂದು ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
  },
  {
    id: 'notice-holidays-schedule',
    title: 'Deepavali & Kannada Rajyotsava Holiday Schedule',
    kannadaTitle: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಮತ್ತು ದೀಪಾವಳಿ ರಜೆ',
    category: 'holidays',
    publishedAt: '3 days ago',
    officialBadge: 'Registrar',
    eventDates: 'Oct 31 to Nov 03',
    content: 'College offices, digital library, and lecture classes will remain suspended from Oct 31 through Nov 03 on account of Deepavali and Kannada Rajyotsava. Regular classes resume Monday, Nov 04.',
    kannadaContent: 'ದೀಪಾವಳಿ ಮತ್ತು ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ನಿಮಿತ್ತ ಅಕ್ಟೋಬರ್ 31 ರಿಂದ ನವೆಂಬರ್ 03 ರವರೆಗೆ ಕಾಲೇಜಿಗೆ ರಜೆ ಇರುತ್ತದೆ. ತರಗತಿಗಳು ನವೆಂಬರ್ 04 ರಂದು ಪುನರಾರಂಭಗೊಳ್ಳುತ್ತವೆ.',
  },
];

const INITIAL_ESCALATIONS: EscalatedQuery[] = [
  {
    id: 'esc-1',
    studentName: 'Karan N.',
    usn: '1BC22CS044',
    semester: '4th Sem',
    category: 'Transport / Welfare',
    query: '“Special concession for sports quota bus passes this semester? BMTC counter asking verification slip.”',
    timeAgo: '12m ago',
    status: 'pending',
  },
  {
    id: 'esc-2',
    studentName: 'Sneha V.',
    usn: '1BC23BC019',
    semester: '2nd Sem',
    category: 'Examination Cell',
    query: '“Revaluation date for Supplementary Exam BCA 2023 batch? Result sheet shows withheld without code.”',
    timeAgo: '34m ago',
    status: 'pending',
  },
  {
    id: 'esc-3',
    studentName: 'Manoj Kumar',
    usn: '1BC22BA088',
    semester: '3rd Sem BBA',
    category: 'Accounts & Fees',
    query: '“Need fee payment extension due to agricultural loan disbursement delay from Grameena Bank.”',
    timeAgo: '1h ago',
    status: 'pending',
  },
];

const INITIAL_CAMPUS_TIMINGS: CampusTiming[] = [
  {
    department: 'Campus Working Hours',
    hours: '8:30 AM – 5:00 PM',
    hoursKn: 'ಬೆಳಗ್ಗೆ 8:30 – ಸಂಜೆ 5:00',
    isOpen: true,
    notes: 'Main Gates Open 7:45 AM',
    subLocation: 'Central College Campus',
  },
  {
    department: 'Central Library',
    hours: '8:30 AM – 6:00 PM (Sat 9:00 AM – 1:30 PM)',
    hoursKn: 'ಬೆಳಗ್ಗೆ 8:30 – ಸಂಜೆ 6:00 (ಶನಿವಾರ 1:30 ರವರೆಗೆ)',
    isOpen: true,
    notes: 'Reading Room open till 4:00 PM Saturdays',
    subLocation: 'Library Block, Ground Floor',
  },
  {
    department: 'Fee & Accounts Counter',
    hours: '9:30 AM – 3:30 PM',
    hoursKn: 'ಬೆಳಗ್ಗೆ 9:30 – ಮಧ್ಯಾಹ್ನ 3:30',
    isOpen: true,
    notes: 'Lunch break 1:30 PM - 2:00 PM',
    subLocation: 'Administrative Block Room #102',
  },
  {
    department: 'Registrar & Admissions Desk',
    hours: '10:00 AM – 5:00 PM',
    hoursKn: 'ಬೆಳಗ್ಗೆ 10:00 – ಸಂಜೆ 5:00',
    isOpen: true,
    notes: 'Student visiting hours: 2:00 PM – 4:00 PM',
    subLocation: 'Main Block 1st Floor',
  },
  {
    department: 'Computer & Science Labs',
    hours: '8:30 AM – 4:30 PM',
    hoursKn: 'ಬೆಳಗ್ಗೆ 8:30 – ಸಂಜೆ 4:30',
    isOpen: true,
    notes: 'Lab Assistant supervision mandatory',
    subLocation: 'Tech Park Block',
  },
];

export const STUDENT_USER: UserProfile = {
  id: 'usr-student-rahul',
  role: 'student',
  name: 'Rahul S.',
  idNumber: 'U21BC408',
  department: 'Department of Computer Applications (BCA)',
  semester: 'Semester 3 • Active',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu17u_V7cSwoXisT3HjQ6eXxP3L2YBqY31KYEmTl-ARoXnTMpZRq2XQPUQtNTmvdzFqWmXmW2-MO7c8yriuWnPhOP4oQHJ66QmYHmZHTIQzSnmTNbpUlDJFCbVTw2sZJqia6DnAGnIIXFJbZd4f7-hl6G7QeGsfElHgVnontwt9O3ufae1Eyu7-OZTjkqqqE4NI96AVVig-YPl_wYZit1tMp-OJwDnu2tbO7u8sH-PHnFzDsPXFodZ',
};

export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-sharma',
  role: 'admin',
  name: 'Prof. S. Sharma',
  idNumber: 'KA-ADM-4092',
  department: 'HOD / Admin Desk • Academic Affairs',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal-fee-inst1',
    title: '1st Installment Fee Deadline (Odd Sem)',
    titleKn: '1ನೇ ಕಂತಿನ ಶುಲ್ಕ ಪಾವತಿ ಕೊನೆಯ ದಿನಾಂಕ',
    date: '2024-10-25',
    month: '2024-10',
    time: '3:30 PM',
    category: 'deadline',
    description: '60% tuition fee due date without penalty under Circular No. ADM/2024/88. Late fine ₹50/day applicable after.',
    descriptionKn: 'ಅಧಿಕೃತ ಸುತ್ತೋಲೆ #ADM/2024/88 ರಂತೆ ದಂಡವಿಲ್ಲದೆ 60% ಶುಲ್ಕ ಪಾವತಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ.',
    venue: 'Accounts Counter / SBI Collect',
    officialRef: 'Circular #ADM/2024/88',
    reminderSet: true,
    reminderNoticeTime: '1 day before',
  },
  {
    id: 'cal-deepavali',
    title: 'Deepavali & Kannada Rajyotsava Vacation',
    titleKn: 'ದೀಪಾವಳಿ ಮತ್ತು ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ರಜೆ',
    date: '2024-10-31',
    endDate: '2024-11-03',
    month: '2024-10',
    category: 'holiday',
    description: 'Campus offices, digital library, and lecture classes suspended. Normal operations resume Monday, Nov 04.',
    descriptionKn: 'ದೀಪಾವಳಿ ಮತ್ತು ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ನಿಮಿತ್ತ ಕಾಲೇಜು ಕಚೇರಿ ಮತ್ತು ತರಗತಿಗಳಿಗೆ ಸಾರ್ವಜನಿಕ ರಜೆ.',
    venue: 'State Holiday',
    officialRef: 'Govt. Gazetted Notification',
  },
  {
    id: 'cal-practical-exams',
    title: 'Odd Semester Practical Lab Examinations',
    titleKn: 'ಬೆಸ ಸೆಮಿಸ್ಟರ್ ಪ್ರಾಯೋಗಿಕ ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳು',
    date: '2024-11-08',
    endDate: '2024-11-15',
    month: '2024-11',
    time: '9:30 AM - 4:30 PM',
    category: 'exam',
    description: 'Internal & external examiner viva and programming lab practicals for BCA, B.Sc & Science streams.',
    descriptionKn: 'BCA ಮತ್ತು ವಿಜ್ಞಾನ ವಿಭಾಗದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಲ್ಯಾಬ್ ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆಗಳು ಪ್ರಾರಂಭ.',
    venue: 'Tech Park Labs 1, 2 & 3',
    officialRef: 'Exam Board Order #401',
    reminderSet: true,
    reminderNoticeTime: '2 days before',
  },
  {
    id: 'cal-exam-form',
    title: 'Odd Sem Exam Form Submission Deadline',
    titleKn: 'ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಅಂತಿಮ ಗಡುವು',
    date: '2024-11-10',
    month: '2024-11',
    time: '5:00 PM',
    category: 'deadline',
    description: 'Final date to submit regular examination registration forms without late penalty. Online portal closes 5 PM.',
    descriptionKn: 'ದಂಡವಿಲ್ಲದೆ ಪರೀಕ್ಷಾ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ. ಸಂಜೆ 5:00 ಕ್ಕೆ ಪೋರ್ಟಲ್ ಮುಚ್ಚುತ್ತದೆ.',
    venue: 'University Student Portal',
    officialRef: 'Circular #KA-2024/88',
    reminderSet: true,
    reminderNoticeTime: '1 day before',
  },
  {
    id: 'cal-hall-ticket',
    title: 'Digital Hall Tickets Portal Release',
    titleKn: 'ಡಿಜಿಟಲ್ ಹಾಲ್ ಟಿಕೆಟ್ ಬಿಡುಗಡೆ',
    date: '2024-11-14',
    month: '2024-11',
    time: '11:00 AM',
    category: 'academic',
    description: 'Admit cards with student photos, QR codes, and exam center room numbers available for download.',
    descriptionKn: 'ಪರೀಕ್ಷಾ ಕೇಂದ್ರ ಮತ್ತು ಕೊಠಡಿ ಸಂಖ್ಯೆಗಳೊಂದಿಗೆ ಹಾಲ್ ಟಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಲಭ್ಯ.',
    venue: 'Student Portal & Exam Desk',
    officialRef: 'Office of COE #89',
  },
  {
    id: 'cal-kanakadasa',
    title: 'Kanakadasa Jayanthi Holiday',
    titleKn: 'ಕನಕದಾಸ ಜಯಂತಿ ರಜೆ',
    date: '2024-11-18',
    month: '2024-11',
    category: 'holiday',
    description: 'College closed on account of Kanakadasa Jayanthi. Scheduled exam papers shifted as per revised timetable.',
    descriptionKn: 'ಕನಕದಾಸ ಜಯಂತಿಯ ಪ್ರಯುಕ್ತ ಕಾಲೇಜಿಗೆ ಸರ್ಕಾರಿ ರಜೆ.',
    venue: 'Public Holiday',
    officialRef: 'Karnataka Govt. Calendar',
  },
  {
    id: 'cal-theory-exams',
    title: 'Odd Semester Theory Examinations (SEE)',
    titleKn: 'ಬೆಸ ಸೆಮಿಸ್ಟರ್ ಥಿಯರಿ ಪರೀಕ್ಷೆಗಳು',
    date: '2024-11-19',
    endDate: '2024-11-28',
    month: '2024-11',
    time: '10:00 AM - 1:00 PM',
    category: 'exam',
    description: 'Semester End Theory Examinations for BCA, BBA, MCA, MBA under NEP 2020 scheme.',
    descriptionKn: 'NEP 2020 ನಿಯಮಾವಳಿಯಂತೆ BCA, BBA ಮತ್ತು MBA ಸೆಮಿಸ್ಟರ್ ಥಿಯರಿ ಪರೀಕ್ಷೆಗಳು.',
    venue: 'Examination Block Quadrangle',
    officialRef: 'Time-Table Circular Ref_412',
    reminderSet: true,
    reminderNoticeTime: '1 day before',
  },
  {
    id: 'cal-ignite',
    title: 'IGNITE 2024 - National Cultural Fest',
    titleKn: 'ಇಗ್ನೈಟ್ 2024 - ವಾರ್ಷಿಕ ರಾಷ್ಟ್ರೀಯ ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವ',
    date: '2024-11-22',
    endDate: '2024-11-24',
    month: '2024-11',
    category: 'event',
    description: 'Inter-collegiate youth fest featuring 45+ competitive events, Battle of the Bands, and Fine Arts.',
    descriptionKn: 'ಬ್ಯಾಟಲ್ ಆಫ್ ಬ್ಯಾಂಡ್ಸ್ ಮತ್ತು ನೃತ್ಯ ಸ್ಪರ್ಧೆಗಳನ್ನೊಳಗೊಂಡ 45ಕ್ಕೂ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳು.',
    venue: 'Main Auditorium & Quadrangle',
    officialRef: 'Student Council Notice',
  },
  {
    id: 'cal-fee-inst2',
    title: '2nd Installment Fee Due Date (Odd Sem)',
    titleKn: '2ನೇ ಕಂತಿನ ಶುಲ್ಕ ಪಾವತಿ ಅಂತಿಮ ದಿನಾಂಕ',
    date: '2024-12-10',
    month: '2024-12',
    time: '3:30 PM',
    category: 'deadline',
    description: 'Final 40% balance tuition fee installment deadline before semester closure.',
    descriptionKn: 'ಸೆಮಿಸ್ಟರ್ ಮುಕ್ತಾಯದ ಮುನ್ನ ಉಳಿದ 40% ಬೋಧನಾ ಶುಲ್ಕ ಪಾವತಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ.',
    venue: 'Accounts Counter / Online SBI',
    officialRef: 'Finance Desk Order #12',
    reminderSet: false,
  },
  {
    id: 'cal-odd-results',
    title: 'Odd Semester Examination Results Notification',
    titleKn: 'ಬೆಸ ಸೆಮಿಸ್ಟರ್ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ ಪ್ರಕಟಣೆ',
    date: '2024-12-18',
    month: '2024-12',
    time: '4:00 PM',
    category: 'academic',
    description: 'Online marks sheet publication and Grade Point Average (GPA) ledger release on University portal.',
    descriptionKn: 'ವಿಶ್ವವಿದ್ಯಾಲಯದ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅಧಿಕೃತ ಅಂಕಪಟ್ಟಿ ಮತ್ತು ಜಿಪಿಎ ಬಿಡುಗಡೆ.',
    venue: 'Online Result Portal',
    officialRef: 'COE Result Board',
  },
  {
    id: 'cal-winter-vacation',
    title: 'Winter Break & Semester End Recess',
    titleKn: 'ಚಳಿಗಾಲದ ರಜೆ ಮತ್ತು ಸೆಮಿಸ್ಟರ್ ವಿರಾಮ',
    date: '2024-12-20',
    endDate: '2025-01-02',
    month: '2024-12',
    category: 'holiday',
    description: 'Winter vacation for undergraduate students and teaching faculty. Administrative counters open till 2 PM.',
    descriptionKn: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮತ್ತು ಅಧ್ಯಾಪಕರಿಗೆ ಚಳಿಗಾಲದ ಸೆಮಿಸ್ಟರ್ ವಿರಾಮ.',
    venue: 'Campus Wide',
    officialRef: 'Academic Council Calendar',
  },
  {
    id: 'cal-even-sem',
    title: 'Commencement of Even Semester Classes (2024-25)',
    titleKn: 'ಸಮ ಸೆಮಿಸ್ಟರ್ ತರಗತಿಗಳ ಪ್ರಾರಂಭ (2024-25)',
    date: '2025-01-06',
    month: '2025-01',
    time: '8:30 AM',
    category: 'academic',
    description: 'Regular timetable lectures commence for 4th and 6th semester BCA/BBA students.',
    descriptionKn: '4 ಮತ್ತು 6 ನೇ ಸೆಮಿಸ್ಟರ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ನಿಯಮಿತ ತರಗತಿಗಳು ಪ್ರಾರಂಭ.',
    venue: 'Respective Department Lecture Halls',
    officialRef: 'Registrar Notification #BC-2025',
    reminderSet: true,
    reminderNoticeTime: '1 day before',
  },
  {
    id: 'cal-reval-date',
    title: 'Revaluation & Photocopy Application Deadline',
    titleKn: 'ಮರುಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಜೆರಾಕ್ಸ್ ಪ್ರತಿ ಅರ್ಜಿ ಕೊನೆಯ ದಿನಾಂಕ',
    date: '2025-01-12',
    month: '2025-01',
    time: '4:00 PM',
    category: 'deadline',
    description: 'Last date to submit revaluation application (₹650/paper) and answer script photocopy request (₹350/paper).',
    descriptionKn: 'ಥಿಯರಿ ಪೇಪರ್ ಮರುಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಉತ್ತರ ಪತ್ರಿಕೆಯ ಪ್ರತಿಯನ್ನು ಪಡೆಯಲು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ.',
    venue: 'Examination Cell Window #2',
    officialRef: 'Evaluation Ordinance §19',
  },
  {
    id: 'cal-republic-day',
    title: 'Republic Day Celebration & Holiday',
    titleKn: 'ಗಣರಾಜ್ಯೋತ್ಸವ ಮತ್ತು ಸಾರ್ವಜನಿಕ ರಜೆ',
    date: '2025-01-26',
    month: '2025-01',
    time: '8:00 AM Flag Hoisting',
    category: 'holiday',
    description: 'National holiday. Flag hoisting at 8:00 AM in Main Campus Quadrangle by Vice-Chancellor.',
    descriptionKn: 'ರಾಷ್ಟ್ರೀಯ ಹಬ್ಬ. ಮುಖ್ಯ ಕ್ಯಾಂಪಸ್ ಮೈದಾನದಲ್ಲಿ ಬೆಳಗ್ಗೆ 8:00 ಕ್ಕೆ ಧ್ವಜಾರೋಹಣ.',
    venue: 'Main Campus Quadrangle',
    officialRef: 'National Holiday',
  },
];

// Supabase Local Store Helper Keys
const STORAGE_PREFIX = 'campus_help_supabase_';
const KEYS = {
  COURSES: `${STORAGE_PREFIX}courses`,
  FAQS: `${STORAGE_PREFIX}faqs`,
  NOTICES: `${STORAGE_PREFIX}notices`,
  ESCALATIONS: `${STORAGE_PREFIX}escalations`,
  TIMINGS: `${STORAGE_PREFIX}timings`,
  CALENDAR: `${STORAGE_PREFIX}calendar_events`,
  USER: `${STORAGE_PREFIX}active_user`,
  AUDIT_LOG: `${STORAGE_PREFIX}audit_log`,
  CONFIG: `${STORAGE_PREFIX}config`,
};

class SupabaseService {
  private config: { url: string; anonKey: string; isConnected: boolean } = {
    url: 'https://mock-campus-db.supabase.co',
    anonKey: 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    isConnected: true,
  };

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (!localStorage.getItem(KEYS.COURSES)) {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    }
    if (!localStorage.getItem(KEYS.FAQS)) {
      localStorage.setItem(KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
    }
    if (!localStorage.getItem(KEYS.NOTICES)) {
      localStorage.setItem(KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
    }
    if (!localStorage.getItem(KEYS.ESCALATIONS)) {
      localStorage.setItem(KEYS.ESCALATIONS, JSON.stringify(INITIAL_ESCALATIONS));
    }
    if (!localStorage.getItem(KEYS.TIMINGS)) {
      localStorage.setItem(KEYS.TIMINGS, JSON.stringify(INITIAL_CAMPUS_TIMINGS));
    }
    if (!localStorage.getItem(KEYS.CALENDAR)) {
      localStorage.setItem(KEYS.CALENDAR, JSON.stringify(INITIAL_CALENDAR_EVENTS));
    }
    if (!localStorage.getItem(KEYS.USER)) {
      localStorage.setItem(KEYS.USER, JSON.stringify(STUDENT_USER));
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOG)) {
      const initialLogs = [
        { time: 'Today 08:30 AM', event: 'Database Cluster: pgvector-asia-south1 synced with RLS enabled' },
        { time: 'Today 09:15 AM', event: 'Gemini Text-Embedding-004 indexed 342 bilingual vectors' },
        { time: 'Today 10:00 AM', event: 'Circular #KA-2024/88 verified and broadcasted by Registrar' },
      ];
      localStorage.setItem(KEYS.AUDIT_LOG, JSON.stringify(initialLogs));
    }
  }

  public getStatus() {
    return {
      healthy: true,
      cluster: 'pgvector-asia-south1',
      vectorModel: 'Gemini Text-Embedding-004',
      latencyMs: '0.4s',
      role: 'college_admin',
      rlsActive: true,
      url: this.config.url,
    };
  }

  public logAuditEvent(event: string) {
    try {
      const raw = localStorage.getItem(KEYS.AUDIT_LOG) || '[]';
      const logs = JSON.parse(raw);
      logs.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event,
      });
      localStorage.setItem(KEYS.AUDIT_LOG, JSON.stringify(logs.slice(0, 20)));
    } catch (e) {
      console.error('Audit log failed', e);
    }
  }

  public getAuditLogs(): { time: string; event: string }[] {
    try {
      const raw = localStorage.getItem(KEYS.AUDIT_LOG);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Active User session
  public getActiveUser(): UserProfile {
    try {
      const raw = localStorage.getItem(KEYS.USER);
      return raw ? JSON.parse(raw) : STUDENT_USER;
    } catch {
      return STUDENT_USER;
    }
  }

  public switchUser(role: 'student' | 'admin'): UserProfile {
    const user = role === 'student' ? STUDENT_USER : ADMIN_USER;
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    this.logAuditEvent(`Session switched to ${user.name} (${user.role})`);
    return user;
  }

  // Courses CRUD
  public async getCourses(): Promise<Course[]> {
    const raw = localStorage.getItem(KEYS.COURSES);
    return raw ? JSON.parse(raw) : INITIAL_COURSES;
  }

  public async addCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const courses = await this.getCourses();
    const newCourse: Course = { ...course, id: `course-${Date.now()}` };
    courses.push(newCourse);
    localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
    this.logAuditEvent(`Added new academic course: ${newCourse.code} (${newCourse.name})`);
    return newCourse;
  }

  public async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const courses = await this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    courses[index] = { ...courses[index], ...updates };
    localStorage.setItem(KEYS.COURSES, JSON.stringify(courses));
    this.logAuditEvent(`Updated course details for: ${courses[index].code}`);
    return courses[index];
  }

  // FAQs CRUD
  public async getFaqs(): Promise<FAQ[]> {
    const raw = localStorage.getItem(KEYS.FAQS);
    return raw ? JSON.parse(raw) : INITIAL_FAQS;
  }

  public async addFaq(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const faqs = await this.getFaqs();
    const newFaq: FAQ = { ...faq, id: `faq-${Date.now()}` };
    faqs.unshift(newFaq);
    localStorage.setItem(KEYS.FAQS, JSON.stringify(faqs));
    this.logAuditEvent(`Added verified FAQ: "${newFaq.question.slice(0, 30)}..." into Vector Store`);
    return newFaq;
  }

  public async deleteFaq(id: string): Promise<boolean> {
    const faqs = await this.getFaqs();
    const filtered = faqs.filter(f => f.id !== id);
    localStorage.setItem(KEYS.FAQS, JSON.stringify(filtered));
    this.logAuditEvent(`Deleted FAQ ID: ${id}`);
    return true;
  }

  // Notices CRUD
  public async getNotices(): Promise<Notice[]> {
    const raw = localStorage.getItem(KEYS.NOTICES);
    return raw ? JSON.parse(raw) : INITIAL_NOTICES;
  }

  public async addNotice(notice: Omit<Notice, 'id'>): Promise<Notice> {
    const notices = await this.getNotices();
    const newNotice: Notice = { ...notice, id: `notice-${Date.now()}` };
    notices.unshift(newNotice);
    localStorage.setItem(KEYS.NOTICES, JSON.stringify(notices));
    this.logAuditEvent(`Broadcasted official announcement: "${newNotice.title}"`);
    return newNotice;
  }

  // Escalated Queries
  public async getEscalatedQueries(): Promise<EscalatedQuery[]> {
    const raw = localStorage.getItem(KEYS.ESCALATIONS);
    return raw ? JSON.parse(raw) : INITIAL_ESCALATIONS;
  }

  public async resolveEscalatedQuery(id: string, responseAnswer: string): Promise<boolean> {
    const escalations = await this.getEscalatedQueries();
    const item = escalations.find(e => e.id === id);
    if (!item) return false;
    item.status = 'resolved';
    item.adminResponse = responseAnswer;
    localStorage.setItem(KEYS.ESCALATIONS, JSON.stringify(escalations));
    this.logAuditEvent(`Resolved escalation ticket from ${item.studentName} (USN: ${item.usn})`);
    return true;
  }

  public async assignEscalatedQuery(id: string, deskName: string): Promise<boolean> {
    const escalations = await this.getEscalatedQueries();
    const item = escalations.find(e => e.id === id);
    if (!item) return false;
    item.status = 'assigned';
    item.assignedTo = deskName;
    localStorage.setItem(KEYS.ESCALATIONS, JSON.stringify(escalations));
    this.logAuditEvent(`Assigned escalation query #${id} to ${deskName}`);
    return true;
  }

  // Campus Timings
  public async getCampusTimings(): Promise<CampusTiming[]> {
    const raw = localStorage.getItem(KEYS.TIMINGS);
    return raw ? JSON.parse(raw) : INITIAL_CAMPUS_TIMINGS;
  }

  public async updateCampusTimings(timings: CampusTiming[]): Promise<boolean> {
    localStorage.setItem(KEYS.TIMINGS, JSON.stringify(timings));
    this.logAuditEvent('Updated campus operational hours and counters');
    return true;
  }

  // Academic Calendar Events CRUD & Reminders with Offline Service Worker Sync
  public async getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      // Attempt to load from /api/calendar (intercepted and served by Service Worker if offline)
      const res = await fetch('/api/calendar', { cache: 'default' });
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events) && data.events.length > 0) {
          // Merge local reminder states with server calendar events
          const localRaw = localStorage.getItem(KEYS.CALENDAR);
          const localEvents: CalendarEvent[] = localRaw ? JSON.parse(localRaw) : [];
          const reminderMap = new Map(localEvents.map(e => [e.id, { reminderSet: e.reminderSet, reminderNoticeTime: e.reminderNoticeTime }]));

          const merged = data.events.map((ev: CalendarEvent) => {
            const local = reminderMap.get(ev.id);
            if (local) {
              return { ...ev, reminderSet: local.reminderSet, reminderNoticeTime: local.reminderNoticeTime };
            }
            return ev;
          });

          localStorage.setItem(KEYS.CALENDAR, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      // Offline fallback: load from local storage
      console.info('Offline on campus: Loading academic calendar from local cache', e);
    }

    const raw = localStorage.getItem(KEYS.CALENDAR);
    return raw ? JSON.parse(raw) : INITIAL_CALENDAR_EVENTS;
  }

  public async toggleCalendarEventReminder(id: string, noticeTime: string = '1 day before'): Promise<{ event: CalendarEvent; isSet: boolean } | null> {
    const events = await this.getCalendarEvents();
    const item = events.find(e => e.id === id);
    if (!item) return null;

    const isSet = !item.reminderSet;
    item.reminderSet = isSet;
    item.reminderNoticeTime = isSet ? noticeTime : undefined;

    localStorage.setItem(KEYS.CALENDAR, JSON.stringify(events));
    this.logAuditEvent(
      isSet
        ? `Reminder activated for ${item.title} (${item.date}) - Alert: ${noticeTime}`
        : `Reminder cancelled for ${item.title}`
    );

    return { event: item, isSet };
  }

  public async addCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const events = await this.getCalendarEvents();
    const newEvent: CalendarEvent = { ...event, id: `cal-${Date.now()}` };
    events.push(newEvent);
    localStorage.setItem(KEYS.CALENDAR, JSON.stringify(events));
    this.logAuditEvent(`Added academic calendar event: "${newEvent.title}" on ${newEvent.date}`);
    return newEvent;
  }

  // Export current knowledge base context string for Gemini grounding
  public async getDynamicKnowledgeContext(): Promise<string> {
    const faqs = await this.getFaqs();
    const notices = await this.getNotices();
    const timings = await this.getCampusTimings();

    let text = `LATEST NOTICES & CIRCULARS:\n`;
    notices.slice(0, 5).forEach(n => {
      text += `- [${n.category.toUpperCase()}] ${n.title}: ${n.content} (${n.publishedAt})\n`;
    });

    text += `\nOFFICIAL FREQUENTLY ASKED QUESTIONS:\n`;
    faqs.slice(0, 10).forEach(f => {
      text += `- Q: ${f.question} | Ans: ${f.answer} [Source: ${f.verifiedSource}]\n`;
    });

    text += `\nLATEST TIMINGS:\n`;
    timings.forEach(t => {
      text += `- ${t.department}: ${t.hours} (${t.notes})\n`;
    });

    return text;
  }
}

export const supabaseService = new SupabaseService();
