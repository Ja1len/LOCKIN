import Link from "next/link";
import { Pause, Play, RotateCcw, Maximize2, Minimize2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RoomControlsProps {
  running: boolean;
  focusMode: boolean;
  roomName?: string;
  roomType?: string;
  onToggle: () => void;
  onReset: () => void;
  onFocusMode: () => void;
}

export function RoomControls({
  running,
  focusMode,
  roomName = "Physics Focus Room",
  roomType = "Silent Focus",
  onToggle,
  onReset,
  onFocusMode,
}: RoomControlsProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--card)]/95 px-4 py-3 backdrop-blur shadow-lg md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="font-bold text-[var(--ink)]">{roomName}</span>
          <span>•</span>
          <span>{roomType}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Play / Pause Toggle */}
          <Button
            size="sm"
            onClick={onToggle}
            className="gap-1.5 rounded-xl font-semibold px-4 shadow-xs"
          >
            {running ? <Pause size={15} /> : <Play size={15} />}
            <span>{running ? "Pause Focus" : "Start Focus"}</span>
          </Button>

          {/* Reset Timer */}
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            aria-label="Reset timer"
            className="gap-1.5 rounded-xl border-[var(--line)] bg-[var(--card)]"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          {/* Focus Mode Fullscreen/Distraction-free toggle */}
          <Button
            size="sm"
            variant={focusMode ? "default" : "outline"}
            onClick={onFocusMode}
            className="gap-1.5 rounded-xl border-[var(--line)]"
          >
            {focusMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span className="hidden sm:inline">
              {focusMode ? "Exit Focus Mode" : "Focus Mode"}
            </span>
          </Button>

          {/* Leave Room */}
          <Link href="/rooms">
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:text-rose-400"
            >
              <LogOut size={15} />
              <span>Leave Room</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
