export type Language = 'en' | 'kn';

export interface Course {
  id: string;
  code: string;
  name: string;
  level: 'Undergraduate' | 'Postgraduate';
  tag: string;
  duration: string;
  semesters: number;
  electives: string;
  tuitionYear: number;
  tuitionDisplay: string;
  placementRate?: string;
  incubatorAccess?: string;
  specializationTrack?: string;
  eligibility: string;
  highlights: string[];
  dualSpecializations?: string[];
  syllabusPdfUrl?: string;
}

export interface Notice {
  id: string;
  title: string;
  kannadaTitle?: string;
  category: 'exams' | 'circulars' | 'events' | 'placements' | 'holidays';
  publishedAt: string;
  officialBadge: string;
  content: string;
  kannadaContent?: string;
  pdfAttachment?: {
    name: string;
    size: string;
    refNo: string;
  };
  eventDates?: string;
  eventLocation?: string;
  bannerImage?: string;
  packageDetails?: string;
  deadline?: string;
  hallTicketAvailable?: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  questionKn: string;
  answer: string;
  answerKn: string;
  category: 'timings' | 'fees' | 'exams' | 'admissions' | 'rules' | 'hostel';
  verifiedSource: string;
  actionType?: 'pdf' | 'fee_portal' | 'hall_ticket' | 'none';
  actionLabel?: string;
}

export interface EscalatedQuery {
  id: string;
  studentName: string;
  usn: string;
  semester: string;
  category: string;
  query: string;
  timeAgo: string;
  status: 'pending' | 'resolved' | 'assigned';
  assignedTo?: string;
  adminResponse?: string;
}

export interface CampusTiming {
  department: string;
  hours: string;
  hoursKn: string;
  isOpen: boolean;
  notes: string;
  subLocation: string;
}

export interface UserProfile {
  id: string;
  role: 'student' | 'admin';
  name: string;
  idNumber: string; // USN or Faculty ID
  department: string;
  semester?: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  kannadaQuery?: boolean;
  kannadaAnswer?: string;
  englishTranslation?: string;
  departmentSource?: string;
  verifiedSource?: string;
  installments?: {
    first: { percentage: string; dueDate: string };
    second: { percentage: string; dueDate: string };
    fineNotice: string;
  };
  facilityCards?: {
    title: string;
    subtitle: string;
    icon: string;
  }[];
  attachments?: {
    fileName: string;
    size: string;
    tag: string;
    downloadUrl?: string;
  }[];
  actions?: {
    type: 'fee_portal' | 'pdf' | 'hall_ticket';
    label: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  titleKn: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  time?: string;
  month: string; // e.g. "2024-10", "2024-11", "2024-12", "2025-01"
  category: 'exam' | 'holiday' | 'deadline' | 'event' | 'academic';
  description: string;
  descriptionKn: string;
  venue?: string;
  officialRef?: string;
  reminderSet?: boolean;
  reminderNoticeTime?: string;
}

