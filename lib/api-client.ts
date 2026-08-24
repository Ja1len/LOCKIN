"use client";

import type {
  UserProfile,
  StudySession,
  RoomData,
  AIDocument,
  QuizResultRecord,
  ThemeMode,
  Subject,
  Todo,
} from "./store";

async function json<T>(res: Response): Promise<T> {
  return res.json();
}

// ---- Profile ----

export async function getProfile(): Promise<UserProfile | null> {
  const res = await fetch("/api/profile");
  if (!res.ok) return null;
  const { profile } = await json<{ profile: any }>(res);
  if (!profile) return null;
  return {
    name: profile.name,
    institution: profile.institution,
    course: profile.course,
    email: profile.email,
    subjects: profile.subjects,
    avatarInitial: profile.avatarInitial,
    dailyGoalMinutes: profile.dailyGoalMinutes,
  };
}

export async function saveProfile(updates: {
  name?: string;
  institution?: string;
  course?: string;
  subjects?: Subject[];
  dailyGoalMinutes?: number;
}): Promise<UserProfile | null> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  const { profile } = await json<{ profile: any }>(res);
  return profile
    ? {
        name: profile.name,
        institution: profile.institution,
        course: profile.course,
        email: profile.email,
        subjects: profile.subjects,
        avatarInitial: profile.avatarInitial,
        dailyGoalMinutes: profile.dailyGoalMinutes,
      }
    : null;
}

export async function getTheme(): Promise<ThemeMode> {
  const res = await fetch("/api/profile");
  if (!res.ok) return "clean";
  const { profile } = await json<{ profile: any }>(res);
  return profile?.theme || "clean";
}

export async function saveTheme(theme: ThemeMode): Promise<void> {
  await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme }),
  });
}

// ---- Study sessions ----

export async function getSessions(): Promise<StudySession[]> {
  const res = await fetch("/api/sessions");
  if (!res.ok) return [];
  const { sessions } = await json<{ sessions: any[] }>(res);
  return sessions.map((s) => ({
    id: s.id,
    user: "",
    subject: s.subject,
    duration: s.duration,
    date: s.date,
    roomName: s.roomName ?? undefined,
  }));
}

export async function addSession(
  subject: Subject,
  duration = 25,
  roomName?: string
): Promise<StudySession | null> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, duration, roomName }),
  });
  if (!res.ok) return null;
  const { session } = await json<{ session: any }>(res);
  return session
    ? {
        id: session.id,
        user: "",
        subject: session.subject,
        duration: session.duration,
        date: session.date,
        roomName: session.roomName ?? undefined,
      }
    : null;
}

// ---- Rooms ----

export async function getRooms(): Promise<RoomData[]> {
  const res = await fetch("/api/rooms");
  if (!res.ok) return [];
  const { rooms } = await json<{ rooms: RoomData[] }>(res);
  return rooms;
}

export async function getRoomById(id: string): Promise<RoomData | undefined> {
  const res = await fetch(`/api/rooms/${id}`);
  if (!res.ok) return undefined;
  const { room } = await json<{ room: RoomData }>(res);
  return room;
}

