import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

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
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const data = await req.json();
  const a = await prisma.announcement.update({
    where: { id },
    data: { text: data.text, isActive: data.isActive, type: data.type },
  });
  revalidateTag("announcements");
  return NextResponse.json(serializeAnnouncement(a));
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  await prisma.announcement.deleteMany({ where: { id } });
  revalidateTag("announcements");
  return new NextResponse(null, { status: 204 });
}
