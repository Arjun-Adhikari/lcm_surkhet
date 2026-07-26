"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PublicLayout } from "@/layouts/PublicLayout";
import { NowShowingMoviesGrid, ComingSoonMoviesGrid } from "@/components/movies-grid";

function MoviesContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(() => searchParams.get("tab") || "now-showing");

  return (
    <PublicLayout>
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">Movies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover what&apos;s playing at Laxmi Chalchitra Mandir. From blockbuster hits to local
            favorites, we&apos;ve got your entertainment covered.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-10">
          <div className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 rounded-full">
            <button
              onClick={() => setTab("now-showing")}
              className={`rounded-full text-base py-2 font-medium transition-colors ${
                tab === "now-showing" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setTab("coming-soon")}
              className={`rounded-full text-base py-2 font-medium transition-colors ${
                tab === "coming-soon" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {tab === "now-showing" ? <NowShowingMoviesGrid /> : <ComingSoonMoviesGrid />}
      </div>
    </PublicLayout>
  );
}

export default function MoviesPage() {
  return (
    <Suspense>
      <MoviesContent />
    </Suspense>
  );
}
