# Product Requirements Document

## Nursery Inventory, Advance Order & Availability Management System

## 1. Product Summary

The nursery needs a system to track plant production, expected availability, advance order commitments, actual sellable stock, and free-to-sell inventory.

The current problem is not simply “stock count.” The real problem is that plants move through a lifecycle:

```text
Planted → Growing → Partially Ready / Ready → Sold / Reserved / Lost

```

At any point, the business needs to know:

```text
How many plants exist?
How many will become sellable?
How many are already promised?
How many are free to sell?
When will future stock become available?
What should we plant next?

```

The application should be built as a responsive web application usable on both mobile and desktop.

The **desktop/laptop interface** should support counter operations, office order-taking, planning, reports, customer history, and reconciliation.

The **mobile interface** should support quick order-taking, batch updates, nursery-floor updates, damage/loss reporting, and availability checks.

Vyapar should continue to be used for billing, invoices, and payment recording. This new system should manage production, availability, reservations, and operational stock confidence.

---

# 2. Product Goals

## 2.1 Primary Goals

1. Maintain accurate visibility of planted, expected, ready, reserved, and free-to-sell plants.
2. Prevent accidental overbooking of future or current plant availability.
3. Allow multiple staff members to take advance orders without coordination confusion.
4. Track batch-level losses, damage, mortality, and revised sellable quantity.
5. Support both mobile and desktop order-taking.
6. Help the nursery decide what to plant next based on sales, orders, losses, and future demand.
7. Reconcile actual sales from Vyapar with nursery stock movement.

## 2.2 Business Outcomes

The system should help the business answer these questions quickly:

- What is available for sale today?
- What is already promised to customers?
- What will become available next week or next month?
- Which batches are at risk of shortage?
- Which customer orders are due soon?
- Which plants are selling fast?
- Which plants should be planted next?
- Where are we overproducing?
- Where are we losing plants during production?

## 2.3 Success Metrics


| Metric                                      | Target                        |
| ------------------------------------------- | ----------------------------- |
| Time to answer “how many are free to sell?” | Under 30 seconds              |
| Advance orders entered into system same day | >95%                          |
| Overbooking incidents                       | Near zero                     |
| Daily Vyapar sales reconciliation           | Completed every business day  |
| Batch loss visibility                       | 100% of major losses recorded |
| Orders due today visible to counter staff   | 100%                          |
| Planting decisions based on system report   | Weekly                        |


---

# 3. Non-Goals for MVP

The first version should not try to replace every operational system.

MVP should not include:

- Full Vyapar replacement
- Full accounting system
- GST filing
- Complex payment gateway integration
- Farmer self-service app
- AI demand forecasting
- IoT-based plant counting
- QR code tracking for every tray
- Full offline-first architecture
- Automated WhatsApp bot
- Complex logistics/transport management

These can be considered in later phases.

---

# 4. Key Product Principle

The most important design principle:

```text
Availability must be calculated, not manually guessed.

```

The system should calculate availability using:

```text
Free to Sell =
Ready or Expected Sellable Quantity
- Reserved Quantity
- Safety Buffer
- Confirmed Sales Not Yet Reconciled

```

The application should distinguish clearly between:


| Term                       | Meaning                                                     |
| -------------------------- | ----------------------------------------------------------- |
| Planted quantity           | Number of plants/trays initially planted                    |
| Expected sellable quantity | Estimated number likely to survive and become sellable      |
| Ready quantity             | Plants physically ready for sale                            |
| Reserved quantity          | Plants committed against confirmed advance orders           |
| Free-to-sell quantity      | Plants available for new sale/order                         |
| Lost/damaged quantity      | Plants that will not be sellable                            |
| Tentative demand           | Enquiries or unconfirmed orders that should not block stock |


---

# 5. Product Scope

## 5.1 MVP Scope

The MVP should include:

1. User login and role-based access
2. Plant and variety master
3. Seasonal growing cycle setup
4. Customer/farmer master
5. Production batch creation
6. Expected ready date calculation
7. Batch loss/damage adjustments
8. Advance order creation
9. Multi-line advance orders
10. Reservation/allocation against batches
11. Free-to-sell calculation
12. Desktop counter order-taking screen
13. Mobile quick order-taking screen
14. Plant availability screen
15. Order fulfillment screen
16. Vyapar invoice reference field
17. Manual Vyapar CSV/Excel import
18. Basic reports
19. Alerts for overbooking, shortage, overdue orders, and batch losses
20. Audit log for important changes

## 5.2 Phase 2 Scope

Later versions can include:

1. Better planting recommendations
2. Demand vs production forecasting
3. Customer order history insights
4. WhatsApp message template generation
5. Payment proof attachments
6. Batch photos
7. QR labels for batches
8. Advanced reporting
9. Automated Vyapar import if feasible
10. Farmer confirmation reminders

## 5.3 Phase 3 Scope

Future advanced capabilities:

1. Farmer self-service order portal
2. Automated WhatsApp order capture
3. Demand prediction
4. Multi-nursery support
5. Profitability by plant/variety
6. Seed/source performance tracking
7. Tray-level or location-level QR scanning
8. Mobile offline mode

---

# 6. Users and Roles

## 6.1 Owner / Admin

The owner has full control over the system.

Permissions:

- Create, edit, and deactivate users
- Manage roles and permissions
- Create/edit plant master
- Create/edit seasonal growing rules
- View all batches, orders, customers, and reports
- Override overbooking warnings
- Edit or cancel confirmed orders
- Release reservations
- Approve major stock corrections
- Import Vyapar sales data
- View audit logs
- Export reports

Typical usage:

- Review daily stock position
- Review shortage/excess risk
- Decide what to plant next
- Approve exceptional changes

---

## 6.2 Nursery Supervisor

Responsible for production and batch health.

Permissions:

