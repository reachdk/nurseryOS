import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function CounterPage() {
  return (
    <>
      <PageHeader title="Counter" description="Orders due today, fulfillment, and quick actions." />
      <EmptyState title="Counter dashboard" description="Built in REA-59." />
    </>
  );
}
