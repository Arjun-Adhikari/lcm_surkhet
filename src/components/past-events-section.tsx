import { getPastEvents } from "@/lib/data";

interface PastEvent {
  id: string; title: string; date: string; time: string;
  description: string; imageUrl: string; status: string;
}

export async function PastEventsSection() {
  const { events: past } = await getPastEvents(1, 3) as { events: PastEvent[]; total: number };

  if (past.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-serif font-bold mb-6 text-muted-foreground">Past Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {past.map((event) => (
          <div key={event.id} className="bg-card border rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
            <div className="aspect-video relative">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover grayscale transition-all hover:grayscale-0"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] uppercase px-2 py-1 rounded backdrop-blur-sm font-bold">
                Past
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold font-serif mb-1">{event.title}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
