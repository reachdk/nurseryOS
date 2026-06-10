import type { AppUser, Permission } from "@/server/lib/permissions";

/**
 * Placeholder session loader until REA-35 wires Supabase Auth → public.users.
 * Returns null when unauthenticated.
 */
export async function getAppUser(): Promise<AppUser | null> {
  // REA-35: load session via createClient(), join users + roles
  return null;
}

/** Dev-only mock for REA-36 nav tests; not used in production paths. */
export function mockAppUser(
  overrides: Partial<AppUser> & Pick<AppUser, "roleName" | "permissions">
): AppUser {
  return {
    id: overrides.id ?? "00000000-0000-4000-8000-000000000001",
    name: overrides.name ?? "Test User",
    email: overrides.email ?? "test@example.com",
    mobile: overrides.mobile ?? null,
    roleName: overrides.roleName,
    permissions: overrides.permissions,
    status: overrides.status ?? "active",
  };
}

export function parsePermissions(raw: unknown): Permission[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((p): p is Permission => typeof p === "string");
}
