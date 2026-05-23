import { Card } from "@/components/ui";

function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--accent)]/30 ${className}`}
      aria-hidden
    />
  );
}

export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="space-y-3">
          <SkeletonBar className="h-5 w-2/5" />
          <SkeletonBar className="h-3 w-3/5" />
          <div className="grid grid-cols-2 gap-2">
            <SkeletonBar className="h-12" />
            <SkeletonBar className="h-12" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="space-y-2 !p-3">
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-9 w-40" />
      </Card>
      <SkeletonBar className="h-4 w-28" />
      <CardListSkeleton count={4} />
    </div>
  );
}

export function PlantsPageSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBar className="h-10 w-full rounded-xl" />
      <CardListSkeleton count={5} />
    </div>
  );
}

export function PlantDetailSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBar className="h-7 w-1/2" />
      <SkeletonBar className="h-3 w-2/3" />
      <Card>
        <div className="grid grid-cols-3 gap-2">
          <SkeletonBar className="h-14" />
          <SkeletonBar className="h-14" />
          <SkeletonBar className="h-14" />
        </div>
      </Card>
      <SkeletonBar className="h-4 w-36" />
      <SkeletonBar className="h-24 w-full rounded-xl" />
      <Card className="space-y-3">
        <SkeletonBar className="h-4 w-1/2" />
        <SkeletonBar className="h-10 w-full" />
      </Card>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonBar className="h-7 w-2/5" />
      <Card className="space-y-4">
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-10 w-24" />
      </Card>
    </div>
  );
}
