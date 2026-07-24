import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeGalleryItem(item: Awaited<ReturnType<typeof prisma.galleryItem.findMany>>[0]) {
  return {
    id: item.id,
    title: item.title,
    imageUrl: item.imageUrl,
    category: item.category,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageParam = searchParams.get("page");
  const pageSize = Math.min(24, Math.max(1, Number(searchParams.get("pageSize") ?? 6)));
  const category = searchParams.get("category") ?? undefined;
  const where = category ? { category } : {};

  // If no page param → return flat array (admin uses this)
  if (!pageParam) {
    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(items.map(serializeGalleryItem));
  }

  // With page param → return paginated response (public gallery uses this)
  const page = Math.max(1, Number(pageParam));
  const [items, total] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.galleryItem.count({ where }),
  ]);

  return NextResponse.json({
    items: items.map(serializeGalleryItem),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const item = await prisma.galleryItem.create({
    data: {
      title: data.title,
      imageUrl: data.imageUrl,
      category: data.category ?? "interior",
    },
  });
  return NextResponse.json(serializeGalleryItem(item), { status: 201 });
}
