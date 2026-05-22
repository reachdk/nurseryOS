export type ParsedVyapaarRow = {
  lineIndex: number;
  partyName: string;
  itemName: string;
  quantity: number;
  soldAt: string;
  externalRef: string;
};

export type ImportRowStatus = "ok" | "unmapped" | "duplicate" | "insufficient";

export type PreviewImportRow = ParsedVyapaarRow & {
  status: ImportRowStatus;
  plantTypeId?: string;
  plantName?: string;
  message?: string;
};

const PARTY_HEADERS = ["party", "customer", "name", "buyer", "sold to"];
const ITEM_HEADERS = ["item", "product", "particular", "description", "goods"];
const QTY_HEADERS = ["qty", "quantity", "units", "count"];
const DATE_HEADERS = ["date", "sold", "invoice date"];
const INVOICE_HEADERS = ["invoice", "bill", "voucher", "ref", "no."];

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findColumnIndex(headers: string[], candidates: string[]): number {
  const normalized = headers.map(normalizeHeader);
  for (const c of candidates) {
    const idx = normalized.findIndex((h) => h.includes(c) || c.includes(h));
    if (idx >= 0) return idx;
  }
  return -1;
}

function parseQuantity(val: unknown): number {
  if (val == null || val === "") return 0;
  const n = Number(String(val).replace(/,/g, "").trim());
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function parseDateCell(val: unknown): string {
  if (val == null || val === "") return new Date().toISOString().slice(0, 10);
  if (typeof val === "number" && val > 40000) {
    const d = new Date((val - 25569) * 86400 * 1000);
    return d.toISOString().slice(0, 10);
  }
  const d = new Date(String(val));
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

export function parseSheetRows(rows: unknown[][]): ParsedVyapaarRow[] {
  if (rows.length < 2) return [];

  const headerRowIndex = rows.findIndex((row) =>
    row.some((cell) => cell != null && String(cell).trim() !== "")
  );
  if (headerRowIndex < 0) return [];

  const headers = (rows[headerRowIndex] as unknown[]).map((c) =>
    String(c ?? "").trim()
  );

  const partyIdx = findColumnIndex(headers, PARTY_HEADERS);
  const itemIdx = findColumnIndex(headers, ITEM_HEADERS);
  const qtyIdx = findColumnIndex(headers, QTY_HEADERS);
  const dateIdx = findColumnIndex(headers, DATE_HEADERS);
  const invoiceIdx = findColumnIndex(headers, INVOICE_HEADERS);

  if (itemIdx < 0 || qtyIdx < 0) return [];

  const parsed: ParsedVyapaarRow[] = [];

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    if (!row || row.every((c) => c == null || String(c).trim() === "")) continue;

    const itemName = String(row[itemIdx] ?? "").trim();
    const quantity = parseQuantity(row[qtyIdx]);
    if (!itemName || quantity <= 0) continue;

    const partyName =
      partyIdx >= 0 ? String(row[partyIdx] ?? "").trim() || "Walk-in" : "Walk-in";
    const soldAt = dateIdx >= 0 ? parseDateCell(row[dateIdx]) : parseDateCell(null);
    const invoicePart =
      invoiceIdx >= 0 ? String(row[invoiceIdx] ?? "").trim() : `row-${i}`;
    const externalRef = `${invoicePart}::${itemName}::${soldAt}::${quantity}`;

    parsed.push({
      lineIndex: i,
      partyName,
      itemName,
      quantity,
      soldAt,
      externalRef,
    });
  }

  return parsed;
}

export function parseCsvText(text: string): ParsedVyapaarRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const rows = lines.map((line) => {
    const parts: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if ((ch === "," || ch === "\t") && !inQuotes) {
        parts.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    parts.push(current.trim());
    return parts;
  });
  return parseSheetRows(rows);
}

export function findSimilarPlantNames(
  input: string,
  existing: string[]
): string[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  return existing
    .filter((name) => {
      const n = name.toLowerCase();
      return n.includes(q) || q.includes(n);
    })
    .slice(0, 5);
}
