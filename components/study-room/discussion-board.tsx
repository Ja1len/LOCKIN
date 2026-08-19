"use client";

import { useState } from "react";
import { MessagesSquare, CheckCircle2, HelpCircle, Lightbulb, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscussionBoardProps {
  question?: string;
  subject?: string;
}

export function DiscussionBoard({
  question = "Why does benzene have resonance stabilization energy compared to 1,3,5-cyclohexatriene?",
  subject = "Organic Chemistry",
}: DiscussionBoardProps) {
  const [ideas, setIdeas] = useState<string[]>([
    "Delocalization of the 6 π electrons in continuous cyclic p-orbital overlap.",
    "Equal C-C bond lengths of 1.39 Å (intermediate between single and double bonds).",
    "Hückel's Rule (4n + 2) is satisfied with n = 1 (6 π electrons).",
  ]);
  const [newIdea, setNewIdea] = useState("");

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    setIdeas([...ideas, newIdea.trim()]);
    setNewIdea("");
  };

  return (
    <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
        <MessagesSquare size={14} />
        Active Problem Discussion
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-500 text-white font-bold text-sm">
            ?
          </span>
          <div>
            <span className="text-[11px] font-semibold uppercase text-amber-900/70 dark:text-amber-300/70">
              Problem to solve together
            </span>
            <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-white">
              {question}
            </h3>
          </div>
        </div>
      </div>

      {/* Collaborative Solution Ideas */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
            <Lightbulb size={13} className="text-amber-500" />
            Group Insights &amp; Findings ({ideas.length})
          </h4>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Open for contributions
          </span>
        </div>

        <div className="mt-3 space-y-2.5">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper)]/60 p-3 text-xs text-[var(--ink)]"
            >
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{idea}</span>
            </div>
          ))}
        </div>

        {/* Add Idea Input */}
        <form onSubmit={handleAddIdea} className="mt-4 flex gap-2">
          <input
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            placeholder="Add an insight or step to solve this..."
            className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--ink)] outline-none focus:border-emerald-700"
          />
          <Button type="submit" size="sm" className="rounded-xl px-4 text-xs font-semibold">
            Post Insight
          </Button>
        </form>
      </div>
    </section>
  );
}
