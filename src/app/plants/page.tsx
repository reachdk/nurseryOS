import Link from "next/link";
import { getAllPlantAvailability } from "@/lib/availability";
import { Card, Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PlantsPage() {
  const availability = await getAllPlantAvailability();

  return (
    <div className="space-y-4">
      <Link href="/plants/new">
        <Button>Add plant type</Button>
      </Link>

      <ul className="space-y-2">
        {availability.map((a) => (
          <li key={a.plantTypeId}>
            <Link href={`/plants/${a.plantTypeId}`}>
              <Card className="transition-colors hover:border-[var(--primary)]">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{a.plantName}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Usually ~{a.typicalReadyDays} days to ready
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums text-[var(--primary)]">
                      {a.availableNow.toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--muted)]">free now</p>
                  </div>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      {availability.length === 0 && (
        <p className="text-center text-sm text-[var(--muted)]">No plant types yet.</p>
      )}
    </div>
  );
}
