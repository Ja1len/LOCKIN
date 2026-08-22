"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Flame,
  History,
  Play,
  Plus,
  Sparkles,
  Target,
  Upload,
  UsersRound,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DashboardCard } from "@/components/dashboard-card";
import { ProgressBar } from "@/components/progress-bar";
import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { StandalonePomodoroModal } from "@/components/pomodoro/standalone-pomodoro-modal";
import { type StudySession, type Subject, type RoomData, type QuizResultRecord, type UserProfile } from "@/lib/store";
import { getProfile, getSessions, getRooms, getQuizResults } from "@/lib/api-client";

const EMPTY_PROFILE: UserProfile = {
  name: "Student",
  institution: "",
  course: "",
  email: "",
  subjects: [],
  avatarInitial: "S",
};

export function DashboardShell() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [targetSubject, setTargetSubject] = useState<Subject>("Physics");
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>([]);

  const refreshData = () => {
    getProfile().then((p) => p && setProfile(p));
    getSessions().then(setSessions);
    getRooms().then(setRooms);
    getQuizResults().then(setQuizResults);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Calculate today's study minutes
  const todayStr = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === todayStr
  );
  
  // Calculate breakdown by subject for today (with default base for realistic demo)
  const mathMinutes = todaySessions
    .filter((s) => s.subject === "Mathematics")
    .reduce((acc, s) => acc + s.duration, 45);
  const csMinutes = todaySessions
    .filter((s) => s.subject === "Computer Science")
    .reduce((acc, s) => acc + s.duration, 25);
  const physicsMinutes = todaySessions
    .filter((s) => s.subject === "Physics")
    .reduce((acc, s) => acc + s.duration, 10);
  const biologyMinutes = todaySessions
    .filter((s) => s.subject === "Biology")
    .reduce((acc, s) => acc + s.duration, 0);

  const totalTodayMinutes = mathMinutes + csMinutes + physicsMinutes + biologyMinutes;
  const targetMinutes = 120; // 2 hours
  const hours = Math.floor(totalTodayMinutes / 60);
  const minutes = totalTodayMinutes % 60;
  const progressPercent = Math.min(100, Math.round((totalTodayMinutes / targetMinutes) * 100));

  // Determine weak topic recommendation from quiz results
  const latestResultWithWeakness = quizResults.find((r) => r.weakTopics && r.weakTopics.length > 0);
  const weakTopic = latestResultWithWeakness?.weakTopics[0] || "Electromagnetic Induction";
  const weakSubject = latestResultWithWeakness?.subject || "Physics";

  return (
    <AppShell activeNav="home">
      <div className="mx-auto max-w-5xl space-y-7 animate-in fade-in duration-300">
        {/* Top Greeting Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[var(--line)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              Ready to lock in?
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Good morning, {profile.name} 👋
            </h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              A clear desk, a fresh start. Let&apos;s make today count.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setTargetSubject("Physics");
                setPomodoroOpen(true);
              }}
              className="gap-2 shadow-sm rounded-xl"
            >
              <Play size={16} />
              Start Focus Block
            </Button>
          </div>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Streak Card */}
          <DashboardCard className="bg-[#1b2920] text-white border-emerald-900/40">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
                <Sparkles size={13} />
                Momentum
              </span>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
                Study streak
              </h2>
              <p className="mt-1 text-sm text-emerald-100/70">
                You&apos;re building a great rhythm.
              </p>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#bfe3cf]">
                  <Flame size={24} className="fill-[#bfe3cf]" />
                </span>
                <div>
                  <p className="text-4xl font-extrabold tracking-tight">5</p>
                  <p className="text-xs font-medium text-emerald-200/80 uppercase tracking-wider">
                    Days Active
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-200/60 block">All-time best</span>
                <span className="text-sm font-semibold text-emerald-100">12 days</span>
              </div>
            </div>
          </DashboardCard>

          {/* Today's Goal */}
          <DashboardCard
            title="Today's goal"
            description="Set a clear finish line for your day."
          >
            <div className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Target size={22} />
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  Complete 2 focus blocks
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {totalTodayMinutes >= 50 ? "2 of 2 completed 🎉" : "1 of 2 completed"}
                </p>
              </div>
            </div>
            <ProgressBar
              value={totalTodayMinutes >= 50 ? 100 : 50}
              className="mt-5"
            />
            <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Block 1: Calculus (45m) ✓</span>
              <span>Block 2: Physics (25m)</span>
            </div>
          </DashboardCard>

          {/* Today's Study Progress */}
          <DashboardCard
            title="Today's study progress"
            description={`You're ${progressPercent}% of the way to your daily 2h goal.`}
          >
            <div className="flex items-end justify-between gap-4">
              <p className="text-3xl font-bold tracking-tight">
                {hours}h {minutes}m{" "}
                <span className="text-sm font-normal text-[var(--muted)]">of 2h</span>
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {Math.max(0, targetMinutes - totalTodayMinutes)} min left
              </span>
            </div>
            <ProgressBar value={progressPercent} className="mt-4" />
            <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Mathematics
                </span>
                <span className="font-medium text-[var(--muted)]">{mathMinutes} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-sky-600" />
                  Physics
                </span>
                <span className="font-medium text-[var(--muted)]">{physicsMinutes} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <span className="h-2 w-2 rounded-full bg-amber-600" />
                  Computer Science
                </span>
                <span className="font-medium text-[var(--muted)]">{csMinutes} min</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Active Study Rooms Preview */}
        <DashboardCard
          title="Active study rooms"
          description="Lock in alongside classmates in real-time."
          action={
            <Link
              href="/rooms"
              className="flex items-center gap-1 text-sm font-semibold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Browse all rooms <ChevronRight size={16} />
            </Link>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.slice(0, 3).map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                subject={room.subject}
                topic={room.topic}
                type={room.type}
                participants={room.participantCount}
                capacity={room.capacity}
                accent={room.accent}
                host={room.host}
              />
            ))}
          </div>
        </DashboardCard>

        {/* AI Recommendation & Quick Actions */}
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* AI Study Coach Recommendation */}
          <DashboardCard
            title="AI study coach"
            description="Personalized active recall based on your study history"
          >
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-800 shadow-sm dark:bg-[#162019] dark:text-emerald-300">
                  <Bot size={20} />
                </span>
                <div className="space-y-1">
                  <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Weak topic detected
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {weakSubject}: {weakTopic}
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                    Your recent quiz showed a gap in {weakTopic}. We recommend a 10-question active recall drill before your next focus block.
                  </p>
                  <div className="pt-2">
                    <Link href="/ai-tutor">
                      <Button size="sm" className="gap-2 rounded-xl">
                        Start Recall Practice
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Quick Actions */}
          <DashboardCard
            title="Quick actions"
            description="Jump straight into what you need."
          >
            <div className="grid gap-2.5">
              <Link href="/rooms/physics-focus" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 rounded-xl border-[var(--line)] bg-[var(--card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left"
                >
                  <History size={16} className="text-emerald-700" />
                  <span className="font-medium text-xs sm:text-sm">Continue Previous Session</span>
                  <Plus className="ml-auto text-zinc-400" size={15} />
                </Button>
              </Link>
              
              <Link href="/rooms" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 rounded-xl border-[var(--line)] bg-[var(--card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left"
                >
                  <UsersRound size={16} className="text-emerald-700" />
                  <span className="font-medium text-xs sm:text-sm">Join Study Room</span>
                  <Plus className="ml-auto text-zinc-400" size={15} />
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => {
                  setTargetSubject("Mathematics");
                  setPomodoroOpen(true);
                }}
                className="w-full justify-start gap-3 rounded-xl border-[var(--line)] bg-[var(--card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left"
              >
                <Play size={16} className="text-emerald-700" />
                <span className="font-medium text-xs sm:text-sm">Start Standalone Pomodoro</span>
                <Plus className="ml-auto text-zinc-400" size={15} />
              </Button>

              <Link href="/ai-tutor" className="w-full">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 rounded-xl border-[var(--line)] bg-[var(--card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left"
                >
                  <Upload size={16} className="text-emerald-700" />
                  <span className="font-medium text-xs sm:text-sm">Upload Notes to AI Tutor</span>
                  <Plus className="ml-auto text-zinc-400" size={15} />
                </Button>
              </Link>
            </div>
          </DashboardCard>
        </div>
      </div>

      <StandalonePomodoroModal
        isOpen={pomodoroOpen}
        onClose={() => {
          setPomodoroOpen(false);
          refreshData();
        }}
        defaultSubject={targetSubject}
        onSessionComplete={() => refreshData()}
      />
    </AppShell>
  );
}
