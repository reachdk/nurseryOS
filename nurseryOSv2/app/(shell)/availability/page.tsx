import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function AvailabilityPage() {
  return (
    <>
      <PageHeader title="Availability" description="Ready and future free-to-sell stock." />
      <EmptyState title="Availability grid" description="Built in REA-60." />
    </>
  );
}
