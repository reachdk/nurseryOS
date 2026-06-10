import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Advance orders and reservations." />
      <EmptyState title="Orders list" description="Built in REA-52 / REA-55." />
    </>
  );
}
