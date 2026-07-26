import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

function serializeShowtime(st: Awaited<ReturnType<typeof prisma.showtime.findUniqueOrThrow>>) {
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const showtime = await prisma.showtime.findUnique({ where: { id } });
  if (!showtime) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeShowtime(showtime));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const data = await req.json();
  const showtime = await prisma.showtime.update({
    where: { id },
    data: {
      movieId: data.movieId,
      date: data.date ? new Date(data.date) : undefined,
      time: data.time,
      screen: data.screen,
      price: data.price,
      ticketPrices: data.ticketPrices,
      availableSeats: data.availableSeats,
    },
  });
  revalidateTag("showtimes");
  return NextResponse.json(serializeShowtime(showtime));
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  await prisma.showtime.deleteMany({ where: { id } });
  revalidateTag("showtimes");
  return new NextResponse(null, { status: 204 });
}
