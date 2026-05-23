import { describe, expect, it } from "vitest";
import { calendarDayInNursery, parseDateOnly } from "@/lib/dates";
import { isReadyForSale } from "@/lib/availability-core";

describe("calendarDayInNursery", () => {
  it("keeps May 22 when stored as UTC midnight", () => {
    expect(calendarDayInNursery(new Date("2026-05-22T00:00:00.000Z"))).toBe(
      "2026-05-22"
    );
  });
});

describe("parseDateOnly", () => {
  it("stores midday UTC so the calendar day does not shift", () => {
    const d = parseDateOnly("2026-05-22");
    expect(d.toISOString()).toBe("2026-05-22T12:00:00.000Z");
    expect(calendarDayInNursery(d)).toBe("2026-05-22");
  });
});

describe("isReadyForSale (India calendar)", () => {
  const asOf = new Date("2026-05-23T12:00:00.000Z");

  it("past ready date in nursery timezone", () => {
    expect(isReadyForSale(parseDateOnly("2026-05-22"), asOf)).toBe(true);
  });

  it("same day", () => {
    expect(isReadyForSale(parseDateOnly("2026-05-23"), asOf)).toBe(true);
  });

  it("future ready date", () => {
    expect(isReadyForSale(parseDateOnly("2026-05-24"), asOf)).toBe(false);
  });
});
