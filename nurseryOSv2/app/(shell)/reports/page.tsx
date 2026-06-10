import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Stock, orders, and planning reports." />
      <EmptyState title="Reports" description="Built in REA-63." />
    </>
  );
}
