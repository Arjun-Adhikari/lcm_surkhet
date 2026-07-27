"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "sonner";
import { signOut, useSession } from "next-auth/react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setChecking(false);
      return;
    }
    if (status === "unauthenticated") {
      fetch("/api/auth/me")
        .then((res) => {
          if (res.ok) setChecking(false);
          else router.replace("/admin/login");
        })
        .catch(() => router.replace("/admin/login"));
    }
  }, [status, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 bg-zinc-950 text-white font-bold text-base tracking-tight">
        Admin Nav
      </div>
      {session?.user && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? ""}
              className="w-9 h-9 rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
          </div>
        </div>
      )}
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
        <button
          onClick={() => { signOut({ callbackUrl: "/" }); setSidebarOpen(false); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors hover:bg-zinc-800 hover:text-white text-zinc-400 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
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
      <Toaster position="top-right" richColors />
    </div>
  );
}
