# Technical Architecture — Nursery Inventory, Advance Order & Availability Management MVP

## 1. Purpose

This document defines the technical architecture for the MVP of a nursery inventory, production, advance order, and availability management system.

The goal of the MVP is to keep the system:

- Simple
- Maintainable
- Reliable
- Suitable for a small business nursery operation
- Easy to run with limited technical overhead
- Strong enough to support future growth

The system should help the nursery confidently answer:

```text
How many plants are planted?
How many are expected to become sellable?
How many are ready?
How many are already reserved?
How many are free to sell?
Which orders are due?
What should be planted next?

```

The MVP should not attempt to replace Vyapar. Vyapar should remain the billing, invoice, payment, and accounting system. This new application should manage nursery production, availability, reservations, order commitments, and stock confidence.

---

## 2. Architecture Summary

The MVP should be built as a responsive web application with one backend and one relational database.

Recommended architecture:

```text
Responsive Web App
        |
        v
Application Backend / Server Logic
        |
        v
PostgreSQL Database
        |
        +-- File Storage
        +-- Inventory Ledger
        +-- Audit Logs
        +-- Reports / Views
        +-- Vyapar CSV/Excel Import

```

Recommended implementation stack:

```text
Frontend: Next.js
Backend: Next.js Server Actions / API Routes
Database: PostgreSQL
Auth: Supabase Auth
Storage: Supabase Storage
Hosting: Vercel or similar
Database Hosting: Supabase

```

This should be a single application, not separate mobile and desktop apps.

The application should have:

- Desktop-optimized screens for counter operations, order-taking, reconciliation, and planning
- Mobile-optimized screens for quick order-taking, nursery-floor updates, batch updates, and availability checks

---

## 3. Core Architecture Principles

## 3.1 Keep the MVP Simple

Avoid unnecessary infrastructure in MVP.

Do not use:

- Microservices
- Kubernetes
- Kafka/event streaming
- Separate native Android app
- Separate native iOS app
- Complex offline-first sync engine
- Complex WhatsApp bot
- Custom accounting system
- Custom payment gateway
- Deep real-time Vyapar integration

Use:

- One codebase
- One backend
- One database
- One deployment pipeline
- Manual Vyapar CSV/Excel import
- Role-based access control
- Inventory ledger
- Database views for reporting

---

## 3.2 The Database Is the Source of Truth

The application must not rely on manually edited “available stock” numbers.

Availability should be calculated from structured records:

- Production batches
- Batch adjustments
- Reservations
- Fulfillments
- Sales imports
- Inventory ledger entries

Important principle:

```text
Availability must be calculated, not guessed.

```

---

## 3.3 Use a Ledger for Stock Movement

Do not store inventory as a single editable number.

Use an inventory ledger that records every important stock-affecting event.

Examples:

```text
Batch planted
Batch loss recorded
Batch marked ready
Order reserved
Reservation released
Order fulfilled
Vyapar sale imported
Manual correction

```

The ledger enables:

- Auditability
- Debugging
- Historical reporting
- Reconciliation
- Trust in stock numbers

---

## 3.4 Enforce Business Rules on the Server

The frontend should not be trusted to enforce important business rules.

The backend/server/database must enforce:

- Reservation rules
- Overbooking prevention
- Fulfillment quantity checks
- Role permissions
- Audit logging
- Inventory ledger creation
- Required fields
- Data integrity constraints

The frontend can guide the user, but the backend must protect the data.

---

## 3.5 Use Transactions for Critical Workflows

Critical operations must be performed inside database transactions.

Examples:

- Reserving stock
- Releasing reservation
- Recording batch loss
- Fulfilling an order
- Posting Vyapar sales import
- Manual stock correction

This prevents data corruption when multiple users operate at the same time.

---

# 4. Recommended Technology Stack

## 4.1 Frontend

Recommended:

```text
Next.js
React
TypeScript
Tailwind CSS

```

The frontend should be responsive and support both mobile and desktop layouts.

Desktop should be optimized for:

- Counter order-taking
- Multi-plant orders
- Customer search
- Availability grid
- Order fulfillment
- Vyapar invoice linking
- Reports
- Planning

Mobile should be optimized for:

- Quick availability check
- Phone/WhatsApp order entry
- Batch updates
- Loss/damage reporting
- Marking batch ready
- Viewing alerts

---

## 4.2 Backend

Recommended:

```text
Next.js Server Actions
Next.js API Routes
TypeScript service modules

```

The backend should contain the core business logic.

Suggested backend service modules:

```text
Batch Service
Order Service
Reservation Service
Inventory Service
Reconciliation Service
Reporting Service
Audit Service
User/Permission Service

```

Even if all modules live in one codebase, keep the business logic separated by domain.

---