- Create planting batches
- Update batch status
- Record germination loss
- Record mortality/damage
- Mark batch partially ready
- Mark batch ready
- Update actual sellable quantity
- Add batch notes
- View batch-level reservations
- View availability, but not override reservations unless allowed

Typical usage:

- Record new planting
- Update readiness
- Report losses
- Maintain accurate batch status

---

## 6.3 Counter Staff / Sales Staff

Responsible for customer-facing sales and order fulfillment.

Permissions:

- Search customer
- Create customer
- Check plant availability
- Create advance order
- Reserve stock if available
- Mark order fulfilled or partially fulfilled
- Add Vyapar invoice number
- Add payment reference
- View orders due today
- View customer order history
- Cannot override shortage without approval

Typical usage:

- Handle walk-in farmers
- Take advance orders at counter
- Link final sale to Vyapar invoice
- Fulfill reserved orders

---

## 6.4 Phone / WhatsApp Order Taker

Responsible for taking orders remotely.

Permissions:

- Search/create customer
- Create enquiry
- Create tentative order
- Create confirmed order if stock is available
- Record advance payment reference
- Attach note or screenshot
- View availability
- Cannot override overbooking

Typical usage:

- Receive phone/WhatsApp order
- Check future availability
- Reserve stock
- Add follow-up notes

---

## 6.5 Office / Planning User

Responsible for planning, reports, and reconciliation.

Permissions:

- View reports
- View all orders and batches
- Import Vyapar sales file
- Reconcile sales
- Export planning reports
- Create planting plan
- Cannot delete operational records unless admin

Typical usage:

- Run daily reconciliation
- Prepare weekly planting plan
- Review sales and demand trends

---

## 6.6 Viewer

Read-only role.

Permissions:

- View availability
- View orders
- View batch status
- View reports
- Cannot create, edit, delete, reserve, or fulfill

---

# 7. Core Concepts and Definitions

## 7.1 Plant

A crop or plant type sold by the nursery.

Example:

```text
Tomato
Chilli
Brinjal
Marigold
Papaya

```

## 7.2 Variety

A specific type of plant.

Example:

```text
Plant: Tomato
Variety: Arka Rakshak

```

## 7.3 Batch

A production lot created when a plant/variety is planted.

Example:

```text
Batch ID: TOM-2026-07-001
Plant: Tomato
Variety: Arka Rakshak
Planted: 50,000
Expected sellable: 44,000
Expected ready date: 22 July

```

## 7.4 Reservation

A commitment of quantity from a batch or future availability against a customer order.

Example:

```text
Farmer Ravi order: 10,000 Tomato
Reserved from Batch TOM-2026-07-001: 10,000

```

## 7.5 Advance Order

An order placed before actual pickup/sale. It may or may not include advance payment.

## 7.6 Free-to-Sell Stock

Quantity available for new sale or new confirmed order.

```text
Free-to-Sell = Sellable Quantity - Reserved Quantity - Safety Buffer

```

## 7.7 Tentative Demand

Customer interest that should be tracked but should not block stock.

---

# 8. Data Model

## 8.1 Entity Relationship Summary

Core relationships:

```text
User creates Batch
Batch belongs to Plant Variety
Customer places Order
Order has one or more Order Lines
Order Line reserves quantity from one or more Batches
Batch has many Batch Events
Order has many Fulfillment Events
Sales may link to Vyapar Invoice
All major actions create Audit Log entries

```

---

## 8.2 Users Table

Stores system users.

Key fields:


| Field      | Type     | Notes            |
| ---------- | -------- | ---------------- |
| id         | UUID     | Primary key      |
| name       | Text     | User name        |
| mobile     | Text     | Login/contact    |
| email      | Text     | Optional         |
| role_id    | UUID     | Linked role      |
| status     | Enum     | Active/inactive  |
| created_at | DateTime | System generated |
| updated_at | DateTime | System generated |


---

## 8.3 Roles Table

Stores permission groups.

Fields:


| Field       | Type       |
| ----------- | ---------- |
| id          | UUID       |
| role_name   | Text       |
| permissions | JSON/Array |
| created_at  | DateTime   |


Default roles:

```text
Admin
Nursery Supervisor
Counter Staff
Order Taker
Planning User
Viewer

```

---

## 8.4 Plant Master Table

Stores crop/plant information.

Fields:


| Field      | Type    | Notes                                |
| ---------- | ------- | ------------------------------------ |
| id         | UUID    | Primary key                          |
| plant_name | Text    | Example: Tomato                      |
| category   | Text    | Vegetable, fruit, flower, ornamental |
| active     | Boolean | Active/inactive                      |
| notes      | Text    | Optional                             |


---

## 8.5 Plant Variety Table

Stores varieties under each plant.

Fields:


| Field                | Type    | Notes                 |
| -------------------- | ------- | --------------------- |
| id                   | UUID    | Primary key           |
| plant_id             | UUID    | Linked plant          |
| variety_name         | Text    | Example: Arka Rakshak |
| default_cycle_days   | Number  | Default growing cycle |
| summer_cycle_days    | Number  | Optional              |
| winter_cycle_days    | Number  | Optional              |
| monsoon_cycle_days   | Number  | Optional              |
| default_loss_percent | Number  | Expected loss         |
| plants_per_tray      | Number  | Standard count        |
| standard_price       | Decimal | Optional              |
| active               | Boolean | Active/inactive       |


---

## 8.6 Location Table

Tracks where plants are grown or stored.

Fields:


| Field         | Type    | Notes                                |
| ------------- | ------- | ------------------------------------ |
| id            | UUID    | Primary key                          |
| location_name | Text    | Polyhouse 1, Shade Net 2, Sales Area |
| location_type | Enum    | Nursery, polyhouse, counter, storage |
| active        | Boolean | Active/inactive                      |


---

## 8.7 Production Batch Table

Stores each planting batch.

Fields:


