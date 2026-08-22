"use client";

import { useState, useEffect } from "react";
import { X, Play, Pause, RotateCcw, Sparkles, CheckCircle2, Coffee, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Subject } from "@/lib/store";
import { addSession } from "@/lib/api-client";

interface StandalonePomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: Subject;
  onSessionComplete?: (subject: Subject, duration: number) => void;
}

const subjects: Subject[] = ["Mathematics", "Physics", "Computer Science", "Biology"];

export function StandalonePomodoroModal({
  isOpen,
  onClose,
  defaultSubject = "Physics",
  onSessionComplete,
}: StandalonePomodoroModalProps) {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [subject, setSubject] = useState<Subject>(defaultSubject);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setSubject(defaultSubject);
  }, [defaultSubject]);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  useEffect(() => {
    if (seconds === 0 && !isCompleted) {
      setIsCompleted(true);
      setIsRunning(false);
      if (mode === "focus") {
        addSession(subject, 25);
        if (onSessionComplete) onSessionComplete(subject, 25);
      }
    }
  }, [seconds, isCompleted, mode, subject, onSessionComplete]);

  if (!isOpen) return null;

  const handleStartPause = () => {
    if (isCompleted) {
      handleReset();
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setSeconds(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: "focus" | "break") => {
    setMode(newMode);
    setIsRunning(false);
    setIsCompleted(false);
    setSeconds(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const minutesStr = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsStr = String(seconds % 60).padStart(2, "0");
  const progressPercent = mode === "focus" 
    ? Math.round(((25 * 60 - seconds) / (25 * 60)) * 100)
    : Math.round(((5 * 60 - seconds) / (5 * 60)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-[#18221b] sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              <Sparkles size={16} />
            </span>
            <span className="font-semibold text-zinc-900 dark:text-white">Quick Pomodoro</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="mt-6 flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
          <button
            onClick={() => switchMode("focus")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "focus"
                ? "bg-white text-emerald-900 shadow-sm dark:bg-[#202e24] dark:text-emerald-300"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            }`}
          >
            <Flame size={15} />
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode("break")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "break"
                ? "bg-white text-emerald-900 shadow-sm dark:bg-[#202e24] dark:text-emerald-300"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
            }`}
          >
            <Coffee size={15} />
            Break (5m)
          </button>
        </div>

        {/* Subject Selection for Focus Mode */}
        {mode === "focus" && (
          <div className="mt-4">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Focus Subject:
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {subjects.map((s) => (
                <button
                  key={s}
                  disabled={isRunning}
                  onClick={() => setSubject(s)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    subject === s
                      ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:text-zinc-300"
                  } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="my-8 flex flex-col items-center justify-center text-center">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-zinc-100 bg-[#1b2920] text-white shadow-inner dark:border-zinc-800">
            <div className="text-center">
              <span className="font-mono text-5xl font-bold tracking-tight">
                {minutesStr}:{secondsStr}
              </span>
              <p className="mt-1 text-xs text-emerald-300/80">
                {isCompleted
                  ? "Block complete! 🎉"
                  : isRunning
                  ? mode === "focus"
                    ? `Locking in • ${subject}`
                    : "Recharge time"
                  : "Ready to start"}
              </p>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="mt-6 w-full">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300 dark:bg-emerald-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completed Announcement */}
        {isCompleted && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3.5 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">Session recorded!</p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/70">
                25 minutes of {subject} added to your daily progress.
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            size="lg"
            className="flex-1 gap-2 rounded-xl text-base font-semibold"
            onClick={handleStartPause}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? "Pause" : isCompleted ? "Start Next Block" : "Start Focus"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            className="rounded-xl px-4"
            aria-label="Reset Timer"
          >
            <RotateCcw size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
