import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.galleryItem.delete({ where: { id } });
  revalidateTag("gallery");
  return NextResponse.json(null, { status: 204 });
}
