import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/server/db/client.server";
import type { AppUser, Permission } from "@/server/lib/permissions";

type RoleRow = {
  role_name: string;
  permissions: unknown;
};

type UserProfileRow = {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  status: "active" | "inactive";
  roles: RoleRow | RoleRow[] | null;
};

function resolveRole(roles: UserProfileRow["roles"]): RoleRow | null {
  if (!roles) return null;
  return Array.isArray(roles) ? (roles[0] ?? null) : roles;
}

export const getAuthUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getAppUser = cache(async (): Promise<AppUser | null> => {
  const authUser = await getAuthUser();
  if (!authUser) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, mobile, status, roles!inner(role_name, permissions)")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as UserProfileRow;
  if (row.status !== "active") return null;

  const role = resolveRole(row.roles);
  if (!role) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    mobile: row.mobile,
    roleName: role.role_name,
    permissions: parsePermissions(role.permissions),
    status: row.status,
  };
});

export async function requireAppUser(): Promise<AppUser> {
  const user = await getAppUser();
  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Please sign in to continue."));
  }
  return user;
}

/** Dev-only mock for tests; not used in production paths. */
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
