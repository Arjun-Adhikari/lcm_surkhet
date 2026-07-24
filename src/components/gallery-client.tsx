"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/lib/store";

interface GalleryClientProps {
  initialItems: GalleryItem[];
  initialTotal: number;
  categories: string[];
  pageSize: number;
}

export function GalleryClient({
  initialItems,
  initialTotal,
  categories,
  pageSize,
}: GalleryClientProps) {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  async function fetchPage(newPage: number, newFilter: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(newPage),
        pageSize: String(pageSize),
        ...(newFilter !== "all" && { category: newFilter }),
      });
      const res = await fetch(`/api/gallery?${params}`);
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
      setPage(newPage);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(newFilter: string) {
    setFilter(newFilter);
    fetchPage(1, newFilter);
  }

  function handlePageChange(newPage: number) {
    fetchPage(newPage, filter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p>No photos available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {/* Category filter */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-2">
        <div className="inline-flex items-center justify-center rounded-full bg-muted p-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => handleFilterChange(c)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all ${
                filter === c
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted-foreground/10"
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery grid */}
      <div className={`columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid">
            <div
              className="relative group rounded-xl overflow-hidden cursor-pointer shadow-sm border bg-card"
              onClick={() => setLightbox(item.imageUrl)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-bold font-serif text-lg leading-tight">{item.title}</p>
                  <p className="text-white/70 text-xs uppercase tracking-wider mt-1">{item.category}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                disabled={loading}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox}
              alt="Gallery"
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
