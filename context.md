# NurseryOS — context

Project: `/Users/deepak.kumar/code/nurseryOS`  
Stack: Next.js 15, React 19, Prisma, SQLite (`prisma/dev.db`), mobile-first UI.

## What this app is

Nursery **inventory only**. Not POS. Not orders.

- **Vyapaar** = all sales + advance orders + party names (all day)
- **NurseryOS** = plants, batches, nursery vs office stock, loss, EOD stock sync from Vyapaar export

## Two places stock lives

| Place | DB | Meaning |
|-------|-----|---------|
| Nursery | `PlantingBatch.remainingQuantity` | Still in poly house |
| Office | `InventoryLot.remainingQuantity` | Sellable area (physical) |

Partial move OK: move 20k of 50k batch → 20k office, 30k stays nursery (`moveBatchToStock` bound per batch, field `moveQuantity`).

## When stock changes

| Action | Effect |
|--------|--------|
| Plant batch | +nursery qty |
| Move to office | nursery down, office up |
| Batch loss | nursery down, `wastage` up, reason in batch notes |
| Vyapaar EOD import | office down, `Sale` row created |
| During day in Vyapaar | NurseryOS office **unchanged** until sync |

**Free to sell** = office stock (no “committed” anymore; orders removed).

## Removed (do not bring back unless asked)

- Production plans
- Farmer orders / commitments / reservations
- Walk-in sale form in app
- Min/max growth days on plant type

## Data model (Prisma)

- `PlantType`: `name` unique, `typicalReadyDays` required, optional `notes`
- `PlantingBatch`: planted qty, remaining in nursery, planted date, **expected ready date** (farmer sets; not auto from min/max)
- `InventoryLot`: office stock, optional link to batch
- `VyapaarProductMap`: vyapaar item name → plantTypeId
- `Sale`: audit of imports — `partyName`, `quantity`, `saleType`=`vyapaar_import`, `externalRef` unique (idempotency)

## Screens / nav

| Tab | Route | Do what |
|-----|-------|---------|
| Home | `/` | Stock by plant |
| Plants | `/plants` | List; link add plant |
| Plant | `/batches/new` | New batch |
| Sync | `/sync` | Upload Vyapaar file, preview, import |

Also: `/plants/new` (add plant), `/plants/[id]` (location table, move, loss), `/settings/vyapaar` (name mappings).

## Add plant

- Required: name (unique; put variant in name e.g. `Cabbage F1`), typical days to ready
- Similar-name warnings while typing (`AddPlantForm`)

## Plant batch

- Required: plant, qty, planted date, **expected ready date**
- Ready date suggested from `typicalReadyDays` on plant change (`PlantBatchForm`); farmer can override

## Vyapaar sync (EOD)

1. Vyapaar: Reports → Sales → export (CSV best; xlsx also works)
2. Sync → upload → preview → confirm OK rows
3. Maps item name → plant via `VyapaarProductMap`; unmapped = skip/warn
4. Insufficient office = warn on preview
5. Duplicate `externalRef` = skip

**CSV**: already works, no code change needed. Preferred (avoids excel lib issues).

Parser: `src/lib/vyapaar-import.ts` — fuzzy column headers (item, qty, party, date, invoice).

Excel: `read-excel-file` in `actions.ts`; `serverExternalPackages` in `next.config.ts`.

## Key files

- `src/app/actions.ts` — all server actions
- `src/lib/availability.ts` — nursery/office/batch rows
- `src/lib/inventory.ts` — `deductOfficeStock` FIFO
- `src/components/SyncImportForm.tsx`, `PlantBatchForm.tsx`, `AddPlantForm.tsx`

## Run

```bash
cd /Users/deepak.kumar/code/nurseryOS
npm install
npm run db:push          # schema change → may need rm prisma/dev.db first
npm run db:seed          # optional demo
npm run dev              # http://localhost:3000
```

`npm audit`: warnings OK for dev; do **not** `npm audit fix --force`. High `xlsx` gone (use CSV or read-excel-file for xlsx).

## Decisions already made

- Inventory-only + Vyapaar EOD sync (not scratch rewrite)
- Refactor kept batch/move/loss/location view
- Ready date per batch, not computed range
- Name sync: mapping table + same names in both apps when possible

## Later (not built)

- Vyapaar open orders → “committed” view
- Manual stock correction sale
- Drop Excel dep → CSV-only sync (optional cleanup)
- Edit ready date on existing batch
- Login / multi-user
- Postgres deploy

## Plans on disk (Cursor)

- `nursery_cleanup_vyapaar` — main pivot (implemented)
- `fix_partial_move` — partial move + manual ready date (implemented)
- `sales_and_loss_tracking` — phase 2 location/loss (implemented)

Do not edit plan files unless user asks.
