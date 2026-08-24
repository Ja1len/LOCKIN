"use client";

import { useEffect, useState } from "react";
import { Circle, Play, Pause, RotateCcw, CheckCircle2, Flame, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Subject } from "@/lib/store";

interface PomodoroTimerProps {
  running: boolean;
  resetKey: number;
  onComplete: (subject: Subject) => void;
  defaultSubject?: Subject;
  subjects: Subject[];
  roomType?: string;
}

export function PomodoroTimer({
  running,
  resetKey,
  onComplete,
  defaultSubject = "Physics",
  subjects,
  roomType = "Silent Focus",
}: PomodoroTimerProps) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [subject, setSubject] = useState<Subject>(defaultSubject);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setSeconds(25 * 60);
    setDone(false);
  }, [resetKey]);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const interval = window.setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0 && !done) {
      setDone(true);
      onComplete(subject);
    }
  }, [seconds, done, subject, onComplete]);

  const minutesStr = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsStr = String(seconds % 60).padStart(2, "0");
  const percent = Math.round(((25 * 60 - seconds) / (25 * 60)) * 100);

  return (
    <section className="flex flex-col justify-between rounded-3xl bg-[#1b2920] p-6 text-white shadow-md dark:border dark:border-emerald-900/30 md:p-8">
      <div>
        {/* Top Status */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-200/80">
            <Flame size={14} className="text-[#bfe3cf]" />
            Focus 25 min · Break 5 min
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[#bfe3cf]">
            <Circle className="fill-current" size={7} />
            {done ? "Completed 🎉" : running ? "Focus in progress" : "Paused"}
          </span>
        </div>

        {/* Large Timer Display */}
        <div className="my-6 text-center">
          <p className="font-mono text-6xl font-extrabold tracking-tight text-white md:text-7xl">
            {minutesStr}:{secondsStr}
          </p>
          <p className="mt-2 text-xs text-emerald-200/70">
            {done
              ? "Great work! 25 min added to daily progress."
              : running
              ? "Stay present. Your room is quietly working beside you."
              : "Click Start Focus below to begin block."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-[11px] text-emerald-200/60 mb-1">
            <span>Block Progress</span>
            <span>{percent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#bfe3cf] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subject Selector */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-200/70">
          Focus Subject
        </label>
        <select
          value={subject}
          disabled={running}
          onChange={(e) => setSubject(e.target.value as Subject)}
          className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white outline-none disabled:opacity-60"
        >
          {(subjects.length > 0 ? subjects : [defaultSubject]).map((item) => (
            <option key={item} value={item} className="text-zinc-900">
              {item}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
