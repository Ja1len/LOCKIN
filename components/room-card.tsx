import Link from "next/link";
import { Users, VolumeX, Presentation, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RoomCardProps {
  id?: string;
  name: string;
  subject: string;
  topic?: string;
  type: "Silent Focus" | "Teaching" | "Discussion";
  participants: number;
  capacity: number;
  accent: string;
  host?: string;
}

export function RoomCard({
  id = "physics-focus",
  name,
  subject,
  topic,
  type,
  participants,
  capacity,
  accent,
  host,
}: RoomCardProps) {
  const isSilent = type === "Silent Focus";
  const isTeaching = type === "Teaching";
  const isDiscussion = type === "Discussion";

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm transition hover:shadow-md hover:border-emerald-700/30 dark:hover:border-emerald-500/30">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-3">
          <span className="h-3 w-3 rounded-full shrink-0" style={{ background: accent }} />
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {isSilent && <VolumeX size={12} />}
              {isTeaching && <Presentation size={12} />}
              {isDiscussion && <MessagesSquare size={12} />}
              {type}
            </span>
          </div>
        </div>

        {/* Room Title & Subject */}
        <h3 className="mt-5 text-base font-bold tracking-tight text-[var(--ink)]">
          {name}
        </h3>
        <p className="mt-1 text-xs font-medium text-emerald-800 dark:text-emerald-400">
          {subject}
        </p>

        {/* Topic / Host info */}
        {topic && (
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)] line-clamp-2 min-h-[32px]">
            {topic}
          </p>
        )}

        {isTeaching && host && (
          <p className="mt-2 text-xs font-medium text-violet-700 dark:text-violet-400">
            👨‍🏫 {host} teaching
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-3.5">
        <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
          <Users size={14} />
          <strong>{participants}</strong>/{capacity} students
        </span>
        <Link href={`/rooms/${id}`}>
          <Button size="sm" className="rounded-xl px-4 text-xs font-semibold">
            LOCK IN
          </Button>
        </Link>
      </div>
    </article>
  );
}
