import { describe, expect, it } from "vitest";
import { PERMISSIONS } from "@/server/lib/permissions";
import {
  ROLE_NAMES,
  ROLE_PERMISSIONS,
  getRoleDefaultPermissions,
  isRoleName,
} from "@/server/lib/role-permissions";
import { can } from "@/server/services/permission-service";
import { mockAppUser } from "@/server/auth/session";

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

describe("role permissions matrix", () => {
  it("defines all six seeded roles", () => {
    expect(ROLE_NAMES).toHaveLength(6);
    for (const roleName of ROLE_NAMES) {
      expect(ROLE_PERMISSIONS[roleName].length).toBeGreaterThan(0);
    }
  });

  it("Admin has every permission", () => {
    for (const permission of ALL_PERMISSIONS) {
      expect(ROLE_PERMISSIONS.Admin).toContain(permission);
    }
  });

  it("Viewer only has dashboard and reports", () => {
    expect(ROLE_PERMISSIONS.Viewer).toEqual([
      PERMISSIONS.viewDashboard,
      PERMISSIONS.viewReports,
    ]);
  });

  it.each(ROLE_NAMES)("role matrix matches can() for %s", (roleName) => {
    const user = mockAppUser({
      roleName,
      permissions: [...ROLE_PERMISSIONS[roleName]],
    });

    for (const permission of ALL_PERMISSIONS) {
      const expected = ROLE_PERMISSIONS[roleName].includes(permission);
      expect(can(user, permission)).toBe(expected);
    }
  });

  it("getRoleDefaultPermissions returns a copy", () => {
    const perms = getRoleDefaultPermissions("Counter Staff");
    perms.push(PERMISSIONS.manageUsers);
    expect(ROLE_PERMISSIONS["Counter Staff"]).not.toContain(PERMISSIONS.manageUsers);
  });

  it("isRoleName rejects unknown roles", () => {
    expect(isRoleName("Admin")).toBe(true);
    expect(isRoleName("Superuser")).toBe(false);
  });

  it("Counter Staff cannot override overbooking or manage users", () => {
    const user = mockAppUser({
      roleName: "Counter Staff",
      permissions: [...ROLE_PERMISSIONS["Counter Staff"]],
    });
    expect(can(user, PERMISSIONS.overrideOverbooking)).toBe(false);
    expect(can(user, PERMISSIONS.manageUsers)).toBe(false);
    expect(can(user, PERMISSIONS.fulfillOrder)).toBe(true);
  });

  it("Planning User can release reservations but not create batches", () => {
    const user = mockAppUser({
      roleName: "Planning User",
      permissions: [...ROLE_PERMISSIONS["Planning User"]],
    });
    expect(can(user, PERMISSIONS.releaseReservation)).toBe(true);
    expect(can(user, PERMISSIONS.createBatch)).toBe(false);
  });
});
