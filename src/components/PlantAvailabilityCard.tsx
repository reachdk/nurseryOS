import Link from "next/link";
import { PlantAvailability } from "@/lib/availability";
import { Card, Stat } from "@/components/ui";

export function PlantAvailabilityCard({ avail }: { avail: PlantAvailability }) {
  return (
    <Card>
      <Link
        href={`/plants/${avail.plantTypeId}`}
        className="mb-2 block text-lg font-semibold text-[var(--primary)] hover:underline"
      >
        {avail.plantName}
      </Link>

      <p className="mb-2 text-xs text-[var(--muted)]">
        Nursery {avail.inNursery.toLocaleString()} · Office {avail.inOffice.toLocaleString()}
      </p>

      <div className="grid grid-cols-2 gap-2 border-b border-[var(--accent)]/30 pb-3">
        <Stat label="In office" value={avail.inOffice} />
        <Stat
          label="Free to sell"
          value={avail.availableNow}
          highlight={avail.availableNow > 0 ? "good" : "danger"}
        />
      </div>

      {avail.upcomingBatches.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            In nursery (ready soon)
          </p>
          <ul className="space-y-1.5">
            {avail.upcomingBatches.map((b) => (
              <li
                key={b.batchId}
                className="flex justify-between rounded-lg bg-[var(--background)] px-3 py-2 text-sm"
              >
                <span>{b.readyLabel}</span>
                <span className="font-semibold tabular-nums text-[var(--primary)]">
                  {b.inNursery.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {avail.upcomingBatches.length === 0 && avail.availableNow === 0 && (
        <p className="mt-3 text-sm text-[var(--muted)]">No stock in nursery or office.</p>
      )}
    </Card>
  );
}
