import { describe, expect, it } from "vitest";
import { can, canAny, requirePermission, PermissionError } from "@/server/services/permission-service";
import { PERMISSIONS } from "@/server/lib/permissions";
import { mockAppUser } from "@/server/auth/session";

describe("permission-service", () => {
  const user = mockAppUser({
    roleName: "Counter Staff",
    permissions: [PERMISSIONS.viewDashboard, PERMISSIONS.fulfillOrder],
  });

  it("can returns true for granted permission", () => {
    expect(can(user, PERMISSIONS.fulfillOrder)).toBe(true);
  });

  it("can returns false for missing permission", () => {
    expect(can(user, PERMISSIONS.manageUsers)).toBe(false);
  });

  it("can returns false for null user", () => {
    expect(can(null, PERMISSIONS.viewDashboard)).toBe(false);
  });

  it("requirePermission throws PermissionError when denied", () => {
    expect(() => requirePermission(user, PERMISSIONS.manageUsers)).toThrow(PermissionError);
  });

  it("canAny passes when one permission matches", () => {
    expect(canAny(user, [PERMISSIONS.manageUsers, PERMISSIONS.fulfillOrder])).toBe(true);
  });
});
