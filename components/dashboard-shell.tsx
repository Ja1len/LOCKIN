"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Check,
  Flame,
  History,
  Play,
  Plus,
  Settings2,
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
import { TodoList } from "@/components/todo-list";
import { StandalonePomodoroModal } from "@/components/pomodoro/standalone-pomodoro-modal";
import { type StudySession, type Subject, type RoomData, type QuizResultRecord, type UserProfile, type Todo } from "@/lib/store";
import { getProfile, getSessions, getRooms, getQuizResults, getTodos, saveProfile } from "@/lib/api-client";
import { calculateStudyStreak } from "@/lib/streak";
import { getTodaySessions, getTodayStudyMinutes, getDailyGoal, getGoalProgress, getSubjectStudyMinutes } from "@/lib/study-stats";

const EMPTY_PROFILE: UserProfile = {
  name: "Student",
  institution: "",
  course: "",
  email: "",
  subjects: [],
  avatarInitial: "S",
};

const GOAL_PRESETS = [30, 60, 90, 120, 180];

export function DashboardShell() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [targetSubject, setTargetSubject] = useState<Subject>("Physics");
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>([]);
  const [goalEditorOpen, setGoalEditorOpen] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState("");

  const refreshData = () => {
    getProfile().then((p) => p && setProfile(p));
    getSessions().then(setSessions);
    getRooms().then(setRooms);
    getQuizResults().then(setQuizResults);
    getTodos().then(setTodos);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const todaySessions = getTodaySessions(sessions);
  const totalTodayMinutes = getTodayStudyMinutes(sessions);
  const subjectMinutes = getSubjectStudyMinutes(todaySessions);
  const dailyGoal = getDailyGoal(profile);
  const goalProgress = getGoalProgress(totalTodayMinutes, dailyGoal);
  const streak = calculateStudyStreak(sessions);

  const hours = Math.floor(totalTodayMinutes / 60);
  const minutes = totalTodayMinutes % 60;
  const goalHoursLabel = dailyGoal % 60 === 0 ? `${dailyGoal / 60}h` : `${Math.floor(dailyGoal / 60)}h ${dailyGoal % 60}m`;

  // Determine weak topic recommendation from quiz results
  const latestResultWithWeakness = quizResults.find((r) => r.weakTopics && r.weakTopics.length > 0);
  const weakTopic = latestResultWithWeakness?.weakTopics[0] || "Electromagnetic Induction";
  const weakSubject = latestResultWithWeakness?.subject || "Physics";

  const handleSetGoal = async (value: number) => {
    setGoalEditorOpen(false);
    setCustomGoalInput("");
    setProfile((p) => ({ ...p, dailyGoalMinutes: value }));
    await saveProfile({ dailyGoalMinutes: value });
  };

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
                setTargetSubject(profile.subjects[0] || "Physics");
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
                {streak.current > 0 ? "You're building a great rhythm." : "Complete a focus block to start your streak."}
              </p>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#bfe3cf]">
                  <Flame size={24} className="fill-[#bfe3cf]" />
                </span>
                <div>
                  <p className="text-4xl font-extrabold tracking-tight">{streak.current}</p>
                  <p className="text-xs font-medium text-emerald-200/80 uppercase tracking-wider">
                    Days Active
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-200/60 block">All-time best</span>
                <span className="text-sm font-semibold text-emerald-100">{streak.best} days</span>
              </div>
            </div>
          </DashboardCard>

          {/* Today's Goal */}
          <DashboardCard
            title="Today's goal"
            description="Set a clear finish line for your day."
            action={
              <button
                onClick={() => setGoalEditorOpen((v) => !v)}
                aria-label="Edit daily goal"
                className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
              >
                <Settings2 size={14} />
              </button>
            }
          >
            <div className="flex items-center gap-3.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {goalProgress.completed ? <Check size={22} /> : <Target size={22} />}
              </span>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {goalHoursLabel} daily goal
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {goalProgress.completed
                    ? "✓ Completed"
                    : `${Math.floor(goalProgress.remaining / 60)}h ${goalProgress.remaining % 60}m remaining`}
                </p>
              </div>
            </div>
            <ProgressBar value={goalProgress.cappedPercent} className="mt-5" />

            {goalEditorOpen && (
              <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 space-y-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {GOAL_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSetGoal(preset)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                        dailyGoal === preset
                          ? "bg-emerald-800 text-white"
                          : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {preset >= 60 ? `${preset / 60}h` : `${preset}m`}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={5}
                    max={720}
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    placeholder="Custom minutes"
                    className="h-8 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white px-2 text-xs outline-none dark:bg-zinc-800"
                  />
                  <button
                    onClick={() => {
                      const val = parseInt(customGoalInput, 10);
                      if (val >= 5 && val <= 720) handleSetGoal(val);
                    }}
                    className="rounded-lg bg-emerald-800 px-3 text-xs font-semibold text-white"
                  >
                    Set
                  </button>
                </div>
              </div>
            )}
          </DashboardCard>

          {/* Today's Study Progress */}
          <DashboardCard
            title="Today's study progress"
            description={`You're ${goalProgress.percent}% of the way to your daily ${goalHoursLabel} goal.`}
          >
            <div className="flex items-end justify-between gap-4">
              <p className="text-3xl font-bold tracking-tight">
                {hours}h {minutes}m{" "}
                <span className="text-sm font-normal text-[var(--muted)]">of {goalHoursLabel}</span>
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {goalProgress.completed ? "Goal met 🎉" : `${goalProgress.remaining} min left`}
              </span>
            </div>
            <ProgressBar value={goalProgress.cappedPercent} className="mt-4" />
            <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-3 text-xs">
              {profile.subjects.length === 0 ? (
                <p className="text-[var(--muted)]">Add subjects on your profile to see a breakdown here.</p>
              ) : (
                profile.subjects.map((subject) => (
                  <div key={subject} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      {subject}
                    </span>
                    <span className="font-medium text-[var(--muted)]">{subjectMinutes[subject] ?? 0} min</span>
                  </div>
                ))
              )}
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

        {/* To-Do + AI Recommendation */}
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <TodoList todos={todos} onChange={setTodos} />

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
        </div>

        {/* Quick Actions */}
        <DashboardCard
          title="Quick actions"
          description="Jump straight into what you need."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
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
                setTargetSubject(profile.subjects[0] || "Mathematics");
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

            <Link href="/progress" className="w-full">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl border-[var(--line)] bg-[var(--card)] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left"
              >
                <History size={16} className="text-emerald-700" />
                <span className="font-medium text-xs sm:text-sm">View Progress</span>
                <Plus className="ml-auto text-zinc-400" size={15} />
              </Button>
            </Link>
          </div>
        </DashboardCard>
      </div>

      <StandalonePomodoroModal
        isOpen={pomodoroOpen}
        onClose={() => {
          setPomodoroOpen(false);
          refreshData();
        }}
        defaultSubject={targetSubject}
        subjects={profile.subjects}
        onSubjectsChange={(subjects) => {
          setProfile((p) => ({ ...p, subjects }));
          saveProfile({ subjects });
        }}
        onSessionComplete={() => refreshData()}
      />
    </AppShell>
  );
}
