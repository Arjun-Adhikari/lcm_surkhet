import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "lcm-surkhet";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImage(buffer, folder);

  return NextResponse.json({ url });
}
