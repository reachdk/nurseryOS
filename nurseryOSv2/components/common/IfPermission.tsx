import { can, canAny } from "@/server/services/permission-service";
import type { AppUser, Permission } from "@/server/lib/permissions";

type IfPermissionProps = {
  user: AppUser | null;
  permission?: Permission;
  anyOf?: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/** Server component helper for permission-gated UI. */
export function IfPermission({
  user,
  permission,
  anyOf,
  children,
  fallback = null,
}: IfPermissionProps) {
  const allowed = permission
    ? can(user, permission)
    : anyOf
      ? canAny(user, anyOf)
      : false;

  return allowed ? <>{children}</> : <>{fallback}</>;
}
