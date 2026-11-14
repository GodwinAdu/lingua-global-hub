import { Skeleton } from '@/components/ui/skeleton';

// Suspense boundary for every dashboard page: shown while the page loads its data,
// so navigating between dashboard pages responds instantly.
export default function DashboardPageLoading() {
  return (
    <div className="max-w-5xl space-y-6" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
