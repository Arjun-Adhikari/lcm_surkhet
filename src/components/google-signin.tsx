"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export function GoogleSignInButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11"
      onClick={() => signIn("google", { callbackUrl: "/admin/movies" })}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      Continue with Google
    </Button>
  );
  }