export async function createRoom(input: {
  name: string;
  subject: Subject;
  topic: string;
  type: "Silent Focus" | "Teaching" | "Discussion";
}): Promise<RoomData | null> {
  const res = await fetch("/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  const { room } = await json<{ room: RoomData }>(res);
  return room;
}

export interface ChatMessage {
  id?: string;
  name: string;
  time: string;
  text: string;
  tone: string;
}

export async function getRoomMessages(roomId: string): Promise<ChatMessage[]> {
  const res = await fetch(`/api/rooms/${roomId}/messages`);
  if (!res.ok) return [];
  const { messages } = await json<{ messages: ChatMessage[] }>(res);
  return messages;
}

export async function sendRoomMessage(roomId: string, text: string): Promise<ChatMessage | null> {
  const res = await fetch(`/api/rooms/${roomId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) return null;
  const { message } = await json<{ message: ChatMessage }>(res);
  return message;
}

// ---- AI documents ----

function formatUploadedAt(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString();
}

function mapDocument(doc: any): AIDocument {
  return {
    id: doc.id,
    title: doc.title,
    subject: doc.subject,
    uploadedAt: formatUploadedAt(doc.uploadedAt),
    pageCount: doc.pageCount ?? 0,
    fileSize: doc.fileSize ?? "",
    topics: doc.topics ?? [],
    questions: doc.questions ?? [],
    flashcards: doc.flashcards ?? [],
    summary: doc.summary ?? { keyConcepts: [], formulas: [], takeaways: [] },
    status: doc.status,
    generationStep: doc.generationStep,
  };
}

export async function getDocuments(): Promise<AIDocument[]> {
  const res = await fetch("/api/documents");
  if (!res.ok) return [];
  const { documents } = await json<{ documents: any[] }>(res);
  return documents.filter((d) => d.status === "ready").map(mapDocument);
}

export async function uploadDocument(
  file: File,
  subject: Subject
): Promise<{ document?: AIDocument; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subject", subject);

  const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
  const data = await json<{ document?: any; error?: string }>(res);
  if (!res.ok) return { error: data.error || "Upload failed." };
  return { document: mapDocument(data.document) };
}

export async function advanceDocument(
  id: string
): Promise<{ document?: AIDocument; done: boolean; error?: string }> {
  const res = await fetch(`/api/documents/${id}/advance`, { method: "POST" });
  const data = await json<{ document?: any; done?: boolean; error?: string }>(res);
  if (!res.ok) return { done: true, error: data.error || "Generation failed." };
  return { document: mapDocument(data.document), done: !!data.done };
}

// ---- Quiz results ----

export async function getQuizResults(): Promise<QuizResultRecord[]> {
  const res = await fetch("/api/quiz-results");
  if (!res.ok) return [];
  const { results } = await json<{ results: any[] }>(res);
  return results.map((r) => ({
    id: r.id,
    documentId: r.documentId ?? undefined,
    documentTitle: r.documentTitle,
    subject: r.subject,
    score: r.score,
    totalQuestions: r.totalQuestions,
    percentage: r.percentage,
    date: r.date,
    strongTopics: r.strongTopics ?? [],
    weakTopics: r.weakTopics ?? [],
  }));
}

export async function saveQuizResult(
  result: Omit<QuizResultRecord, "id" | "date">
): Promise<QuizResultRecord | null> {
  const res = await fetch("/api/quiz-results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  if (!res.ok) return null;
  const { result: saved } = await json<{ result: any }>(res);
  return saved
    ? {
        id: saved.id,
        documentId: saved.documentId ?? undefined,
        documentTitle: saved.documentTitle,
        subject: saved.subject,
        score: saved.score,
        totalQuestions: saved.totalQuestions,
        percentage: saved.percentage,
        date: saved.date,
        strongTopics: saved.strongTopics ?? [],
        weakTopics: saved.weakTopics ?? [],
      }
    : null;
}

// ---- Todos ----

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch("/api/todos");
  if (!res.ok) return [];
  const { todos } = await json<{ todos: any[] }>(res);
  return todos.map((t) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    createdAt: t.createdAt,
    completedAt: t.completedAt ?? undefined,
  }));
}

export async function addTodo(title: string): Promise<Todo | null> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) return null;
  const { todo } = await json<{ todo: any }>(res);
  return todo
    ? { id: todo.id, title: todo.title, completed: todo.completed, createdAt: todo.createdAt, completedAt: todo.completedAt ?? undefined }
    : null;
}

export async function completeTodo(id: string): Promise<Todo | null> {
  const res = await fetch(`/api/todos/${id}`, { method: "PATCH" });
  if (!res.ok) return null;
  const { todo } = await json<{ todo: any }>(res);
  return todo
    ? { id: todo.id, title: todo.title, completed: todo.completed, createdAt: todo.createdAt, completedAt: todo.completedAt ?? undefined }
    : null;
}
