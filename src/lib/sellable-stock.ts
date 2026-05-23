/** Merge office + ready-nursery maps into total sellable per plant. */
export function mergeSellableStock(
  officeByPlant: Map<string, number>,
  readyNurseryByPlant: Map<string, number>
): Map<string, number> {
  const merged = new Map<string, number>(officeByPlant);
  for (const [plantTypeId, qty] of readyNurseryByPlant) {
    merged.set(plantTypeId, (merged.get(plantTypeId) ?? 0) + qty);
  }
  return merged;
}

export function getSellableFromMaps(
  merged: Map<string, number>,
  plantTypeId: string
): number {
  return merged.get(plantTypeId) ?? 0;
}
