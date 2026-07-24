import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border shadow-sm">
      <Skeleton className="aspect-2/3 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row bg-card border rounded-xl overflow-hidden shadow-sm">
      <Skeleton className="sm:w-2/5 aspect-video sm:aspect-auto" />
      <div className="p-6 sm:w-3/5 space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GalleryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid">
          <Skeleton className={`w-full rounded-xl ${i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-48" : "h-56"}`} />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] min-h-150 w-full bg-zinc-900 flex items-end pb-16">
      <div className="container mx-auto px-4 space-y-4 max-w-2xl">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-14 w-40 rounded-full" />
          <Skeleton className="h-14 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