## 4.3 Database

Recommended:

```text
PostgreSQL

```

PostgreSQL is well suited because the system is strongly relational.

The system needs relationships between:

- Users
- Roles
- Plants
- Varieties
- Batches
- Customers
- Orders
- Order lines
- Reservations
- Fulfillments
- Vyapar sales rows
- Ledger entries
- Audit logs

The database should use:

- Primary keys
- Foreign keys
- Check constraints
- Unique constraints
- Indexes
- Views
- Transactions

---

## 4.4 Authentication

Recommended:

```text
Supabase Auth

```

Minimum authentication requirements:

- User login
- Role-based permissions
- No shared staff login
- Admin-managed users
- Active/inactive user status

Roles should include:

```text
Admin
Nursery Supervisor
Counter Staff
Order Taker
Planning User
Viewer

```

---

## 4.5 File Storage

Recommended:

```text
Supabase Storage

```

MVP file storage should support:

- Payment screenshots
- WhatsApp order screenshots
- Batch damage photos
- Vyapar import files

Each file should be linked to the relevant business object:

```text
Order
Customer
Batch
Payment reference
Vyapar import session

```

---

## 4.6 Hosting

Recommended:

```text
Application Hosting: Vercel
Database/Auth/Storage: Supabase

```

This keeps infrastructure simple and managed.

Avoid self-hosting the database in MVP unless there is a strong reason.

---

# 5. High-Level System Diagram

```text
+---------------------------+
|        Users              |
|                           |
| Desktop / Laptop / Mobile |
+-------------+-------------+
              |
              v
+---------------------------+
|   Responsive Web App      |
|                           |
| Next.js + React           |
| Desktop + Mobile Layouts  |
+-------------+-------------+
              |
              v
+---------------------------+
| Application Backend       |
|                           |
| Server Actions / API      |
| Business Services         |
| Validation                |
| Permissions               |
+-------------+-------------+
              |
              v
+---------------------------+
| PostgreSQL Database       |
|                           |
| Tables                    |
| Ledger                    |
| Views                     |
| Constraints               |
| Audit Logs                |
+-------------+-------------+
              |
              +--------------------+
              |                    |
              v                    v
+---------------------------+   +---------------------------+
| File Storage              |   | Vyapar Import             |
|                           |   |                           |
| Screenshots               |   | CSV / Excel Upload        |
| Photos                    |   | Item Mapping              |
| Import Files              |   | Reconciliation            |
+---------------------------+   +---------------------------+

```

---

# 6. Application Modules

## 6.1 Authentication and User Management

Responsibilities:

- User login
- User logout
- Role assignment
- User activation/deactivation
- Permission checks

Main roles:

```text
Admin
Nursery Supervisor
Counter Staff
Order Taker
Planning User
Viewer

```

Permission enforcement must happen on the server.

---

## 6.2 Plant Master Module

Responsibilities:

- Create plants
- Create varieties
- Set plants per tray
- Set growing cycle duration
- Set seasonal cycle variation
- Set expected loss percentage
- Activate/deactivate plant varieties

Examples:

```text
Plant: Tomato
Variety: Arka Rakshak
Plants per tray: 98
Default cycle: 42 days
Expected loss: 10%

```

---

## 6.3 Customer Module

Responsibilities:

- Create customer/farmer
- Search by mobile number
- Search by name
- View customer order history
- Store village/location
- Store notes

Customer duplicate detection should use mobile number as the primary matching signal.

---

## 6.4 Batch Management Module

Responsibilities:

- Create production batch
- Record planted quantity
- Calculate expected sellable quantity
- Calculate expected ready date
- Record batch loss
- Record damage
- Mark partially ready
- Mark ready
- Close batch
- Show batch reservation impact

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

## 6.5 Advance Order Module

Responsibilities:

- Create advance order
- Support desktop and mobile order entry
- Support multi-line orders
- Save enquiry/tentative/confirmed/reserved orders
- Record advance amount
- Record payment reference
- Record order source
- Track required date
- Track order status

Order sources:

```text
Phone
WhatsApp
Counter
Field Visit
Other

```

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

## 6.6 Reservation Module

Responsibilities:

- Check availability
- Reserve quantity from one or more batches
- Prevent overbooking
- Release reservations
- Reallocate reservations
- Detect shortage risk
- Support admin override with reason

Important rule:

```text
One order line can reserve from multiple batches.
One batch can serve multiple order lines.

```

Reservation must be transactional.

---

## 6.7 Inventory Module

Responsibilities:

- Write inventory ledger entries
- Calculate ready stock
- Calculate future stock
- Calculate reserved stock
- Calculate free-to-sell stock
- Detect negative stock
- Detect shortage risk
- Expose database views for dashboards and reports

Important formula:

```text
Free-to-Sell = Sellable Quantity - Reserved Quantity - Safety Buffer - Sold Quantity

```

---

## 6.8 Fulfillment Module

Responsibilities:

- Search order
- Record pickup/sale quantity
- Support partial fulfillment
- Link Vyapar invoice number
- Reduce reserved quantity
- Reduce ready stock
- Update order status

Fulfillment should support this scenario:

```text
Order quantity: 20,000
Picked up today: 12,000
Remaining: 8,000
Status: Partially Fulfilled

```

---

## 6.9 Vyapar Reconciliation Module

Responsibilities:

- Upload Vyapar CSV/Excel sales export
- Parse sale rows
- Map Vyapar item names to nursery plant varieties
- Detect duplicate invoices
- Detect unmatched rows
- Post matched sales to inventory ledger
- Show reconciliation summary
- Show last reconciliation date

MVP should use manual import.

Do not depend on real-time Vyapar integration in MVP.

---

## 6.10 Reporting Module

Responsibilities:

- Daily stock report
- Ready stock report
- Reserved stock report
- Free-to-sell report
- Orders due today
- Orders overdue
- Future availability
- Shortage risk
- Batch loss report
- Weekly planting recommendation report

For MVP, reports should be based primarily on database views.

---

## 6.11 Audit Module

Responsibilities:

- Record important changes
- Store old value
- Store new value
- Store user
- Store timestamp
- Store reason

Audit logging is required for:

- Batch quantity correction
- Batch loss entry
- Batch loss reversal
- Reservation override
- Reservation release
- Order cancellation
- Manual stock correction
- User permission changes
- Vyapar reconciliation corrections

---

# 7. Suggested Code Structure

Recommended folder structure:

```text
nursery-app/
  app/
    dashboard/
    counter/
    orders/
    batches/
    plants/
    customers/
    reports/
    reconciliation/
    admin/
    login/

  components/
    common/
    forms/
    tables/
    layout/
    alerts/

  server/
    services/
      batch-service.ts
      order-service.ts
      reservation-service.ts
      inventory-service.ts
      reconciliation-service.ts
      reporting-service.ts
      audit-service.ts
      permission-service.ts

    validators/
      batch-validator.ts
      order-validator.ts
      reservation-validator.ts
      customer-validator.ts

    db/
      client.ts
      transactions.ts
      queries/

  database/
    migrations/
    views/
    seed/

  docs/
    product-requirements.md
    technical-architecture.md
    data-model.md
    workflows.md

  tests/
    unit/
    integration/

```

---

# 8. Database Design Overview

## 8.1 Core Tables

Minimum MVP tables:

```text
users
roles
plants
plant_varieties
locations
production_batches
batch_events
customers
advance_orders
advance_order_lines
reservations
fulfillments
inventory_ledger
vyapar_imports
vyapar_import_rows
vyapar_item_mappings
audit_logs

```

---

## 8.2 Users

Purpose:

Stores application users.

Important fields:

```text
id
name
mobile
email
role_id
status
created_at
updated_at

```

---

## 8.3 Roles

Purpose:

Stores permission groups.

Important fields:

```text
id
role_name
permissions
created_at

```

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

## 8.4 Plants

Purpose:

Stores plant/crop master.

Important fields:

```text
id
plant_name
category
active
notes
created_at
updated_at

```

---

## 8.5 Plant Varieties

Purpose:

Stores varieties under plants.

Important fields:

```text
id
plant_id
variety_name
default_cycle_days
summer_cycle_days
winter_cycle_days
monsoon_cycle_days
default_loss_percent
plants_per_tray
standard_price
active
created_at
updated_at

```

---

## 8.6 Locations

Purpose:

Stores nursery growing and sales locations.

Important fields:

```text
id
location_name
location_type
active
created_at
updated_at

```

Example locations:

```text
Polyhouse 1
Shade Net 2
Sales Counter
Hardening Area

```

---

## 8.7 Production Batches

Purpose:

Stores each planting batch.

Important fields:

```text
id
batch_code
plant_variety_id
location_id
planted_date
season
trays_planted
plants_per_tray
initial_planted_quantity
expected_loss_percent
expected_sellable_quantity
actual_ready_quantity
expected_ready_date
actual_ready_date
status
notes
created_by
created_at
updated_at

```

---

## 8.8 Batch Events

Purpose:

Stores all batch adjustments and lifecycle events.

Important fields:

```text
id
batch_id
event_type
quantity_change
resulting_expected_quantity
reason
event_date
photo_url
created_by
created_at

```

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

## 8.9 Customers

Purpose:

Stores farmer/customer records.

Important fields:

```text
id
customer_name
mobile
alternate_mobile
village
address
customer_type
notes
created_at
updated_at

```

