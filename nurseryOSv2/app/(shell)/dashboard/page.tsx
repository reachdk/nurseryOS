import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of stock, orders, and alerts."
      />
      <EmptyState
        title="Dashboard coming soon"
        description="Operational widgets land in later waves."
        action={
          <Link
            href="/availability"
            className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Check availability
          </Link>
        }
      />
    </>
  );
}
