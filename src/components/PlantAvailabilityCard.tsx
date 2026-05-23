import Link from "next/link";
import { PlantAvailability } from "@/lib/availability";
import { Card, Stat } from "@/components/ui";

function NurseryBatchList({
  title,
  batches,
}: {
  title: string;
  batches: PlantAvailability["readyNowBatches"];
}) {
  if (batches.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {title}
      </p>
      <ul className="space-y-1.5">
        {batches.map((b) => (
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
  );
}

export function PlantAvailabilityCard({ avail }: { avail: PlantAvailability }) {
  return (
    <Card
      data-plant={avail.plantName}
      data-available-now={avail.availableNow}
      data-ready-in-nursery={avail.readyInNursery}
      data-in-nursery={avail.inNursery}
      data-in-office={avail.inOffice}
    >
      <Link
        href={`/plants/${avail.plantTypeId}`}
        className="mb-2 block text-lg font-semibold text-[var(--primary)] hover:underline"
      >
        {avail.plantName}
      </Link>

      <p className="mb-2 text-xs text-[var(--muted)]">
        Nursery {avail.inNursery.toLocaleString()} · Office {avail.inOffice.toLocaleString()}
        {avail.readyInNursery > 0 && (
          <> · Ready in nursery {avail.readyInNursery.toLocaleString()}</>
        )}
      </p>

      <div className="grid grid-cols-2 gap-2 border-b border-[var(--accent)]/30 pb-3">
        <Stat label="In office" value={avail.inOffice} />
        <Stat
          label="Free to sell"
          value={avail.availableNow}
          highlight={avail.availableNow > 0 ? "good" : "danger"}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        Free to sell = office + nursery (ready date today or earlier)
      </p>

      <NurseryBatchList title="Ready in nursery" batches={avail.readyNowBatches} />
      <NurseryBatchList title="Coming soon" batches={avail.upcomingBatches} />

      {avail.readyNowBatches.length === 0 &&
        avail.upcomingBatches.length === 0 &&
        avail.availableNow === 0 && (
          <p className="mt-3 text-sm text-[var(--muted)]">No stock in nursery or office.</p>
        )}
    </Card>
  );
}
