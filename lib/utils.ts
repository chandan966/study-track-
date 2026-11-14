import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.round(minutes % 60);
  if (hours === 0) return `${remainingMins}m`;
  if (remainingMins === 0) return `${hours}h`;
  return `${hours}h ${remainingMins}m`;
}

export function formatSecondsToTimer(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatDate(date: Date | string, pattern = "dd MMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Calculates current study streak and longest study streak in days.
 * A day counts towards a streak if total study duration on that day >= dailyGoalMinutes (or > 0 if goal is unset).
 */
export function calculateStreaks(
  sessions: { startTime: Date | string; durationMinutes: number }[],
  dailyGoalMinutes = 360
): { currentStreak: number; longestStreak: number } {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Aggregate minutes by date key (YYYY-MM-DD)
  const dayMinutesMap = new Map<string, number>();

  sessions.forEach((session) => {
    const d = typeof session.startTime === "string" ? new Date(session.startTime) : session.startTime;
    const dateKey = format(d, "yyyy-MM-dd");
    const current = dayMinutesMap.get(dateKey) || 0;
    dayMinutesMap.set(dateKey, current + session.durationMinutes);
  });

  // Qualify days meeting the goal requirement (if dailyGoalMinutes > 0, at least 30m or goal)
  // To be fair and encourage students, a day counts as active study day if study time >= Math.min(30, dailyGoalMinutes)
  const qualifyingDays = new Set<string>();
  const threshold = Math.min(30, dailyGoalMinutes);

  dayMinutesMap.forEach((minutes, dateKey) => {
    if (minutes >= threshold) {
      qualifyingDays.add(dateKey);
    }
  });

  if (qualifyingDays.size === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDates = Array.from(qualifyingDays).sort();

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  // Calculate current streak
  let currentStreak = 0;
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = format(yesterday, "yyyy-MM-dd");

  let checkDate = new Date();
  if (!qualifyingDays.has(todayKey)) {
    // If today hasn't qualified yet, check if yesterday was qualified
    if (qualifyingDays.has(yesterdayKey)) {
      checkDate = yesterday;
    } else {
      return { currentStreak: 0, longestStreak };
    }
  }

  while (true) {
    const key = format(checkDate, "yyyy-MM-dd");
    if (qualifyingDays.has(key)) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}
