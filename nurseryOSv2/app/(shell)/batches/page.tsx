import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function BatchesPage() {
  return (
    <>
      <PageHeader title="Batches" description="Production batches and lifecycle events." />
      <EmptyState title="Batch list" description="Built in REA-45 / REA-46." />
    </>
  );
}
