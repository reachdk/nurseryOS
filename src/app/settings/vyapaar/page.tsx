import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createVyapaarMapping, deleteVyapaarMapping } from "@/app/actions";
import { Card, Field, Input, Select, Button } from "@/components/ui";

export default async function VyapaarMappingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [maps, plants] = await Promise.all([
    prisma.vyapaarProductMap.findMany({
      include: { plantType: true },
      orderBy: { vyapaarItemName: "asc" },
    }),
    prisma.plantType.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Vyapaar name mappings</h2>
      <p className="text-sm text-[var(--muted)]">
        Link each Vyapaar item name to a plant in NurseryOS. Use the same name in both apps when
        possible; add a row here when they differ.
      </p>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">{error}</p>
      )}

      <Card>
        <form action={createVyapaarMapping} className="space-y-4">
          <Field label="Vyapaar item name (exact)">
            <Input name="vyapaarItemName" required placeholder="As shown on Vyapaar invoice" />
          </Field>
          <Field label="NurseryOS plant">
            <Select name="plantTypeId" required>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit">Add mapping</Button>
        </form>
      </Card>

      {maps.length > 0 ? (
        <ul className="space-y-2">
          {maps.map((m) => (
            <li key={m.id}>
              <Card className="flex items-center justify-between gap-2 !py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{m.vyapaarItemName}</p>
                  <p className="text-sm text-[var(--muted)]">→ {m.plantType.name}</p>
                </div>
                <form action={deleteVyapaarMapping}>
                  <input type="hidden" name="id" value={m.id} />
                  <Button type="submit" variant="danger" className="!w-auto !py-2 !px-3 text-xs">
                    Remove
                  </Button>
                </form>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--muted)]">No mappings yet.</p>
      )}

      <Link href="/sync" className="block text-center text-sm text-[var(--primary)]">
        ← Back to Sync
      </Link>
    </div>
  );
}
