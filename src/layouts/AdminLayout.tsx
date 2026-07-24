"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Film,
  Calendar,
  Image as ImageIcon,
  Megaphone,
  Settings,
  LogOut,
  Ticket,
  Menu,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/admin/movies", label: "Movies", icon: Film },
    { href: "/admin/showtimes", label: "Showtimes", icon: Ticket },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const sidebar = (
    <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 bg-zinc-950 text-white font-serif font-bold text-lg tracking-tight truncate">
        {settings.name} Admin
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
          Management
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-zinc-800 hover:text-white text-zinc-400"
        >
          <LogOut className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Desktop sidebar */}
      <div className="hidden md:flex sticky top-0 h-screen">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute inset-y-0 left-0 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-16 border-b bg-card flex items-center px-4 md:px-8 shadow-sm justify-between gap-4">
          <button
            className="md:hidden p-2 -ml-2 text-foreground hover:text-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground capitalize truncate">
            {pathname.split("/").pop() || "Dashboard"}
          </h1>
          <ThemeToggle />
        </header>
        <div className="p-4 md:p-8 overflow-y-auto flex-1">{children}</div>
      </main>
    </div>
  );
}
