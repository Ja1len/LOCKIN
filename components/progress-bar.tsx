import { cn } from "@/lib/utils";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const progress = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-emerald-100", className)} aria-label={`${progress}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
      <div className="h-full rounded-full bg-emerald-800 transition-all" style={{ width: `${progress}%` }} />
    </div>
  );
}
