import { beforeEach, describe, expect, it, vi } from "vitest";
import { PERMISSIONS } from "@/server/lib/permissions";
import { mockAppUser } from "@/server/auth/session";

vi.mock("@/server/auth/session", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/auth/session")>();
  return {
    ...actual,
    requireAppUser: vi.fn(),
  };
});

import { requireAppUser } from "@/server/auth/session";
import { guardedEchoSafe } from "@/server/actions/guarded-action";

describe("guarded server action", () => {
  const viewer = mockAppUser({
    roleName: "Viewer",
    permissions: [PERMISSIONS.viewDashboard, PERMISSIONS.viewReports],
  });

  beforeEach(() => {
    vi.mocked(requireAppUser).mockReset();
  });

  it("returns 403 when permission is denied", async () => {
    vi.mocked(requireAppUser).mockResolvedValue(viewer);

    const result = await guardedEchoSafe(PERMISSIONS.manageUsers, "hello");

    expect(result).toEqual({
      ok: false,
      status: 403,
      message: "You do not have permission to perform this action.",
    });
  });

  it("returns payload when permission is granted", async () => {
    vi.mocked(requireAppUser).mockResolvedValue(viewer);

    const result = await guardedEchoSafe(PERMISSIONS.viewReports, "hello");

    expect(result).toEqual({ ok: true, data: "hello" });
  });
});