| Field                      | Type     | Notes                                     |
| -------------------------- | -------- | ----------------------------------------- |
| id                         | UUID     | Primary key                               |
| batch_code                 | Text     | Human-readable ID                         |
| plant_variety_id           | UUID     | Linked variety                            |
| location_id                | UUID     | Growing location                          |
| planted_date               | Date     | Date planted                              |
| season                     | Enum     | Summer/winter/monsoon/default             |
| trays_planted              | Number   | Number of trays                           |
| plants_per_tray            | Number   | Snapshot at time of planting              |
| initial_planted_quantity   | Number   | Calculated or entered                     |
| expected_loss_percent      | Number   | Initial estimate                          |
| expected_sellable_quantity | Number   | Calculated                                |
| actual_ready_quantity      | Number   | Updated when ready                        |
| expected_ready_date        | Date     | Auto-calculated/editable                  |
| actual_ready_date          | Date     | When marked ready                         |
| status                     | Enum     | Planned/planted/growing/ready/closed/lost |
| notes                      | Text     | Optional                                  |
| created_by                 | UUID     | User                                      |
| created_at                 | DateTime | System generated                          |
| updated_at                 | DateTime | System generated                          |


Batch statuses:

```text
Planned
Planted
Growing
Partially Ready
Ready
Partially Lost
Fully Lost
Closed
Cancelled

```

---

## 8.8 Batch Event / Adjustment Table

Stores all batch changes.

Fields:


| Field                       | Type     | Notes                               |
| --------------------------- | -------- | ----------------------------------- |
| id                          | UUID     | Primary key                         |
| batch_id                    | UUID     | Linked batch                        |
| event_type                  | Enum     | Loss, damage, readiness, correction |
| quantity_change             | Number   | Positive or negative                |
| resulting_expected_quantity | Number   | Snapshot after event                |
| reason                      | Text     | Required for loss/correction        |
| event_date                  | Date     | Date of event                       |
| photo_url                   | Text     | Optional later                      |
| created_by                  | UUID     | User                                |
| created_at                  | DateTime | System generated                    |


Event types:

```text
Planted
Loss
Damage
Mortality
Weak Plants Removed
Count Correction
Partially Ready
Ready
Batch Closed
Batch Cancelled

```

---

## 8.9 Customer Table

Stores farmer/customer details.

Fields:


| Field            | Type     | Notes                           |
| ---------------- | -------- | ------------------------------- |
| id               | UUID     | Primary key                     |
| customer_name    | Text     | Required                        |
| mobile           | Text     | Strongly recommended            |
| alternate_mobile | Text     | Optional                        |
| village          | Text     | Optional                        |
| address          | Text     | Optional                        |
| customer_type    | Enum     | Farmer, dealer, reseller, other |
| notes            | Text     | Optional                        |
| created_at       | DateTime | System generated                |


---

## 8.10 Advance Order Table

Stores order header.

Fields:


| Field             | Type     | Notes                                          |
| ----------------- | -------- | ---------------------------------------------- |
| id                | UUID     | Primary key                                    |
| order_number      | Text     | Human-readable                                 |
| customer_id       | UUID     | Linked customer                                |
| order_date        | Date     | Required                                       |
| source            | Enum     | Phone, WhatsApp, counter, field visit          |
| order_status      | Enum     | Enquiry/tentative/confirmed/reserved/fulfilled |
| advance_amount    | Decimal  | Optional                                       |
| payment_reference | Text     | Optional                                       |
| payment_status    | Enum     | None, partial, advance paid, paid              |
| notes             | Text     | Optional                                       |
| created_by        | UUID     | User                                           |
| created_at        | DateTime | System generated                               |
| updated_at        | DateTime | System generated                               |


Order statuses:

```text
Enquiry
Tentative
Confirmed
Reserved
Partially Fulfilled
Fulfilled
Cancelled
Expired

```

---

## 8.11 Advance Order Line Table

Stores each plant requested in an order.

Fields:


| Field              | Type    | Notes                                  |
| ------------------ | ------- | -------------------------------------- |
| id                 | UUID    | Primary key                            |
| order_id           | UUID    | Linked order                           |
| plant_variety_id   | UUID    | Requested variety                      |
| requested_quantity | Number  | Required                               |
| required_date      | Date    | Required                               |
| agreed_price       | Decimal | Optional                               |
| line_status        | Enum    | Tentative/reserved/fulfilled/cancelled |
| notes              | Text    | Optional                               |


---

## 8.12 Reservation / Allocation Table

Stores quantity reserved against batches.

Fields:


| Field              | Type     | Notes                               |
| ------------------ | -------- | ----------------------------------- |
| id                 | UUID     | Primary key                         |
| order_line_id      | UUID     | Linked order line                   |
| batch_id           | UUID     | Linked batch                        |
| reserved_quantity  | Number   | Required                            |
| reservation_status | Enum     | Active/released/fulfilled/cancelled |
| reserved_by        | UUID     | User                                |
| reserved_at        | DateTime | System generated                    |
| released_at        | DateTime | Optional                            |
| release_reason     | Text     | Required if released                |


Important rule:

```text
One order line can reserve from multiple batches.
One batch can serve multiple order lines.

```

---

## 8.13 Fulfillment Table

Stores actual pickup/sale against an order.

Fields:


| Field                 | Type   | Notes                  |
| --------------------- | ------ | ---------------------- |
| id                    | UUID   | Primary key            |
| order_line_id         | UUID   | Linked order line      |
| batch_id              | UUID   | Optional but preferred |
| fulfilled_quantity    | Number | Required               |
| fulfillment_date      | Date   | Required               |
| vyapar_invoice_number | Text   | Optional               |
| fulfilled_by          | UUID   | User                   |
| notes                 | Text   | Optional               |


---

## 8.14 Vyapar Sales Import Table

Stores imported sales rows from Vyapar.

Fields:


