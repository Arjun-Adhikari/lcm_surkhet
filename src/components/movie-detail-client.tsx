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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const trailerId = getYoutubeId(movie.trailerUrl);
  const hasDates = showtimes.length > 0;

  return (
    <div className="pt-4 flex flex-wrap gap-4">
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
            {trailerId ? (
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">Trailer unavailable</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {movie.status === "now-showing" && hasDates && (
        <Button size="lg" className="rounded-full" onClick={() => document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth" })}>
          <Clock className="w-5 h-5 mr-2" /> View Showtimes
        </Button>
      )}
    </div>
  );
}
