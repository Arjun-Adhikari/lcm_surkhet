import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toStatus(s: string) {
  switch (s) {
    case "now-showing":  return "NOW_SHOWING";
    case "coming-soon":  return "COMMING_SOON";
    case "archived":     return "ARCHIVED";
    default:             return "NOW_SHOWING";
  }
}

function fromStatus(s: string) {
  switch (s) {
    case "NOW_SHOWING":  return "now-showing";
    case "COMMING_SOON": return "coming-soon";
    case "ARCHIVED":     return "archived";
    default:             return "now-showing";
  }
}

function serializeMovie(m: Awaited<ReturnType<typeof prisma.movie.findMany>>[0]) {
  return {
    id: m.id,
    title: m.title,
    originalTitle: m.originalTitle ?? undefined,
    director: m.director,
    cast: m.cast,
    durationMinutes: m.durationMinutes,
    genre: m.genre,
    synopsis: m.synopsis,
    posterUrl: m.posterUrl,
    backdropUrl: m.backdropUrl,
    trailerUrl: m.trailerUrl,
    status: fromStatus(m.status),
    releaseDate: m.releaseDate.toISOString().split("T")[0],
    language: m.language,
    ageRating: m.ageRating,
  };
}

export async function GET() {
  const movies = await prisma.movie.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(movies.map(serializeMovie));
}

export async function POST(req: Request) {
  const data = await req.json();
  const movie = await prisma.movie.create({
    data: {
      title: data.title,
      originalTitle: data.originalTitle,
      director: data.director,
      cast: Array.isArray(data.cast) ? data.cast : [],
      durationMinutes: data.durationMinutes,
      genre: Array.isArray(data.genre) ? data.genre : [],
      synopsis: data.synopsis,
      posterUrl: data.posterUrl,
      backdropUrl: data.backdropUrl,
      trailerUrl: data.trailerUrl,
      status: toStatus(data.status),
      releaseDate: new Date(data.releaseDate),
      language: data.language,
      ageRating: data.ageRating,
    },
  });
  return NextResponse.json(serializeMovie(movie), { status: 201 });
}
