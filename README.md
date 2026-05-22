# NurseryOS

Mobile-first nursery **inventory** tracker. All sales and orders happen in **Vyapaar**; NurseryOS tracks stock in the nursery and office and updates from end-of-day Vyapaar exports.

## Quick start

```bash
cd /Users/deepak.kumar/code/nurseryOS
npm install
npm run db:push -- --accept-data-loss
npm run db:seed   # optional demo data
npm run dev
```

Open http://localhost:3000 on your phone or browser.

## Daily workflow

### During the day (Vyapaar)

- Record all sales and advance orders in **Vyapaar** (party names, quantities, invoices).

### In NurseryOS

1. **Plants** — Add crop types (unique name, required typical days to ready).
2. **Plant** — Record planting batches (planted date + expected ready date).
3. **Plant detail** — Move partial quantities to office; record nursery loss if needed.
4. **Sync** (end of day) — Export today’s sales from Vyapaar (Excel), upload → preview → import. Office stock goes down.

### Vyapaar export

1. Vyapaar app → **Reports** → **Sales** (or Transaction report).
2. Filter today’s date → tap **Excel** export.
3. NurseryOS → **Sync** → upload file.

### Keeping names in sync

- Best: use the **same item name** in Vyapaar and NurseryOS.
- When names differ: **Sync** → **Vyapaar product name mappings** — link Vyapaar item text to your plant.

## What each screen shows

| Field | Meaning |
|-------|---------|
| In nursery | Still in poly house (batches) |
| In office | Moved to sales area |
| Free to sell | Same as office (until EOD sync deducts Vyapaar sales) |

## Nav

| Tab | Purpose |
|-----|---------|
| Home | Stock overview |
| Plants | List + add plant |
| Plant | New batch |
| Sync | Vyapaar EOD import + mappings link |
