import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteImageByUrl } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth-guard";

function serializeEvent(e: Awaited<ReturnType<typeof prisma.event.findUniqueOrThrow>>) {
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeEvent(event));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const data = await req.json();
  const event = await prisma.event.update({
    where: { id },
    data: {
      title: data.title,
      date: data.date ? new Date(data.date) : undefined,
      time: data.time,
      status: data.status,
      imageUrl: data.imageUrl,
      description: data.description,
    },
  });
  revalidateTag("events");
  return NextResponse.json(serializeEvent(event));
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (event) await deleteImageByUrl(event.imageUrl);
  await prisma.event.deleteMany({ where: { id } });
  revalidateTag("events");
  return new NextResponse(null, { status: 204 });
}
