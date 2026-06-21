/* Skeleton loaders for SHUB LIFE — pulse animation via Tailwind */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`shimmer animate-pulse rounded-md bg-surface-elevated ${className}`} />;
}

export function HomeSkeleton() {
  return (
    <div className="space-y-4 px-5 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bar className="h-11 w-11 rounded-full" />
          <div className="space-y-2">
            <Bar className="h-2 w-16" />
            <Bar className="h-3 w-24" />
          </div>
        </div>
        <Bar className="h-10 w-10 rounded-full" />
      </div>
      <Bar className="h-64 w-full rounded-[28px]" />
      <div className="grid grid-cols-2 gap-3">
        <Bar className="h-28 rounded-2xl" />
        <Bar className="h-28 rounded-2xl" />
      </div>
      <Bar className="h-40 w-full rounded-3xl" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 px-5 pt-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <Bar className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Bar className="h-3 w-1/2" />
            <Bar className="h-2 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 px-5 pt-6">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Bar key={i} className="h-24 rounded-2xl" />)}
      </div>
      <Bar className="h-56 rounded-3xl" />
    </div>
  );
}

export function CardSkeleton() {
  return <Bar className="h-32 w-full rounded-3xl" />;
}
