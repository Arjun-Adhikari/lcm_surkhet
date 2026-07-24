"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function NowShowingGrid() {
  const { movies, showtimes } = useAppStore();
  const nowShowing = movies.filter((m) => m.status === "now-showing").slice(0, 4);

  if (nowShowing.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {nowShowing.map((movie) => {
        const movieShowtimes = showtimes.filter((s) => s.movieId === movie.id).slice(0, 3);
        return (
          <div key={movie.id} className="group relative rounded-xl overflow-hidden bg-card border shadow-sm hover:shadow-xl transition-all duration-300">
            <Link href={`/movies/${movie.id}`} className="block aspect-2/3 overflow-hidden relative">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="p-4">
              <h3 className="font-bold text-lg line-clamp-1 mb-1 font-serif group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground gap-2 mb-3">
                <span>{movie.genre[0]}</span>
                <span>•</span>
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {movie.durationMinutes}m</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movieShowtimes.map((st) => (
                  <span key={st.id} className="text-[10px] font-mono bg-muted px-2 py-1 rounded border border-border/50">
                    {st.time} · Rs. {st.ticketPrices?.[0]?.price ?? st.price}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                General / Student / Child prices listed on show details page.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
