"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  CircleUserRound,
  Flame,
  Home,
  LayoutDashboard,
  LogOut,
  Palette,
  Play,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import { StandalonePomodoroModal } from "@/components/pomodoro/standalone-pomodoro-modal";
import { getProfile } from "@/lib/store";

interface AppShellProps {
  children: ReactNode;
  activeNav?: "home" | "rooms" | "ai-tutor" | "progress" | "profile";
}

export function AppShell({ children, activeNav }: AppShellProps) {
  const pathname = usePathname();
  const { theme, setTheme, themes } = useTheme();
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const profile = getProfile();

  const navigation = [
    { label: "Home", icon: Home, href: "/dashboard", key: "home" },
    { label: "Study Rooms", icon: UsersRound, href: "/rooms", key: "rooms" },
    { label: "AI Tutor", icon: Bot, href: "/ai-tutor", key: "ai-tutor" },
    { label: "Progress", icon: LayoutDashboard, href: "/progress", key: "progress" },
    { label: "Profile", icon: CircleUserRound, href: "/profile", key: "profile" },
  ];

  const currentActive =
    activeNav ||
    (pathname === "/dashboard"
      ? "home"
      : pathname.startsWith("/rooms")
      ? "rooms"
      : pathname.startsWith("/ai-tutor")
      ? "ai-tutor"
      : pathname.startsWith("/progress")
      ? "progress"
      : pathname.startsWith("/profile")
      ? "profile"
      : "home");

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/90 px-5 py-3.5 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold tracking-[-0.05em] text-[var(--ink)]">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-800 text-white shadow-sm">
              <Sparkles size={16} />
            </span>
            <span className="text-xl tracking-tight">lockin</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Quick Pomodoro Start Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPomodoroOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-xl border-[var(--line)] bg-[var(--card)] text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            >
              <Play size={13} className="fill-emerald-800 dark:fill-emerald-300" />
              <span>Quick Focus</span>
            </Button>

            {/* Quick Theme Switcher Button */}
            <button
              onClick={() => setThemeModalOpen(true)}
              aria-label="Switch theme"
              className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--card)] text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 transition"
            >
              <Palette size={16} />
            </button>

            {/* Profile Avatar Link */}
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                {profile.avatarInitial || "A"}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{profile.name}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-[var(--line)] px-3 py-7 md:flex md:flex-col md:justify-between">
          <div>
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">
              Workspace
            </p>
            <nav className="space-y-1">
              {navigation.map(({ label, icon: Icon, href, key }) => {
                const isActive = currentActive === key;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-emerald-100/90 text-emerald-950 font-semibold dark:bg-emerald-950/60 dark:text-emerald-200"
                        : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--ink)]"
                    )}
                  >
                    <Icon size={18} className={isActive ? "text-emerald-800 dark:text-emerald-300" : ""} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-[var(--line)] pt-4">
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">
                Focus Tools
              </p>
              <button
                onClick={() => setPomodoroOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-left text-sm text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--ink)] transition"
              >
                <Flame size={17} className="text-amber-600" />
                Start Pomodoro
              </button>
              <button
                onClick={() => setThemeModalOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-left text-sm text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--ink)] transition"
              >
                <Palette size={17} className="text-emerald-700" />
                Change Theme
              </button>
            </div>
          </div>

          <div className="border-t border-[var(--line)] pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
            >
              <LogOut size={16} />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Content Body */}
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-[var(--line)] bg-[var(--paper)]/95 px-2 py-2 backdrop-blur md:hidden">
        {navigation.map(({ label, icon: Icon, href, key }) => {
          const isActive = currentActive === key;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition",
                isActive
                  ? "text-emerald-800 dark:text-emerald-300 font-semibold"
                  : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              <Icon size={18} />
              <span>{label === "Study Rooms" ? "Rooms" : label === "AI Tutor" ? "AI Tutor" : label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global Standalone Pomodoro Modal */}
      <StandalonePomodoroModal
        isOpen={pomodoroOpen}
        onClose={() => setPomodoroOpen(false)}
      />

      {/* Global Theme Selector Modal */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Choose Your Atmosphere</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Personalize your study aesthetic.</p>
              </div>
              <button
                onClick={() => setThemeModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {themes.map((item) => {
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTheme(item.id);
                    }}
                    className={cn(
                      "overflow-hidden rounded-2xl border text-left transition-all hover:scale-[1.02]",
                      isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-400"
                        : "border-[var(--line)] hover:border-zinc-300"
                    )}
                  >
                    <div className="h-20 p-3" style={{ background: item.bg }}>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold" style={{ color: item.accent }}>
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-700 text-white text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex gap-1.5">
                        {item.swatches.map((color) => (
                          <span
                            key={color}
                            className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--card)]">
                      <p className="text-xs text-[var(--muted)] leading-relaxed">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex justify-end">
              <Button onClick={() => setThemeModalOpen(false)}>Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
