import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  buffer: Buffer,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Upload failed"));
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

export function getPublicIdFromUrl(url: string): string {
  const regex = /\/upload\/(?:v\d+\/)?(.+?)\.\w+$/;
  const match = url.match(regex);
  if (!match) throw new Error("Not a Cloudinary URL");
  return match[1];
}

export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const publicId = getPublicIdFromUrl(url);
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Not a Cloudinary URL or already deleted — nothing to do
  }
}
