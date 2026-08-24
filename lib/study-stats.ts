import type { StudySession, UserProfile, Subject } from "./store";

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getTodaySessions(sessions: StudySession[]): StudySession[] {
  const today = new Date();
  return sessions.filter((s) => isSameLocalDay(new Date(s.date), today));
}

export function getTodayStudyMinutes(sessions: StudySession[]): number {
  return getTodaySessions(sessions).reduce((acc, s) => acc + s.duration, 0);
}

export function getDailyGoal(profile: UserProfile | null | undefined): number {
  return profile?.dailyGoalMinutes ?? 120;
}

export function getGoalProgress(
  todayMinutes: number,
  goalMinutes: number
): { percent: number; cappedPercent: number; remaining: number; completed: boolean } {
  const percent = goalMinutes > 0 ? Math.round((todayMinutes / goalMinutes) * 100) : 0;
  return {
    percent,
    cappedPercent: Math.min(100, percent),
    remaining: Math.max(0, goalMinutes - todayMinutes),
    completed: todayMinutes >= goalMinutes && goalMinutes > 0,
  };
}

export function getSubjectStudyMinutes(sessions: StudySession[]): Partial<Record<Subject, number>> {
  const totals: Partial<Record<Subject, number>> = {};
  for (const s of sessions) {
    totals[s.subject] = (totals[s.subject] ?? 0) + s.duration;
  }
  return totals;
}
