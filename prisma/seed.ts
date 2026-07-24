import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const existing = await prisma.movie.findMany();
  if (existing.length > 0) {
    console.log(`Database already has ${existing.length} movies. Skipping seed.`);
    await prisma.$disconnect();
    return;
  }

  const movies = await prisma.$transaction([
    prisma.movie.create({
      data: {
        title: "Pashupati Prasad 2: Bhasme Don",
        director: "Dipendra K. Khanal",
        cast: ["Bipin Karki", "Saugat Malla", "Swastima Khadka"],
        durationMinutes: 145,
        genre: ["Drama", "Action"],
        synopsis:
          "Bhasme Don, seeking a peaceful life, finds his past catching up to him in the chaotic alleys of Pashupatinath.",
        posterUrl:
          "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
        backdropUrl:
          "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80",
        trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "NOW_SHOWING",
        releaseDate: new Date("2023-10-21"),
        language: "Nepali",
        ageRating: "PG-13",
      },
    }),
    prisma.movie.create({
      data: {
        title: "Dune: Part Two",
        director: "Denis Villeneuve",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
        durationMinutes: 166,
        genre: ["Sci-Fi", "Adventure"],
        synopsis:
          "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        posterUrl:
          "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
        backdropUrl:
          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80",
        trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "NOW_SHOWING",
        releaseDate: new Date("2024-03-01"),
        language: "English",
        ageRating: "PG-13",
      },
    }),
    prisma.movie.create({
      data: {
        title: "Mahapurush",
        director: "Pradip Bhattarai",
        cast: ["Hari Bansha Acharya", "Madan Krishna Shrestha"],
        durationMinutes: 135,
        genre: ["Comedy", "Drama"],
        synopsis:
          "A heartwarming tale of a widowed father finding love again, challenging societal norms in urban Nepal.",
        posterUrl:
          "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=60",
        backdropUrl:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
        trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "COMMING_SOON",
        releaseDate: new Date("2024-05-15"),
        language: "Nepali",
        ageRating: "U",
      },
    }),
    prisma.movie.create({
      data: {
        title: "Fighter",
        director: "Siddharth Anand",
        cast: ["Hrithik Roshan", "Deepika Padukone"],
        durationMinutes: 166,
        genre: ["Action", "Thriller"],
        synopsis:
          "Top IAF aviators come together in the face of imminent danger, to form Air Dragons.",
        posterUrl:
          "https://images.unsplash.com/photo-1629851410196-857508006bf2?w=500&auto=format&fit=crop&q=60",
        backdropUrl:
          "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80",
        trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "COMMING_SOON",
        releaseDate: new Date("2024-06-10"),
        language: "Hindi",
        ageRating: "PG-13",
      },
    }),
    prisma.movie.create({
      data: {
        title: "The Wild Robot",
        director: "Chris Sanders",
        cast: ["Lupita Nyong'o", "Pedro Pascal", "Kit Connor"],
        durationMinutes: 102,
        genre: ["Animation", "Adventure"],
        synopsis:
          "A robot stranded on a remote island learns to survive, build a family, and become part of the natural world around her.",
        posterUrl:
          "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500&auto=format&fit=crop&q=60",
        backdropUrl:
          "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80",
        trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "NOW_SHOWING",
        releaseDate: new Date("2026-07-18"),
        language: "English",
        ageRating: "U",
      },
    }),
    prisma.movie.create({
      data: {
        title: "Karnali Ko Katha",
        director: "Aashish Shrestha",
        cast: ["Prakash Ghimire", "Menuka Pradhan", "Nischal Basnet"],
        durationMinutes: 128,
        genre: ["Drama", "Family"],
        synopsis:
          "A young teacher returns to her mountain hometown and discovers a community story worth bringing to the whole country.",
        posterUrl:
          "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&auto=format&fit=crop&q=60",
        backdropUrl:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
        trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        status: "COMMING_SOON",
        releaseDate: new Date("2026-08-14"),
        language: "Nepali",
        ageRating: "U",
      },
    }),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const addDays = (days: number) => {
    const d = new Date(`${today}T12:00:00`);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  await prisma.showtime.createMany({
    data: [
      { movieId: movies[0].id, date: new Date(today), time: "11:00", screen: "Screen 1", price: 300, ticketPrices: [{ type: "General", price: 300 }, { type: "Student", price: 250 }, { type: "Child", price: 200 }], availableSeats: 120 },
      { movieId: movies[0].id, date: new Date(today), time: "14:30", screen: "Screen 1", price: 300, ticketPrices: [{ type: "General", price: 300 }, { type: "Student", price: 250 }, { type: "Child", price: 200 }], availableSeats: 45 },
      { movieId: movies[0].id, date: new Date(today), time: "18:00", screen: "Screen 1", price: 350, ticketPrices: [{ type: "General", price: 350 }, { type: "Student", price: 300 }, { type: "Child", price: 250 }], availableSeats: 12 },
      { movieId: movies[1].id, date: new Date(today), time: "10:30", screen: "Screen 2", price: 400, ticketPrices: [{ type: "General", price: 400 }, { type: "Student", price: 350 }, { type: "Child", price: 300 }], availableSeats: 80 },
      { movieId: movies[1].id, date: new Date(today), time: "16:00", screen: "Screen 2", price: 400, ticketPrices: [{ type: "General", price: 400 }, { type: "Student", price: 350 }, { type: "Child", price: 300 }], availableSeats: 65 },
      { movieId: movies[4].id, date: new Date(today), time: "12:30", screen: "Screen 3", price: 300, ticketPrices: [{ type: "General", price: 300 }, { type: "Student", price: 250 }, { type: "Child", price: 200 }], availableSeats: 96 },
      { movieId: movies[4].id, date: new Date(today), time: "15:15", screen: "Screen 3", price: 300, ticketPrices: [{ type: "General", price: 300 }, { type: "Student", price: 250 }, { type: "Child", price: 200 }], availableSeats: 58 },
      { movieId: movies[0].id, date: new Date(addDays(1)), time: "11:00", screen: "Screen 1", price: 300, ticketPrices: [{ type: "General", price: 300 }, { type: "Student", price: 250 }, { type: "Child", price: 200 }], availableSeats: 110 },
      { movieId: movies[1].id, date: new Date(addDays(1)), time: "18:30", screen: "Screen 2", price: 450, ticketPrices: [{ type: "General", price: 450 }, { type: "Student", price: 400 }, { type: "Child", price: 350 }], availableSeats: 32 },
      { movieId: movies[4].id, date: new Date(addDays(2)), time: "13:00", screen: "Screen 3", price: 300, ticketPrices: [{ type: "General", price: 300 }, { type: "Student", price: 250 }, { type: "Child", price: 200 }], availableSeats: 140 },
      { movieId: movies[4].id, date: new Date(addDays(2)), time: "17:30", screen: "Screen 3", price: 350, ticketPrices: [{ type: "General", price: 350 }, { type: "Student", price: 300 }, { type: "Child", price: 250 }], availableSeats: 72 },
    ],
  });

  await prisma.event.createMany({
    data: [
      { title: "Bhasme Don Cast Meet & Greet", date: new Date("2024-05-20"), time: "15:00", status: "upcoming", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60", description: "Join us for an exclusive meet and greet with the cast of Pashupati Prasad 2: Bhasme Don." },
      { title: "Surkhet Film Festival 2024", date: new Date("2024-07-10"), time: "10:00", status: "upcoming", imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=60", description: "A three-day festival celebrating local filmmakers from Karnali province." },
      { title: "Family Sunday Matinee", date: new Date("2026-08-02"), time: "11:00", status: "upcoming", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60", description: "A relaxed Sunday screening morning for families, with a kid-friendly film and complimentary popcorn for children." },
      { title: "Karnali Creators Night", date: new Date("2026-08-22"), time: "17:30", status: "upcoming", imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60", description: "Meet emerging filmmakers, photographers, and storytellers from Karnali." },
    ],
  });

  await prisma.galleryItem.createMany({
    data: [
      { title: "Grand Opening", imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=60", category: "exterior" },
      { title: "Screen 1 Hall", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60", category: "interior" },
      { title: "Lobby Area", imageUrl: "https://images.unsplash.com/photo-1563514757348-18e4df463cfa?w=800&auto=format&fit=crop&q=60", category: "interior" },
      { title: "Housefull Weekend", imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60", category: "audience" },
      { title: "Premiere Night", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60", category: "events" },
      { title: "Evening Lights", imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=60", category: "exterior" },
      { title: "Comfortable Seating", imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=60", category: "interior" },
      { title: "Audience Arrival", imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60", category: "audience" },
    ],
  });

  await prisma.announcement.createMany({
    data: [
      { text: "Welcome to the newly renovated LCM Surkhet! Experience movies in 4K Dolby Atmos.", isActive: true, type: "success" },
      { text: "Morning shows are now discounted by 20%.", isActive: true, type: "info" },
      { text: "Karnali Ko Katha releases August 14. Check the Coming Soon page for details.", isActive: true, type: "warning" },
      { text: "Family Sunday Matinee is coming on August 2. Call the box office for details.", isActive: true, type: "info" },
    ],
  });

  console.log("Seed complete.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
