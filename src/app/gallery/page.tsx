"use client";

import { useState } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useAppStore } from "@/lib/store";

export default function GalleryPage() {
  return (
    <PublicLayout>
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:text-white border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground dark:text-zinc-300 max-w-2xl">
            Take a visual tour of Laxmi Chalchitra Mandir. See our modern halls, grand premieres,
            and the happy faces of our audience.
          </p>
        </div>
      </div>
      <GalleryContent />
    </PublicLayout>
  );
}

function GalleryContent() {
  const { gallery } = useAppStore();
  const [filter, setFilter] = useState<string>("all");
  const categories = [...new Set(gallery.map((g) => g.category))];
  const filtered = filter === "all" ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No images found in this category.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="break-inside-avoid rounded-xl overflow-hidden bg-card border shadow-sm group cursor-pointer">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="p-3">
                <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
