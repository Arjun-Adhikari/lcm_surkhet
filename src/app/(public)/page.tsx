import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CalendarDays } from "lucide-react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { getSettings, getMovies, getNowShowingShowtimes } from "@/lib/data";
import { HomeHero } from "@/components/home-hero";
import { NowShowingGrid } from "@/components/now-showing-grid";
import { HeroSkeleton, MovieGridSkeleton } from "@/components/skeletons";

export default async function Home() {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>

      {/* Dynamic: hero needs the first now-showing movie from DB */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Static shell: headings, links */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Now Showing</h2>
              <p className="text-muted-foreground">Catch the latest blockbusters on the big screen.</p>
            </div>
            <Link href="/movies" className="hidden sm:flex items-center text-primary font-semibold hover:underline">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Dynamic: movie cards from DB */}
          <Suspense fallback={<MovieGridSkeleton count={4} />}>
            <NowShowingGrid />
          </Suspense>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link href="/movies">View All Movies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Static: CTA banner — uses settings already fetched above */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-80 mb-2">Plan your visit</p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
              Check showtimes, then call the box office
            </h2>
            <p className="opacity-90 max-w-2xl">{settings.ticketPolicy}</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5" />
              <span>Shows listed by date online</span>
            </div>
            <Button variant="secondary" className="rounded-full" asChild>
              <Link href="/contact"><Phone className="w-4 h-4 mr-2" /> Call {settings.phone}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Fully static: cinema features section */}
      <section className="py-20 bg-zinc-950 text-white border-y border-zinc-800">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Cinematic Brilliance in Surkhet</h2>
          <p className="text-zinc-400 text-lg md:text-xl mb-10">
            Experience movies the way they were meant to be seen. Featuring state-of-the-art 4K
            projection, immersive Dolby Atmos sound, and luxurious seating.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎥", title: "4K Laser Projection", desc: "Crystal clear, vibrant images that bring stories to life." },
              { icon: "🔊", title: "Dolby Atmos", desc: "360-degree immersive sound that puts you inside the action." },
              { icon: "💺", title: "Plush Seating", desc: "Ergonomic, spacious seats designed for ultimate comfort." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-3xl">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}

// Separate async component so Suspense can stream it independently
async function HeroSection() {
  const [movies, showtimes] = await Promise.all([getMovies(), getNowShowingShowtimes()]);
  const nowShowing = movies.filter((m) => m.status === "now-showing");
  const heroMovie = nowShowing[0] || movies[0];
  if (!heroMovie) return null;
  return <HomeHero movie={heroMovie} />;
}
