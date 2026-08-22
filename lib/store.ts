export type Subject = "Mathematics" | "Physics" | "Computer Science" | "Biology";

export interface UserProfile {
  name: string;
  institution: string;
  course: string;
  email: string;
  subjects: Subject[];
  avatarInitial: string;
}

export interface StudySession {
  id: string;
  user?: string;
  subject: Subject;
  duration: number; // in minutes
  date: string; // ISO date string
  roomName?: string;
}

export interface RoomData {
  id: string;
  name: string;
  subject: Subject;
  topic: string;
  type: "Silent Focus" | "Teaching" | "Discussion";
  participantCount: number;
  capacity: number;
  accent: string;
  host?: string;
  hostRole?: string;
  discussionQuestion?: string;
  goal?: string;
  participants: {
    name: string;
    initials: string;
    role: string;
    online: boolean;
    tone: string;
    isHost?: boolean;
    handRaised?: boolean;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface AIDocument {
  id: string;
  title: string;
  subject: Subject;
  uploadedAt: string;
  pageCount: number;
  fileSize: string;
  topics: string[];
  questions: QuizQuestion[];
  flashcards: {
    id: string;
    front: string;
    back: string;
    topic: string;
  }[];
  summary: {
    keyConcepts: string[];
    formulas: { name: string; formula: string; note: string }[];
    takeaways: string[];
  };
  status?: "pending" | "ready" | "failed";
  generationStep?: string;
}

export interface QuizResultRecord {
  id: string;
  documentId?: string;
  documentTitle: string;
  subject: Subject;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  strongTopics: string[];
  weakTopics: string[];
}

export type ThemeMode = "clean" | "focus" | "energy";
