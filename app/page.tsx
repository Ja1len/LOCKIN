"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleUserRound,
  Flame,
  LayoutDashboard,
  Leaf,
  LogOut,
  Palette,
  Sparkles,
  UsersRound,
  ShieldCheck,
  Brain,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function Mark({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-bold tracking-[-.05em]",
        dark ? "text-white" : "text-zinc-900"
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 place-items-center rounded-xl shadow-xs",
          dark ? "bg-[#bfe3cf] text-emerald-950" : "bg-emerald-800 text-white"
        )}
      >
        <Sparkles size={16} />
      </span>
      <span className="text-xl tracking-tight">lockin</span>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<"landing" | "login">("landing");
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  if (view === "login") {
    return (
      <Login
        onBack={() => setView("landing")}
        onContinue={handleLoginSuccess}
      />
    );
  }

  return (
    <Landing
      onLogin={() => setView("login")}
      onStart={() => setView("login")}
    />
  );
}

function Landing({
  onLogin,
  onStart,
}: {
  onLogin: () => void;
  onStart: () => void;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <Mark />
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onLogin} className="text-sm font-semibold">
            Log in <ArrowRight size={15} />
          </Button>
          <Button onClick={onStart} className="rounded-xl text-sm font-semibold shadow-xs">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 animate-pulse" />
              The Student Productivity Platform
            </div>

            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.02] tracking-tight text-zinc-900 md:text-7xl">
              Study together. <br />
              <span className="text-emerald-800">Lock in with intention.</span>
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg">
              LOCKIN is a calm, collaborative digital workspace for college students. Combine peer accountability rooms, structured Pomodoro focus, and AI-powered active recall quizzes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" onClick={onStart} className="gap-2 rounded-xl text-base font-semibold px-7 shadow-sm">
                Enter Your Workspace <ArrowRight size={17} />
              </Button>
              <Button size="lg" variant="outline" onClick={onLogin} className="rounded-xl text-base">
                I have an account
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-700" /> Free for students
              </span>
              <span className="flex items-center gap-1.5">
                <Brain size={16} className="text-emerald-700" /> Active recall system
              </span>
              <span className="flex items-center gap-1.5">
                <Timer size={16} className="text-emerald-700" /> Built-in Pomodoro
              </span>
            </div>
          </section>

          {/* Right Hero Visual Card */}
          <section className="relative">
            <div className="grain absolute -inset-6 -z-0 rounded-[3rem] bg-emerald-100/60" />
            <div className="relative rounded-3xl border border-emerald-900/10 bg-[#1b2920] p-6 shadow-2xl shadow-emerald-950/20 text-white sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Mark dark />
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Live Study Room
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-200/70">Saturday Study Block</p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Physics Focus Room
                </h2>
                <p className="mt-1 text-xs text-emerald-100/70">
                  Electromagnetic Induction • 18 students locked in
                </p>
              </div>

              {/* Large Timer Mini Preview */}
              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-200/80">Active Pomodoro</span>
                  <p className="font-mono text-3xl font-bold text-white">24:18</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-[#bfe3cf] font-semibold">
                    <Check size={14} /> In Flow
                  </span>
                  <p className="text-[11px] text-emerald-200/60">Silent Mode Active</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="h-2 flex-1 rounded-full bg-[#bfe3cf]" />
                <div className="h-2 w-1/3 rounded-full bg-white/20" />
              </div>
            </div>
          </section>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="mt-20 grid gap-6 border-t border-zinc-200 pt-10 md:grid-cols-3">
          <Value
            icon={<UsersRound size={20} />}
            title="Collaborative Accountability"
            text="Choose between Silent Focus, Peer Teaching, and Group Discussion rooms to match your study mode."
          />
          <Value
            icon={<Brain size={20} />}
            title="Active Recall AI Tutor"
            text="Upload PDF lecture notes to generate instant multi-question quizzes, smart flashcards, and conceptual summaries."
          />
          <Value
            icon={<LayoutDashboard size={20} />}
            title="Progress Analytics"
            text="Automatically track daily focus hours, weekly streaks, and diagnose weak topic areas before exams."
          />
        </div>
      </main>
    </div>
  );
}

function Login({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-2">
      <section className="flex flex-col p-6 sm:p-10">
        <button onClick={onBack} className="w-fit">
          <Mark />
        </button>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Welcome to LOCKIN
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">
            Settle in.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Sign in as demo student <strong className="text-zinc-800">Ailee</strong> to enter your study space.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onContinue();
            }}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-zinc-700">
                Student Email
              </label>
              <Input
                type="email"
                defaultValue="ailee@sunway.edu.my"
                className="mt-1.5 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700">
                Password
              </label>
              <Input
                type="password"
                defaultValue="lockin123"
                className="mt-1.5 rounded-xl"
                required
              />
            </div>

            <Button type="submit" className="mt-4 w-full rounded-xl py-2.5 font-semibold">
              Continue to Dashboard <ArrowRight size={16} />
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500">
            Demo credentials are pre-filled. Click continue to enter.
          </p>
        </div>
      </section>

      <aside className="hidden bg-[#1b2920] p-12 lg:flex lg:flex-col lg:justify-between text-white">
        <Mark dark />
        <div className="max-w-md">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Continuous Improvement
          </span>
          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white">
            Study. Focus. Recall. Improve.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/70">
            LOCKIN brings together everything you need to stay on track: real-time collaborative rooms, distraction-free timers, and AI-powered active recall quizzes.
          </p>
        </div>
        <p className="text-xs text-emerald-200/50">
          LOCKIN Version 0 · Student Productivity Platform
        </p>
      </aside>
    </div>
  );
}

function Value({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-300">
        {icon}
      </span>
      <div>
        <h3 className="font-bold text-[var(--ink)] text-base">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{text}</p>
      </div>
    </div>
  );
}
