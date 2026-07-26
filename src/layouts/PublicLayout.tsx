"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Calendar, Image as ImageIcon, Info, MapPin, Menu, X, Phone, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/lib/store";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { settings, announcements } = useAppStore();
  const activeAnnouncements = announcements.filter((a) => a.isActive);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const pathname = usePathname();

  const nextAnnouncement = useCallback(() => {
    setAnnouncementIndex((i) => (i + 1) % Math.max(activeAnnouncements.length, 1));
  }, [activeAnnouncements.length]);

  useEffect(() => {
    if (activeAnnouncements.length < 2) return;
    const id = setInterval(nextAnnouncement, 4000);
    return () => clearInterval(id);
  }, [activeAnnouncements.length, nextAnnouncement]);

  const navLinks = [
    { href: "/", label: "Home", icon: Film },
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: MapPin },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight hidden sm:inline-block">
              {settings.name}
            </span>
            <span className="font-serif font-bold text-xl tracking-tight sm:hidden">LCM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? "text-primary border-b-2 border-primary py-5"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 md:top-16 z-30 bg-background border-t">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-4 rounded-lg text-lg font-medium transition-colors ${
                  isActive(link.href) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {activeAnnouncements.length > 0 && (
        <div className="bg-red-600 text-white text-center text-sm font-medium overflow-hidden relative h-9">
          <div
            className="absolute inset-0 flex items-center justify-center animate-[fadeIn_0.5s_ease-in-out]"
            key={activeAnnouncements[announcementIndex].id}
          >
            {activeAnnouncements[announcementIndex].text}
          </div>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-zinc-950 text-zinc-400 py-8 md:py-12 mt-auto border-t-4 border-primary">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-100">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <Film className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">{settings.name}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed hidden sm:block">
              {settings.aboutText ? settings.aboutText.substring(0, 150) + "..." : ""}
            </p>
          </div>
          <div>
            <h4 className="text-zinc-100 font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/movies" className="hover:text-primary transition-colors">Now Showing</Link></li>
              <li><Link href="/coming-soon" className="hover:text-primary transition-colors">Coming Soon</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-zinc-100 font-semibold mb-4 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{settings.openingTime} – {settings.closingTime}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-6 md:mt-12 pt-4 md:pt-6 border-t border-zinc-800 text-sm flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link href="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
