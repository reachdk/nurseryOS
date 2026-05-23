import { describe, expect, it } from "vitest";
import {
  computeAvailability,
  isReadyForSale,
  type PlantWithStock,
} from "@/lib/availability-core";

const asOf = new Date("2026-05-23T12:00:00");

function plant(overrides: Partial<PlantWithStock> = {}): PlantWithStock {
  return {
    id: "p1",
    name: "Brinjal",
    typicalReadyDays: 30,
    inventoryLots: [],
    plantingBatches: [],
    ...overrides,
  };
}

describe("isReadyForSale", () => {
  it("returns true for past ready date", () => {
    expect(isReadyForSale(new Date("2026-05-22"), asOf)).toBe(true);
  });

  it("returns true for same calendar day", () => {
    expect(isReadyForSale(new Date("2026-05-23"), asOf)).toBe(true);
  });

  it("returns false for future ready date", () => {
    expect(isReadyForSale(new Date("2026-05-24"), asOf)).toBe(false);
  });
});

describe("computeAvailability", () => {
  it("includes past-ready nursery qty in free to sell (Brinjal case)", () => {
    const result = computeAvailability(
      plant({
        plantingBatches: [
          {
            id: "b1",
            expectedReadyDate: new Date("2026-05-22"),
            remainingQuantity: 5000,
          },
        ],
      }),
      asOf
    );

    expect(result.inOffice).toBe(0);
    expect(result.readyInNursery).toBe(5000);
    expect(result.availableNow).toBe(5000);
    expect(result.readyNowBatches).toHaveLength(1);
    expect(result.upcomingBatches).toHaveLength(0);
  });

  it("puts future-ready batches only in upcoming", () => {
    const result = computeAvailability(
      plant({
        plantingBatches: [
          {
            id: "b1",
            expectedReadyDate: new Date("2026-06-01"),
            remainingQuantity: 3000,
          },
        ],
      }),
      asOf
    );

    expect(result.availableNow).toBe(0);
    expect(result.readyInNursery).toBe(0);
    expect(result.upcomingBatches).toHaveLength(1);
    expect(result.readyNowBatches).toHaveLength(0);
  });

  it("sums office and ready nursery for availableNow", () => {
    const result = computeAvailability(
      plant({
        inventoryLots: [
          { plantingBatchId: "b1", remainingQuantity: 1000 },
        ],
        plantingBatches: [
          {
            id: "b1",
            expectedReadyDate: new Date("2026-05-20"),
            remainingQuantity: 2000,
          },
        ],
      }),
      asOf
    );

    expect(result.inOffice).toBe(1000);
    expect(result.readyInNursery).toBe(2000);
    expect(result.availableNow).toBe(3000);
  });

  it("returns zeros for empty plant", () => {
    const result = computeAvailability(plant(), asOf);
    expect(result.availableNow).toBe(0);
    expect(result.inNursery).toBe(0);
    expect(result.inOffice).toBe(0);
  });
});
