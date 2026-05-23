import Link from "next/link";
import { getAllPlantAvailability } from "@/lib/availability";
import { PlantAvailabilityCard } from "@/components/PlantAvailabilityCard";
import { Card, Button } from "@/components/ui";

export default async function HomePage() {
  const availability = await getAllPlantAvailability();

  const lowStock = availability.filter(
    (a) => a.availableNow === 0 && a.inNursery === 0
  );

  return (
    <div className="space-y-4">
      <Card className="!p-3">
        <p className="text-sm text-[var(--muted)]">
          Sales happen in <strong className="text-[var(--foreground)]">Vyapaar</strong>.
          Run <strong className="text-[var(--foreground)]">Sync</strong> at end of day to update
          office stock.
        </p>
        <Link href="/sync" className="mt-2 block">
          <Button>Sync from Vyapaar</Button>
        </Link>
      </Card>

      {lowStock.length > 0 && (
        <Card className="border-[var(--danger)]/30 bg-red-50">
          <p className="text-sm font-medium text-[var(--danger)]">Low or no stock</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {lowStock.map((p) => p.plantName).join(", ")}
          </p>
        </Card>
      )}

      <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
        Stock by plant
      </h2>

      {availability.length === 0 ? (
        <Card>
          <p className="text-sm text-[var(--muted)]">
            No plants yet. Add a crop type, then record planting batches.
          </p>
          <Link href="/plants/new" className="mt-3 block">
            <Button>Add first plant type</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {availability.map((a) => (
            <PlantAvailabilityCard key={a.plantTypeId} avail={a} />
          ))}
        </div>
      )}
    </div>
  );
}
