import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function fromStatus(s: string) {
  switch (s) {
    case "NOW_SHOWING":  return "now-showing";
    case "COMMING_SOON": return "coming-soon";
    case "ARCHIVED":     return "archived";
    default:             return "now-showing";
  }
}

function toStatus(s: string) {
  switch (s) {
    case "now-showing":  return "NOW_SHOWING" as const;
    case "coming-soon":  return "COMMING_SOON" as const;
    case "archived":     return "ARCHIVED" as const;
    default:             return "NOW_SHOWING" as const;
  }
}

function serializeMovie(m: Awaited<ReturnType<typeof prisma.movie.findUniqueOrThrow>>) {
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeMovie(movie));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const movie = await prisma.movie.update({
    where: { id },
    data: {
      title: data.title,
      originalTitle: data.originalTitle,
      director: data.director,
      cast: Array.isArray(data.cast) ? data.cast : undefined,
      durationMinutes: data.durationMinutes,
      genre: Array.isArray(data.genre) ? data.genre : undefined,
      synopsis: data.synopsis,
      posterUrl: data.posterUrl,
      backdropUrl: data.backdropUrl,
      trailerUrl: data.trailerUrl,
      status: data.status ? toStatus(data.status) : undefined,
      releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
      language: data.language,
      ageRating: data.ageRating,
    },
  });
  revalidateTag("movies");
  return NextResponse.json(serializeMovie(movie));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.movie.delete({ where: { id } });
  revalidateTag("movies");
  return NextResponse.json(null, { status: 204 });
}