| Field                   | Type    | Notes                               |
| ----------------------- | ------- | ----------------------------------- |
| id                      | UUID    | Primary key                         |
| import_batch_id         | UUID    | Import session                      |
| vyapar_invoice_number   | Text    | From Vyapar                         |
| sale_date               | Date    | From Vyapar                         |
| customer_name           | Text    | From Vyapar                         |
| item_name               | Text    | From Vyapar                         |
| mapped_plant_variety_id | UUID    | Matched manually/automatically      |
| quantity                | Number  | Sold quantity                       |
| amount                  | Decimal | Optional                            |
| reconciliation_status   | Enum    | Matched/unmatched/duplicate/ignored |
| notes                   | Text    | Optional                            |


---

## 8.15 Inventory Ledger Table

Stores movement events for inventory calculation.

Fields:


| Field            | Type     | Notes                                          |
| ---------------- | -------- | ---------------------------------------------- |
| id               | UUID     | Primary key                                    |
| ledger_date      | Date     | Event date                                     |
| plant_variety_id | UUID     | Plant variety                                  |
| batch_id         | UUID     | Optional                                       |
| source_type      | Enum     | Batch, order, sale, adjustment                 |
| source_id        | UUID     | Linked object                                  |
| event_type       | Enum     | Planted, loss, reserved, released, ready, sold |
| quantity_effect  | Number   | Positive or negative                           |
| created_by       | UUID     | User                                           |
| created_at       | DateTime | System generated                               |


Ledger event examples:

```text
Planted: +50,000 expected
Loss: -5,000 expected
Reserved: -10,000 free
Released: +10,000 free
Ready: +44,000 ready
Sold: -5,000 ready

```

---

## 8.16 Audit Log Table

Stores sensitive changes.

Fields:


| Field       | Type     |
| ----------- | -------- |
| id          | UUID     |
| entity_type | Text     |
| entity_id   | UUID     |
| action      | Text     |
| old_value   | JSON     |
| new_value   | JSON     |
| changed_by  | UUID     |
| changed_at  | DateTime |
| reason      | Text     |


Audit required for:

- Batch quantity correction
- Loss reversal
- Order cancellation
- Reservation override
- Manual stock correction
- User permission change
- Vyapar reconciliation correction

---

# 9. Main Screens

## 9.1 Desktop Counter Dashboard

Purpose:

Allow counter/office staff to quickly manage sales and advance orders.

Key sections:

- Search customer
- New advance order
- Orders due today
- Orders overdue
- Plant availability search
- Ready stock summary
- Shortage alerts
- Recent orders
- Vyapar invoice linking

Primary actions:

```text
Create order
Check availability
Reserve stock
Fulfill order
Link Vyapar invoice
Record advance payment reference

```

---

## 9.2 Desktop New Advance Order Screen

Purpose:

Fast and complete order entry at counter or office.

Fields:

- Customer mobile
- Customer name
- Village/location
- Source
- Plant/variety
- Quantity
- Required date
- Availability check
- Suggested batch allocation
- Advance amount
- Payment status
- Notes

Required behavior:

- User enters plant, quantity, and date.
- System shows available now and available by required date.
- System suggests eligible batches.
- User can reserve full or partial quantity.
- System prevents overbooking unless role allows override.

---

## 9.3 Desktop Multi-Plant Order Screen

Purpose:

Support farmers ordering multiple plants in one visit.

Example:

```text
Order for Farmer Ramesh:
1. Tomato - 10,000 - 20 July
2. Chilli - 5,000 - 25 July
3. Brinjal - 2,000 - Today

```

Each line should have:

- Independent availability check
- Independent required date
- Independent reservation
- Independent fulfillment status

---

## 9.4 Desktop Availability Screen

Purpose:

Show ready and future free stock.

Columns:


| Plant | Variety | Ready Now | Reserved Now | Free Now | Next Ready Date | Future Free |
| ----- | ------- | --------- | ------------ | -------- | --------------- | ----------- |


Filters:

- Plant
- Variety
- Date range
- Location
- Only free stock
- Only shortage risk
- Only ready now

---

## 9.5 Desktop Production Planning Screen

Purpose:

Help decide what to plant next.

Shows:

- Current ready stock
- Future expected stock
- Confirmed demand
- Tentative demand
- Average sales
- Loss history
- Suggested planting quantity

---

## 9.6 Desktop Reconciliation Screen

Purpose:

Compare Vyapar sales with nursery inventory.

Actions:

- Upload Vyapar CSV/Excel
- Map Vyapar item to plant variety
- Detect duplicate invoices
- Detect unmatched items
- Mark sale as reconciled
- Reduce stock accordingly

---

## 9.7 Mobile Quick Availability Screen

Purpose:

Allow staff to quickly answer availability questions.

Search by plant/variety.

Show:

```text
Ready now
Reserved
Free now
Coming soon
Free soon
Shortage risk

```

---

## 9.8 Mobile Quick Order Screen

Purpose:

Take phone/WhatsApp orders quickly.

Fields:

- Customer mobile
- Customer name
- Plant
- Quantity
- Required date
- Source
- Notes

System shows:

```text
Can reserve fully
Can reserve partially
Cannot reserve

```

---

## 9.9 Mobile Batch Update Screen

Purpose:

Allow nursery supervisor to update batch status.

Actions:

- Record loss
- Record damage
- Mark partially ready
- Mark ready
- Correct expected sellable quantity
- Add note/photo

---

# 10. Main Workflows

## 10.1 Create New Plant Variety

Actor:

Admin or Planning User

Steps:

1. Open Plant Master.
2. Select plant or create new plant.
3. Add variety name.
4. Enter default growing cycle.
5. Enter seasonal cycle variations.
6. Enter plants per tray.
7. Enter expected loss percentage.
8. Save.

Output:

- Variety becomes available for batch creation and order-taking.

---

## 10.2 Create Production Batch

Actor:

Nursery Supervisor

Steps:

1. Select plant/variety.
2. Enter planted date.
3. Enter location.
4. Enter number of trays.
5. Confirm plants per tray.
6. System calculates planted quantity.
7. System applies default loss percentage.
8. System calculates expected sellable quantity.
9. System calculates expected ready date.
10. User confirms or edits.
11. Batch is created with status “Planted” or “Growing.”

Example:

```text
Trays: 500
Plants per tray: 98
Initial planted quantity: 49,000
Expected loss: 10%
Expected sellable: 44,100
Expected ready date: 22 July

```

---

## 10.3 Record Batch Loss

Actor:

Nursery Supervisor

Steps:

1. Open batch.
2. Select “Record Loss.”
3. Enter loss quantity.
4. Enter reason.
5. Enter date.
6. Save.
7. System reduces expected sellable quantity.
8. System checks reservations against the batch.
9. If reservations exceed revised quantity, system creates shortage alert.

Example alert:

```text
Batch TOM-2026-07-001 is now short by 3,500 plants against confirmed orders.

```

---

## 10.4 Mark Batch Ready

Actor:

Nursery Supervisor

Steps:

1. Open batch.
2. Select “Mark Ready” or “Partially Ready.”
3. Enter actual ready quantity.
4. Enter actual ready date.
5. Save.
6. System updates ready stock.
7. System updates free-to-sell calculation.

---

## 10.5 Create Advance Order at Counter/Desktop

Actor:

Counter Staff

Steps:

1. Search customer by mobile number.
2. Create customer if not found.
3. Add plant/variety.
4. Enter quantity.
5. Enter required date.
6. System checks availability.
7. System suggests batch allocation.
8. Staff selects status:
  - Enquiry
  - Tentative
  - Confirmed
  - Reserved
9. Staff records advance amount if any.
10. Save order.
11. System creates reservation if confirmed/reserved.

---

## 10.6 Create Phone/WhatsApp Advance Order on Mobile

Actor:

Order Taker

Steps:

1. Open quick order form.
2. Enter customer mobile.
3. Select plant/variety.
4. Enter quantity.
5. Enter required date.
6. Select source: phone/WhatsApp.
7. Add notes.
8. System displays availability.
9. User confirms reservation or saves as tentative.
10. System updates reserved/free quantity if confirmed.

---

## 10.7 Fulfill Advance Order

Actor:

Counter Staff

Steps:

1. Search customer or order number.
2. Open order.
3. View reserved quantity.
4. Enter quantity being picked up.
5. Generate invoice in Vyapar.
6. Enter Vyapar invoice number in nursery app.
7. Mark fulfilled or partially fulfilled.
8. System reduces reserved quantity and ready stock.

Example:

```text
Order quantity: 20,000
Picked up today: 12,000
Remaining: 8,000
Status: Partially Fulfilled

```

---

## 10.8 Walk-In Sale Without Advance Order

Actor:

Counter Staff

Steps:

1. Check free stock in nursery app.
2. Sell through Vyapar.
3. Enter sale reference manually or import through daily Vyapar file.
4. System reduces free stock during reconciliation.

Important MVP rule:

```text
If sale is not linked immediately, daily Vyapar reconciliation must reduce stock.

```

---

## 10.9 Daily Vyapar Reconciliation

Actor:

Office / Planning User

Steps:

1. Export daily sales from Vyapar.
2. Upload file into nursery app.
3. System reads invoice rows.
4. System maps Vyapar item names to plant varieties.
5. User resolves unmatched items.
6. System identifies duplicate invoices.
7. System posts sales movement to inventory ledger.
8. System shows reconciliation summary.

Summary example:

```text
Total invoices imported: 42
Matched lines: 39
Unmatched lines: 3
Duplicate invoices: 0
Stock movements posted: 39

```

---

## 10.10 Release Reservation

Actor:

Admin or authorized user

Steps:

1. Open order.
2. Select reserved line.
3. Choose release quantity.
4. Enter reason.
5. Save.
6. System increases free-to-sell quantity.
7. Audit log is created.

Reasons:

```text
Customer cancelled
Customer did not pick up
Order expired
Changed plant variety
Admin correction

```

---

## 10.11 Planting Recommendation Workflow

Actor:

Owner / Planning User

Steps:

1. Open production planning screen.
2. Select date range.
3. System shows:
  - Current free stock
  - Future expected free stock
  - Confirmed demand
  - Tentative demand
  - Recent sales velocity
  - Historical loss percentage
4. System suggests shortage/excess.
5. User decides planting quantity.

Example:

```text
Tomato demand next 45 days: 80,000
Expected free availability: 42,000
Average loss: 12%
Suggested planting: 45,000 to 50,000

```

---

# 11. Business Rules

## 11.1 Availability Calculation

For ready stock:

```text
Free Ready Stock =
Actual Ready Quantity
- Active Reserved Quantity
- Sold Quantity
- Safety Buffer

```

For future stock:

```text
Future Free Stock =
Expected Sellable Quantity
- Active Future Reservations
- Safety Buffer

```

---

## 11.2 Reservation Rule

Only these statuses block stock:

```text
Confirmed
Reserved
Partially Fulfilled

```

These do not block stock:

```text
Enquiry
Tentative
Cancelled
Expired

```

---

## 11.3 Overbooking Rule

Normal users cannot reserve more than available free quantity.

Admin may override, but must enter a reason.

Override should create:

- Shortage alert
- Audit log
- Owner notification

---

## 11.4 Loss Rule

Loss reduces available stock in this order:

1. Free unreserved quantity
2. Safety buffer
3. Creates shortage against reservations

Example:

```text
Expected sellable: 50,000
Reserved: 40,000
Free: 10,000
Loss: 15,000

New expected: 35,000
Reserved: 40,000
Shortage: 5,000

```

---

## 11.5 Partial Fulfillment Rule

Orders can be partially fulfilled.

```text
Original order: 20,000
Fulfilled: 12,000
Remaining reserved: 8,000

```

Order status becomes:

```text
Partially Fulfilled

```

---

## 11.6 Order Expiry Rule