---

## 8.10 Advance Orders

Purpose:

Stores order header.

Important fields:

```text
id
order_number
customer_id
order_date
source
order_status
advance_amount
payment_reference
payment_status
notes
created_by
created_at
updated_at

```

---

## 8.11 Advance Order Lines

Purpose:

Stores each plant/variety requested in an order.

Important fields:

```text
id
order_id
plant_variety_id
requested_quantity
required_date
agreed_price
line_status
notes
created_at
updated_at

```

---

## 8.12 Reservations

Purpose:

Stores quantity allocated from batches to order lines.

Important fields:

```text
id
order_line_id
batch_id
reserved_quantity
reservation_status
reserved_by
reserved_at
released_at
release_reason
created_at
updated_at

```

Reservation statuses:

```text
Active
Released
Fulfilled
Cancelled

```

---

## 8.13 Fulfillments

Purpose:

Stores actual pickup/sale against an order.

Important fields:

```text
id
order_line_id
batch_id
fulfilled_quantity
fulfillment_date
vyapar_invoice_number
fulfilled_by
notes
created_at
updated_at

```

---

## 8.14 Inventory Ledger

Purpose:

Stores all inventory-affecting movements.

Important fields:

```text
id
ledger_date
plant_variety_id
batch_id
source_type
source_id
event_type
quantity_effect
created_by
created_at

```

Event types:

```text
PlantedExpected
LossExpected
MarkedReady
Reserved
ReservationReleased
Fulfilled
VyaparSaleImported
ManualCorrection

```

---

## 8.15 Vyapar Imports

Purpose:

Stores each Vyapar import session.

Important fields:

```text
id
file_name
file_url
imported_by
imported_at
status
summary
created_at

```

Statuses:

```text
Uploaded
Processing
Completed
CompletedWithErrors
Failed

```

---

## 8.16 Vyapar Import Rows

Purpose:

Stores each row from imported Vyapar sales file.

Important fields:

```text
id
import_id
vyapar_invoice_number
sale_date
customer_name
item_name
mapped_plant_variety_id
quantity
amount
reconciliation_status
notes
created_at

```

Reconciliation statuses:

```text
Matched
Unmatched
Duplicate
Ignored
Posted
Error

```

---

## 8.17 Vyapar Item Mappings

Purpose:

Stores mapping between Vyapar item names and nursery plant varieties.

Important fields:

```text
id
vyapar_item_name
plant_variety_id
active
created_by
created_at
updated_at

```

---

## 8.18 Audit Logs

Purpose:

Stores important business and data changes.

Important fields:

```text
id
entity_type
entity_id
action
old_value
new_value
changed_by
changed_at
reason

```

---

# 9. Database Views

Use database views for common calculations and reports.

Recommended views:

```text
plant_availability_view
batch_availability_view
ready_stock_view
reserved_stock_view
future_availability_view
orders_due_today_view
orders_overdue_view
shortage_risk_view
batch_loss_summary_view
vyapar_reconciliation_summary_view
weekly_sales_summary_view

```

---

## 9.1 Plant Availability View

Purpose:

Show free-to-sell stock by plant/variety.

Should include:

```text
plant_id
plant_name
plant_variety_id
variety_name
ready_quantity
reserved_quantity
fulfilled_quantity
free_quantity
future_expected_quantity
future_reserved_quantity
future_free_quantity
next_ready_date

```

---

## 9.2 Batch Availability View

Purpose:

Show availability at batch level.

Should include:

```text
batch_id
batch_code
plant_variety_id
expected_sellable_quantity
actual_ready_quantity
reserved_quantity
fulfilled_quantity
free_quantity
expected_ready_date
actual_ready_date
status
shortage_quantity

```

---

## 9.3 Orders Due Today View

Purpose:

Show orders requiring attention today.

Should include:

```text
order_id
order_number
customer_name
mobile
plant_name
variety_name
requested_quantity
reserved_quantity
fulfilled_quantity
remaining_quantity
required_date
status

```

---

## 9.4 Shortage Risk View

Purpose:

Show batches/orders where reservations exceed available quantity.

Should include:

```text
batch_id
batch_code
plant_name
variety_name
expected_or_ready_quantity
reserved_quantity
shortage_quantity
affected_order_count

```

---

# 10. Key Business Transactions

## 10.1 Create Production Batch

Transaction steps:

```text
1. Validate user permission.
2. Validate plant variety exists and is active.
3. Calculate initial_planted_quantity.
4. Calculate expected_sellable_quantity.
5. Calculate expected_ready_date.
6. Create production_batch record.
7. Create batch_event record of type Planted.
8. Create inventory_ledger record of type PlantedExpected.
9. Create audit_log record.
10. Commit transaction.

```

---

