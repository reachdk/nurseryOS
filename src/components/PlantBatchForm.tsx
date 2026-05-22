"use client";

import { useMemo, useState } from "react";
import { createPlantingBatch } from "@/app/actions";
import { suggestReadyDate, toDateInputValue } from "@/lib/dates";
import { Card, Field, Input, Select, Textarea, Button } from "@/components/ui";

type Plant = {
  id: string;
  name: string;
  typicalReadyDays: number;
};

export function PlantBatchForm({
  plants,
  defaultPlantId,
  today,
  error,
}: {
  plants: Plant[];
  defaultPlantId?: string;
  today: string;
  error?: string;
}) {
  const [plantTypeId, setPlantTypeId] = useState(defaultPlantId ?? plants[0]?.id ?? "");
  const [plantedDate, setPlantedDate] = useState(today);
  const [expectedReadyDate, setExpectedReadyDate] = useState(() => {
    const plant = plants.find((p) => p.id === (defaultPlantId ?? plants[0]?.id));
    return toDateInputValue(
      suggestReadyDate(new Date(today), plant?.typicalReadyDays ?? 30)
    );
  });
  const [readyTouched, setReadyTouched] = useState(false);

  const selectedPlant = plants.find((p) => p.id === plantTypeId);

  const suggestionLabel = useMemo(() => {
    return `Suggested from ~${selectedPlant?.typicalReadyDays ?? 30} days — change for variant, season, or weather.`;
  }, [selectedPlant]);

  function handlePlantChange(id: string) {
    setPlantTypeId(id);
    if (!readyTouched) {
      const plant = plants.find((p) => p.id === id);
      setExpectedReadyDate(
        toDateInputValue(
          suggestReadyDate(new Date(plantedDate), plant?.typicalReadyDays ?? 30)
        )
      );
    }
  }

  function handlePlantedDateChange(value: string) {
    setPlantedDate(value);
    if (!readyTouched && value) {
      setExpectedReadyDate(
        toDateInputValue(
          suggestReadyDate(new Date(value), selectedPlant?.typicalReadyDays ?? 30)
        )
      );
    }
  }

  return (
    <Card>
      <form action={createPlantingBatch} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        <Field label="Plant">
          <Select
            name="plantTypeId"
            value={plantTypeId}
            onChange={(e) => handlePlantChange(e.target.value)}
            required
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (~{p.typicalReadyDays}d)
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Quantity planted">
          <Input name="plantedQuantity" type="number" min={1} required placeholder="50000" />
        </Field>
        <Field label="Planted date">
          <Input
            name="plantedDate"
            type="date"
            value={plantedDate}
            onChange={(e) => handlePlantedDateChange(e.target.value)}
            required
          />
        </Field>
        <Field label="Expected ready date">
          <Input
            name="expectedReadyDate"
            type="date"
            value={expectedReadyDate}
            onChange={(e) => {
              setReadyTouched(true);
              setExpectedReadyDate(e.target.value);
            }}
            required
          />
          <p className="mt-1 text-xs text-[var(--muted)]">{suggestionLabel}</p>
        </Field>
        <Field label="Notes">
          <Textarea name="notes" placeholder="Poly house section, seed batch, etc." />
        </Field>
        <Button type="submit">Save batch</Button>
      </form>
    </Card>
  );
}
