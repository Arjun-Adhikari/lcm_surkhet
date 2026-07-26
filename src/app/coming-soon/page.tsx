"use client";

import { PublicLayout } from "@/layouts/PublicLayout";
import { useState } from "react";
import { NowShowingMoviesGrid, ComingSoonMoviesGrid } from "@/components/movies-grid";

export default function ComingSoonPage() {
  return (
    <PublicLayout>
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:text-white border-b">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">Coming Soon</h1>
          <p className="text-base text-muted-foreground dark:text-zinc-300">
            Upcoming movies at Laxmi Chalchitra Mandir.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ComingSoonMoviesGrid />
      </div>
    </PublicLayout>
  );
}
