"use server";

import { requireAppUser } from "@/server/auth/session";
import { requirePermission, PermissionError } from "@/server/services/permission-service";
import type { Permission } from "@/server/lib/permissions";

/**
 * Example guarded server action pattern for REA-32.
 * Domain actions in later waves should call requirePermission the same way.
 */
export async function guardedEcho(permission: Permission, payload: string): Promise<string> {
  const user = await requireAppUser();
  requirePermission(user, permission);
  return payload;
}

export async function guardedEchoSafe(
  permission: Permission,
  payload: string
): Promise<{ ok: true; data: string } | { ok: false; status: number; message: string }> {
  try {
    const data = await guardedEcho(permission, payload);
    return { ok: true, data };
  } catch (error) {
    if (error instanceof PermissionError) {
      return { ok: false, status: error.status, message: error.message };
    }
    throw error;
  }
}
