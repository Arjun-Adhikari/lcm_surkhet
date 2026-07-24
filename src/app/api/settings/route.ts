import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  id: "singleton",
  name: "Laxmi Chalchitra Mandir",
  address: "Birendranagar-6, Surkhet, Nepal",
  phone: "+977 083-520123",
  email: "info@lcmsurkhet.com",
  openingTime: "9:00 AM",
  closingTime: "9:00 PM",
  ticketPolicy:
    "Please call the cinema for ticket availability. Payment is accepted at the cinema counter only.",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14059.259970966555!2d81.616667!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a28bf2a096c4d7%3A0xc34a62bb1e2472b5!2sBirendranagar%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
  aboutText:
    "Laxmi Chalchitra Mandir is Surkhet's premier cinema destination. Founded with a vision to bring world-class entertainment to Karnali province, we offer state-of-the-art projection, immersive Dolby Atmos sound, and comfortable seating.",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
};

function serializeSettings(s: typeof DEFAULT_SETTINGS) {
  return {
    name: s.name,
    address: s.address,
    phone: s.phone,
    email: s.email,
    openingTime: s.openingTime,
    closingTime: s.closingTime,
    ticketPolicy: s.ticketPolicy,
    mapEmbedUrl: s.mapEmbedUrl,
    aboutText: s.aboutText,
    facebookUrl: s.facebookUrl,
    instagramUrl: s.instagramUrl,
  };
}

export async function GET() {
  let settings = await prisma.cinemaSettings.findFirst();
  if (!settings) {
    settings = await prisma.cinemaSettings.create({ data: DEFAULT_SETTINGS });
  }
  return NextResponse.json(serializeSettings(settings));
}

export async function PATCH(req: Request) {
  const data = await req.json();
  let settings = await prisma.cinemaSettings.findFirst();

  if (!settings) {
    settings = await prisma.cinemaSettings.create({
      data: { ...DEFAULT_SETTINGS, ...data },
    });
    return NextResponse.json(serializeSettings(settings));
  }

  const updated = await prisma.cinemaSettings.update({
    where: { id: settings.id },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      ticketPolicy: data.ticketPolicy,
      mapEmbedUrl: data.mapEmbedUrl,
      aboutText: data.aboutText,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
    },
  });
  return NextResponse.json(serializeSettings(updated));
}
