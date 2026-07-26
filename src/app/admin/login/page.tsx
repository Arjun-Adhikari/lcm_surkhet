"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { GoogleSignInButton } from "@/components/google-signin";

export default function Login() {
  const router = useRouter();
  const { settings } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/admin/movies");
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl mb-4">
            <Film className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            {settings.name}
          </h1>
          <p className="text-zinc-400 mt-1">Admin Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="admin@lcmsurkhet.com"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              defaultValue="password"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              "Authenticating..."
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" /> Sign In
              </>
            )}
          </Button>
          <div className="space-y-4">
            <GoogleSignInButton />
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          <p>Demo mode: Use any credentials to login.</p>
          <a
            href="/"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Return to website
          </a>
        </div>
      </div>
    </div>
  );
}
