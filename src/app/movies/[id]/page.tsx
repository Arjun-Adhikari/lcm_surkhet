"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Phone } from "lucide-react";
import { MovieDetailClient } from "@/components/movie-detail-client";
import { ShowtimesPicker } from "@/components/showtimes-picker";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const { movies, showtimes: allShowtimes, settings } = useAppStore();

  const movie = useMemo(() => movies.find((m) => m.id === params.id), [movies, params.id]);
  const showtimes = useMemo(() => allShowtimes.filter((s) => s.movieId === params.id), [allShowtimes, params.id]);

  if (!movie) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Movie not found.</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="relative w-full h-[60vh] min-h-125 bg-black">
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-40 blur-[2px]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="w-48 md:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 hidden md:block">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={movie.status === "now-showing" ? "default" : "secondary"} className="uppercase">
                  {movie.status.replace("-", " ")}
                </Badge>
                <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
                  {movie.ageRating}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white drop-shadow-md">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-zinc-300 text-sm md:text-base">
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {movie.durationMinutes} mins</span>
                <span>•</span>
                <span>{movie.genre.join(", ")}</span>
                <span>•</span>
                <span>{movie.language}</span>
                <span>•</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(movie.releaseDate).getFullYear()}</span>
              </div>

              <MovieDetailClient movie={movie} showtimes={showtimes} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-serif font-bold mb-4">Synopsis</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{movie.synopsis}</p>
            </section>

            <section className="grid grid-cols-2 gap-6 p-6 bg-muted/30 rounded-xl border border-border/50">
              <div>
                <h3 className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Director</h3>
                <p className="font-medium text-foreground">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Cast</h3>
                <p className="font-medium text-foreground">{movie.cast.join(", ")}</p>
              </div>
            </section>

            {movie.status === "now-showing" && showtimes.length > 0 && (
              <section id="showtimes" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-bold">Showtimes</h2>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Call the box office to ask about availability. Payment is made at the cinema counter only.
                  </p>
                  <Button variant="outline" className="shrink-0" asChild>
                    <a href={`tel:${settings.phone?.replace(/\s/g, "")}`}><Phone className="w-4 h-4 mr-2" /> Call Box Office</a>
                  </Button>
                </div>
                <ShowtimesPicker showtimes={showtimes} phone={settings.phone} />
              </section>
            )}
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg mb-4 pb-2 border-b">Cinema Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Original Title</span>
                  <span className="font-medium text-right">{movie.originalTitle || movie.title}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Release Date</span>
                  <span className="font-medium text-right">
                    {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Age Rating</span>
                  <span className="font-medium text-right">{movie.ageRating}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 text-center">
              <h3 className="font-serif font-bold text-xl mb-2 text-primary">Box Office</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For ticket availability and reservations, please call the cinema. Payment at counter only.
              </p>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                <a href={`tel:${settings.phone?.replace(/\s/g, "")}`}>
                  <Phone className="w-4 h-4 mr-2" /> Call {settings.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
