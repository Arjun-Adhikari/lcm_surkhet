import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

function serializeEvent(e: Awaited<ReturnType<typeof prisma.event.findMany>>[0]) {
  return {
    id: e.id,
    title: e.title,
    date: e.date.toISOString().split("T")[0],
    time: e.time,
    description: e.description,
    imageUrl: e.imageUrl,
    status: e.status,
  };
}

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(events.map(serializeEvent));
}

export async function POST(req: Request) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const data = await req.json();
  const event = await prisma.event.create({
    data: {
      title: data.title,
      date: new Date(data.date),
      time: data.time,
      status: data.status ?? "upcoming",
      imageUrl: data.imageUrl,
      description: data.description,
    },
  });
  revalidateTag("events");
  return NextResponse.json(serializeEvent(event), { status: 201 });
}
