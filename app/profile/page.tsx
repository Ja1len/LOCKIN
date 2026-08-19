"use client";

import { useState, useEffect } from "react";
import {
  CircleUserRound,
  Check,
  Plus,
  Trash2,
  Flame,
  Clock,
  Award,
  BookOpen,
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme-provider";
import {
  getProfile,
  saveProfile,
  getSessions,
  getQuizResults,
  type UserProfile,
  type Subject,
  type ThemeMode,
} from "@/lib/store";

export default function ProfilePage() {
  const { theme, setTheme, themes } = useTheme();
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [name, setName] = useState(profile.name);
  const [institution, setInstitution] = useState(profile.institution);
  const [course, setCourse] = useState(profile.course);
  const [email, setEmail] = useState(profile.email);
  const [subjects, setSubjects] = useState<Subject[]>(profile.subjects);
  const [newSubjectInput, setNewSubjectInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Statistics
  const sessions = getSessions();
  const quizResults = getQuizResults();

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0) + 120; // Base history for realistic demo
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedBlocks = sessions.length + 8;
  const avgQuizAccuracy =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce((acc, r) => acc + r.percentage, 0) / quizResults.length
        )
      : 85;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      institution: institution.trim(),
      course: course.trim(),
      email: email.trim(),
      subjects,
      avatarInitial: name.trim().charAt(0).toUpperCase() || "A",
    };
    setProfile(updated);
    saveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newSubjectInput.trim();
    if (!val) return;
    if (!subjects.includes(val as Subject)) {
      const updated = [...subjects, val as Subject];
      setSubjects(updated);
      const updatedProfile = { ...profile, subjects: updated };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
    }
    setNewSubjectInput("");
  };

  const handleRemoveSubject = (sub: Subject) => {
    const updated = subjects.filter((s) => s !== sub);
    setSubjects(updated);
    const updatedProfile = { ...profile, subjects: updated };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  return (
    <AppShell activeNav="profile">
      <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="border-b border-[var(--line)] pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CircleUserRound size={13} />
            Student Profile &amp; Preferences
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Personal Space
          </h1>
          <p className="mt-2 text-base text-[var(--muted)]">
            Manage your academic identity, enrolled subjects, and study environment.
          </p>
        </div>

        {/* 4 Quick Stat Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <Clock size={15} className="text-emerald-700 dark:text-emerald-400" />
              <span>Total Study</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--ink)]">
              {totalHours} <span className="text-xs font-normal text-[var(--muted)]">hrs</span>
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <CheckCircle2 size={15} className="text-emerald-700 dark:text-emerald-400" />
              <span>Focus Blocks</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--ink)]">
              {completedBlocks}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <Award size={15} className="text-emerald-700 dark:text-emerald-400" />
              <span>Quiz Accuracy</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--ink)]">
              {avgQuizAccuracy}%
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <Flame size={15} className="text-amber-500" />
              <span>Current Streak</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-[var(--ink)]">
              5 <span className="text-xs font-normal text-[var(--muted)]">days</span>
            </p>
          </div>
        </div>

        {/* Profile Details Form */}
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-[var(--line)] pb-6">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 font-mono text-2xl font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-xs">
              {profile.avatarInitial || "A"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">{profile.name}</h2>
              <p className="text-xs text-[var(--muted)]">
                {profile.course} • {profile.institution}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Full Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Institution / College
                </label>
                <Input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--muted)]">
                  Degree / Program
                </label>
                <Input
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" className="gap-2 rounded-xl px-6">
                <Save size={15} />
                Save Profile
              </Button>
              {savedSuccess && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
                  <Check size={14} /> Profile updated successfully.
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Enrolled Subjects Management */}
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[var(--ink)]">Enrolled Subjects</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Subjects appear in Pomodoro timers, study rooms, and progress tracking.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {subjects.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(sub)}
                  className="text-emerald-700 hover:text-rose-600 dark:text-emerald-400 dark:hover:text-rose-400"
                  aria-label={`Remove ${sub}`}
                >
                  <Trash2 size={13} />
                </button>
              </span>
            ))}
          </div>

          {/* Add Subject Input */}
          <form onSubmit={handleAddSubject} className="flex max-w-md gap-2 pt-2">
            <Input
              value={newSubjectInput}
              onChange={(e) => setNewSubjectInput(e.target.value)}
              placeholder="e.g. Linear Algebra, Economics"
              className="rounded-xl"
            />
            <Button type="submit" size="sm" variant="outline" className="gap-1.5 rounded-xl shrink-0">
              <Plus size={15} /> Add Subject
            </Button>
          </form>
        </section>

        {/* Theme Personalization (Module 6) */}
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-emerald-800 dark:text-emerald-300" />
                <h3 className="text-lg font-bold text-[var(--ink)]">Theme Personalization</h3>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Choose the visual atmosphere that enhances your concentration.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Active: {themes.find((t) => t.id === theme)?.name}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                    isSelected
                      ? "border-emerald-700 ring-2 ring-emerald-400 shadow-md"
                      : "border-[var(--line)] hover:border-zinc-300"
                  }`}
                >
                  <div className="h-24 p-4" style={{ background: item.bg }}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold" style={{ color: item.accent }}>
                        {item.name}
                      </span>
                      {isSelected && (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-700 text-white text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="mt-6 flex gap-1.5">
                      {item.swatches.map((color) => (
                        <span
                          key={color}
                          className="h-4 w-4 rounded-full border border-black/10 shadow-xs"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--card)]">
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
