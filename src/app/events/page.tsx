import { Suspense } from "react";
import { Calendar } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { getSettings } from "@/lib/data";
import { UpcomingEventsSection } from "@/components/events-sections";
import { PastEventsSection } from "@/components/past-events-section";
import { EventGridSkeleton } from "@/components/skeletons";


export default async function EventsPage() {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>
      {/* Static shell */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Events & Premieres</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join us for special screenings, cast meet-and-greets, and cinema festivals right here in Surkhet.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Upcoming events — dynamic */}
        <section>
          <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-primary block rounded-full" />
            Upcoming Events
          </h2>
          <Suspense fallback={<EventGridSkeleton count={2} />}>
            <UpcomingEventsSection />
          </Suspense>
        </section>

        {/* Past events — dynamic with pagination */}
        <Suspense fallback={
          <section>
            <h2 className="text-2xl font-serif font-bold mb-6 text-muted-foreground">Past Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-card border rounded-xl overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        }>
          <PastEventsSection />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
