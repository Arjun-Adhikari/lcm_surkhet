"use client";

import { PublicLayout } from "@/layouts/PublicLayout";
import { useAppStore } from "@/lib/store";
import { MapPin, Phone, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export default function Contact() {
  return (
    <PublicLayout>
      <div className="bg-zinc-100 dark:bg-zinc-900 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have a question, feedback, or inquiry? We are here to help.
          </p>
        </div>
      </div>
      <ContactContent />
    </PublicLayout>
  );
}

function ContactContent() {
  const { settings } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary mt-1"><MapPin className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-muted-foreground">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary mt-1"><Phone className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-muted-foreground">{settings.phone}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Box office: {settings.openingTime} – {settings.closingTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary mt-1"><Mail className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-muted-foreground">{settings.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border shadow-sm h-64 bg-muted">
            {settings.mapEmbedUrl ? (
              <iframe
                src={settings.mapEmbedUrl}
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LCM Location Map"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="w-8 h-8 mb-2 opacity-50" />
                <span>Map Not Configured</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif font-bold mb-2">Visit or call the box office</h2>
          <p className="text-muted-foreground mb-8">{settings.ticketPolicy}</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
