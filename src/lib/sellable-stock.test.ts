import { describe, expect, it } from "vitest";
import { getSellableFromMaps, mergeSellableStock } from "@/lib/sellable-stock";

describe("mergeSellableStock", () => {
  it("merges office and ready nursery per plant", () => {
    const office = new Map([["p1", 1000]]);
    const ready = new Map([["p1", 5000], ["p2", 2000]]);
    const merged = mergeSellableStock(office, ready);

    expect(merged.get("p1")).toBe(6000);
    expect(merged.get("p2")).toBe(2000);
  });

  it("returns 0 for unknown plant", () => {
    const merged = mergeSellableStock(new Map(), new Map());
    expect(getSellableFromMaps(merged, "unknown")).toBe(0);
  });
});
