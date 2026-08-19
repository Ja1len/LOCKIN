import { Hand, Crown, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Participant {
  name: string;
  initials: string;
  role: string;
  online: boolean;
  tone: string;
  isHost?: boolean;
  handRaised?: boolean;
}

export function ParticipantList({
  participants,
  roomType = "Silent Focus",
}: {
  participants: Participant[];
  roomType?: string;
}) {
  return (
    <section className="border-t border-[var(--line)] p-5 md:p-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold tracking-tight text-[var(--ink)]">
            Participants in this room ({participants.length})
          </h2>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {roomType === "Silent Focus"
              ? "Quietly holding each other accountable."
              : roomType === "Teaching"
              ? "Live audience and discussion."
              : "Active problem solvers."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {participants.map((person) => (
          <div
            key={person.name}
            className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3 shadow-xs transition hover:border-emerald-700/30"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full text-xs font-bold",
                    person.tone
                  )}
                >
                  {person.initials}
                </span>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-zinc-900",
                    person.online ? "bg-emerald-600" : "bg-zinc-300"
                  )}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="block truncate text-xs font-semibold text-[var(--ink)]">
                    {person.name}
                  </span>
                  {person.isHost && (
                    <Crown size={12} className="text-amber-500 shrink-0" />
                  )}
                </div>
                <span className="block text-[11px] text-[var(--muted)] truncate">
                  {person.role}
                </span>
              </div>
            </div>

            {person.handRaised && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                <Hand size={11} /> Hand Raised
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
