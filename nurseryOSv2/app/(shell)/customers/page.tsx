import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="Customers" description="Farmer and dealer records." />
      <EmptyState title="Customer master" description="Built in REA-40." />
    </>
  );
}
