import { PERMISSIONS, type Permission } from "@/server/lib/permissions";

/** Role names seeded in supabase/migrations — must stay in sync with DB. */
export const ROLE_NAMES = [
  "Admin",
  "Nursery Supervisor",
  "Counter Staff",
  "Order Taker",
  "Planning User",
  "Viewer",
] as const;

export type RoleName = (typeof ROLE_NAMES)[number];

/** Default permission matrix per role (architecture §11 / REA-33 seed). */
export const ROLE_PERMISSIONS: Record<RoleName, readonly Permission[]> = {
  Admin: [
    PERMISSIONS.viewDashboard,
    PERMISSIONS.manageUsers,
    PERMISSIONS.managePlantMaster,
    PERMISSIONS.createBatch,
    PERMISSIONS.recordBatchLoss,
    PERMISSIONS.markBatchReady,
    PERMISSIONS.createCustomer,
    PERMISSIONS.createAdvanceOrder,
    PERMISSIONS.reserveStock,
    PERMISSIONS.overrideOverbooking,
    PERMISSIONS.releaseReservation,
    PERMISSIONS.fulfillOrder,
    PERMISSIONS.importVyapar,
    PERMISSIONS.viewReports,
    PERMISSIONS.exportData,
    PERMISSIONS.viewAuditLogs,
  ],
  "Nursery Supervisor": [
    PERMISSIONS.viewDashboard,
    PERMISSIONS.createBatch,
    PERMISSIONS.recordBatchLoss,
    PERMISSIONS.markBatchReady,
    PERMISSIONS.createCustomer,
    PERMISSIONS.viewReports,
  ],
  "Counter Staff": [
    PERMISSIONS.viewDashboard,
    PERMISSIONS.createCustomer,
    PERMISSIONS.createAdvanceOrder,
    PERMISSIONS.reserveStock,
    PERMISSIONS.fulfillOrder,
    PERMISSIONS.viewReports,
  ],
  "Order Taker": [
    PERMISSIONS.viewDashboard,
    PERMISSIONS.createCustomer,
    PERMISSIONS.createAdvanceOrder,
    PERMISSIONS.reserveStock,
    PERMISSIONS.viewReports,
  ],
  "Planning User": [
    PERMISSIONS.viewDashboard,
    PERMISSIONS.managePlantMaster,
    PERMISSIONS.createCustomer,
    PERMISSIONS.createAdvanceOrder,
    PERMISSIONS.reserveStock,
    PERMISSIONS.releaseReservation,
    PERMISSIONS.fulfillOrder,
    PERMISSIONS.importVyapar,
    PERMISSIONS.viewReports,
    PERMISSIONS.exportData,
    PERMISSIONS.viewAuditLogs,
  ],
  Viewer: [PERMISSIONS.viewDashboard, PERMISSIONS.viewReports],
};

export function getRoleDefaultPermissions(roleName: string): Permission[] {
  if (!isRoleName(roleName)) return [];
  return [...ROLE_PERMISSIONS[roleName]];
}

export function isRoleName(value: string): value is RoleName {
  return (ROLE_NAMES as readonly string[]).includes(value);
}
