"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Play, Clock } from "lucide-react";
import type { Movie, Showtime } from "@/lib/store";

interface Props {
  movie: Movie;
  showtimes: Showtime[];
}

export function MovieDetailClient({ movie, showtimes }: Props) {
  const getYoutubeId = (url: string) => {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };
  const hasDates = showtimes.length > 0;
  if (!movie.trailerUrl) return <div className="pt-4 flex flex-wrap gap-4">{movie.status === "now-showing" && hasDates && (
    <Button size="lg" className="rounded-full" onClick={() => document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth" })}>
      <Clock className="w-5 h-5 mr-2" /> View Showtimes
    </Button>
  )}</div>;
  const trailerId = getYoutubeId(movie.trailerUrl);
  const isYoutubeUrl = movie.trailerUrl.toLowerCase().includes("youtube") || movie.trailerUrl.toLowerCase().includes("youtu.be");

  return (
    <div className="pt-4 flex flex-wrap gap-4">
      {isYoutubeUrl && trailerId ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" variant="outline" className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white hover:text-black">
              <Play className="w-5 h-5 mr-2" /> Watch Trailer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 bg-black border-zinc-800 overflow-hidden">
            <DialogTitle className="sr-only">Trailer for {movie.title}</DialogTitle>
            <DialogDescription className="sr-only">Video trailer</DialogDescription>
            <div className="aspect-video w-full bg-black">
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=0&rel=0`}
                title="Trailer"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : movie.trailerUrl ? (
        <Button size="lg" variant="outline" className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white hover:text-black" asChild>
          <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">
            <Play className="w-5 h-5 mr-2" /> Watch Trailer
          </a>
        </Button>
      ) : null}

      {movie.status === "now-showing" && hasDates && (
        <Button size="lg" className="rounded-full" onClick={() => document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth" })}>
          <Clock className="w-5 h-5 mr-2" /> View Showtimes
        </Button>
      )}
    </div>
  );
}
