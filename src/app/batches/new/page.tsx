import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toDateInputValue } from "@/lib/dates";
import { PlantBatchForm } from "@/components/PlantBatchForm";

export default async function NewBatchPage({
  searchParams,
}: {
  searchParams: Promise<{ plant?: string; error?: string }>;
}) {
  const { plant, error } = await searchParams;
  const plants = await prisma.plantType.findMany({ orderBy: { name: "asc" } });
  const today = toDateInputValue(new Date());

  if (plants.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--muted)]">Add a plant type first.</p>
        <Link href="/plants/new" className="text-sm text-[var(--primary)]">
          Add plant type
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Record planting batch</h2>
      <PlantBatchForm
        plants={plants.map((p) => ({
          id: p.id,
          name: p.name,
          typicalReadyDays: p.typicalReadyDays,
        }))}
        defaultPlantId={plant}
        today={today}
        error={error}
      />
    </div>
  );
}
