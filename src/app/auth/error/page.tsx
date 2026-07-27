"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "AccessDenied") {
    return (
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="bg-red-600/20 p-3 rounded-full w-fit mx-auto mb-4">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400 mb-6">
          This Google account does not have permission to access the admin panel.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
      <h1 className="text-2xl font-serif font-bold text-white mb-2">Authentication Error</h1>
      <p className="text-zinc-400 mb-6">Something went wrong. Please try signing in again.</p>
      <Button asChild variant="outline" className="w-full">
        <Link href="/admin/login">Back to Login</Link>
      </Button>
    </div>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
