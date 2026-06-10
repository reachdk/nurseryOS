/** Permission keys — must match role seed in supabase/migrations. */
export const PERMISSIONS = {
  viewDashboard: "view_dashboard",
  manageUsers: "manage_users",
  managePlantMaster: "manage_plant_master",
  createBatch: "create_batch",
  recordBatchLoss: "record_batch_loss",
  markBatchReady: "mark_batch_ready",
  createCustomer: "create_customer",
  createAdvanceOrder: "create_advance_order",
  reserveStock: "reserve_stock",
  overrideOverbooking: "override_overbooking",
  releaseReservation: "release_reservation",
  fulfillOrder: "fulfill_order",
  importVyapar: "import_vyapar",
  viewReports: "view_reports",
  exportData: "export_data",
  viewAuditLogs: "view_audit_logs",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type AppUser = {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  roleName: string;
  permissions: Permission[];
  status: "active" | "inactive";
};

export type NavItem = {
  href: string;
  label: string;
  /** User needs any one of these permissions to see the item. */
  permissions: Permission[];
  mobilePriority?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    permissions: [PERMISSIONS.viewDashboard],
    mobilePriority: true,
  },
  {
    href: "/counter",
    label: "Counter",
    permissions: [PERMISSIONS.fulfillOrder, PERMISSIONS.createAdvanceOrder],
    mobilePriority: true,
  },
  {
    href: "/orders",
    label: "Orders",
    permissions: [PERMISSIONS.createAdvanceOrder],
    mobilePriority: true,
  },
  {
    href: "/customers",
    label: "Customers",
    permissions: [PERMISSIONS.createCustomer],
  },
  {
    href: "/availability",
    label: "Availability",
    permissions: [PERMISSIONS.viewDashboard],
    mobilePriority: true,
  },
  {
    href: "/batches",
    label: "Batches",
    permissions: [
      PERMISSIONS.createBatch,
      PERMISSIONS.recordBatchLoss,
      PERMISSIONS.markBatchReady,
    ],
    mobilePriority: true,
  },
  {
    href: "/reconciliation",
    label: "Reconciliation",
    permissions: [PERMISSIONS.importVyapar],
  },
  {
    href: "/reports",
    label: "Reports",
    permissions: [PERMISSIONS.viewReports],
  },
  {
    href: "/admin/users",
    label: "Admin",
    permissions: [PERMISSIONS.manageUsers, PERMISSIONS.managePlantMaster],
  },
];

export function hasPermission(user: AppUser, permission: Permission): boolean {
  if (user.status !== "active") return false;
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: AppUser, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(user, p));
}

export function visibleNavItems(user: AppUser | null): NavItem[] {
  if (!user) return [];
  return NAV_ITEMS.filter((item) => hasAnyPermission(user, item.permissions));
}
