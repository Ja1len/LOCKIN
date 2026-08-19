import Link from "next/link";
import { ArrowLeft, UsersRound, VolumeX, Presentation, MessagesSquare } from "lucide-react";

export interface StudyRoomHeaderProps {
  roomName: string;
  subject: string;
  topic: string;
  roomType: "Silent Focus" | "Teaching" | "Discussion";
  participantCount: number;
  capacity: number;
}

export function StudyRoomHeader({
  roomName,
  subject,
  topic,
  roomType,
  participantCount,
  capacity,
}: StudyRoomHeaderProps) {
  const isSilent = roomType === "Silent Focus";
  const isTeaching = roomType === "Teaching";
  const isDiscussion = roomType === "Discussion";

  return (
    <div>
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-emerald-800 dark:hover:text-emerald-400 transition"
      >
        <ArrowLeft size={14} /> Back to all study rooms
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200">
              {isSilent && <VolumeX size={12} />}
              {isTeaching && <Presentation size={12} />}
              {isDiscussion && <MessagesSquare size={12} />}
              {roomType}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {subject}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
            {roomName}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{topic}</p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-xs text-[var(--muted)] shadow-xs">
          <UsersRound size={16} className="text-emerald-700 dark:text-emerald-400" />
          <span>
            <strong className="font-bold text-[var(--ink)]">{participantCount}</strong>/{capacity} students locked in
          </span>
        </div>
      </div>
    </div>
  );
}
