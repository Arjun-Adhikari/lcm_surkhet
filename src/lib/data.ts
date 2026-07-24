import { prisma } from "@/lib/prisma";
import type { CinemaSettings, Movie, Showtime, Event, GalleryItem } from "@/lib/store";

// ─── Status mappers ───────────────────────────────────────────────────────────

export function fromStatus(s: string): Movie["status"] {
  switch (s) {
    case "NOW_SHOWING":  return "now-showing";
    case "COMMING_SOON": return "coming-soon";
    case "ARCHIVED":     return "archived";
    default:             return "now-showing";
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  id: "singleton",
  name: "Laxmi Chalchitra Mandir",
  address: "Birendranagar-6, Surkhet, Nepal",
  phone: "+977 083-520123",
  email: "info@lcmsurkhet.com",
  openingTime: "9:00 AM",
  closingTime: "9:00 PM",
  ticketPolicy: "Please call the cinema for ticket availability. Payment is accepted at the cinema counter only.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14059.259970966555!2d81.616667!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a28bf2a096c4d7%3A0xc34a62bb1e2472b5!2sBirendranagar%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  aboutText: "Laxmi Chalchitra Mandir is Surkhet's premier cinema destination. Founded with a vision to bring world-class entertainment to Karnali province, we offer state-of-the-art projection, immersive Dolby Atmos sound, and comfortable seating.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
};

export async function getSettings(): Promise<CinemaSettings> {
  let s = await prisma.cinemaSettings.findFirst();
  if (!s) s = await prisma.cinemaSettings.create({ data: DEFAULT_SETTINGS });
  return {
    name: s.name, address: s.address, phone: s.phone, email: s.email,
    openingTime: s.openingTime, closingTime: s.closingTime,
    ticketPolicy: s.ticketPolicy, mapEmbedUrl: s.mapEmbedUrl,
    aboutText: s.aboutText, facebookUrl: s.facebookUrl, instagramUrl: s.instagramUrl,
  };
}

// ─── Movies ───────────────────────────────────────────────────────────────────

export async function getMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({ orderBy: { createdAt: "asc" } });
  return movies.map((m) => ({
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
  }));
}

export async function getMovieById(id: string): Promise<Movie | null> {
  const m = await prisma.movie.findUnique({ where: { id } });
  if (!m) return null;
  return {
    id: m.id, title: m.title, originalTitle: m.originalTitle ?? undefined,
    director: m.director, cast: m.cast, durationMinutes: m.durationMinutes,
    genre: m.genre, synopsis: m.synopsis, posterUrl: m.posterUrl,
    backdropUrl: m.backdropUrl, trailerUrl: m.trailerUrl,
    status: fromStatus(m.status),
    releaseDate: m.releaseDate.toISOString().split("T")[0],
    language: m.language, ageRating: m.ageRating,
  };
}

// ─── Showtimes ────────────────────────────────────────────────────────────────

export async function getShowtimesByMovieId(movieId: string): Promise<Showtime[]> {
  const rows = await prisma.showtime.findMany({
    where: { movieId },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
  return rows.map((s) => ({
    id: s.id, movieId: s.movieId,
    date: s.date.toISOString().split("T")[0],
    time: s.time, screen: s.screen, price: s.price,
    ticketPrices: s.ticketPrices as { type: string; price: number }[],
    availableSeats: s.availableSeats,
  }));
}

export async function getNowShowingShowtimes(): Promise<Showtime[]> {
  // Only fetch showtimes for now-showing movies — used on home + movies pages
  const rows = await prisma.showtime.findMany({
    where: { movie: { status: "NOW_SHOWING" } },
    orderBy: { date: "asc" },
  });
  return rows.map((s) => ({
    id: s.id, movieId: s.movieId,
    date: s.date.toISOString().split("T")[0],
    time: s.time, screen: s.screen, price: s.price,
    ticketPrices: s.ticketPrices as { type: string; price: number }[],
    availableSeats: s.availableSeats,
  }));
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(): Promise<Event[]> {
  const rows = await prisma.event.findMany({
    where: { status: "upcoming" },
    orderBy: { date: "asc" },
  });
  return rows.map((e) => ({
    id: e.id, title: e.title,
    date: e.date.toISOString().split("T")[0],
    time: e.time, description: e.description,
    imageUrl: e.imageUrl, status: e.status as Event["status"],
  }));
}

export async function getPastEvents(page = 1, pageSize = 3): Promise<{ events: Event[]; total: number }> {
  const [rows, total] = await Promise.all([
    prisma.event.findMany({
      where: { status: "past" },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.event.count({ where: { status: "past" } }),
  ]);
  return {
    events: rows.map((e) => ({
      id: e.id, title: e.title,
      date: e.date.toISOString().split("T")[0],
      time: e.time, description: e.description,
      imageUrl: e.imageUrl, status: e.status as Event["status"],
    })),
    total,
  };
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export async function getGallery(page = 1, pageSize = 6, category?: string): Promise<{ items: GalleryItem[]; total: number }> {
  const where = category && category !== "all" ? { category } : {};
  const [rows, total] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.galleryItem.count({ where }),
  ]);
  return {
    items: rows.map((g) => ({
      id: g.id, title: g.title, imageUrl: g.imageUrl,
      category: g.category as GalleryItem["category"],
    })),
    total,
  };
}

export async function getGalleryCategories(): Promise<string[]> {
  const items = await prisma.galleryItem.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return items.map((i) => i.category);
}
