import { prisma } from "@/lib/prisma";
import { AddPlantForm } from "@/components/AddPlantForm";

export default async function NewPlantPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; name?: string }>;
}) {
  const { error, name } = await searchParams;
  const plants = await prisma.plantType.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Add plant type</h2>
      <AddPlantForm
        existingNames={plants.map((p) => p.name)}
        defaultName={name}
        error={error}
      />
    </div>
  );
}
