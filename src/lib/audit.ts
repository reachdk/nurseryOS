import type { User } from "@supabase/supabase-js";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AuditPayload = {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function logAudit(user: User, payload: AuditPayload) {
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userEmail: user.email ?? null,
      action: payload.action,
      entityType: payload.entityType ?? null,
      entityId: payload.entityId ?? null,
      metadata: payload.metadata ?? undefined,
    },
  });
}
