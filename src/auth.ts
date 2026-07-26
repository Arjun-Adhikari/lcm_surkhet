import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account) {
        console.log("=== GOOGLE TOKEN RESPONSE ===");
        console.log("Access Token:", account.access_token);
        console.log("ID Token:", account.id_token);
        console.log("Refresh Token:", account.refresh_token);
        console.log("Expires At:", account.expires_at);
        console.log("Token Type:", account.token_type);
        console.log("Scope:", account.scope);
        console.log("=== USER PROFILE ===");
        console.log("Name:", user?.name);
        console.log("Email:", user?.email);
        console.log("Image:", user?.image);
        console.log("ID:", user?.id);
        console.log("Profile:", profile);
        console.log("=====================");
      }
      return token;
    },
  },
};