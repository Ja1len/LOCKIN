"use client";

import { useState } from "react";
import { Target, VolumeX, CheckCircle2, Edit3, Sparkles } from "lucide-react";

export function RoomGoalCard({
  goal = "Complete Chapter 4 Exercise Questions",
  isSilent = true,
}: {
  goal?: string;
  isSilent?: boolean;
}) {
  const [currentGoal, setCurrentGoal] = useState(goal);
  const [isEditing, setIsEditing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  return (
    <section className="flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">
            <Target size={14} className="text-emerald-700 dark:text-emerald-400" />
            Session Intention
          </p>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <Edit3 size={13} />
          </button>
        </div>

        {isEditing ? (
          <div className="mt-3">
            <input
              type="text"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              autoFocus
              className="w-full rounded-xl border border-emerald-700 bg-emerald-50/50 p-2 text-sm font-semibold outline-none dark:bg-emerald-950/40"
            />
          </div>
        ) : (
          <p
            onClick={() => setIsDone(!isDone)}
            className={`mt-4 cursor-pointer font-semibold leading-snug tracking-tight transition ${
              isDone
                ? "line-through text-[var(--muted)]"
                : "text-[var(--ink)]"
            }`}
          >
            {currentGoal}
          </p>
        )}

        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          {isDone
            ? "Goal completed! Mark off and relax during break."
            : "Click goal to mark complete when done."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs font-medium text-emerald-800 dark:text-emerald-300">
        <span className="flex items-center gap-1.5">
          {isSilent ? <VolumeX size={14} /> : <Sparkles size={14} />}
          {isSilent ? "Silent focus room" : "Interactive session"}
        </span>
        <button
          onClick={() => setIsDone(!isDone)}
          className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold dark:bg-emerald-950/60"
        >
          {isDone ? "Completed ✓" : "Mark Done"}
        </button>
      </div>
    </section>
  );
}
