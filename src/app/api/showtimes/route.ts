import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeShowtime(st: Awaited<ReturnType<typeof prisma.showtime.findMany>>[0]) {
  return {
    id: st.id,
    movieId: st.movieId,
    date: st.date.toISOString().split("T")[0],
    time: st.time,
    screen: st.screen,
    price: st.price,
    ticketPrices: st.ticketPrices as { type: string; price: number }[],
    availableSeats: st.availableSeats,
  };
}

export async function GET() {
  const showtimes = await prisma.showtime.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(showtimes.map(serializeShowtime));
}

export async function POST(req: Request) {
  const data = await req.json();
  const showtime = await prisma.showtime.create({
    data: {
      movieId: data.movieId,
      date: new Date(data.date),
      time: data.time,
      screen: data.screen,
      price: data.price,
      ticketPrices: data.ticketPrices ?? [],
      availableSeats: data.availableSeats,
    },
  });
  return NextResponse.json(serializeShowtime(showtime), { status: 201 });
}
