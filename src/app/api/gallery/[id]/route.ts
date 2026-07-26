import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteImageByUrl } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth-guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const data = await req.json();
  const item = await prisma.galleryItem.update({
    where: { id },
    data: { title: data.title, imageUrl: data.imageUrl, category: data.category },
  });
  revalidateTag("gallery");
  return NextResponse.json(item);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (item) await deleteImageByUrl(item.imageUrl);
  await prisma.galleryItem.deleteMany({ where: { id } });
  revalidateTag("gallery");
  return new NextResponse(null, { status: 204 });
}
