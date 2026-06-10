import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Admin" description="Users, roles, and system settings." />
      <EmptyState title="User management" description="Built in REA-65." />
    </>
  );
}
