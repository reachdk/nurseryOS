import { describe, expect, it } from "vitest";
import {
  PERMISSIONS,
  hasAnyPermission,
  hasPermission,
  visibleNavItems,
} from "@/server/lib/permissions";
import { mockAppUser } from "@/server/auth/session";

describe("permissions", () => {
  const admin = mockAppUser({
    roleName: "Admin",
    permissions: Object.values(PERMISSIONS),
  });

  const viewer = mockAppUser({
    roleName: "Viewer",
    permissions: [PERMISSIONS.viewDashboard, PERMISSIONS.viewReports],
  });

  it("admin has manage_users", () => {
    expect(hasPermission(admin, PERMISSIONS.manageUsers)).toBe(true);
  });

  it("viewer cannot manage users", () => {
    expect(hasPermission(viewer, PERMISSIONS.manageUsers)).toBe(false);
  });

  it("inactive user has no permissions", () => {
    const inactive = { ...admin, status: "inactive" as const };
    expect(hasPermission(inactive, PERMISSIONS.viewDashboard)).toBe(false);
  });

  it("visibleNavItems filters by role", () => {
    const adminNav = visibleNavItems(admin);
    const viewerNav = visibleNavItems(viewer);
    expect(adminNav.length).toBeGreaterThan(viewerNav.length);
    expect(adminNav.some((i) => i.href === "/admin/users")).toBe(true);
    expect(viewerNav.some((i) => i.href === "/admin/users")).toBe(false);
    expect(viewerNav.some((i) => i.href === "/reports")).toBe(true);
  });

  it("returns empty nav when user is null", () => {
    expect(visibleNavItems(null)).toEqual([]);
  });

  it("hasAnyPermission works for counter nav", () => {
    const counter = mockAppUser({
      roleName: "Counter Staff",
      permissions: [
        PERMISSIONS.viewDashboard,
        PERMISSIONS.createAdvanceOrder,
        PERMISSIONS.fulfillOrder,
      ],
    });
    expect(hasAnyPermission(counter, [PERMISSIONS.fulfillOrder, PERMISSIONS.importVyapar])).toBe(
      true
    );
  });
});
