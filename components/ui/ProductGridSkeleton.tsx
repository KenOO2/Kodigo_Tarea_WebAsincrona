export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="pixel-panel overflow-hidden rounded-xl">
          <div className="aspect-[4/3] animate-pulse border-b-3 border-ink bg-sky/30" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-[#e6dfc8]" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-[#e6dfc8]" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-[#e6dfc8]" />
          </div>
        </div>
      ))}
    </div>
  );
}
