import { addDays, format, startOfWeek } from "date-fns";

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