If order due date passes and customer does not pick up:

- Day 1: Show overdue alert
- Day 3: Ask staff to follow up
- Day 7: Require admin to extend, cancel, or release reservation

Exact expiry period should be configurable.

---

## 11.7 Batch Readiness Rule

A batch may become partially ready.

Example:

```text
Expected sellable: 50,000
Ready today: 30,000
Remaining growing: 20,000

```

The system must support partial readiness.

---

## 11.8 Multi-Batch Allocation Rule

One order line can be fulfilled from multiple batches.

Example:

```text
Order: 15,000 Chilli
Batch A: 8,000
Batch B: 7,000

```

---

## 11.9 Substitution Rule

If requested variety is not available, staff may suggest alternate variety.

If accepted, substitution must be recorded.

Example:

```text
Requested: Tomato Variety A
Substituted with: Tomato Variety B
Reason: Variety A unavailable
Approved by: Customer

```

---

## 11.10 Manual Correction Rule

Manual stock corrections must require:

- Reason
- User name
- Timestamp
- Old value
- New value

---

# 12. Edge Cases

## 12.1 Customer Orders More Than Available

Scenario:

Customer wants 20,000 plants, but only 12,000 are free.

Expected behavior:

- System warns user.
- User can reserve 12,000 and mark 8,000 as unfulfilled demand.
- Admin can override only with reason.

---

## 12.2 Batch Loss After Orders Are Reserved

Scenario:

40,000 plants reserved from a batch, but batch suffers loss and now only 35,000 are expected.

Expected behavior:

- System creates shortage alert.
- Impacted orders are listed.
- Admin can reallocate from another batch.
- If not possible, staff can renegotiate with customers.

---

## 12.3 Customer Does Not Pick Up Order

Scenario:

Customer reserved plants but does not collect on due date.

Expected behavior:

- Order becomes overdue.
- Reservation remains active initially.
- System alerts staff.
- After configured period, admin must extend, cancel, or release.

---

## 12.4 Customer Picks Up Partial Quantity

Scenario:

Customer ordered 20,000 but collects only 12,000.

Expected behavior:

- Fulfill 12,000.
- Remaining 8,000 stays reserved unless released.
- Order status becomes partially fulfilled.

---

## 12.5 Walk-In Sale Consumes Reserved Stock Accidentally

Scenario:

Counter sells from physical stock that was reserved for advance order.

Expected behavior:

- System should warn if free stock is insufficient.
- During reconciliation, shortage alert should be created.
- Reserved orders at risk should be shown.

---

## 12.6 Same Customer Creates Duplicate Orders

Scenario:

Same farmer calls two different staff members and places same order twice.

Expected behavior:

- System should show recent orders for same customer/mobile.
- Warning should appear:

```text
This customer already has an active order for Tomato due on similar date.

```

---

## 12.7 Same Plant Has Multiple Names in Vyapar

Scenario:

Vyapar item is named “Tomato Seedling Hybrid,” but nursery app has “Tomato Arka Rakshak.”

Expected behavior:

- Reconciliation screen should allow item mapping.
- Mapping should be remembered for future imports.

---

## 12.8 Batch Ready Earlier or Later Than Expected

Scenario:

Expected ready date was 20 July, but batch is ready on 16 July or delayed to 25 July.

Expected behavior:

- Supervisor updates actual ready date.
- System updates future availability.
- Orders due before actual ready date are flagged as risk.

---

## 12.9 Entire Batch Lost

Scenario:

Batch of 50,000 fails completely.

Expected behavior:

- Batch status becomes Fully Lost.
- Expected availability becomes zero.
- All reservations against batch become shortage risk.
- Admin must reallocate or contact customers.

---

## 12.10 Plant Count Is Approximate

Scenario:

Exact plant count is not known, only tray count.

Expected behavior:

- System should allow tray-based quantity estimation.
- Actual ready quantity can be updated later.
- Difference is recorded as adjustment.

---

## 12.11 Order Taken Without Advance Payment

Scenario:

Customer verbally confirms but pays no advance.

Expected behavior:

- Business must decide whether this blocks stock.
- Recommended default:
  - Tentative does not block stock.
  - Confirmed may block stock.
  - Advance paid gets stronger priority.

---

## 12.12 Multiple Users Edit Same Order

Scenario:

Two staff members open and edit same order.

Expected behavior:

- System should prevent conflicting saves.
- Show warning if order changed since user opened it.
- Maintain audit log.

---

## 12.13 Internet Connectivity Failure

Scenario:

Staff is taking order on phone and internet drops.

Expected behavior for MVP:

- User should see save failure clearly.
- No silent data loss.
- Later phase may support offline draft mode.

---

## 12.14 Negative Free Stock

Scenario:

Due to reconciliation or manual correction, free stock becomes negative.

Expected behavior:

- System should allow negative only as exception state.
- Show critical alert.
- Require admin correction/reallocation.

---

## 12.15 Customer Changes Required Date

Scenario:

Customer wants same quantity but later/earlier pickup.

Expected behavior:

- System recalculates availability for new date.
- Existing reservation may need to move to different batch.
- Audit log records date change.

---

## 12.16 Customer Changes Plant Variety

Scenario:

Customer changes from Chilli A to Chilli B.

Expected behavior:

- Release old reservation.
- Create new reservation if available.
- Maintain order history.

---

## 12.17 Order Quantity Increased

Scenario:

Customer initially ordered 10,000 and later wants 15,000.

Expected behavior:

- System checks availability for additional 5,000.
- If available, reserve extra quantity.
- If unavailable, mark partial or waitlisted.

---

## 12.18 Order Quantity Reduced

Scenario:

Customer reduces order from 10,000 to 6,000.

Expected behavior:

- Release 4,000 from reservation.
- Update free-to-sell quantity.
- Record audit reason.

---

## 12.19 Batch Split Across Locations

Scenario:

Same batch is moved partly to another area.

Expected behavior:

