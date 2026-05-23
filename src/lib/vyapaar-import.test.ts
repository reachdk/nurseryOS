import { describe, expect, it } from "vitest";
import { parseCsvText, parseSheetRows } from "@/lib/vyapaar-import";

describe("parseCsvText", () => {
  it("parses item and quantity columns", () => {
    const csv = `Party,Item,Qty,Date,Invoice
Ram,Cabbage,100,2026-05-23,INV-1`;

    const rows = parseCsvText(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].itemName).toBe("Cabbage");
    expect(rows[0].quantity).toBe(100);
    expect(rows[0].partyName).toBe("Ram");
  });

  it("returns empty for missing columns", () => {
    const csv = `Foo,Bar
a,b`;
    expect(parseCsvText(csv)).toHaveLength(0);
  });
});

describe("parseSheetRows", () => {
  it("skips blank rows after header", () => {
    const rows = parseSheetRows([
      ["Item", "Qty"],
      ["Tomato", "50"],
      ["", ""],
      ["Brinjal", "25"],
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[1].itemName).toBe("Brinjal");
    expect(rows[1].quantity).toBe(25);
  });
});
