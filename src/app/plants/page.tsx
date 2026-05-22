import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAllPlantAvailability } from "@/lib/availability";
import { Card, Button } from "@/components/ui";

export default async function PlantsPage() {
  const [plants, availability] = await Promise.all([
    prisma.plantType.findMany({ orderBy: { name: "asc" } }),
    getAllPlantAvailability(),
  ]);

  const availMap = new Map(availability.map((a) => [a.plantTypeId, a]));

  return (
    <div className="space-y-4">
      <Link href="/plants/new">
        <Button>Add plant type</Button>
      </Link>

      <ul className="space-y-2">
        {plants.map((plant) => {
          const a = availMap.get(plant.id);
          return (
            <li key={plant.id}>
              <Link href={`/plants/${plant.id}`}>
                <Card className="transition-colors hover:border-[var(--primary)]">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{plant.name}</p>
                      {plant.typicalReadyDays != null && (
                        <p className="text-xs text-[var(--muted)]">
                          Usually ~{plant.typicalReadyDays} days to ready
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold tabular-nums text-[var(--primary)]">
                        {(a?.availableNow ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-[var(--muted)]">free now</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      {plants.length === 0 && (
        <p className="text-center text-sm text-[var(--muted)]">No plant types yet.</p>
      )}
    </div>
  );
}