- MVP may track notes only.
- Later phase should support batch split/location movement.

---

## 12.20 Sales Entered in Vyapar but Not Reconciled

Scenario:

Counter sells plants in Vyapar, but import is not done.

Expected behavior:

- Nursery app may temporarily overstate stock.
- Daily reconciliation should be mandatory.
- Dashboard should show:

```text
Last Vyapar reconciliation: Yesterday / Today / Not done

```

---

# 13. Alerts and Notifications

## 13.1 Critical Alerts

- Overbooking attempted
- Confirmed orders exceed expected stock
- Batch loss creates shortage
- Ready stock sold beyond free quantity
- Negative free stock
- Vyapar reconciliation not done

## 13.2 Operational Alerts

- Orders due today
- Orders due tomorrow
- Orders overdue
- Batch expected ready this week
- Batch delayed
- Customer has duplicate active order
- High unsold stock risk

## 13.3 Planning Alerts

- Demand exceeds expected supply
- Excess future stock expected
- Loss percentage unusually high
- Planting needed based on sales velocity
- Plant has no upcoming batches

---

# 14. Reports

## 14.1 Daily Reports

- Ready stock report
- Free-to-sell stock report
- Reserved stock report
- Orders due today
- Orders overdue
- Batch loss report
- Vyapar reconciliation report

## 14.2 Weekly Reports

- Sales by plant/variety
- Advance orders received
- Demand by required date
- Future readiness calendar
- Shortage risk report
- Excess stock risk report
- Batch performance report
- Planting recommendation report

## 14.3 Monthly Reports

- Planted vs sellable analysis
- Loss percentage by plant
- Loss percentage by season
- Customer demand trends
- Most ordered varieties
- Sales velocity by plant
- Reservation fulfillment rate
- Vyapar vs nursery stock reconciliation summary

---

# 15. MVP Functional Requirements

## 15.1 Plant Master

The system shall allow admin users to create and manage plants and varieties.

Acceptance criteria:

- Admin can create plant.
- Admin can create variety under plant.
- Admin can define plants per tray.
- Admin can define growing cycle.
- Admin can define expected loss percentage.
- Inactive plants should not appear in new batch/order forms.

---

## 15.2 Batch Creation

The system shall allow nursery supervisors to create production batches.

Acceptance criteria:

- User can select plant variety.
- User can enter planted date.
- User can enter trays and plants per tray.
- System calculates planted quantity.
- System calculates expected sellable quantity.
- System calculates expected ready date.
- Batch appears in future availability.

---

## 15.3 Batch Adjustment

The system shall allow authorized users to record batch losses and corrections.

Acceptance criteria:

- User can select adjustment type.
- User must enter quantity.
- User must enter reason.
- System recalculates expected sellable quantity.
- System creates shortage alert if reservations are affected.
- Audit log is created.

---

## 15.4 Advance Order Creation

The system shall allow users to create advance orders.

Acceptance criteria:

- User can search or create customer.
- User can add one or more order lines.
- Each line has plant, quantity, and required date.
- System checks availability.
- User can save as enquiry, tentative, confirmed, or reserved.
- Confirmed/reserved order reduces free availability.

---

## 15.5 Reservation

The system shall allocate confirmed order quantities against available batches.

Acceptance criteria:

- System suggests eligible batches.
- User can accept suggested allocation.
- User can manually select batch if authorized.
- System prevents overbooking for normal users.
- Admin override requires reason.
- Reservation appears against both order and batch.

---

## 15.6 Availability Dashboard

The system shall show current and future availability.

Acceptance criteria:

- User can search by plant/variety.
- System shows ready now, reserved, and free.
- System shows future batches and future free quantity.
- System highlights shortage risk.
- Data updates after batch, order, or sales changes.

---

## 15.7 Order Fulfillment

The system shall support full and partial order fulfillment.

Acceptance criteria:

- User can search active order.
- User can enter fulfilled quantity.
- User can enter Vyapar invoice number.
- System reduces reserved quantity.
- System updates order status.
- Partial fulfillment keeps remaining quantity open.

---

## 15.8 Vyapar Reconciliation

The system shall support manual import of Vyapar sales.

Acceptance criteria:

- User can upload CSV/Excel file.
- System parses sales rows.
- System maps Vyapar items to plant varieties.
- User can resolve unmatched items.
- System prevents duplicate invoice posting.
- System posts sales movement to inventory ledger.

---

## 15.9 User Permissions

The system shall enforce role-based permissions.

Acceptance criteria:

- Users see only allowed actions.
- Unauthorized users cannot override stock.
- Admin can manage users.
- Major edits create audit logs.

---

# 16. Technical Requirements

## 16.1 Platform

Recommended approach:

```text
Responsive web application
Mobile-friendly layout
Desktop-optimized layout
Single backend
Single database

```

## 16.2 Device Support

Must support:

- Android phones
- Desktop browsers
- Laptop browsers
- Tablet browsers, optional but useful

## 16.3 Browser Support

Recommended:

- Chrome
- Edge
- Safari
- Android Chrome

## 16.4 Authentication

Minimum:

- Mobile/email login
- Password or OTP-based login
- Role-based access

## 16.5 Database

Recommended:

- PostgreSQL or equivalent relational database

Reason:

- Strong relational model
- Good reporting
- Good audit history
- Suitable for orders, batches, reservations, and ledger

## 16.6 Backup

Requirements:

- Daily automated backup
- Ability to export data
- Admin-only access to backup/export

## 16.7 Performance

Expected MVP scale:

- Thousands of customers
- Hundreds/thousands of batches
- Tens of thousands of order lines over time
- Multiple users operating simultaneously

Performance targets:

- Availability search under 2 seconds
- Order save under 3 seconds
- Dashboard load under 5 seconds
- CSV import result under 30 seconds for normal daily files

---

# 17. Suggested MVP Build Sequence

## Step 1: Foundation

