import { PublicLayout } from "@/layouts/PublicLayout";
import { getSettings } from "@/lib/data";
import { Film, Award, Users, Volume2 } from "lucide-react";


export default async function About() {
  const settings = await getSettings();

  return (
    <PublicLayout settings={settings}>
      <div className="py-20 md:py-24 bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 text-center">
          <Film className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Bringing the magic of cinema to Surkhet. A legacy of entertainment, reimagined for the modern era.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert prose-zinc max-w-none mb-20 font-serif leading-relaxed text-center">
            <p className="text-xl md:text-2xl text-foreground font-medium">
              &ldquo;{settings.aboutText}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold">The LCM Experience</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that watching a movie should be an event. That is why we have invested
                in the finest cinema technology available — from crystal-clear 4K laser projection
                to our thunderous Dolby Atmos sound system.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our spacious, luxurious seating ensures you stay comfortable from opening credits
                to the final post-credit scene.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Volume2, title: "Dolby Atmos", sub: "Immersive 3D audio" },
                { icon: Film, title: "4K Laser", sub: "Stunning clarity" },
                { icon: Users, title: "Plush Seating", sub: "Ultimate comfort" },
                { icon: Award, title: "Premium Cafe", sub: "Gourmet snacks" },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="bg-card border rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl font-serif font-bold mb-4">A Community Landmark</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              More than just a cinema, LCM Surkhet is a gathering place for film lovers in Karnali.
              We regularly host local premieres, film festivals, and cultural events.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
