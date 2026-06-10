import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function ReconciliationPage() {
  return (
    <>
      <PageHeader title="Reconciliation" description="Vyapar sales import and matching." />
      <EmptyState title="Vyapar reconciliation" description="Built in REA-61 / REA-62." />
    </>
  );
}
