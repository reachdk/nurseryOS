import { addDays, format, startOfWeek } from "date-fns";

/** Nursery operates on India calendar days (Vyapaar / farmer dates). */
export const NURSERY_TIMEZONE = "Asia/Kolkata";

/** yyyy-MM-dd in nursery timezone — for ready-date comparisons. */
export function calendarDayInNursery(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: NURSERY_TIMEZONE,
  }).format(d);
}

/** Parse HTML date input (yyyy-MM-dd) without UTC midnight shifting the day. */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) {
    throw new Error(`Invalid date: ${value}`);
  }
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

export function formatDate(d: Date | string): string {
  return format(new Date(d), "dd MMM yyyy");
}

export function formatWeek(d: Date | string): string {
  const weekStart = startOfWeek(new Date(d), { weekStartsOn: 1 });
  return `Week of ${format(weekStart, "dd MMM yyyy")}`;
}

export function suggestReadyDate(plantedDate: Date, typicalReadyDays: number): Date {
  return addDays(plantedDate, typicalReadyDays > 0 ? typicalReadyDays : 30);
}

export function toDateInputValue(d: Date): string {
  return format(d, "yyyy-MM-dd");
}
