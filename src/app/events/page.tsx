"use client";

import { PublicLayout } from "@/layouts/PublicLayout";
import { useAppStore } from "@/lib/store";
import { Calendar, MapPin, Clock } from "lucide-react";

export default function EventsPage() {
  return (
    <PublicLayout>
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">Events & Premieres</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join us for special screenings, cast meet-and-greets, and cinema festivals right here in Surkhet.
          </p>
        </div>
      </div>
      <EventsContent />
    </PublicLayout>
  );
}

function EventsContent() {
  const { events } = useAppStore();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section>
        <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary block rounded-full" />
          Upcoming Events
        </h2>
        {upcoming.length === 0 ? (
          <div className="p-12 text-center border border-dashed rounded-xl bg-muted/20">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <p className="text-lg font-medium">No upcoming events scheduled.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon for exciting screenings and special events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcoming.map((event) => (
              <div key={event.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="text-xs uppercase tracking-wider font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Upcoming</span>
                  <h3 className="text-xl font-serif font-bold mt-3 mb-3">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(event.date + "T" + (event.time || "00:00")).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {event.time}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6 text-muted-foreground">Past Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {past.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-card border rounded-xl overflow-hidden shadow-sm group">
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">Past</span>
                  <h3 className="font-bold mt-2 mb-1 line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {new Date(event.date + "T" + (event.time || "00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
