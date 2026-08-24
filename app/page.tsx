"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleUserRound,
  Eye,
  EyeOff,
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
  AlertCircle,
  School,
  GraduationCap,
  Lock,
  Mail,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type UserAccount,
} from "@/lib/auth";

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
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  const handleLoginSuccess = () => {
    router.push("/dashboard");
  };

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setView("login");
  };

  if (view === "login") {
    return (
      <AuthView
        initialMode={authMode}
        onBack={() => setView("landing")}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <Landing
      currentUser={currentUser}
      onOpenSignIn={() => handleOpenAuth("signin")}
      onOpenSignUp={() => handleOpenAuth("signup")}
    />
  );
}

function Landing({
  currentUser,
  onOpenSignIn,
  onOpenSignUp,
}: {
  currentUser: UserAccount | null;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
}) {
  const router = useRouter();

  const heroContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      {/* Streamlined Header: single contextual action button */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-10">
        <Mark />
        <div>
          {currentUser ? (
            <Button
              id="header-workspace-btn"
              onClick={() => router.push("/dashboard")}
              className="gap-2 rounded-xl text-sm font-semibold shadow-xs"
            >
              <span>Hi, {currentUser.name}</span>
              <ArrowRight size={15} />
            </Button>
          ) : (
            <Button
              id="header-signin-btn"
              variant="outline"
              onClick={onOpenSignIn}
              className="rounded-xl border-[var(--line)] bg-[var(--card)] text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-10 md:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={heroContainer}
          >
            <motion.div
              variants={heroItem}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 animate-pulse" />
              The Student Productivity Platform
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="max-w-xl text-5xl font-extrabold leading-[1.02] tracking-tight text-zinc-900 md:text-7xl"
            >
              Study together. <br />
              <span className="text-emerald-800">Lock in with intention.</span>
            </motion.h1>

            <motion.p variants={heroItem} className="max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg">
              LOCKIN is a calm, collaborative digital workspace for college students. Combine peer accountability rooms, structured Pomodoro focus, and AI-powered active recall quizzes.
            </motion.p>

            {/* Single Primary Call-to-Action */}
            <motion.div variants={heroItem} className="pt-2">
              {currentUser ? (
                <Button
                  id="hero-enter-btn"
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="gap-2 rounded-xl px-8 text-base font-semibold shadow-md hover:scale-[1.01] transition"
                >
                  Enter Workspace <ArrowRight size={18} />
                </Button>
              ) : (
                <Button
                  id="hero-lockin-btn"
                  size="lg"
                  onClick={onOpenSignUp}
                  className="gap-2 rounded-xl px-8 text-base font-semibold shadow-md hover:scale-[1.01] transition"
                >
                  Lock In Now <ArrowRight size={18} />
                </Button>
              )}
            </motion.div>

            <motion.div variants={heroItem} className="flex items-center gap-6 pt-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-700" /> Free for students
              </span>
              <span className="flex items-center gap-1.5">
                <Brain size={16} className="text-emerald-700" /> Active recall system
              </span>
              <span className="flex items-center gap-1.5">
                <Timer size={16} className="text-emerald-700" /> Built-in Pomodoro
              </span>
            </motion.div>
          </motion.section>

          {/* Right Hero Visual Card */}
          <motion.section
            className="relative"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            whileHover={{ y: -6, scale: 1.015 }}
          >
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
          </motion.section>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="mt-20 grid gap-6 border-t border-zinc-200 pt-10 md:grid-cols-3">
          <Value
            icon={<UsersRound size={20} />}
            title="Collaborative Accountability"
            text="Choose between Silent Focus, Peer Teaching, and Group Discussion rooms to match your study mode."
            delay={0}
          />
          <Value
            icon={<Brain size={20} />}
            title="Active Recall AI Tutor"
            text="Upload lecture notes to generate instant multi-question quizzes, smart flashcards, and conceptual summaries."
            delay={0.1}
          />
          <Value
            icon={<LayoutDashboard size={20} />}
            title="Progress Analytics"
            text="Automatically track daily focus hours, weekly streaks, and diagnose weak topic areas before exams."
            delay={0.2}
          />
        </div>
      </main>
    </div>
  );
}

function AuthView({
  initialMode = "signin",
  onBack,
  onSuccess,
}: {
  initialMode: "signin" | "signup";
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState("ailee@moe-dl.edu.my");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("KMPK");
  const [course, setCourse] = useState("Physical Science");

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await loginUser({ email, password });
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setErrorMessage(result.error || "Login failed. Please check your credentials.");
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await registerUser({
      name,
      email,
      password,
      institution,
      course,
    });
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setErrorMessage(result.error || "Failed to create account.");
    }
  };

  const handleQuickDemoLogin = async () => {
    const result = await loginUser({ email: "ailee@moe-dl.edu.my", password: "lockin123" });
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="grid min-h-screen bg-[var(--paper)] lg:grid-cols-2">
      {/* Left Form Column */}
      <section className="flex flex-col p-6 sm:p-10 justify-between">
        <div>
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition"
          >
            <Mark />
            <span className="hidden sm:inline text-zinc-400 group-hover:text-zinc-700">
              ← Back to home
            </span>
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8 sm:py-12">
          {/* Mode Switcher Tabs */}
          <div className="mb-6 flex rounded-xl bg-zinc-200/70 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage("");
              }}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-bold transition",
                mode === "signin"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-bold transition",
                mode === "signup"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          {mode === "signin" ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Ready to Lock In?
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Settle into your space.
              </h1>
              <p className="mt-2 text-xs text-zinc-500 sm:text-sm">
                Enter your student credentials to access your rooms and focus stats.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Start Your Journey
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Create your account.
              </h1>
              <p className="mt-2 text-xs text-zinc-500 sm:text-sm">
                Join students staying accountable and locking in every day.
              </p>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Student Email
                </label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="rounded-xl pr-9 text-sm"
                    required
                  />
                  <Mail size={16} className="absolute right-3 top-3 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                </div>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl pr-9 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-zinc-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full gap-2 rounded-xl py-2.5 font-semibold shadow-xs"
              >
                <span>{isSubmitting ? "Signing In..." : "Sign In to Workspace"}</span>
                <ArrowRight size={16} />
              </Button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full rounded-xl border border-dashed border-emerald-700/30 bg-emerald-50/70 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/70 transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="text-emerald-700" />
                  <span>1-Click Demo Login (Ailee)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up / Create Account Form */
            <form onSubmit={handleSignUp} className="mt-6 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ailee"
                    className="rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Student Email
                </label>
                <div className="relative mt-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ailee@moe-dl.edu.my"
                    className="rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700">
                    Institution
                  </label>
                  <Input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. KMPK"
                    className="mt-1 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700">
                    Course
                  </label>
                  <Input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. Physical Science"
                    className="mt-1 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Create Password (min 4 characters)
                </label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl pr-9 text-sm"
                    required
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full gap-2 rounded-xl py-2.5 font-semibold shadow-xs"
              >
                <span>{isSubmitting ? "Creating Account..." : "Create Account & Lock In"}</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          )}

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-zinc-500">
            {mode === "signin" ? (
              <span>
                New to LOCKIN?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-bold text-emerald-800 hover:underline"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have credentials?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-bold text-emerald-800 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </p>
        </div>

        <div className="text-center text-[11px] text-zinc-400">
          Peer accountability • Structured focus blocks • AI active recall
        </div>
      </section>

      {/* Right Column: Cleaned up green responsive showcase (no duplicate logo, no version text) */}
      <aside className="hidden bg-[#1b2920] p-12 lg:flex lg:flex-col lg:justify-between text-white relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Top Status Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-950/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready to Lock In?</span>
          </div>
        </div>

        {/* Central Content */}
        <div className="relative z-10 max-w-md space-y-6">
          <div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Study Together. <br />
              <span className="text-[#bfe3cf]">Focus Deeper. Excel.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-emerald-100/70">
              LOCKIN is built for college students who value deep concentration. Join peers in live focus rooms, set structured timers, and review lecture concepts with AI.
            </p>
          </div>

          {/* Interactive Live Status Widget */}
          <div className="rounded-2xl border border-emerald-800/40 bg-white/5 p-5 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <Flame size={15} className="text-amber-400" /> Live Accountability
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-200">
                142 students online
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="rounded-xl bg-black/20 p-3">
                <span className="text-[11px] text-emerald-200/60 block">Focus Mode</span>
                <span className="text-sm font-bold text-white">Silent Study</span>
              </div>
              <div className="rounded-xl bg-black/20 p-3">
                <span className="text-[11px] text-emerald-200/60 block">Avg. Session</span>
                <span className="text-sm font-bold text-white">45 Mins</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-200/70">
              <Check size={14} className="text-[#bfe3cf]" />
              <span>Personalized notes & quiz records saved automatically</span>
            </div>
          </div>
        </div>

        {/* Bottom Motivational Quote / Info */}
        <div className="relative z-10 text-xs text-emerald-200/60 flex items-center justify-between">
          <span>Your quiet digital study sanctuary</span>
          <span className="text-[11px] text-emerald-300/80 font-medium">⚡️ Zero Distractions</span>
        </div>
      </aside>
    </div>
  );
}

function Value({
  icon,
  title,
  text,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 shadow-xs dark:bg-emerald-950/60 dark:text-emerald-300">
        {icon}
      </span>
      <div>
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{text}</p>
      </div>
    </motion.div>
  );
}
