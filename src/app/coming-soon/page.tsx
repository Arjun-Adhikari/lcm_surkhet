"use client";

import { PublicLayout } from "@/layouts/PublicLayout";
import { useState } from "react";
import { NowShowingMoviesGrid, ComingSoonMoviesGrid } from "@/components/movies-grid";

export default function ComingSoonPage() {
  return (
    <PublicLayout>
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Coming Soon</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Get a sneak peek at what&apos;s coming next to Laxmi Chalchitra Mandir.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ComingSoonMoviesGrid />
      </div>
    </PublicLayout>
  );
}
