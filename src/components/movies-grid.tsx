import Link from "next/link";
import { Clock, Play, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMovies, getNowShowingShowtimes } from "@/lib/data";
import type { Movie, Showtime } from "@/lib/store";

function MovieCard({ movie, showtimes }: { movie: Movie; showtimes: Showtime[] }) {
  const movieShowtimes = showtimes.filter((s) => s.movieId === movie.id).slice(0, 3);
  return (
    <div className="group flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <Link href={`/movies/${movie.id}`} className="relative aspect-2/3 block overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase">
            {movie.ageRating}
          </span>
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg font-serif mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center text-xs text-muted-foreground gap-2 mb-3">
          <span>{movie.language}</span>
          <span>•</span>
          <span>{movie.genre.join(", ")}</span>
        </div>
        <div className="mt-auto space-y-3">
          {movie.status === "now-showing" && movieShowtimes.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                {movieShowtimes.map((st) => (
                  <span key={st.id} className="text-xs font-mono bg-muted text-foreground px-2 py-1 rounded border">
                    {st.time} · Rs. {st.ticketPrices?.[0]?.price ?? st.price}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">General, Student and Child prices in show details.</p>
            </>
          )}
          {movie.status === "coming-soon" && (
            <div className="text-sm font-medium text-primary">
              Releases: {new Date(movie.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          )}
          <Button asChild className="w-full rounded-md shadow-none" variant={movie.status === "now-showing" ? "default" : "outline"}>
            <Link href={`/movies/${movie.id}`}>
              {movie.status === "now-showing"
                ? <><Clock className="w-4 h-4 mr-2" /> View Showtimes</>
                : <><Play className="w-4 h-4 mr-2" /> View Details</>}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export async function NowShowingMoviesGrid() {
  const [movies, showtimes] = await Promise.all([getMovies(), getNowShowingShowtimes()]);
  const nowShowing = movies.filter((m) => m.status === "now-showing");

  if (nowShowing.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Film className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No movies currently showing.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {nowShowing.map((movie) => <MovieCard key={movie.id} movie={movie} showtimes={showtimes} />)}
    </div>
  );
}

export async function ComingSoonMoviesGrid() {
  const movies = await getMovies();
  const comingSoon = movies.filter((m) => m.status === "coming-soon");

  if (comingSoon.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Film className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No upcoming movies announced yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {comingSoon.map((movie) => <MovieCard key={movie.id} movie={movie} showtimes={[]} />)}
    </div>
  );
}
