import { Calendar, MapPin, Clock } from "lucide-react";
import { getUpcomingEvents } from "@/lib/data";

export async function UpcomingEventsSection() {
  const upcoming = await getUpcomingEvents();

  if (upcoming.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed rounded-xl bg-muted/20">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <p className="text-lg text-muted-foreground">Stay tuned! We are planning exciting events.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {upcoming.map((event) => (
        <div key={event.id} className="flex flex-col sm:flex-row bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="sm:w-2/5 aspect-video sm:aspect-auto relative overflow-hidden">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 sm:w-3/5 flex flex-col justify-center">
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-primary mb-3">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {event.time}
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">{event.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{event.description}</p>
            <div className="mt-auto flex items-center text-sm font-medium text-foreground">
              <MapPin className="w-4 h-4 mr-1 text-muted-foreground" /> LCM Surkhet Premises
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
