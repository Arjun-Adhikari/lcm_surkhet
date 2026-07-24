import { Suspense } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { getSettings, getGallery, getGalleryCategories } from "@/lib/data";
import { GalleryGrid } from "@/components/gallery-grid";
import { GalleryGridSkeleton } from "@/components/skeletons";


export default async function GalleryPage() {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>
      {/* Static shell */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Take a visual tour of Laxmi Chalchitra Mandir. See our modern halls, grand premieres,
            and the happy faces of our audience.
          </p>
        </div>
      </div>

      {/* Dynamic: gallery grid with pagination + filter */}
      <Suspense fallback={<div className="container mx-auto px-4 py-12"><GalleryGridSkeleton count={6} /></div>}>
        <GalleryGrid />
      </Suspense>
    </PublicLayout>
  );
}
