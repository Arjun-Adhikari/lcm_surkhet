import { Suspense } from "react";
import { PublicLayout } from "@/layouts/PublicLayout";
import { getSettings } from "@/lib/data";
import { NowShowingMoviesGrid, ComingSoonMoviesGrid } from "@/components/movies-grid";
import { MovieGridSkeleton } from "@/components/skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface MoviesPageProps {
  defaultTab?: string;
}

export default async function MoviesPage({ defaultTab = "now-showing" }: MoviesPageProps) {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>
      {/* Static shell — renders instantly */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Movies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover what&apos;s playing at Laxmi Chalchitra Mandir. From blockbuster hits to local
            favorites, we&apos;ve got your entertainment covered.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue={defaultTab} className="w-full">
          {/* Static: tab controls */}
          <div className="flex justify-center mb-10">
            <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 rounded-full">
              <TabsTrigger value="now-showing" className="rounded-full text-base py-2">Now Showing</TabsTrigger>
              <TabsTrigger value="coming-soon" className="rounded-full text-base py-2">Coming Soon</TabsTrigger>
            </TabsList>
          </div>

          {/* Dynamic: movie grids streamed in */}
          <TabsContent value="now-showing" className="mt-0">
            <Suspense fallback={<MovieGridSkeleton count={4} />}>
              <NowShowingMoviesGrid />
            </Suspense>
          </TabsContent>

          <TabsContent value="coming-soon" className="mt-0">
            <Suspense fallback={<MovieGridSkeleton count={4} />}>
              <ComingSoonMoviesGrid />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  );
}
