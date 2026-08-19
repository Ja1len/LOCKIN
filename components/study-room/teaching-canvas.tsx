"use client";

import { useState } from "react";
import {
  Hand,
  Presentation,
  ScreenShare,
  PenTool,
  Maximize2,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeachingCanvasProps {
  hostName?: string;
  topic?: string;
  subject?: string;
}

export function TeachingCanvas({
  hostName = "Daniel Lim",
  topic = "Graph Traversal Algorithms (BFS & DFS)",
  subject = "Computer Science",
}: TeachingCanvasProps) {
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<"slides" | "whiteboard">("slides");
  const [handCount, setHandCount] = useState(2);

  const toggleHand = () => {
    if (handRaised) {
      setHandRaised(false);
      setHandCount((c) => Math.max(0, c - 1));
    } else {
      setHandRaised(true);
      setHandCount((c) => c + 1);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
      {/* Top Teaching Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-violet-50/70 p-4 dark:bg-violet-950/30">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white font-bold shadow-xs">
            👨‍🏫
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-900 dark:text-violet-300">
                Presenter Spotlight
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Live</span>
            </div>
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              {hostName} is teaching
            </p>
          </div>
        </div>

        {/* Raise Hand & Stage Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={toggleHand}
            className={`gap-1.5 rounded-xl text-xs font-semibold transition ${
              handRaised
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md ring-2 ring-amber-300"
                : "bg-white border border-zinc-200 text-zinc-800 hover:bg-amber-50 hover:text-amber-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
            }`}
          >
            <Hand size={14} className={handRaised ? "animate-bounce" : ""} />
            <span>{handRaised ? "Hand Raised ✋" : "Raise Hand"}</span>
            <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.2 text-[10px]">
              {handCount}
            </span>
          </Button>

          <div className="flex rounded-xl bg-white p-1 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab("slides")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                activeTab === "slides"
                  ? "bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <ScreenShare size={13} /> Screen
            </button>
            <button
              onClick={() => setActiveTab("whiteboard")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                activeTab === "whiteboard"
                  ? "bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-200"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <PenTool size={13} /> Whiteboard
            </button>
          </div>
        </div>
      </div>

      {/* Screen Share / Whiteboard Canvas */}
      <div className="relative aspect-video w-full bg-[#111613] p-6 text-white flex flex-col justify-between">
        {activeTab === "slides" ? (
          <>
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <Presentation size={14} className="text-violet-400" />
                {subject} • Slide 4 of 12
              </span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-zinc-300">
                1080p HD Stream
              </span>
            </div>

            <div className="my-auto max-w-xl mx-auto text-center space-y-3">
              <div className="inline-block rounded-lg bg-violet-950/80 border border-violet-700/50 px-3 py-1 text-xs font-mono text-violet-300">
                DFS Recursion Stack vs BFS FIFO Queue
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Graph Traversal Visualization
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-md mx-auto">
                Depth-First Search (DFS) dives deeply into unvisited neighbors using an implicit recursion stack, while BFS traverses layer by layer with a FIFO queue.
              </p>

              {/* Code snippet illustration */}
              <div className="mt-4 rounded-xl bg-black/60 p-3 text-left font-mono text-xs text-emerald-300 border border-white/10">
                <p className="text-zinc-500">// DFS Recursive Implementation</p>
                <p><span className="text-pink-400">function</span> <span className="text-yellow-300">dfs</span>(node, visited) &#123;</p>
                <p className="pl-4">visited.add(node);</p>
                <p className="pl-4"><span className="text-pink-400">for</span> (<span className="text-pink-400">const</span> neighbor <span className="text-pink-400">of</span> graph[node]) &#123;</p>
                <p className="pl-8"><span className="text-pink-400">if</span> (!visited.has(neighbor)) dfs(neighbor, visited);</p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/10 pt-3">
              <span>Host controls active</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles size={12} /> Peer Teaching Session
              </span>
            </div>
          </>
        ) : (
          /* Whiteboard View */
          <div className="flex h-full flex-col justify-center items-center text-center space-y-3">
            <PenTool size={32} className="text-violet-400" />
            <h4 className="text-lg font-bold">Collaborative Canvas</h4>
            <p className="text-xs text-zinc-400 max-w-sm">
              Live presenter annotations and student diagrams are rendered here in real-time.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                Pen Mode: Active
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                Color: #a7d9bb
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
