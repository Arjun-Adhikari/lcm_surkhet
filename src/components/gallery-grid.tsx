import { getGallery, getGalleryCategories } from "@/lib/data";
import { GalleryClient } from "@/components/gallery-client";

export async function GalleryGrid() {
  const [{ items, total }, categories] = await Promise.all([
    getGallery(1, 6),
    getGalleryCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <GalleryClient
        initialItems={items}
        initialTotal={total}
        categories={["all", ...categories]}
        pageSize={6}
      />
    </div>
  );
}
