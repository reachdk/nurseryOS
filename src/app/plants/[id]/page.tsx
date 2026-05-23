import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPlantAvailability } from "@/lib/availability";
import { formatDate } from "@/lib/dates";
import { moveBatchToStock, recordBatchLoss } from "@/app/actions";
import { Card, Stat, Button, Field, Input, Select, Textarea } from "@/components/ui";

const LOSS_REASONS = [
  { value: "disease", label: "Disease" },
  { value: "pest", label: "Pest" },
  { value: "damage", label: "Damage" },
  { value: "other", label: "Other" },
];

export default async function PlantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lossError?: string; moveError?: string }>;
}) {
  const { id } = await params;
  const { lossError, moveError } = await searchParams;

  const [plant, avail] = await Promise.all([
    prisma.plantType.findUnique({
      where: { id },
      include: {
        plantingBatches: { orderBy: { expectedReadyDate: "asc" } },
      },
    }),
    getPlantAvailability(id),
  ]);

  if (!plant || !avail) notFound();

  const batchesWithNursery = plant.plantingBatches.filter((b) => b.remainingQuantity > 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{plant.name}</h2>
      <p className="text-xs text-[var(--muted)]">
        Usually ~{plant.typicalReadyDays} days to ready · sales in Vyapaar, sync EOD
      </p>

      <Card>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="In nursery" value={avail.inNursery} />
          <Stat label="In office" value={avail.inOffice} />
          <Stat
            label="Free to sell"
            value={avail.availableNow}
            highlight={avail.availableNow > 0 ? "good" : "danger"}
          />
        </div>
      </Card>

      {avail.batchRows.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold uppercase text-[var(--muted)]">
            Batches by location
          </h3>
          <div className="overflow-x-auto rounded-xl border border-[var(--accent)]/40 bg-white">
            <table className="w-full min-w-[320px] text-left text-xs lg:min-w-full">
              <thead className="bg-[var(--background)] text-[var(--muted)]">
                <tr>
                  <th className="px-2 py-2 font-medium">Ready</th>
                  <th className="px-2 py-2 font-medium">Nursery</th>
                  <th className="px-2 py-2 font-medium">Office</th>
                </tr>
              </thead>
              <tbody>
                {avail.batchRows.map((row) => (
                  <tr key={row.batchId} className="border-t border-[var(--accent)]/20">
                    <td className="px-2 py-2 whitespace-nowrap">
                      {formatDate(row.readyDate)}
                    </td>
                    <td className="px-2 py-2 tabular-nums">{row.inNursery.toLocaleString()}</td>
                    <td className="px-2 py-2 tabular-nums">{row.inOffice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {moveError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
              {moveError}
            </p>
          )}

          {batchesWithNursery.map((batch) => (
            <Card key={batch.id}>
              <p className="mb-2 text-sm font-medium">
                Move to office · ready {formatDate(batch.expectedReadyDate)}
              </p>
              <p className="mb-2 text-xs text-[var(--muted)]">
                {batch.remainingQuantity.toLocaleString()} still in nursery
              </p>
              <form action={moveBatchToStock.bind(null, batch.id)} className="flex gap-2">
                <div className="min-w-0 flex-1">
                  <Field label="Qty to move">
                    <Input
                      name="moveQuantity"
                      type="number"
                      min={1}
                      max={batch.remainingQuantity}
                      step={1}
                      inputMode="numeric"
                      placeholder={`Max ${batch.remainingQuantity.toLocaleString()}`}
                      className="!py-2"
                      required
                    />
                  </Field>
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  className="!w-auto shrink-0 self-end"
                >
                  Move
                </Button>
              </form>
            </Card>
          ))}
        </section>
      )}

      {batchesWithNursery.length > 0 && (
        <Card>
          <h3 className="mb-3 text-sm font-semibold">Record loss (nursery)</h3>
          {lossError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
              {lossError}
            </p>
          )}
          <form action={recordBatchLoss} className="space-y-3">
            <input type="hidden" name="plantTypeId" value={id} />
            <Field label="Batch">
              <Select name="batchId" required>
                {batchesWithNursery.map((b) => (
                  <option key={b.id} value={b.id}>
                    {formatDate(b.expectedReadyDate)} — {b.remainingQuantity.toLocaleString()}{" "}
                    in nursery
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Quantity lost">
              <Input name="quantity" type="number" min={1} required />
            </Field>
            <Field label="Reason">
              <Select name="reason" required>
                {LOSS_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Note (optional)">
              <Textarea name="notes" rows={2} />
            </Field>
            <Button type="submit" variant="danger">
              Record loss
            </Button>
          </form>
        </Card>
      )}

      <Link href={`/batches/new?plant=${id}`}>
        <Button variant="secondary">Record new planting batch</Button>
      </Link>
    </div>
  );
}