## 10.2 Record Batch Loss

Transaction steps:

```text
1. Validate user permission.
2. Load batch.
3. Validate loss quantity.
4. Reduce expected_sellable_quantity.
5. Create batch_event record of type Loss/Damage/Mortality.
6. Create inventory_ledger record of type LossExpected.
7. Recalculate reservations against batch.
8. If reservations exceed expected/ready quantity, create shortage alert.
9. Create audit_log record.
10. Commit transaction.

```

---

## 10.3 Mark Batch Ready

Transaction steps:

```text
1. Validate user permission.
2. Load batch.
3. Validate ready quantity.
4. Update batch actual_ready_quantity.
5. Update batch actual_ready_date.
6. Update batch status to Ready or Partially Ready.
7. Create batch_event record of type Ready or Partially Ready.
8. Create inventory_ledger record of type MarkedReady.
9. Check shortage/excess.
10. Create audit_log record.
11. Commit transaction.

```

---

## 10.4 Create Advance Order

Transaction steps:

```text
1. Validate user permission.
2. Search or create customer.
3. Create advance_order.
4. Create one or more advance_order_lines.
5. For each order line:
   a. Check availability by plant variety and required date.
   b. If order status blocks stock, create reservation.
   c. Write inventory_ledger entry of type Reserved.
6. Create audit_log record.
7. Commit transaction.

```

---

## 10.5 Reserve Stock

Transaction steps:

```text
1. Validate user permission.
2. Load order line.
3. Load eligible batch or batches.
4. Lock relevant batch/reservation rows.
5. Calculate current free quantity.
6. If free quantity is sufficient:
   a. Create reservation.
   b. Write inventory_ledger entry.
   c. Update order line status.
7. If free quantity is insufficient:
   a. Reject for normal users.
   b. Allow admin override only with reason.
8. Create audit_log record.
9. Commit transaction.

```

Important:

Reservation must be transaction-safe to prevent two users from reserving the same stock at the same time.

---

## 10.6 Release Reservation

Transaction steps:

```text
1. Validate user permission.
2. Load active reservation.
3. Validate release quantity.
4. Update reservation status or quantity.
5. Write inventory_ledger entry of type ReservationReleased.
6. Update order/order line status if needed.
7. Create audit_log record with reason.
8. Commit transaction.

```

---

## 10.7 Fulfill Order

Transaction steps:

```text
1. Validate user permission.
2. Load order line.
3. Load reservation.
4. Validate fulfilled quantity.
5. Create fulfillment record.
6. Update reservation status/remaining quantity.
7. Write inventory_ledger entry of type Fulfilled.
8. Store Vyapar invoice number if provided.
9. Update order/order line status:
   - Partially Fulfilled
   - Fulfilled
10. Create audit_log record.
11. Commit transaction.

```

---

## 10.8 Import Vyapar Sales

Transaction steps:

```text
1. Validate user permission.
2. Upload file to storage.
3. Create vyapar_import record.
4. Parse rows.
5. For each row:
   a. Check duplicate invoice/item/quantity.
   b. Map Vyapar item to plant variety.
   c. Mark row as Matched, Unmatched, Duplicate, or Error.
6. For matched rows:
   a. Post inventory_ledger entry of type VyaparSaleImported.
   b. Mark row as Posted.
7. Create reconciliation summary.
8. Create audit_log record.
9. Commit transaction.

```

---

# 11. Permissions Matrix


| Action               | Admin | Nursery Supervisor | Counter Staff | Order Taker | Planning User | Viewer |
| -------------------- | ----- | ------------------ | ------------- | ----------- | ------------- | ------ |
| View dashboard       | Yes   | Yes                | Yes           | Yes         | Yes           | Yes    |
| Manage users         | Yes   | No                 | No            | No          | No            | No     |
| Manage plant master  | Yes   | No                 | No            | No          | Optional      | No     |
| Create batch         | Yes   | Yes                | No            | No          | Optional      | No     |
| Record batch loss    | Yes   | Yes                | No            | No          | No            | No     |
| Mark batch ready     | Yes   | Yes                | No            | No          | No            | No     |
| Create customer      | Yes   | Yes                | Yes           | Yes         | Yes           | No     |
| Create advance order | Yes   | No                 | Yes           | Yes         | Optional      | No     |
| Reserve stock        | Yes   | No                 | Yes           | Yes         | Optional      | No     |
| Override overbooking | Yes   | No                 | No            | No          | No            | No     |
| Release reservation  | Yes   | No                 | Optional      | No          | Optional      | No     |
| Fulfill order        | Yes   | No                 | Yes           | No          | Optional      | No     |
| Import Vyapar sales  | Yes   | No                 | No            | No          | Yes           | No     |
| View reports         | Yes   | Optional           | Optional      | Optional    | Yes           | Yes    |
| Export data          | Yes   | No                 | No            | No          | Yes           | No     |
| View audit logs      | Yes   | No                 | No            | No          | Optional      | No     |


