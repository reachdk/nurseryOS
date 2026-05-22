import Link from "next/link";
import { SyncImportForm } from "@/components/SyncImportForm";

export default async function SyncPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sync from Vyapaar</h2>
      <p className="text-sm text-[var(--muted)]">
        End-of-day: export today&apos;s sales from Vyapaar, upload here to reduce office stock.
      </p>

      {success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-[var(--primary)]">
          {success}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">{error}</p>
      )}

      <SyncImportForm />

      <Link href="/settings/vyapaar" className="block text-center text-sm text-[var(--primary)]">
        Vyapaar product name mappings
      </Link>
    </div>
  );
}
