export default function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="pixel-panel flex items-center justify-between rounded-xl px-5 py-4">
          <div className="space-y-2">
            <div className="h-3 w-10 animate-pulse rounded bg-[#e6dfc8]" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#e6dfc8]" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-[#e6dfc8]" />
        </div>
      ))}
    </div>
  );
}
