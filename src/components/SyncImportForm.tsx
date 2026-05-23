"use client";

import { useState } from "react";
import {
  previewVyapaarImport,
  confirmVyapaarImport,
} from "@/app/actions";
import type { PreviewImportRow } from "@/lib/vyapaar-import";
import { Card, Field, Button, Badge } from "@/components/ui";
import Link from "next/link";

function statusTone(status: PreviewImportRow["status"]) {
  switch (status) {
    case "ok":
      return "good" as const;
    case "duplicate":
      return "default" as const;
    default:
      return "warn" as const;
  }
}

export function SyncImportForm() {
  const [preview, setPreview] = useState<PreviewImportRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePreview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await previewVyapaarImport(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      setPreview(null);
    } else {
      setPreview(result.rows);
    }
  }

  const okCount = preview?.filter((r) => r.status === "ok").length ?? 0;

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={handlePreview} className="space-y-4">
          <Field label="Vyapaar sales export (CSV or Excel)">
            <input
              type="file"
              name="file"
              accept=".csv,.txt,.xlsx,.xls"
              required
              className="w-full text-sm"
            />
          </Field>
          <p className="text-xs text-[var(--muted)]">
            From Vyapaar: Reports → Sales → export Excel for today. Needs item and quantity
            columns.
          </p>
          <Button type="submit" variant="secondary" disabled={loading}>
            {loading ? "Reading…" : "Preview import"}
          </Button>
        </form>
      </Card>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">{error}</p>
      )}

      {preview && preview.length > 0 && (
        <Card className="space-y-3">
          <p className="text-sm font-medium">
            {okCount} line(s) ready to import · {preview.length} total
          </p>
          <div className="max-h-64 overflow-x-auto overflow-y-auto">
            <div className="min-w-[320px] space-y-2 lg:min-w-full">
            {preview.map((row) => (
              <div
                key={row.externalRef}
                className="rounded-lg bg-[var(--background)] px-3 py-2 text-sm"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{row.itemName}</span>
                  <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                </div>
                <p className="text-[var(--muted)]">
                  {row.partyName} · {row.quantity.toLocaleString()}
                  {row.plantName && ` · ${row.plantName}`}
                </p>
                {row.message && (
                  <p className="text-xs text-[var(--warning)]">{row.message}</p>
                )}
              </div>
            ))}
            </div>
          </div>
          {okCount > 0 && (
            <form action={confirmVyapaarImport}>
              <input type="hidden" name="payload" value={JSON.stringify(preview)} />
              <Button type="submit">
                Import {okCount} sale line(s) and update stock
              </Button>
            </form>
          )}
          {preview.some((r) => r.status === "unmapped") && (
            <Link href="/settings/vyapaar" className="block text-center text-sm text-[var(--primary)]">
              Fix unmapped items →
            </Link>
          )}
        </Card>
      )}
    </div>
  );
}
