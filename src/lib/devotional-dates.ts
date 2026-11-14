export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function getDevotionalNumber(dateKey: string, totalDevotionals: number) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  const anchor = new Date("2026-01-01T12:00:00Z");
  const offset = Math.floor((date.getTime() - anchor.getTime()) / 86_400_000);
  return ((offset % totalDevotionals) + totalDevotionals) % totalDevotionals;
}

export function getCurrentStreak(completedDateKeys: string[], today = getLocalDateKey()) {
  if (!isDateKey(today)) return 0;
  const completed = new Set(completedDateKeys);
  let cursor = completed.has(today) ? today : shiftDateKey(today, -1);
  let streak = 0;

  while (completed.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

export function shiftDateKey(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

