import {
  hasAnyPermission,
  hasPermission,
  type AppUser,
  type Permission,
} from "@/server/lib/permissions";

export function can(user: AppUser | null, permission: Permission): boolean {
  if (!user) return false;
  return hasPermission(user, permission);
}

export function canAny(user: AppUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return hasAnyPermission(user, permissions);
}

export class PermissionError extends Error {
  readonly status = 403;

  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "PermissionError";
  }
}

export function requirePermission(user: AppUser | null, permission: Permission): void {
  if (!can(user, permission)) {
    throw new PermissionError();
  }
}
