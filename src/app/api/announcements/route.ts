import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function serializeAnnouncement(item: Awaited<ReturnType<typeof prisma.announcement.findMany>>[0]) {
  return {
    id: item.id,
    text: item.text,
    isActive: item.isActive,
    type: item.type,
  };
}

export async function GET() {
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(announcements.map(serializeAnnouncement));
}

export async function POST(req: Request) {
  const data = await req.json();
  const announcement = await prisma.announcement.create({
    data: {
      text: data.text,
      isActive: data.isActive ?? true,
      type: data.type ?? "info",
    },
  });
  revalidateTag("announcements");
  return NextResponse.json(serializeAnnouncement(announcement), { status: 201 });
}