---

# 12. Frontend Screen Architecture

## 12.1 Desktop Screens

Required MVP desktop screens:

```text
/dashboard
/counter
/orders
/orders/new
/orders/[id]
/customers
/customers/[id]
/availability
/batches
/batches/new
/batches/[id]
/reconciliation
/reports
/admin/users
/admin/plants

```

---

## 12.2 Mobile Screens

The same routes can render mobile-optimized layouts.

Mobile-priority screens:

```text
/availability
/orders/new
/batches
/batches/[id]/update
/dashboard

```

Mobile UI should prioritize:

- Large tap targets
- Search-first flows
- Fewer columns
- Step-by-step forms
- Minimal required fields
- Fast save

---

## 12.3 Counter Screen

Route:

```text
/counter

```

Purpose:

Primary desktop screen for counter staff.

Features:

- Customer search by mobile
- New advance order
- Orders due today
- Orders overdue
- Plant availability lookup
- Fulfillment shortcut
- Vyapar invoice entry
- Alerts

---

## 12.4 Availability Screen

Route:

```text
/availability

```

Purpose:

Answer stock questions quickly.

Features:

- Search plant/variety
- Show ready now
- Show reserved quantity
- Show free quantity
- Show future batches
- Show next ready date
- Show shortage risk

---

## 12.5 Batch Detail Screen

Route:

```text
/batches/[id]

```

Purpose:

Manage one production batch.

Features:

- Batch summary
- Current expected sellable quantity
- Ready quantity
- Reserved quantity
- Free quantity
- Batch events
- Record loss
- Mark ready
- View affected orders

---

## 12.6 Order Detail Screen

Route:

```text
/orders/[id]

```

Purpose:

Manage one advance order.

Features:

- Customer details
- Order lines
- Required dates
- Reservation status
- Fulfillment history
- Payment reference
- Vyapar invoice references
- Cancel/release actions
- Audit history

---

# 13. API / Server Action Design

The app can use Server Actions or API routes.

Suggested actions:

## Batch Actions

```text
createBatch(input)
recordBatchLoss(batchId, input)
markBatchReady(batchId, input)
updateBatchLocation(batchId, input)
closeBatch(batchId)

```

## Order Actions

```text
createAdvanceOrder(input)
updateAdvanceOrder(orderId, input)
cancelAdvanceOrder(orderId, reason)
addOrderLine(orderId, input)
updateOrderLine(orderLineId, input)

```

## Reservation Actions

```text
checkAvailability(input)
reserveStock(orderLineId, input)
releaseReservation(reservationId, input)
reallocateReservation(reservationId, input)

```

## Fulfillment Actions

```text
fulfillOrderLine(orderLineId, input)
reverseFulfillment(fulfillmentId, reason)

```

## Reconciliation Actions

```text
uploadVyaparFile(file)
processVyaparImport(importId)
mapVyaparItem(rowId, plantVarietyId)
postVyaparImport(importId)

```

## Reporting Actions

```text
getAvailabilitySummary(filters)
getOrdersDueToday()
getShortageRisks()
getBatchLossReport(filters)
getWeeklyPlanningReport(filters)

```

---

# 14. Validation Rules

Use shared TypeScript validation schemas where possible.

Important validation rules:

## Batch Validation

```text
plant_variety_id is required
planted_date is required
trays_planted must be >= 0
plants_per_tray must be > 0
initial_planted_quantity must be > 0
expected_loss_percent must be between 0 and 100
expected_ready_date must be >= planted_date

```

## Order Validation

```text
customer_id is required
order_date is required
source is required
order must have at least one line
requested_quantity must be > 0
required_date is required

```

## Reservation Validation

```text
order_line_id is required
batch_id is required
reserved_quantity must be > 0
reserved_quantity cannot exceed free quantity unless admin override
override requires reason

```

## Fulfillment Validation

```text
fulfilled_quantity must be > 0
fulfilled_quantity cannot exceed remaining order quantity unless admin override
vyapar_invoice_number is optional but recommended

```

## Batch Loss Validation

```text
loss quantity must be > 0
loss reason is required
loss quantity cannot exceed expected remaining quantity unless admin correction

```

---

# 15. Inventory Calculation Rules

## 15.1 Ready Free Stock

```text
Ready Free Stock =
Actual Ready Quantity
- Active Reserved Quantity
- Fulfilled Quantity
- Safety Buffer

```

## 15.2 Future Free Stock

```text
Future Free Stock =
Expected Sellable Quantity
- Active Future Reservations
- Safety Buffer

```