- User login
- Roles
- Plant master
- Variety master
- Customer master

## Step 2: Production

- Batch creation
- Batch list
- Batch detail
- Batch adjustment
- Batch readiness

## Step 3: Orders

- Customer search
- Advance order creation
- Multi-line orders
- Availability check
- Reservation allocation

## Step 4: Counter Operations

- Desktop counter dashboard
- Order fulfillment
- Vyapar invoice reference
- Orders due today
- Overdue orders

## Step 5: Inventory Intelligence

- Availability dashboard
- Batch availability
- Shortage alerts
- Free-to-sell calculation

## Step 6: Reconciliation

- Vyapar CSV import
- Item mapping
- Duplicate detection
- Sales posting to ledger

## Step 7: Reports

- Daily stock report
- Reserved stock report
- Order due report
- Batch loss report
- Weekly planning report

---

# 18. Open Questions

## 18.1 Business Process Questions

1. Which order statuses should actually block stock?
  - Confirmed only?
  - Advance paid only?
  - Confirmed without advance also?
2. How many days after due date should reservation remain active?
3. Should staff be allowed to reserve stock without advance payment?
4. Should customers with advance payment get priority over customers without advance payment?
5. Can one customer order multiple varieties in one order?
6. Can one order have different pickup dates for different plants?
7. Should partial pickup be common and fully supported in MVP?
8. What is the business rule when actual ready quantity is lower than reserved quantity?
9. Should the system automatically choose which customer gets priority during shortage?
10. Are substitutions allowed between plant varieties?

---

## 18.2 Inventory Questions

1. Is inventory usually counted in plants, trays, or both?
2. Is plants-per-tray fixed or variable by plant?
3. Do you need to track tray-level movement?
4. Do you need to track exact growing location?
5. Can a batch be split across locations?
6. Can batches be merged?
7. How often is actual count updated?
8. Should expected loss percentage be fixed by plant or adjustable per batch?
9. Should the system track seed/source/supplier?
10. Should weak but sellable plants be tracked separately?

---

## 18.3 Sales and Vyapar Questions

1. What exact Vyapar export format is available?
2. Does Vyapar item naming match nursery plant variety naming?
3. Is every sale entered in Vyapar on the same day?
4. Are advance payments recorded in Vyapar?
5. Should the nursery app record payment amount or only payment reference?
6. Should the app create a receipt for advance payment?
7. Should walk-in sales be entered in nursery app immediately or only through Vyapar import?
8. What happens when Vyapar sale quantity differs from nursery app fulfillment quantity?

---

## 18.4 User and Permission Questions

1. Who should be allowed to create batches?
2. Who should be allowed to mark losses?
3. Who should be allowed to override overbooking?
4. Who should be allowed to cancel confirmed orders?
5. Who should be allowed to release reservations?
6. Should every user see financial/payment data?
7. Should staff see all customer history?
8. Should there be approval workflow for major stock corrections?

---

## 18.5 Device and Usage Questions

1. Will counter staff primarily use desktop or laptop?
2. Will nursery supervisors use mobile in the growing area?
3. Is internet reliable across nursery locations?
4. Is Kannada/Hindi/local language support required?
5. Should the app support printing order slips?
6. Should the app support WhatsApp sharing of order confirmation?
7. Should farmers ever access the system directly?

---

## 18.6 Reporting Questions

1. What is the most important daily report?
2. Who reviews weekly planting recommendations?
3. How far ahead do you plan planting?
4. Do different plants have very different planning horizons?
5. Do you need revenue reports in this app, or only quantity reports?
6. Should the system show profitability by plant?
7. Do you want demand forecasting in phase 2?

---

# 19. Key Risks

## 19.1 Duplicate Entry Risk

Because Vyapar remains separate, some sales data may exist in Vyapar but not in the nursery app.

Mitigation:

- Daily reconciliation
- Clear “last reconciled” indicator
- Mandatory import workflow

---

## 19.2 Staff Adoption Risk

If advance orders are still taken only on WhatsApp or memory, system accuracy will fail.

Mitigation:

- Very fast mobile order entry
- Very fast desktop counter order entry
- Minimal required fields
- Customer search by mobile number
- Daily order-taking discipline

---

## 19.3 Incorrect Availability Risk

If batch losses are not updated, future availability will be overstated.

Mitigation:

- Supervisor daily/weekly batch update routine
- Batch readiness reminders
- Loss adjustment workflow
- Audit trail

---

## 19.4 Overcomplex MVP Risk

Trying to build forecasting, automation, WhatsApp bot, Vyapar integration, and QR tracking in version 1 will delay the core value.

Mitigation:

- Build batch + reservation + availability first
- Add intelligence and automation later

---

# 20. Recommended MVP Definition

The MVP is successful if the nursery can reliably do the following:

1. Enter every planting batch.
2. Update losses and actual ready quantity.
3. Enter every advance order.
4. Reserve confirmed orders against batches.
5. See free-to-sell quantity by plant and date.
6. Fulfill orders and link Vyapar invoice numbers.
7. Reconcile Vyapar sales daily.
8. Identify shortage risk before the customer arrives.
9. Use weekly reports to decide what to plant next.

The MVP should not be judged by whether it has advanced forecasting or automation. It should be judged by whether it removes the core confusion:

```text
How many plants are actually free to sell?

```

---

# 21. Product Summary Statement

This product is a nursery production and availability management system that tracks plant batches from planting to sale, manages advance customer commitments, calculates free-to-sell inventory, supports mobile and desktop order-taking, and reconciles final sales with Vyapar.

The system’s core job is to prevent confusion between:

```text
Planted quantity
Expected quantity
Ready quantity
Reserved quantity
Free quantity
Sold quantity
Lost quantity

```

The most important requirement is:

```text
Every confirmed customer commitment must reserve quantity against a batch or expected future availability.

```

Once that rule is enforced, the nursery can confidently manage sales, advance orders, production planning, and customer commitments.