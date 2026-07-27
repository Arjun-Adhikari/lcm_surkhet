"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Film, Lock, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { GoogleSignInButton } from "@/components/google-signin";
import { Toaster, toast } from "sonner";

type Mode = "login" | "signup" | "verify";

export default function Login() {
  const router = useRouter();
  const { settings } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) router.replace("/admin/movies");
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Login failed");
        return;
      }
      router.push("/admin/movies");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }
      toast.success(data.message || "Verification code sent!");
      setMode("verify");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verifyCode }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Verification failed");
        return;
      }
      router.push("/admin/movies");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
      <Toaster />
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl mb-4">
            <Film className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">
            {settings.name}
          </h1>
          <p className="text-zinc-400 mt-1">Admin Control Panel</p>
        </div>

        {mode === "verify" ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <p className="text-sm text-zinc-400">Enter the code sent to the admin for approval</p>
            </div>
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-zinc-300">Verification Code</Label>
                <Input
                  id="code"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="e.g. A3B9C2"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 text-center text-lg tracking-widest uppercase"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Complete Signup"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="flex border border-zinc-700 rounded-lg mb-6 overflow-hidden">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === "login" ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === "signup" ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lcmsurkhet.com"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                <Lock className="w-4 h-4 mr-2" />
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-3 text-zinc-500">or continue with</span>
              </div>
            </div>

            <GoogleSignInButton />
          </>
        )}
      </div>
    </div>
  );
}