## 15.3 Shortage

```text
Shortage =
Active Reserved Quantity
- Available Expected/Ready Quantity

```

If shortage > 0, create or show shortage risk.

---

# 16. Concurrency and Data Integrity

The system must handle multiple users.

Important concurrency scenarios:

- Two users reserve same plant at the same time
- Batch loss is recorded while an order is being reserved
- Fulfillment happens while reservation is being edited
- Vyapar import posts sale while manual fulfillment is happening

Use database transactions and row locking where needed.

Critical transaction areas:

```text
Reservation creation
Reservation release
Batch loss recording
Order fulfillment
Vyapar sales posting
Manual stock correction

```

---

# 17. Audit Logging

Every critical action should create an audit log.

Required audit fields:

```text
entity_type
entity_id
action
old_value
new_value
changed_by
changed_at
reason

```

Examples of audited actions:

```text
CREATE_BATCH
RECORD_BATCH_LOSS
MARK_BATCH_READY
CREATE_ORDER
RESERVE_STOCK
RELEASE_RESERVATION
OVERRIDE_OVERBOOKING
FULFILL_ORDER
CANCEL_ORDER
IMPORT_VYAPAR_FILE
POST_VYAPAR_SALE
MANUAL_STOCK_CORRECTION
CHANGE_USER_ROLE

```

---

# 18. Alerts

Alerts can be stored as database records or generated from views in MVP.

Required alerts:

```text
Overbooking attempted
Batch loss created shortage
Order due today
Order overdue
Reservation expired
Negative free stock
Vyapar reconciliation not done today
Unmatched Vyapar import rows
Batch expected ready soon
Batch delayed

```

For MVP, it is acceptable to show alerts on dashboards without building a full notification system.

---

# 19. Vyapar Integration Strategy

## 19.1 MVP Strategy

Use manual CSV/Excel import.

Process:

```text
1. User exports daily sales from Vyapar.
2. User uploads file into nursery app.
3. App parses rows.
4. App maps Vyapar item names to nursery plant varieties.
5. User resolves unmatched items.
6. App detects duplicates.
7. App posts matched sales to inventory ledger.
8. App shows reconciliation summary.

```

## 19.2 Why Manual Import First

Manual import is preferred for MVP because it is:

- Easier to build
- Easier to debug
- Safer operationally
- Not dependent on external API limitations
- Good enough for daily reconciliation

## 19.3 Required Reconciliation Features

The reconciliation screen should show:

```text
Total rows imported
Matched rows
Unmatched rows
Duplicate rows
Rows posted to ledger
Rows ignored
Import errors
Last reconciliation date

```

---

# 20. Offline and Connectivity Strategy

## 20.1 MVP Decision

Do not build full offline mode in MVP.

Reason:

Offline order entry and stock reservation can create conflicts and overbooking if multiple users are offline.

## 20.2 MVP Resilience Requirements

The app should:

- Show clear save failure messages
- Not silently lose form data
- Keep unsaved form data visible after failed save
- Allow retry
- Show loading and saving states
- Show last successful reconciliation date

## 20.3 Future Offline Support

Later phases may support:

- PWA installability
- Offline read-only availability cache
- Offline draft orders
- Sync conflict resolution

---

# 21. Backup and Recovery

Minimum requirements:

```text
Daily automated database backup
Admin export of critical data
Import files retained
Audit logs retained
Ability to restore from backup

```

Admin should be able to export:

```text
Plants
Customers
Batches
Orders
Reservations
Fulfillments
Availability report
Vyapar reconciliation report

```

---

# 22. Security Requirements

MVP security requirements:

```text
HTTPS only
Authenticated users only
Role-based access control
No shared staff login
Server-side permission checks
Database constraints
Audit logs for critical actions
Restricted file access
Admin-only exports
Regular backups

```

Do not rely only on hiding UI buttons. Permissions must be checked on the server.

---

# 23. Testing Strategy

## 23.1 Unit Tests

Test business logic:

```text
Availability calculation
Expected sellable calculation
Reservation calculation
Shortage calculation
Order status transitions
Batch status transitions

```

## 23.2 Integration Tests

Test critical workflows:

```text
Create batch
Record batch loss
Create order
Reserve stock
Prevent overbooking
Release reservation
Fulfill order
Import Vyapar sales
Detect duplicate Vyapar invoice

```

## 23.3 Manual User Testing

Test with real nursery scenarios:

```text
Phone order
Counter order
Multi-plant order
Partial pickup
Batch loss after reservation
Order overdue
Walk-in sale
Daily Vyapar import

```

---

# 24. Environments

Use three environments:

```text
Development
Staging
Production

```

## Development

Used by developers.

## Staging

Used for testing with sample nursery data.

## Production

