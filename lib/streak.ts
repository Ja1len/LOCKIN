import type { StudySession } from "./store";

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcA - utcB) / msPerDay);
}

export function calculateStudyStreak(sessions: StudySession[]): { current: number; best: number } {
  if (sessions.length === 0) return { current: 0, best: 0 };

  const studyDates = Array.from(
    new Set(sessions.map((s) => localDateKey(new Date(s.date))))
  )
    .map((key) => {
      const [y, m, d] = key.split("-").map(Number);
      return new Date(y, m, d);
    })
    .sort((a, b) => a.getTime() - b.getTime());

  const dateSet = new Set(studyDates.map(localDateKey));

  // Current streak: walk backward from today, allowing today to be missing
  // as long as yesterday was studied (a streak "ending today or yesterday").
  const today = new Date();
  let current = 0;
  let cursor = new Date(today);
  if (!dateSet.has(localDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dateSet.has(localDateKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Best streak: longest run of consecutive calendar days anywhere in the data.
  let best = 0;
  let run = 0;
  for (let i = 0; i < studyDates.length; i++) {
    if (i === 0 || daysBetween(studyDates[i], studyDates[i - 1]) === 1) {
      run++;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
  }

  return { current, best: Math.max(best, current) };
}
