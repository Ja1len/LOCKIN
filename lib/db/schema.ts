import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  institution: text("institution").notNull().default(""),
  course: text("course").notNull().default(""),
  subjects: text("subjects").array().notNull().default([]),
  avatarInitial: text("avatar_initial").notNull(),
  theme: text("theme").notNull().default("clean"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  type: text("type").notNull(),
  capacity: integer("capacity").notNull().default(20),
  accent: text("accent").notNull().default("#2d6a4f"),
  hostUserId: uuid("host_user_id").references(() => users.id, { onDelete: "set null" }),
  hostRole: text("host_role"),
  discussionQuestion: text("discussion_question"),
  goal: text("goal"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  duration: integer("duration").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "set null" }),
  roomName: text("room_name"),
});

export const roomParticipants = pgTable(
  "room_participants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("Member"),
    isHost: boolean("is_host").notNull().default(false),
    handRaised: boolean("hand_raised").notNull().default(false),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.roomId, table.userId)]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    senderName: text("sender_name").notNull(),
    text: text("text").notNull(),
    tone: text("tone").notNull().default("bg-emerald-100 text-emerald-800"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("chat_messages_room_created_idx").on(table.roomId, table.createdAt)]
);

export const aiDocuments = pgTable("ai_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull(),
  cloudinaryUrl: text("cloudinary_url").notNull(),
  pageCount: integer("page_count"),
  fileSize: text("file_size"),
  topics: text("topics").array().notNull().default([]),
  questions: jsonb("questions").notNull().default([]),
  flashcards: jsonb("flashcards").notNull().default([]),
  summary: jsonb("summary").notNull().default({}),
  // Generation is split across multiple short serverless invocations (polled
  // by the client) to stay under Vercel Hobby's 10s function limit — a single
  // full-document generation call takes far longer than that.
  status: text("status").notNull().default("pending"), // 'pending' | 'ready' | 'failed'
  generationStep: text("generation_step").notNull().default("topics_summary"),
  extractedText: text("extracted_text"),
  errorMessage: text("error_message"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  documentId: uuid("document_id").references(() => aiDocuments.id, { onDelete: "set null" }),
  documentTitle: text("document_title").notNull(),
  subject: text("subject").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  percentage: integer("percentage").notNull(),
  strongTopics: text("strong_topics").array().notNull().default([]),
  weakTopics: text("weak_topics").array().notNull().default([]),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
});
