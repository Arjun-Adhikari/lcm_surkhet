import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeAnnouncement(item: Awaited<ReturnType<typeof prisma.announcement.findUniqueOrThrow>>) {
  return { id: item.id, text: item.text, isActive: item.isActive, type: item.type };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const a = await prisma.announcement.findUnique({ where: { id } });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeAnnouncement(a));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();
  const a = await prisma.announcement.update({
    where: { id },
    data: { text: data.text, isActive: data.isActive, type: data.type },
  });
  return NextResponse.json(serializeAnnouncement(a));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json(null, { status: 204 });
}