Used for actual business operations.

Never test risky changes directly on production.

---

# 25. Deployment Strategy

Recommended MVP deployment:

```text
Vercel for application
Supabase for database/auth/storage
GitHub for source code
Environment variables for secrets
Automated deployment from main branch to production
Separate staging branch/environment

```

Minimum deployment setup:

```text
main branch -> production
staging branch -> staging
feature branches -> preview deployments

```

---

# 26. Migration Strategy

All database changes should be handled through migrations.

Migration rules:

```text
No manual production schema edits
Every schema change must be version-controlled
Migrations must be tested in staging first
Backups before risky migrations

```

---

# 27. MVP Build Sequence

## Phase 1: Foundation

Build:

```text
Login
Roles
Plant master
Plant variety master
Customer master
Basic app layout

```

## Phase 2: Batch Management

Build:

```text
Create batch
Batch list
Batch detail
Record loss
Mark ready
Batch events

```

## Phase 3: Order and Reservation

Build:

```text
Create advance order
Multi-line order
Availability check
Reserve from batch
Release reservation
Prevent overbooking

```

## Phase 4: Counter Operations

Build:

```text
Counter dashboard
Customer search
Orders due today
Orders overdue
Fulfill order
Link Vyapar invoice number

```

## Phase 5: Inventory Views

Build:

```text
Availability dashboard
Ready stock view
Future availability view
Batch availability view
Shortage risk view

```

## Phase 6: Vyapar Reconciliation

Build:

```text
CSV/Excel upload
Item mapping
Duplicate detection
Post matched sales to ledger
Reconciliation summary

```

## Phase 7: Reports

Build:

```text
Daily stock report
Reserved stock report
Orders due report
Batch loss report
Weekly planning report

```

---

# 28. What Not to Build in MVP

Do not build these initially:

```text
Native Android app
Native iOS app
Farmer-facing app
WhatsApp bot
AI forecasting
QR code scanning
Tray-level inventory
Complex offline mode
Payment gateway
Accounting replacement
GST filing
Automated Vyapar API integration
Multi-branch architecture
IoT-based plant counting

```

These may be useful later, but they should not distract from the core MVP.

---

# 29. Key Engineering Risks

## 29.1 Stock Calculation Bugs

Risk:

Incorrect availability calculation can damage business trust.

Mitigation:

- Ledger-based design
- Database views
- Unit tests
- Audit logs
- Reconciliation reports

---

## 29.2 Overbooking Due to Concurrency

Risk:

Two staff members reserve the same stock at the same time.

Mitigation:

- Database transactions
- Row locking where needed
- Server-side checks
- Overbooking prevention tests

---

## 29.3 Poor Staff Adoption

Risk:

Staff continue to take orders on WhatsApp/phone but do not enter them.

Mitigation:

- Fast order entry
- Mobile-friendly forms
- Minimal required fields
- Customer search by mobile
- Daily review of unentered orders

---

## 29.4 Vyapar Mismatch

Risk:

Vyapar item names may not match nursery plant names.

Mitigation:

- Item mapping table
- Manual mapping screen
- Reuse previous mappings
- Unmatched row report

---

## 29.5 Manual Corrections Become Common

Risk:

Users bypass proper workflows by using manual corrections.

Mitigation:

- Restrict manual correction to admin
- Require reason
- Audit all corrections
- Show correction reports

---

# 30. Definition of Done for MVP

The MVP is technically complete when the system can:

```text
1. Authenticate users.
2. Enforce role permissions.
3. Create and manage plant varieties.
4. Create production batches.
5. Record batch loss and readiness.
6. Create advance orders.
7. Reserve stock against batches.
8. Prevent normal-user overbooking.
9. Show free-to-sell availability.
10. Fulfill advance orders.
11. Link Vyapar invoice numbers.
12. Import Vyapar sales files.
13. Map Vyapar items to plant varieties.
14. Post sales to inventory ledger.
15. Show shortage alerts.
16. Show orders due and overdue.
17. Maintain audit logs.
18. Export important reports.

```

---

# 31. Final Architecture Recommendation

The recommended MVP architecture is:

```text
Next.js responsive web application
        +
Server-side business logic
        +
Supabase Auth
        +
Supabase PostgreSQL
        +
Supabase Storage
        +
Inventory ledger
        +
Database views
        +
Manual Vyapar CSV/Excel reconciliation

```

The most important technical decision is:

```text
All stock-changing actions must go through controlled backend workflows and write to the inventory ledger.

```

The second most important decision is:

```text
Never allow free stock to be manually guessed or directly edited without an audited correction.

```

This architecture keeps the system simple enough for a small nursery but strong enough to support future improvements like WhatsApp reminders, QR scanning, forecasting, and deeper Vyapar integration.