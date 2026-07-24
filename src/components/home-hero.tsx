"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { Movie } from "@/lib/store";

export function HomeHero({ movie }: { movie: Movie }) {
  return (
    <section className="relative h-[80vh] min-h-150 w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 bg-primary text-xs font-bold rounded uppercase tracking-wider">Now Showing</span>
            <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-xs font-bold rounded uppercase tracking-wider">{movie.language}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 leading-tight">{movie.title}</h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-8 line-clamp-3">{movie.synopsis}</p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full text-base px-8 h-14 shadow-lg shadow-primary/30" asChild>
              <Link href={`/movies/${movie.id}`}><Clock className="mr-2 w-5 h-5" /> View Showtimes</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 bg-black/40 border-white/30 text-white hover:bg-white hover:text-black" asChild>
              <Link href={`/movies/${movie.id}`}><Play className="mr-2 w-5 h-5" /> Watch Trailer</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
