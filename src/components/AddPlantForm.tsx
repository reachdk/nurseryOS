"use client";

import { useMemo, useState } from "react";
import { createPlantType } from "@/app/actions";
import { findSimilarPlantNames } from "@/lib/vyapaar-import";
import { Card, Field, Input, Button } from "@/components/ui";

export function AddPlantForm({
  existingNames,
  defaultName,
  error,
}: {
  existingNames: string[];
  defaultName?: string;
  error?: string;
}) {
  const [name, setName] = useState(defaultName ?? "");

  const similar = useMemo(
    () => findSimilarPlantNames(name, existingNames),
    [name, existingNames]
  );

  const exactMatch = existingNames.some(
    (n) => n.toLowerCase() === name.trim().toLowerCase()
  );

  return (
    <Card>
      <form action={createPlantType} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        <Field label="Name (include variant in name, e.g. Cabbage F1)">
          <Input
            name="name"
            required
            placeholder="Cabbage"
            value={name}
            onChange={(e) => setName(e.target.value)}
            list="plant-name-suggestions"
          />
          <datalist id="plant-name-suggestions">
            {existingNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </Field>
        {similar.length > 0 && !exactMatch && (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-[var(--warning)]">
            <p className="font-medium">Similar plants already exist:</p>
            <ul className="mt-1 list-inside list-disc">
              {similar.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="mt-1 text-xs">Use a distinct name if this is a different variety.</p>
          </div>
        )}
        {exactMatch && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
            This name already exists. Add the variant to the name (e.g. Cabbage Hybrid).
          </p>
        )}
        <Field label="Typical days to ready for sale">
          <Input
            name="typicalReadyDays"
            type="number"
            min={1}
            required
            placeholder="e.g. 30"
          />
        </Field>
        <p className="text-xs text-[var(--muted)]">
          Used as the default ready date when planting a batch. You can change it per batch.
        </p>
        <Field label="Notes (optional)">
          <Input name="notes" placeholder="Season notes, etc." />
        </Field>
        <Button type="submit" disabled={exactMatch && name.trim().length > 0}>
          Save
        </Button>
      </form>
    </Card>
  );
}
