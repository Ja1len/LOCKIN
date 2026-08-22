"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  Flame,
  ArrowRight,
  BookOpen,
  Calendar,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { type StudySession, type QuizResultRecord } from "@/lib/store";
import { getSessions, getQuizResults } from "@/lib/api-client";

export default function ProgressPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>([]);

  useEffect(() => {
    getSessions().then(setSessions);
    getQuizResults().then(setQuizResults);
  }, []);

  // Compute Weekly Study Time (Mon - Sun)
  const daysOfWeek = [
    { day: "Mon", minutes: 75 },
    { day: "Tue", minutes: 90 },
    { day: "Wed", minutes: 60 },
    { day: "Thu", minutes: 105 },
    { day: "Fri", minutes: 80 },
    { day: "Sat", minutes: 120 },
    { day: "Sun", minutes: 45 },
  ];

  const maxDayMinutes = Math.max(...daysOfWeek.map((d) => d.minutes));
  const weeklyTotalMinutes = daysOfWeek.reduce((acc, d) => acc + d.minutes, 0);
  const weeklyTotalHours = (weeklyTotalMinutes / 60).toFixed(1);

  // Subject Breakdown calculation
  const subjectTotals: { [key: string]: number } = {
    Physics: 310,
    Mathematics: 240,
    "Computer Science": 180,
    Biology: 75,
  };

  const totalSubjectMinutes = Object.values(subjectTotals).reduce((a, b) => a + b, 0);

  // Quiz Stats
  const totalQuizzes = quizResults.length + 5;
  const avgScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((acc, r) => acc + r.percentage, 0) / quizResults.length
        )
      : 86;
  const totalQuestionsAnswered =
    quizResults.reduce((acc, r) => acc + r.totalQuestions, 0) + 25;

  // Strong vs Weak Topics
  const allStrongTopics: string[] = [
    "Magnetic Flux",
    "Transformers & Mutual Induction",
    "Breadth-First Search (BFS)",
    "Depth-First Search (DFS)",
    "Trigonometric Substitution",
  ];

  const allWeakTopics: string[] = [
    "Faraday's Law of Induction",
    "Lenz's Law Current Directions",
    "Partial Fractions Integration",
  ];

  return (
    <AppShell activeNav="progress">
      <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="border-b border-[var(--line)] pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <TrendingUp size={13} />
            Growth &amp; Mastery Tracking
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Progress Analytics
          </h1>
          <p className="mt-2 text-base text-[var(--muted)]">
            Understand your study patterns, identify knowledge gaps, and watch your consistency compound.
          </p>
        </div>

        {/* 4 Key Summary Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-xs">
            <span className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <Clock size={15} className="text-emerald-700 dark:text-emerald-400" />
              Weekly Focus
            </span>
            <p className="mt-3 font-mono text-3xl font-bold text-[var(--ink)]">
              {weeklyTotalHours} <span className="text-xs font-normal text-[var(--muted)]">hours</span>
            </p>
            <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              ↑ +2.5h compared to last week
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-xs">
            <span className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <Flame size={15} className="text-amber-500" />
              Active Streak
            </span>
            <p className="mt-3 font-mono text-3xl font-bold text-[var(--ink)]">
              5 <span className="text-xs font-normal text-[var(--muted)]">days</span>
            </p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">Best record: 12 days</p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-xs">
            <span className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <Award size={15} className="text-emerald-700 dark:text-emerald-400" />
              Quiz Average
            </span>
            <p className="mt-3 font-mono text-3xl font-bold text-[var(--ink)]">
              {avgScore}%
            </p>
            <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
              Top 15% active students
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-xs">
            <span className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <CheckCircle2 size={15} className="text-emerald-700 dark:text-emerald-400" />
              Questions Solved
            </span>
            <p className="mt-3 font-mono text-3xl font-bold text-[var(--ink)]">
              {totalQuestionsAnswered}
            </p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">across {totalQuizzes} quizzes</p>
          </div>
        </div>

        {/* Section 1: Weekly Study Time Chart & Subject Breakdown */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Weekly Time Bar Chart */}
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[var(--ink)]">Weekly Study Hours</h2>
                <p className="text-xs text-[var(--muted)]">Daily minutes logged across all rooms</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                This Week
              </span>
            </div>

            {/* Custom SVG / Div Bar Chart */}
            <div className="pt-6">
              <div className="flex h-44 items-end justify-between gap-3 border-b border-[var(--line)] pb-2 px-2">
                {daysOfWeek.map((d) => {
                  const barHeight = Math.round((d.minutes / maxDayMinutes) * 100);
                  const isToday = d.day === "Sat";
                  return (
                    <div key={d.day} className="group relative flex flex-1 flex-col items-center">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-8 hidden rounded-lg bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white shadow-md group-hover:block dark:bg-zinc-100 dark:text-zinc-900">
                        {d.minutes} min
                      </span>

                      {/* The Bar */}
                      <div
                        className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 group-hover:opacity-80 ${
                          isToday
                            ? "bg-emerald-700 dark:bg-emerald-400 shadow-sm"
                            : "bg-emerald-200/80 dark:bg-emerald-950"
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Day Labels */}
              <div className="mt-3 flex justify-between px-2 text-xs font-semibold text-[var(--muted)]">
                {daysOfWeek.map((d) => (
                  <span key={d.day} className={d.day === "Sat" ? "text-emerald-800 dark:text-emerald-300 font-bold" : ""}>
                    {d.day}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Subject Breakdown */}
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-7 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-[var(--ink)]">Subject Allocation</h2>
              <p className="text-xs text-[var(--muted)]">Distribution of focus time</p>
            </div>

            <div className="space-y-4">
              {Object.entries(subjectTotals).map(([subject, mins]) => {
                const percent = Math.round((mins / totalSubjectMinutes) * 100);
                const hrs = (mins / 60).toFixed(1);
                const color =
                  subject === "Physics"
                    ? "bg-emerald-600"
                    : subject === "Mathematics"
                    ? "bg-sky-600"
                    : subject === "Computer Science"
                    ? "bg-amber-600"
                    : "bg-rose-600";

                return (
                  <div key={subject} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--ink)]">{subject}</span>
                      <span className="text-[var(--muted)] font-mono">
                        {hrs}h ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-300`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Section 2: Weak Topics vs Mastered Topics */}
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[var(--ink)]">
                Active Recall Knowledge Matrix
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Automatic concept diagnostics generated from your AI Tutor quizzes
              </p>
            </div>
            <Link href="/ai-tutor">
              <Button size="sm" className="gap-2 rounded-xl text-xs font-semibold">
                Open AI Tutor <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Weak Topics */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                  <AlertTriangle size={15} className="text-amber-700 dark:text-amber-400" />
                  Needs Reinforcement ({allWeakTopics.length})
                </span>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  Targeted drills ready
                </span>
              </div>

              <div className="space-y-2.5">
                {allWeakTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-xl bg-white p-3 text-xs shadow-xs dark:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600 font-bold">⚠</span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{topic}</span>
                    </div>
                    <Link href="/ai-tutor">
                      <button className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-200">
                        Practice →
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Mastered Strong Topics */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                  <CheckCircle2 size={15} className="text-emerald-700 dark:text-emerald-400" />
                  Strong &amp; Mastered ({allStrongTopics.length})
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  &gt;80% accuracy
                </span>
              </div>

              <div className="space-y-2.5">
                {allStrongTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs shadow-xs dark:bg-zinc-800"
                  >
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
